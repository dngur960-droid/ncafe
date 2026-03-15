import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getSession();

    if (!session.token) {
        return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: session.user });
}
