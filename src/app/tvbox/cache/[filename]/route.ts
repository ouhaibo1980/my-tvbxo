import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

// 加密前缀
const ENCRYPTION_PREFIX = 'jhSPAyzn';

/**
 * 解密内容（支持双重加密）
 */
function decryptContent(content: string): string {
  if (!content.startsWith(ENCRYPTION_PREFIX)) {
    return content;
  }
  
  // 第一次解密
  let content1 = decryptSingleLayer(content);
  
  // 检查是否需要第二次解密
  if (content1 !== content && content1.startsWith(ENCRYPTION_PREFIX)) {
    content1 = decryptSingleLayer(content1);
  }
  
  return content1;
}

/**
 * 单层解密
 */
function decryptSingleLayer(content: string): string {
  // 移除前缀
  let encodedContent = content.substring(ENCRYPTION_PREFIX.length);
  
  // 跳过所有*号
  while (encodedContent.startsWith('*')) {
    encodedContent = encodedContent.substring(1);
  }
  
  // 尝试直接解码
  try {
    const decoded = Buffer.from(encodedContent, 'base64').toString('utf-8');
    
    if (decoded.trim().startsWith('{') || decoded.trim().startsWith('[') || decoded.startsWith(ENCRYPTION_PREFIX)) {
      return decoded;
    }
  } catch (error) {
    // 继续尝试第二种格式
  }
  
  // 尝试第二种格式（jhSPAyzn**random**base64content）
  const secondPrefix = '**';
  const secondPrefixIndex = encodedContent.indexOf(secondPrefix);
  
  if (secondPrefixIndex !== -1) {
    const actualContent = encodedContent.substring(secondPrefixIndex + secondPrefix.length);
    
    try {
      const decoded = Buffer.from(actualContent, 'base64').toString('utf-8');
      return decoded;
    } catch (error) {
      console.error('解密失败:', error);
    }
  }
  
  return content;
}

/**
 * 读取并返回单个HTML文件
 * - 浏览器访问：返回原始加密内容（由服务器端加密）
 * - TVBox客户端访问：返回解密内容（已处理）
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // 安全检查：只允许HTML文件
    if (!filename || !filename.endsWith('.html')) {
      return new NextResponse('无效的文件名', { status: 400 });
    }
    
    // 防止路径遍历攻击
    const normalizedFilename = path.normalize(filename);
    if (normalizedFilename.startsWith('..') || normalizedFilename.includes('/..')) {
      return new NextResponse('无效的路径', { status: 403 });
    }
    
    // 构建文件路径
    const filePath = path.join(process.cwd(), 'tvbox', 'cache', normalizedFilename);
    
    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch {
      return new NextResponse('文件不存在', { status: 404 });
    }
    
    // 读取文件内容
    const content = await fs.readFile(filePath, 'utf-8');
    
    // 检查是否是浏览器访问（通过User-Agent）
    const userAgent = request.headers.get('user-agent') || '';
    const isBrowser = /(Windows|Macintosh|Android|Mobile|QQ|MicroMessenger|Chrome|Safari|Firefox)/i.test(userAgent);
    
    if (isBrowser) {
      // 浏览器访问：返回原始加密内容
      return new NextResponse(content, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    } else {
      // TVBox客户端访问：解密内容后返回
      const decryptedContent = decryptContent(content);
      return new NextResponse(decryptedContent, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
  } catch (error) {
    console.error('读取HTML文件失败:', error);
    return new NextResponse('服务器错误', { status: 500 });
  }
}
