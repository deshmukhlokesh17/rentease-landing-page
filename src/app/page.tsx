"use client";

import { useState, useRef, useEffect } from "react";
import Hero from "./components/Hero";
import CategorySelector from "./components/CategorySelector";
import Features from "./components/Features";
import LeadForm from "./components/LeadForm";

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fire and forget visit tracking
        fetch("/api/track-visit", { method: "POST" });
    }, []);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        scrollToForm();
    };

    return (
        <main className="min-h-screen bg-white">
            <Hero onGetStarted={scrollToForm} />

            <CategorySelector onSelect={handleCategorySelect} />

            <Features />

            <div ref={formRef}>
                <LeadForm selectedCategory={selectedCategory} />
            </div>

            <footer className="bg-gray-800 text-white py-8 text-center">
                <p>&copy; {new Date().getFullYear()} Rentease. All rights reserved.</p>
            </footer>
        </main>
    );
}
