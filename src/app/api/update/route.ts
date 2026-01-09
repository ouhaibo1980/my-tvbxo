import { NextRequest, NextResponse } from 'next/server';
import { downloadAndExtractZip, needUpdate, updateStatusData } from '@/lib/update-manager';

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const switchValue = searchParams.get('switch') || '关';

    if (switchValue !== '开') {
      return NextResponse.json({ success: false, message: '自动更新未启用' });
    }

    // 检查是否需要更新
    const need = await needUpdate();
    if (!need) {
      return NextResponse.json({ success: true, message: '已是最新版本，无需更新' });
    }

    // 执行更新
    const result = await downloadAndExtractZip();
    
    if (result.success) {
      await updateStatusData({ html_updated: false });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Update API错误:', error);
    return NextResponse.json(
      { success: false, message: `更新失败: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    );
  }
}
