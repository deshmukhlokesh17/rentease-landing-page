"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";

type Lead = {
    id: number;
    fullName: string;
    phoneNumber: string;
    city: string;
    type: string;
    subType: string | null;
    budget: string | null;
    moveIn: string | null;
    area: string | null;
    createdAt: Date;
    surveyResponse: {
        willingnessToPay: string;
    } | null;
    engagementEvents?: {
        eventType: string;
    }[];
};

type LeadRegistryProps = {
    leads: Lead[];
    totalLeads: number;
    page: number;
    limit: number;
    filterOptions: {
        types: string[];
        budgets: string[];
        moveIns: string[];
        cities: string[];
    };
};

export default function LeadRegistry({ leads, totalLeads, page, limit, filterOptions }: LeadRegistryProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    // Filter Stats
    const currentSearch = searchParams.get("search") || "";
    const currentCity = searchParams.get("city") || "";
    const currentType = searchParams.get("type") || "";
    const currentBudget = searchParams.get("budget") || "";
    const currentMoveIn = searchParams.get("moveIn") || "";
    const currentStatus = searchParams.get("surveyStatus") || "";

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        params.set("page", "1"); // Reset to page 1 on filter change
        router.push(`/dashboard?${params.toString()}`);
    };

    const toggleRow = (id: number) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Lead Registry</h2>
                    <p className="text-sm text-slate-500 mt-1">Real-time database of captured potential tenants.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
                    {/* Search */}
                    <div className="relative w-full md:w-48">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            defaultValue={currentSearch}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleFilterChange("search", e.currentTarget.value);
                            }}
                            className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full shadow-sm placeholder:text-slate-400"
                        />
                    </div>

                    {/* City */}
                    <Select
                        value={currentCity}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("city", e.target.value)}
                        options={filterOptions.cities}
                        placeholder="City"
                        width="w-32"
                    />

                    {/* Type */}
                    <Select
                        value={currentType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("type", e.target.value)}
                        options={filterOptions.types}
                        placeholder="Type"
                        width="w-32"
                    />

                    {/* Status */}
                    <select
                        value={currentStatus}
                        onChange={(e) => handleFilterChange("surveyStatus", e.target.value)}
                        className="px-3 py-2 text-xs border border-slate-200 rounded-md outline-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-slate-600 max-w-[120px]"
                    >
                        <option value="">Status</option>
                        <option value="YES">YES</option>
                        <option value="MAYBE">MAYBE</option>
                        <option value="NO">NO</option>
                        <option value="NONE">No Response</option>
                    </select>

                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Additional Filters Row (Budget/MoveIn) */}
            <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Advanced:</span>
                {/* Budget */}
                <Select
                    value={currentBudget}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("budget", e.target.value)}
                    options={filterOptions.budgets}
                    placeholder="Budget Range"
                    width="w-40"
                />
                {/* Move In */}
                <Select
                    value={currentMoveIn}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("moveIn", e.target.value)}
                    options={filterOptions.moveIns}
                    placeholder="Move-in Timeline"
                    width="w-40"
                />
            </div>

            {/* Mobile View: Stacked Cards */}
            <div className="md:hidden space-y-4">
                {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
                {leads.length === 0 && (
                    <div className="text-center text-slate-500 text-sm py-8 bg-white rounded-lg border border-slate-200">
                        No leads found matching your filters.
                    </div>
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <Th label="#" />
                                <Th label="Lead Name" />
                                <Th label="Phone" />
                                <Th label="City" />
                                <Th label="Type" />
                                <Th label="Survey" />
                                <Th label="Registered" />
                                <Th label="" />
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {leads.map((lead, index) => {
                                const serialNumber = (page - 1) * limit + index + 1;
                                const isExpanded = expandedRowId === lead.id;

                                return (
                                    <React.Fragment key={lead.id}>
                                        <tr
                                            onClick={() => toggleRow(lead.id)}
                                            className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${isExpanded ? "bg-slate-50" : ""}`}
                                        >
                                            <td className="px-6 py-3 whitespace-nowrap text-xs text-slate-400 font-mono">
                                                {serialNumber}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-slate-900">{lead.fullName}</div>
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-600 font-mono tracking-tight">
                                                {lead.phoneNumber}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-xs text-slate-600 uppercase tracking-wide font-medium">
                                                {lead.city}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                                                    {lead.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                <Badge status={lead.surveyResponse?.willingnessToPay} />
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-xs text-slate-400">
                                                {format(new Date(lead.createdAt), 'MMM d, h:mm a')}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                <span className="text-indigo-600 hover:text-indigo-900 text-xs">
                                                    {isExpanded ? "Hide" : "View"}
                                                </span>
                                            </td>
                                        </tr>
                                        {/* Expanded Detail Row */}
                                        {isExpanded && (
                                            <tr className="bg-slate-50/50">
                                                <td colSpan={8} className="px-6 py-4 border-t border-slate-100">
                                                    <ExpandedDetails lead={lead} />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm">
                                        No leads found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination (Shared) */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-lg border-x-0 md:border-x md:border-b">
                <div className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-bold text-slate-700">{leads.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="font-bold text-slate-700">{Math.min(page * limit, totalLeads)}</span> of <span className="font-bold text-slate-700">{totalLeads}</span> leads
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set("page", (page - 1).toString());
                            router.push(`/dashboard?${params.toString()}`);
                        }}
                        disabled={page <= 1}
                        className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${page <= 1
                            ? 'opacity-50 pointer-events-none bg-slate-50 text-slate-400 border-slate-100'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm'
                            }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set("page", (page + 1).toString());
                            router.push(`/dashboard?${params.toString()}`);
                        }}
                        disabled={page * limit >= totalLeads}
                        className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${page * limit >= totalLeads
                            ? 'opacity-50 pointer-events-none bg-slate-50 text-slate-400 border-slate-100'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm'
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}

function Select({ value, onChange, options, placeholder, width = "max-w-[140px]" }: { value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[], placeholder: string, width?: string }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`px-3 py-2 text-xs border border-slate-200 rounded-md outline-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-slate-600 ${width}`}
        >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    );
}

function Th({ label }: { label: string }) {
    return <th className="px-6 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</th>;
}

function Badge({ status }: { status?: string }) {
    if (!status) return <span className="text-[10px] text-slate-400 font-medium italic">No Response</span>;
    const styles = {
        YES: "bg-emerald-100 text-emerald-700 border-emerald-200",
        MAYBE: "bg-amber-100 text-amber-700 border-amber-200",
        NO: "bg-rose-100 text-rose-700 border-rose-200",
    }[status] || "bg-slate-100 text-slate-700 border-slate-200";

    return <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${styles}`}>{status}</span>;
}

function DetailRow({ label, value, highlight }: { label: string, value: string | null | boolean, highlight?: boolean }) {
    let displayValue = value;
    if (typeof value === "boolean") displayValue = value ? "Yes" : "No";

    return (
        <div className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
            <span className="text-slate-500 text-xs">{label}</span>
            <span className={`text-xs font-medium ${highlight ? "text-emerald-600" : "text-slate-700"}`}>{displayValue}</span>
        </div>
    );
}

// Extracted for reuse
function ExpandedDetails({ lead }: { lead: Lead }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {/* Column 1: Lead Details */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Property Preferences</h4>
                <div className="space-y-2">
                    <DetailRow label="Sub-Type" value={lead.subType || "-"} />
                    <DetailRow label="Budget" value={lead.budget || "-"} />
                    <DetailRow label="Move-In" value={lead.moveIn || "-"} />
                    <DetailRow label="Preferred Area" value={lead.area || "-"} />
                </div>
            </div>

            {/* Column 2: Engagement */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Engagement Activity</h4>
                <div className="space-y-2">
                    <DetailRow
                        label="Preview Page"
                        value={lead.engagementEvents?.some(e => e.eventType === 'preview_page_viewed') ? "Visited" : "No"}
                        highlight={lead.engagementEvents?.some(e => e.eventType === 'preview_page_viewed')}
                    />
                    <DetailRow
                        label="Details Clicked"
                        value={lead.engagementEvents?.some(e => e.eventType === 'details_clicked') ? "Yes" : "No"}
                        highlight={lead.engagementEvents?.some(e => e.eventType === 'details_clicked')}
                    />
                    <DetailRow
                        label="Unlock Clicked"
                        value={lead.engagementEvents?.some(e => e.eventType === 'unlock_clicked') ? "Yes" : "No"}
                        highlight={lead.engagementEvents?.some(e => e.eventType === 'unlock_clicked')}
                    />
                </div>
            </div>

            {/* Column 3: Status / Notes */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status & Notes</h4>
                <div className="bg-white p-3 rounded border border-slate-200 shadow-sm">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Internal Notes</label>
                    <textarea
                        placeholder="Add a note..."
                        className="w-full text-xs border-0 p-0 focus:ring-0 resize-none text-slate-700 placeholder:text-slate-300 h-16"
                    />
                </div>
                <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-indigo-600 text-white text-xs py-2 rounded shadow-sm hover:bg-indigo-700">Call Lead</button>
                    <button className="flex-1 bg-white border border-slate-300 text-slate-700 text-xs py-2 rounded shadow-sm hover:bg-slate-50">Email</button>
                </div>
            </div>
        </div>
    )
}

function LeadCard({ lead }: { lead: Lead }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            {/* Card Header clickable to expand */}
            <div
                onClick={() => setExpanded(!expanded)}
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
            >
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="text-sm font-bold text-slate-900">{lead.fullName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{lead.phoneNumber}</div>
                    </div>
                    <Badge status={lead.surveyResponse?.willingnessToPay} />
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mt-3">
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">City</span>
                        <span className="text-slate-700 font-medium">{lead.city}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Type</span>
                        <span className="text-slate-700 font-medium">{lead.type}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Details</span>
                        <span className="text-slate-700 truncate">{lead.budget || "-"} • {lead.moveIn || "-"}</span>
                    </div>
                    <div className="flex flex-col items-end justify-end">
                        <span className="text-slate-400 text-[10px]">{format(new Date(lead.createdAt), 'MMM d')}</span>
                    </div>
                </div>
            </div>

            {/* Expansion Panel */}
            {expanded && (
                <div className="bg-slate-50 border-t border-slate-100 p-4 animate-fadeIn">
                    <ExpandedDetails lead={lead} />
                </div>
            )}

            {/* Action Bar */}
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex justify-center">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
                >
                    {expanded ? "Collapse Details" : "View Full Details"}
                    <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
            </div>
        </div>
    );
}
