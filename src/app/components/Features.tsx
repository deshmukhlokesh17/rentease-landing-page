export default function Features() {
    return (
        <div className="py-16 bg-white overflow-hidden lg:py-24">
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">The Problem</h2>
                    <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                        The Rental Market Is Broken
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        {["Fake listings", "High brokerage fees", "Unverified properties", "Too many site visits", "Legal confusion"].map((item) => (
                            <span key={item} className="px-4 py-2 rounded-full bg-red-100 text-red-800 font-medium">
                                ❌ {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Our Solution</h2>
                        <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                            What We’re Building
                        </p>
                        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                            A smarter, verified way to rent your next home or office.
                        </p>
                    </div>

                    <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
                        {[
                            { title: "Verified properties only", desc: "Every listing is physically verified by our team." },
                            { title: "Direct owner communication", desc: "Connect directly without middlemen." },
                            { title: "Transparent pricing", desc: "No hidden charges or surprise fees." },
                            { title: "Budget & Location Filters", desc: "Find exactly what you need, where you need it." },
                            { title: "Digital Rent Agreements", desc: "Legal paperwork handled online." },
                        ].map((feature) => (
                            <div key={feature.title} className="relative">
                                <dt>
                                    <p className="text-lg leading-6 font-medium text-gray-900">✅ {feature.title}</p>
                                </dt>
                                <dd className="mt-2 text-base text-gray-500">
                                    {feature.desc}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
