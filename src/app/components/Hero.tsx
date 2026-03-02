"use client";

import Link from "next/link";

export default function Hero({ onGetStarted }: { onGetStarted: () => void }) {
    return (
        <div className="bg-indigo-700 text-white py-24 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl mb-6">
                Find Verified Rental Properties <br className="hidden sm:block" />
                <span className="text-indigo-200">Without Brokerage Stress</span>
            </h1>
            <p className="max-w-md mx-auto text-xl text-indigo-100 sm:max-w-3xl mb-10">
                Residential & Commercial Spaces Across Indore, Bhopal & Bengaluru.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={onGetStarted}
                    className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:text-lg md:px-10 min-h-[44px]"
                >
                    Get Available Properties
                </button>
                <Link
                    href="#list-property"
                    className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 md:text-lg md:px-10 min-h-[44px] flex items-center justify-center"
                >
                    List Your Property
                </Link>
            </div>
        </div>
    );
}
