
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { leadId, willingnessToPay } = body;

        if (!leadId || !willingnessToPay) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify Lead Exists
        const lead = await db.lead.findUnique({
            where: { id: leadId },
        });

        if (!lead) {
            return NextResponse.json({ error: 'Invalid Lead ID' }, { status: 404 });
        }

        // Use upsert to handle both creation and updates
        const survey = await db.surveyResponse.upsert({
            where: {
                leadId: leadId,
            },
            update: {
                willingnessToPay: willingnessToPay,
            },
            create: {
                leadId: leadId,
                willingnessToPay: willingnessToPay,
            },
        });

        return NextResponse.json({ success: true, id: survey.id }, { status: 201 });
    } catch (error) {
        console.error('Error submitting survey:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
