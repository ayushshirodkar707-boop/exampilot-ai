import { NextRequest, NextResponse } from 'next/server';
import {
  getTelemetry,
  recordUserLogin,
  recordUserChoices,
} from '@/lib/telemetry';

export async function GET(req: NextRequest) {
  try {
    const passcode =
      req.headers.get('x-admin-passcode') ||
      req.nextUrl.searchParams.get('passcode');
    const adminSecret = process.env.ADMIN_PASSCODE || 'exampilot2026';

    if (!passcode || passcode !== adminSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or missing admin passcode.' },
        { status: 401 }
      );
    }

    const data = getTelemetry();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Admin telemetry API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (action === 'login' || action === 'signup') {
      recordUserLogin(data);
      return NextResponse.json({ success: true, message: 'Login logged' });
    }

    if (action === 'profile') {
      recordUserChoices(data);
      return NextResponse.json({ success: true, message: 'Profile choice logged' });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin telemetry POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
