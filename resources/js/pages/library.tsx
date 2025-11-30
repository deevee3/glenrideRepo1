import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { useState } from 'react';

export default function Library() {
    const [activeFilter, setActiveFilter] = useState<'all' | 'read' | 'watch' | 'listen'>('all');
    const [activePillar, setActivePillar] = useState<'all' | 'ethics' | 'critique' | 'praxis'>('all');

    return (
        <PublicLayout>
            <Head title="Library" />

            {/* Hero */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        A library for rethinking the future.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl">
                        Dive into essays, talks, conversations, and prototypes that explore ethics, critique power, and document experiments in praxis.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="px-8 lg:px-12 pb-12 border-b border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500">Content Type</h3>
                        <div className="flex flex-wrap gap-4">
                            {(['all', 'read', 'watch', 'listen'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${activeFilter === filter
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {filter === 'all' ? 'All' : filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500">Filter by Pillar</h3>
                        <div className="flex flex-wrap gap-4">
                            {(['all', 'ethics', 'critique', 'praxis'] as const).map((pillar) => (
                                <button
                                    key={pillar}
                                    onClick={() => setActivePillar(pillar)}
                                    className={`px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${activePillar === pillar
                                            ? 'bg-[#C5B393] text-white'
                                            : 'border border-gray-300 text-gray-700 hover:border-black'
                                        }`}
                                >
                                    {pillar === 'all' ? 'All Pillars' : pillar}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Empty State */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Coming online as we build.
                    </h2>
                    <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                        As Glenride launches, our library will grow with new essays, video explainers, and recorded conversations. Sign up below to be notified when we publish.
                    </p>

                    <div className="max-w-md mx-auto">
                        <form className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4">
                            We'll only send you updates when new content is published.
                        </p>
                    </div>
                </div>
            </section>

            {/* Placeholder for future content grid */}
            {/* <section className="px-8 lg:px-12 pb-32">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        Content items will appear here
                    </div>
                </div>
            </section> */}
        </PublicLayout>
    );
}
