import * as fs from 'fs/promises';
import * as path from 'path';
import AdmZip from 'adm-zip';
import { calculateMD5, ensureDir } from './utils';

// 状态文件路径
const STATUS_FILE_PATH = process.env.STATUS_FILE_PATH || path.join(process.cwd(), 'downloads', 'status.json');
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || path.join(process.cwd(), 'downloads');
const EXTRACT_DIR = process.env.EXTRACT_DIR || process.cwd();
const HTML_FILE_PATH = process.env.HTML_FILE_PATH || path.join(process.cwd(), 'tvbox', 'cache', '888.html');
const INTERFACE_FILE_PATH = process.env.INTERFACE_FILE_PATH || path.join(process.cwd(), 'tvbox', 'dc.txt');

// 默认配置
const ZIP_URL = process.env.ZIP_URL || 'http://123.yy.xn--dkw.xn--6qq986b3xl/tvbox.zip';
const REMOTE_HASH_API = process.env.REMOTE_HASH_API || 'http://123.yy.xn--dkw.xn--6qq986b3xl/tvboxmd5.php';
const CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12小时

interface UpdateStatus {
  hash: string;
  last_check: number;
  html_updated: boolean;
}

/**
 * 初始化状态文件
 */
async function initStatusFile(): Promise<void> {
  try {
    await ensureDir(path.dirname(STATUS_FILE_PATH));
    await fs.access(STATUS_FILE_PATH);
  } catch {
    const initialData: UpdateStatus = {
      hash: '',
      last_check: 0,
      html_updated: false
    };
    await fs.writeFile(STATUS_FILE_PATH, JSON.stringify(initialData, null, 2));
  }
}

/**
 * 读取状态数据
 */
export async function getStatusData(): Promise<UpdateStatus> {
  await initStatusFile();
  try {
    const content = await fs.readFile(STATUS_FILE_PATH, 'utf-8');
    const data = JSON.parse(content) as UpdateStatus;
    return {
      hash: data.hash || '',
      last_check: data.last_check || 0,
      html_updated: data.html_updated || false
    };
  } catch (error) {
    console.error('读取状态文件失败:', error);
    return { hash: '', last_check: 0, html_updated: false };
  }
}

/**
 * 更新状态数据
 */
export async function updateStatusData(updates: Partial<UpdateStatus>): Promise<void> {
  const current = await getStatusData();
  const newData: UpdateStatus = {
    hash: updates.hash !== undefined ? updates.hash : current.hash,
    last_check: updates.last_check !== undefined ? updates.last_check : current.last_check,
    html_updated: updates.html_updated !== undefined ? updates.html_updated : current.html_updated
  };
  await fs.writeFile(STATUS_FILE_PATH, JSON.stringify(newData, null, 2));
}

/**
 * 获取远程哈希
 */
export async function getRemoteHash(): Promise<string> {
  try {
    const response = await fetch(REMOTE_HASH_API, {
      method: 'GET',
      signal: AbortSignal.timeout(10000)
    });
    
    if (response.ok) {
      const hash = await response.text();
      const trimmedHash = hash.trim().toLowerCase();
      if (trimmedHash.length === 32) {
        return trimmedHash;
      }
    }
    return '';
  } catch (error) {
    console.error('获取远程哈希失败:', error);
    return '';
  }
}

/**
 * 检查是否需要更新
 */
export async function canCheckUpdate(): Promise<boolean> {
  const status = await getStatusData();
  const now = Date.now();
  return (now - status.last_check) >= CHECK_INTERVAL;
}

/**
 * 判断是否需要更新
 */
export async function needUpdate(): Promise<boolean> {
  const remoteHash = await getRemoteHash();
  if (!remoteHash) {
    const status = await getStatusData();
    return !status.hash;
  }
  const status = await getStatusData();
  return remoteHash !== status.hash;
}

/**
 * 下载并解压ZIP文件
 */
export async function downloadAndExtractZip(): Promise<{ success: boolean; message: string }> {
  try {
    // 确保目录存在
    await ensureDir(DOWNLOAD_DIR);
    await ensureDir(path.dirname(HTML_FILE_PATH));

    // 1. 获取远程哈希
    const remoteHash = await getRemoteHash();
    if (!remoteHash) {
      return { success: false, message: '无法获取远程哈希' };
    }

    // 2. 下载ZIP文件
    const response = await fetch(ZIP_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      return { success: false, message: `下载失败: ${response.status}` };
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // 3. 校验哈希
    const localHash = (await calculateMD5(buffer)).toLowerCase();
    if (localHash !== remoteHash) {
      return { success: false, message: '哈希校验失败' };
    }

    // 4. 保存ZIP文件
    const zipFileName = path.basename(ZIP_URL);
    const zipFilePath = path.join(DOWNLOAD_DIR, zipFileName);
    await fs.writeFile(zipFilePath, buffer);

    // 5. 解压ZIP
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(EXTRACT_DIR, true);

    // 6. 更新状态
    await updateStatusData({ hash: remoteHash });

    return { success: true, message: '更新成功' };
  } catch (error) {
    console.error('下载并解压ZIP失败:', error);
    return { success: false, message: `更新失败: ${error instanceof Error ? error.message : '未知错误'}` };
  }
}

/**
 * 执行自动更新（如果需要）
 */
export async function autoUpdate(): Promise<void> {
  try {
    if (await canCheckUpdate()) {
      if (await needUpdate()) {
        const result = await downloadAndExtractZip();
        if (result.success) {
          await updateStatusData({ html_updated: false });
          console.log('自动更新成功');
        } else {
          console.error('自动更新失败:', result.message);
        }
      }
      await updateStatusData({ last_check: Date.now() });
    }
  } catch (error) {
    console.error('自动更新异常:', error);
  }
}

/**
 * 处理888.html内容
 */
export async function processHtmlContent(announcement: string): Promise<void> {
  try {
    const status = await getStatusData();
    
    if (status.html_updated) {
      return; // 已处理过
    }

    if (await fileExists(HTML_FILE_PATH)) {
      const { decryptContent, encryptContent, replaceAnnouncement } = await import('./utils');
      
      const htmlContent = await fs.readFile(HTML_FILE_PATH, 'utf-8');
      const decrypted = decryptContent(htmlContent);
      
      const processed = replaceAnnouncement(decrypted, announcement);
      const encrypted = encryptContent(processed);
      
      await fs.writeFile(HTML_FILE_PATH, encrypted);
      await updateStatusData({ html_updated: true });
    }
  } catch (error) {
    console.error('处理888.html失败:', error);
  }
}

/**
 * 检查文件是否存在
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 读取并处理接口配置
 */
export async function getInterfaceConfig(baseUrl: string, lineName: string, announcement: string): Promise<string | null> {
  try {
    if (!(await fileExists(INTERFACE_FILE_PATH))) {
      console.log('配置文件不存在:', INTERFACE_FILE_PATH);
      return null;
    }

    let content = await fs.readFile(INTERFACE_FILE_PATH, 'utf-8');
    
    console.log('原始baseUrl:', baseUrl);
    console.log('替换前内容长度:', content.length);
    
    // 替换所有localhost相关的URL
    const { replaceUrlPrefix, replaceHtmlName } = await import('./utils');
    content = replaceUrlPrefix(content, baseUrl);
    
    // 替换888.html的name
    content = replaceHtmlName(content, baseUrl, lineName);
    
    console.log('替换后内容长度:', content.length);
    
    // 处理888.html内容
    await processHtmlContent(announcement);
    
    return content;
  } catch (error) {
    console.error('读取接口配置失败:', error);
    return null;
  }
}
