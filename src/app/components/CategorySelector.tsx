"use client";

const categories = [
    { id: "Student", label: "Student Housing", icon: "🎓" },
    { id: "Family", label: "Family Homes", icon: "🏡" },
    { id: "Professional", label: "Working Professionals", icon: "💼" },
    { id: "Commercial", label: "Commercial Spaces", icon: "🏢" },
];

export default function CategorySelector({ onSelect }: { onSelect: (category: string) => void }) {
    return (
        <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
                    Who Are You Looking For?
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onSelect(cat.id)}
                            className="group relative rounded-lg p-6 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 transition-all flex flex-col items-center text-center cursor-pointer shadow-sm hover:shadow-md"
                        >
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</span>
                            <span className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
