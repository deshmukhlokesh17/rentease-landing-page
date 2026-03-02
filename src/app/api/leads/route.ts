
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, phoneNumber, city, type, subType, budget, moveIn, area } = body;

        if (!fullName || !phoneNumber || !city || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const lead = await db.lead.create({
            data: {
                fullName,
                phoneNumber,
                city,
                type,
                subType,
                budget,
                moveIn,
                area,
            },
        });

        return NextResponse.json({ leadId: lead.id }, { status: 201 });
    } catch (error) {
        console.error('Error creating lead:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
