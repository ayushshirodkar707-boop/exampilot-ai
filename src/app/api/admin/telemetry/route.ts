import { NextRequest, NextResponse } from 'next/server';
import {
  getTelemetry,
  saveTelemetry,
  resetTelemetry,
  recordUserLogin,
  recordUserChoices,
  recordAIRequestAndPlan,
} from '@/lib/telemetry';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    if (action === 'sync') {
      const { user, profile, plan } = data || {};
      if (user && user.uid) recordUserLogin(user);
      if (profile && profile.uid) recordUserChoices(profile);
      if (plan && plan.id) {
        recordAIRequestAndPlan({
          uid: user?.uid || profile?.uid,
          email: user?.email || profile?.email,
          exam: plan.exam,
          country: plan.country || 'Global',
          dailyHours: profile?.dailyHours || 6,
          sessionDurationMinutes: plan.dailyRoutine?.sessionDurationMinutes || 90,
          selectedSubjects: plan.selectedSubjects || [],
          weakSubjects: profile?.weakSubjects || [],
          source: 'ai_engine',
          durationMs: 650,
          status: 'success',
          plan,
        });
      }
      return NextResponse.json({ success: true, message: 'Real session synced' });
    }

    if (action === 'reset') {
      const cleaned = resetTelemetry();
      return NextResponse.json({ success: true, message: 'Telemetry reset', data: cleaned });
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
