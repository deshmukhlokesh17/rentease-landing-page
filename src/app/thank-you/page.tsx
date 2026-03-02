"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function ThankYouContent() {
    const searchParams = useSearchParams();
    const leadIdStr = searchParams.get("leadId");
    const leadId = leadIdStr ? parseInt(leadIdStr) : null;
    const [surveyAnswer, setSurveyAnswer] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSurveySubmit = async (answer: string) => {
        if (!leadId) return;
        setLoading(true);
        setSurveyAnswer(answer); // Optimistic UI update
        try {
            await fetch("/api/survey", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, willingnessToPay: answer.toUpperCase() }),
            });
        } catch (e) {
            console.error("Survey submission failed", e);
        } finally {
            setLoading(false);
        }
    };

    const handleExplore = async () => {
        if (leadId) {
            try {
                await fetch("/api/track-engagement", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ leadId, eventType: "preview_clicked" }),
                });
            } catch (e) {
                console.error("Tracking failed", e);
            }
            window.location.href = `/preview?leadId=${leadId}`;
        } else {
            window.location.href = "/preview";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Main Card */}
            <div className="w-full max-w-[560px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-10 border border-slate-100">

                {/* Top Section */}
                <div className="text-center mb-10">
                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100/50 mb-6 ring-1 ring-emerald-500/20">
                        <svg className="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                        Thank You.
                    </h2>

                    <h3 className="text-lg font-semibold text-slate-700 mb-4">
                        Request Received.
                    </h3>

                    <div className="space-y-1">
                        <p className="text-slate-600 font-medium">
                            We’re preparing verified matches for you.
                        </p>
                        <p className="text-slate-500">
                            Our team will contact you shortly.
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-slate-100 mb-10"></div>

                {/* Willingness Section (Glass/Frosted Card) */}
                <div className="bg-slate-50/50 backdrop-blur-sm rounded-xl border border-slate-200/60 p-6 mb-8 inner-shadow-sm">
                    <p className="text-center text-slate-700 font-medium mb-5 leading-relaxed">
                        Would you pay a small one-time fee (₹199–₹499) for guaranteed verified rental listings?
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                        {["YES", "MAYBE", "NO"].map((option) => {
                            const isSelected = surveyAnswer === option;
                            const isSelectedOther = surveyAnswer !== null && !isSelected;

                            return (
                                <button
                                    key={option}
                                    onClick={() => handleSurveySubmit(option)}
                                    disabled={loading || !leadId || surveyAnswer !== null}
                                    className={`
                                        relative overflow-hidden py-2.5 px-2 rounded-lg text-sm font-semibold transition-all duration-200 border
                                        ${isSelected
                                            ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-[1.02]"
                                            : isSelectedOther
                                                ? "bg-white text-slate-300 border-slate-200 opacity-50 cursor-not-allowed"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm active:scale-[0.98]"
                                        }
                                    `}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Explore Section */}
                <div className="text-center mb-8 flex justify-center">
                    <button
                        onClick={handleExplore}
                        className="group w-full md:w-auto inline-flex items-center justify-center px-8 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow"
                    >
                        Explore Sample Listings
                        <svg className="ml-2 w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>

                {/* Footer Link */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                </div>
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    );
}
