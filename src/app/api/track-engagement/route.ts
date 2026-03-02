
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { leadId, eventType } = body;

        if (!leadId || !eventType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate leadId is a number
        const parsedLeadId = parseInt(leadId);
        if (isNaN(parsedLeadId)) {
            return NextResponse.json({ error: 'Invalid Lead ID format' }, { status: 400 });
        }

        // Verify Lead Exists
        const lead = await db.lead.findUnique({
            where: { id: parsedLeadId },
        });

        if (!lead) {
            return NextResponse.json({ error: 'Invalid Lead ID' }, { status: 404 });
        }

        const event = await db.engagementEvent.create({
            data: {
                leadId: parsedLeadId,
                eventType,
            },
        });

        return NextResponse.json({ success: true, id: event.id }, { status: 201 });
    } catch (error) {
        console.error('Error tracking engagement:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
