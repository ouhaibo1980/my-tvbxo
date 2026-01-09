import { NextRequest, NextResponse } from 'next/server';
import { getStatusData } from '@/lib/update-manager';

export async function GET(req: NextRequest) {
  try {
    const status = await getStatusData();
    return NextResponse.json({
      success: true,
      data: {
        ...status,
        last_check_formatted: status.last_check > 0 
          ? new Date(status.last_check).toLocaleString('zh-CN')
          : '未检查过'
      }
    });
  } catch (error) {
    console.error('Status API错误:', error);
    return NextResponse.json(
      { success: false, message: '获取状态失败' },
      { status: 500 }
    );
  }
}
