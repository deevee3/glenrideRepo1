import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function About() {
    return (
        <PublicLayout>
            <Head title="About Glenride" />

            {/* Hero Section */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Rewriting the future is a collective discipline.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl">
                        Glenride is a global movement and think tank founded by D'Vaughn House, dedicated to engineering solutions at the intersection of ethics, critique, and praxis.
                    </p>
                </div>
            </section>

            {/* Section 1 – What Glenride Is */}
            <section className="px-8 py-20 lg:px-12 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">
                        A think tank. A build space. A movement.
                    </h2>
                    <div className="space-y-6 text-lg text-gray-700 max-w-4xl">
                        <p>
                            Glenride brings together scholars, technologists, organizers, artists, and communities who believe the future is not a forecast but an engineered decision.
                        </p>
                        <p>
                            We refuse to accept crisis as the default state of humanity. Instead, we design and test new frameworks, tools, and institutions that serve the greatest good—especially for those most harmed by existing systems.
                        </p>
                        <p className="font-semibold">Glenride operates as:</p>
                        <ul className="list-none space-y-4 ml-0">
                            <li className="flex gap-4">
                                <span className="text-[#C5B393] font-bold">→</span>
                                <span><strong>A research engine</strong>, where rigorous thinking about ethics and power is central, not peripheral.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-[#C5B393] font-bold">→</span>
                                <span><strong>A build space</strong>, where ideas evolve into prototypes, pilots, and policies.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-[#C5B393] font-bold">→</span>
                                <span><strong>A movement network</strong>, where people across borders and disciplines organize around shared values.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 2 – How We Work */}
            <section className="px-8 py-20 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">
                        From insight to infrastructure.
                    </h2>
                    <div className="space-y-6 text-lg text-gray-700 max-w-4xl mb-12">
                        <p>Our work moves through a deliberate cycle:</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-6xl font-bold text-gray-200 mb-4">1</div>
                            <h3 className="text-xl font-bold mb-3">Ethics</h3>
                            <p className="text-gray-600">
                                Clarifying what justice, responsibility, and the "greatest good" mean in concrete contexts.
                            </p>
                        </div>
                        <div>
                            <div className="text-6xl font-bold text-gray-200 mb-4">2</div>
                            <h3 className="text-xl font-bold mb-3">Critique</h3>
                            <p className="text-gray-600">
                                Diagnosing how domination, inequality, and extraction are built into our institutions and technologies.
                            </p>
                        </div>
                        <div>
                            <div className="text-6xl font-bold text-gray-200 mb-4">3</div>
                            <h3 className="text-xl font-bold mb-3">Praxis</h3>
                            <p className="text-gray-600">
                                Co-creating interventions that redistribute power and expand freedom.
                            </p>
                        </div>
                    </div>
                    <div className="mt-12 text-lg text-gray-700 max-w-4xl">
                        <p>
                            Every Glenride program, partnership, and publication is mapped to these three pillars so that we never lose sight of values, power, or action.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 3 – Origins */}
            <section className="px-8 py-20 lg:px-12 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">
                        Created by D'Vaughn House.
                    </h2>
                    <div className="space-y-6 text-lg text-gray-700 max-w-4xl">
                        <p>
                            Glenride began as a response to a simple question:<br />
                            <em className="text-xl font-medium text-black">
                                What would it look like if we treated the future as something we intentionally engineer for justice, rather than something we passively inherit?
                            </em>
                        </p>
                        <p>
                            Drawing on a background that bridges rigorous analysis, data integrity, and systems thinking, D'Vaughn House created Glenride as a foundation for people who wanted more than commentary—people who wanted to build.
                        </p>
                        <p>
                            Today, Glenride is evolving into a global ecosystem of collaborators who share that commitment.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 4 – What We Focus On */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">
                        Crises we refuse to normalize.
                    </h2>
                    <div className="space-y-6 text-lg text-gray-700 max-w-4xl mb-12">
                        <p>
                            While Glenride's tools are broad, our attention is precise. We concentrate on overlapping crises such as:
                        </p>
                        <ul className="list-none space-y-3 ml-0">
                            <li className="flex gap-4">
                                <span className="text-[#C5B393] font-bold">•</span>
                                <span>Climate breakdown and extractive economies</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-[#C5B393] font-bold">•</span>
                                <span>Racial segregation, economic exploitation, and mass displacement</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-[#C5B393] font-bold">•</span>
                                <span>Gendered and sexual oppression</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-[#C5B393] font-bold">•</span>
                                <span>Political violence, algorithmic harm, and democratic erosion</span>
                            </li>
                        </ul>
                        <p>
                            We approach these not as isolated "issues," but as interconnected systems that can—and must—be redesigned.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-block border border-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                    >
                        Explore Our 2025 Agenda →
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
