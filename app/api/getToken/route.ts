import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get('cmuToken')?.value;
    if (!token) return NextResponse.json({ token: null });
    return NextResponse.json({ token : token });
}
