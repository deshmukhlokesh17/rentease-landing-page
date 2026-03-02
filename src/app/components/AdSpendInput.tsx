"use client";

import { updateAdSpend } from "../actions/settings";
import { useState } from "react";

export default function AdSpendInput({ initialValue }: { initialValue: string }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        await updateAdSpend(formData);
        setLoading(false);
    };

    return (
        <form action={handleSubmit} className="flex items-end gap-4">
            <div className="flex-1">
                <label htmlFor="adSpend" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Ad Spend (₹)
                </label>
                <input
                    type="number"
                    id="adSpend"
                    name="adSpend"
                    defaultValue={initialValue}
                    placeholder="0"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? "Updating..." : "Update"}
            </button>
        </form>
    );
}
