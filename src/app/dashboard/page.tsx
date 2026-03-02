import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";
import LeadRegistry from "../components/LeadRegistry";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;

    // Parse query params
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const search = typeof params.search === 'string' ? params.search : undefined;
    const city = typeof params.city === 'string' ? params.city : undefined;
    const type = typeof params.type === 'string' ? params.type : undefined;
    const budget = typeof params.budget === 'string' ? params.budget : undefined;
    const moveIn = typeof params.moveIn === 'string' ? params.moveIn : undefined;
    const surveyStatus = typeof params.surveyStatus === 'string' ? params.surveyStatus : undefined;

    // 1. Fetch Data for Metrics (Always Global)
    const [totalVisitors, totalLeadsCount, totalSurveysCount] = await Promise.all([
        db.visit.count(),
        db.lead.count(),
        db.surveyResponse.count()
    ]);

    // Survey Breakdown Stats (Global)
    const surveyStats = await db.surveyResponse.groupBy({
        by: ['willingnessToPay'],
        _count: { leadId: true },
    });

    const yesCount = surveyStats.find((s) => s.willingnessToPay === 'YES')?._count.leadId || 0;
    const maybeCount = surveyStats.find((s) => s.willingnessToPay === 'MAYBE')?._count.leadId || 0;
    const noCount = surveyStats.find((s) => s.willingnessToPay === 'NO')?._count.leadId || 0;

    // Validation Status Logic
    const yesPercentOfLeads = totalLeadsCount > 0 ? (yesCount / totalLeadsCount) * 100 : 0;
    let validationStatus = "Weak";
    let statusColor = "text-rose-600 bg-rose-50 border-rose-100";

    if (totalLeadsCount < 20) {
        validationStatus = "Insufficient Data";
        statusColor = "text-slate-400 bg-slate-50 border-slate-100";
    } else {
        if (yesPercentOfLeads > 25) {
            validationStatus = "Strong";
            statusColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
        } else if (yesPercentOfLeads >= 10) {
            validationStatus = "Moderate";
            statusColor = "text-amber-600 bg-amber-50 border-amber-100";
        }
    }

    // 2. Fetch Leads for Table (Filtered & Paginated)
    const whereClause: Prisma.LeadWhereInput = {};

    if (search) {
        whereClause.OR = [
            { fullName: { contains: search } },
            { phoneNumber: { contains: search } }
        ];
    }
    if (city) whereClause.city = city;
    if (type) whereClause.type = type;
    if (budget) whereClause.budget = budget;
    if (moveIn) whereClause.moveIn = moveIn;

    if (surveyStatus) {
        if (surveyStatus === 'NONE') {
            whereClause.surveyResponse = { is: null };
        } else {
            whereClause.surveyResponse = { willingnessToPay: surveyStatus };
        }
    }

    const [leads, totalFilteredLeads] = await Promise.all([
        db.lead.findMany({
            where: whereClause,
            include: {
                surveyResponse: true,
                engagementEvents: true
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        db.lead.count({ where: whereClause })
    ]);

    // Fetch Filter Options (Distinct Values)
    const [distinctCities, distinctTypes, distinctBudgets, distinctMoveIns] = await Promise.all([
        db.lead.groupBy({ by: ['city'] }),
        db.lead.groupBy({ by: ['type'] }),
        db.lead.groupBy({ by: ['budget'] }),
        db.lead.groupBy({ by: ['moveIn'] }),
    ]);

    const filterOptions = {
        cities: distinctCities.map(c => c.city).filter(Boolean) as string[],
        types: distinctTypes.map(t => t.type).filter(Boolean) as string[],
        budgets: distinctBudgets.map(b => b.budget).filter(Boolean) as string[],
        moveIns: distinctMoveIns.map(m => m.moveIn).filter(Boolean) as string[],
    };

    // Engagement Metrics (Global)
    const engagementEvents = await db.engagementEvent.groupBy({
        by: ['eventType'],
        _count: { leadId: true },
    });

    const previewViews = engagementEvents.find((e: { eventType: string, _count: { leadId: number } }) => e.eventType === 'preview_page_viewed')?._count.leadId || 0;
    const detailsClicks = engagementEvents.find((e: { eventType: string, _count: { leadId: number } }) => e.eventType === 'details_clicked')?._count.leadId || 0;
    const unlockClicks = engagementEvents.find((e: { eventType: string, _count: { leadId: number } }) => e.eventType === 'unlock_clicked')?._count.leadId || 0;
    const priorityClicks = engagementEvents.find((e: { eventType: string, _count: { leadId: number } }) => e.eventType === 'priority_access_clicked')?._count.leadId || 0;

    // Rates calculation
    const visitorToLeadRate = totalVisitors > 0 ? (totalLeadsCount / totalVisitors) * 100 : 0;
    const leadToSurveyRate = totalLeadsCount > 0 ? (totalSurveysCount / totalLeadsCount) * 100 : 0;
    const surveyToYesRate = totalSurveysCount > 0 ? (yesCount / totalSurveysCount) * 100 : 0;

    // Engagement Rates
    const detailsRate = previewViews > 0 ? (detailsClicks / previewViews) * 100 : 0;
    const unlockRate = detailsClicks > 0 ? (unlockClicks / detailsClicks) * 100 : 0;
    const priorityRate = unlockClicks > 0 ? (priorityClicks / unlockClicks) * 100 : 0;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-900 selection:bg-indigo-50 selection:text-indigo-900">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Operational Dashboard</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Investor-Grade Demand Validation</p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                        <div className={`px-4 py-1.5 rounded-full border ${statusColor} inline-flex items-center`}>
                            <div className="text-xs font-bold uppercase tracking-widest">
                                {validationStatus}
                            </div>
                        </div>
                        {validationStatus !== "Insufficient Data" && (
                            <p className="text-xs text-slate-400 font-semibold mt-2">Based on {yesPercentOfLeads.toFixed(1)}% YES Rate</p>
                        )}
                    </div>
                </div>

                {/* 1. Demand Funnel */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">1. Demand Intake Funnel</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[43px] left-[12%] right-[12%] h-[2px] bg-slate-100 z-0"></div>

                        <FunnelStep
                            label="Total Page Loads"
                            value={totalVisitors}
                            sub="All Visits"
                            step={1}
                        />
                        <FunnelStep
                            label="Leads Captured"
                            value={totalLeadsCount}
                            sub={`${visitorToLeadRate.toFixed(1)}% Conversion`}
                            step={2}
                        />
                        <FunnelStep
                            label="Surveys Completed"
                            value={totalSurveysCount}
                            sub={`${leadToSurveyRate.toFixed(1)}% Response`}
                            step={3}
                        />
                        <FunnelStep
                            label="High Intent (YES)"
                            value={yesCount}
                            sub={`${surveyToYesRate.toFixed(1)}% Qualified`}
                            step={4}
                            highlight
                        />
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 2. Engagement */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">2. Engagement Metrics</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricBox
                                label="Preview Page Loads"
                                value={previewViews}
                                subtext="Total Views"
                            />
                            <MetricBox
                                label="Details Clicks"
                                value={detailsClicks}
                                subtext={`${detailsRate.toFixed(1)}% Click-through`}
                                trend
                            />
                            <MetricBox
                                label="Unlock Clicks"
                                value={unlockClicks}
                                subtext={`${unlockRate.toFixed(1)}% from Details`}
                                trend
                            />
                            <MetricBox
                                label="Priority Access"
                                value={priorityClicks}
                                subtext={`${priorityRate.toFixed(1)}% from Unlock`}
                                trend
                            />
                        </div>
                    </section>

                    {/* 3. Survey Breakdown */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">3. Survey Breakdown</h2>
                        <div className="space-y-6">
                            <BreakdownRow
                                label="YES — High Intent"
                                count={yesCount}
                                total={totalSurveysCount}
                                color="bg-emerald-500"
                                bg="bg-emerald-50"
                            />
                            <BreakdownRow
                                label="MAYBE — Potential"
                                count={maybeCount}
                                total={totalSurveysCount}
                                color="bg-amber-400"
                                bg="bg-amber-50"
                            />
                            <BreakdownRow
                                label="NO — Not Interested"
                                count={noCount}
                                total={totalSurveysCount}
                                color="bg-rose-400"
                                bg="bg-rose-50"
                            />
                        </div>
                    </section>
                </div>

                {/* 4. Lead Registry (New Implementation) */}
                <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading leads...</div>}>
                    <LeadRegistry
                        leads={leads}
                        totalLeads={totalFilteredLeads}
                        page={page}
                        limit={limit}
                        filterOptions={filterOptions}
                    />
                </Suspense>
            </div>
        </div>
    );
}

function FunnelStep({ label, value, sub, highlight, step }: { label: string; value: number; sub?: string; highlight?: boolean; step: number }) {
    return (
        <div className={`p-6 rounded-xl border relative overflow-visible transition-all group z-10 ${highlight
            ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
            : 'bg-white border-slate-100 text-slate-900 shadow-sm hover:shadow-md hover:border-slate-200'
            }`}>
            {/* Step Number Badge */}
            <div className={`absolute -top-3 left-6 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${highlight
                ? 'bg-indigo-500 border-slate-900 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                {step}
            </div>

            <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${highlight ? 'text-slate-400' : 'text-slate-400'}`}>{label}</div>
            <div className="text-3xl font-bold mt-2 tracking-tight">{value}</div>
            {sub && <div className={`text-xs mt-2 font-medium ${highlight ? 'text-emerald-400' : 'text-slate-500'}`}>
                {sub}
            </div>}
        </div>
    );
}

function MetricBox({ label, value, subtext, trend }: { label: string; value: number; subtext: string; trend?: boolean }) {
    return (
        <div className="p-5 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors shadow-sm group">
            <div className="flex justify-between items-start">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
                {trend && (
                    <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                )}
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{value}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">{subtext}</div>
        </div>
    );
}

function BreakdownRow({ label, count, total, color, bg }: { label: string; count: number; total: number; color: string; bg?: string }) {
    const percent = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold items-center">
                <span className="text-slate-700">{label}</span>
                <span className="text-slate-900">{count} <span className="text-slate-400 font-medium ml-1">({percent.toFixed(0)}%)</span></span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${bg || 'bg-slate-100'}`}>
                <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}
