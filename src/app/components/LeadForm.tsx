"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LeadForm({ selectedCategory }: { selectedCategory?: string }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        city: "INDORE",
        type: "RESIDENTIAL",
        subType: "",
        budget: "",
        moveIn: "",
        area: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (selectedCategory) {
            setFormData((prev) => ({ ...prev, type: selectedCategory }));
        }
    }, [selectedCategory]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to submit");

            const data = await res.json();
            router.push(`/thank-you?leadId=${data.leadId}`);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="lead-form" className="py-12 bg-gray-50">
            <div className="max-w-xl mx-auto px-4">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Get Matched With Verified Rentals
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border min-h-[44px]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                required
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border min-h-[44px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City *</label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border min-h-[44px]"
                                >
                                    <option value="INDORE">Indore</option>
                                    <option value="BHOPAL">Bhopal</option>
                                    <option value="BENGALURU">Bengaluru</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Property Type *</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border min-h-[44px]"
                                >
                                    <option value="RESIDENTIAL">Residential</option>
                                    <option value="COMMERCIAL">Commercial</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sub-Type</label>
                            <select
                                name="subType"
                                value={formData.subType}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border min-h-[44px]"
                            >
                                <option value="">Select Option...</option>
                                <option value="Student">Student Housing</option>
                                <option value="Family">Family Home</option>
                                <option value="Professional">Working Professional</option>
                                <option value="Office">Office Space</option>
                                <option value="Shop">Shop / Retail</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                                <input
                                    type="text"
                                    name="budget"
                                    placeholder="e.g. 10k-15k"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border min-h-[44px]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Move-in Timeline</label>
                                <input
                                    type="text"
                                    name="moveIn"
                                    placeholder="e.g. Immediate"
                                    value={formData.moveIn}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border min-h-[44px]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Preferred Area</label>
                            <input
                                type="text"
                                name="area"
                                placeholder="e.g. Vijay Nagar"
                                value={formData.area}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border min-h-[44px]"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 min-h-[44px]"
                        >
                            {loading ? "Submitting..." : "Show Available Properties"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
