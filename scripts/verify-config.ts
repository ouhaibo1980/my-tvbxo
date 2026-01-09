#!/usr/bin/env node

/**
 * 配置验证脚本
 * 用于检查环境配置是否正确
 */

const fs = require('fs');
const path = require('path');

// ANSI颜色代码
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  log('\n========================================', colors.cyan);
  log('TVBox 接口管理系统 - 配置验证', colors.cyan);
  log('========================================\n', colors.cyan);
  
  if (!fs.existsSync(envPath)) {
    log('❌ 错误：.env.local 文件不存在', colors.red);
    log('   请在项目根目录创建 .env.local 文件\n', colors.yellow);
    return false;
  }
  
  log('✅ .env.local 文件存在\n', colors.green);
  
  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split('\n').filter((line: string) => line.trim() && !line.startsWith('#'));
  
  const requiredVars = ['ZIP_URL', 'REMOTE_HASH_API'];
  const config: { [key: string]: string } = {};
  
  // 解析环境变量
  lines.forEach((line: string) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      config[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  let hasError = false;
  
  // 检查必需的环境变量
  log('检查必需的环境变量：', colors.blue);
  requiredVars.forEach(varName => {
    if (config[varName]) {
      log(`  ✅ ${varName}: ${config[varName]}`, colors.green);
    } else {
      log(`  ❌ ${varName}: 未设置`, colors.red);
      hasError = true;
    }
  });
  
  // 检查可选的环境变量
  log('\n检查可选的环境变量：', colors.blue);
  if (config['BASE_URL']) {
    log(`  ✅ BASE_URL: ${config['BASE_URL']} (生产环境推荐)`, colors.green);
  } else {
    log(`  ⚠️  BASE_URL: 未设置 (将使用自动检测)`, colors.yellow);
    log(`     提示：在生产环境部署时，建议手动设置 BASE_URL`, colors.yellow);
  }
  
  if (config['ANNOUNCEMENT']) {
    log(`  ✅ ANNOUNCEMENT: ${config['ANNOUNCEMENT']}`, colors.green);
  } else {
    log(`  ⚠️  ANNOUNCEMENT: 未设置 (使用默认值)`, colors.yellow);
  }
  
  // 检查文件目录
  log('\n检查文件目录：', colors.blue);
  const requiredDirs = ['tvbox', 'downloads'];
  requiredDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      log(`  ✅ ${dir}/ 目录存在`, colors.green);
    } else {
      log(`  ⚠️  ${dir}/ 目录不存在 (将在首次运行时创建)`, colors.yellow);
    }
  });
  
  // 检查配置文件
  log('\n检查配置文件：', colors.blue);
  const interfaceFile = path.join(process.cwd(), 'tvbox/dc.txt');
  if (fs.existsSync(interfaceFile)) {
    const content = fs.readFileSync(interfaceFile, 'utf-8');
    if (content.includes('clan://localhost')) {
      log(`  ✅ tvbox/dc.txt 存在且包含 clan://localhost`, colors.green);
    } else if (content.includes('localhost')) {
      log(`  ✅ tvbox/dc.txt 存在且已替换 localhost`, colors.green);
    } else {
      log(`  ⚠️  tvbox/dc.txt 存在但格式可能不正确`, colors.yellow);
    }
  } else {
    log(`  ⚠️  tvbox/dc.txt 不存在 (首次运行后会下载)`, colors.yellow);
  }
  
  // 总结
  log('\n========================================', colors.cyan);
  if (hasError) {
    log('❌ 配置验证失败，请检查上述错误', colors.red);
    log('========================================\n', colors.cyan);
    return false;
  } else {
    log('✅ 配置验证通过', colors.green);
    log('========================================\n', colors.cyan);
    
    // 给出部署建议
    if (!config['BASE_URL']) {
      log('生产环境部署建议：', colors.yellow);
      log('1. 在 .env.local 中添加：BASE_URL=https://your-domain.com', colors.yellow);
      log('2. 替换 https://your-domain.com 为你的实际域名', colors.yellow);
      log('3. 重启应用使配置生效\n', colors.yellow);
    }
    
    return true;
  }
}

// 执行检查
const success = checkEnvFile();
process.exit(success ? 0 : 1);
