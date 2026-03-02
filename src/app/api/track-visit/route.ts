
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
    try {
        await db.visit.create({ data: {} });
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Error recording visit:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
