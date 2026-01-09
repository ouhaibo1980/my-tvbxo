import { randomUUID } from 'crypto';

// 加密前缀
const ENCRYPTION_PREFIX = 'jhSPAyzn**';

/**
 * 解密内容
 */
export function decryptContent(content: string): string {
  if (content.startsWith(ENCRYPTION_PREFIX)) {
    const encodedContent = content.substring(ENCRYPTION_PREFIX.length);
    
    // 尝试直接解码（文件格式：jhSPAyzn**base64content）
    try {
      const decoded = Buffer.from(encodedContent, 'base64').toString('utf-8');
      // 检查解码后的内容是否有效（应该是JSON格式）
      if (decoded.trim().startsWith('{') || decoded.trim().startsWith('[')) {
        return decoded;
      }
    } catch (error) {
      console.error('直接解码失败，尝试其他格式:', error);
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
  }
  return content;
}

/**
 * 加密内容
 */
export function encryptContent(content: string): string {
  const encoded = Buffer.from(content, 'utf-8').toString('base64');
  return `${ENCRYPTION_PREFIX}**${encoded}`;
}

/**
 * 替换URL前缀 - 替换所有localhost相关URL
 */
export function replaceUrlPrefix(content: string, newPrefix: string): string {
  // 替换 clan://localhost (TVBox自定义协议)
  content = content.replace(/clan:\/\/localhost/g, newPrefix);
  
  // 替换 http://localhost:5000 和 https://localhost:5000
  content = content.replace(/https?:\/\/localhost:5000/g, newPrefix);
  
  // 替换 http://localhost 和 https://localhost（带端口变体）
  content = content.replace(/https?:\/\/localhost(:\d+)?/g, newPrefix);
  
  return content;
}

/**
 * 替换888.html的name
 */
export function replaceHtmlName(content: string, baseUrl: string, name: string): string {
  const escapedUrl = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `("url":"${escapedUrl}/tvbox/cache/888\\.html","name":")([^"]+)(")`,
    'g'
  );
  return content.replace(regex, `$1👇 ${name}收集网络线路👇$3`);
}

/**
 * 替换公告内容
 */
export function replaceAnnouncement(content: string, announcement: string): string {
  return content.replace('失效等候更新或者在线更新本地包防失效', announcement);
}

/**
 * 计算MD5
 */
export async function calculateMD5(data: Buffer): Promise<string> {
  const crypto = await import('crypto');
  return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * 创建目录（如果不存在）
 */
export async function ensureDir(dirPath: string): Promise<void> {
  const fs = await import('fs/promises');
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * 获取当前协议和主机
 */
export function getBaseUrl(req: Request): string {
  const url = new URL(req.url);
  const protocol = url.protocol.replace(':', '');
  const host = url.host;
  return `${protocol}://${host}`;
}

/**
 * 获取脚本基础路径
 */
export function getBasePath(req: Request): string {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  segments.pop(); // 移除当前脚本名
  const basePath = segments.length > 0 ? '/' + segments.join('/') : '';
  return basePath;
}
