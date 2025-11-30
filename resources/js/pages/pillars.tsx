import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function Pillars() {
    return (
        <PublicLayout>
            <Head title="Pillars & Programs" />

            {/* Hero */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        From principles to programs.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl">
                        Glenride's work is structured around three pillars—Ethics, Critique, and Praxis. Each pillar hosts programs that move us from understanding to transformation.
                    </p>
                </div>
            </section>

            {/* Section 1 – ETHICS */}
            <section className="px-8 py-20 lg:px-12 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <span className="text-xs font-bold tracking-widest text-gray-500 mb-4 block uppercase">
                        Pillar I · Ethics
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ethics
                    </h2>
                    <p className="text-lg text-gray-700 max-w-4xl mb-12">
                        Ethics is our starting point. We investigate what justice requires in contexts shaped by AI, climate crisis, global inequality, and more. We craft frameworks that can guide real-world decisions, not just abstract debates.
                    </p>

                    <div className="space-y-8">
                        <div className="border-l-4 border-[#C5B393] pl-6">
                            <h3 className="text-xl font-bold mb-3">Ethics Labs</h3>
                            <p className="text-gray-600">
                                Collaborative studios where philosophers, technologists, and affected communities design ethical guidelines and evaluation criteria for emerging technologies and public policies.
                            </p>
                        </div>
                        <div className="border-l-4 border-[#C5B393] pl-6">
                            <h3 className="text-xl font-bold mb-3">Justice by Design Fellowship</h3>
                            <p className="text-gray-600">
                                A fellowship for scholars and builders who embed ethical reflection into systems—product design, governance models, legal frameworks, and data infrastructures.
                            </p>
                        </div>
                        <div className="border-l-4 border-[#C5B393] pl-6">
                            <h3 className="text-xl font-bold mb-3">Global Ethics Dialogues</h3>
                            <p className="text-gray-600">
                                Open conversations and workshops that bring complex ethical questions into accessible public forums, online and in-person.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2 – CRITIQUE */}
            <section className="px-8 py-20 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <span className="text-xs font-bold tracking-widest text-gray-500 mb-4 block uppercase">
                        Pillar II · Critique
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Critique
                    </h2>
                    <p className="text-lg text-gray-700 max-w-4xl mb-12">
                        Critique helps us see clearly. We examine how power operates—historically and today—in law, markets, data, borders, and everyday life. We refuse the myth of neutral systems.
                    </p>

                    <div className="space-y-8">
                        <div className="border-l-4 border-[#C5B393] pl-6">
                            <h3 className="text-xl font-bold mb-3">Power Diagnostics Initiative</h3>
                            <p className="text-gray-600">
                                Deep-dive research projects that map how power and harm move through specific systems—policing, housing, migration, education, digital platforms—and identify leverage points for change.
                            </p>
                        </div>
                        <div className="border-l-4 border-[#C5B393] pl-6">
                            <h3 className="text-xl font-bold mb-3">Critical Histories of the Future</h3>
                            <p className="text-gray-600">
                                Projects that uncover suppressed or forgotten histories to expand what futures we can imagine and claim, especially for marginalized communities.
                            </p>
                        </div>
                        <div className="border-l-4 border-[#C5B393] pl-6">
                            <h3 className="text-xl font-bold mb-3">Methodologies of Liberation School</h3>
                            <p className="text-gray-600">
                                Training in critical methods for students, organizers, policymakers, and technologists who want to interrogate and transform the systems they're in.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3 – PRAXIS */}
            <section className="px-8 py-20 lg:px-12 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <span className="text-xs font-bold tracking-widest text-gray-500 mb-4 block uppercase">
                        Pillar III · Praxis
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Praxis
                    </h2>
                    <p className="text-lg text-gray-700 max-w-4xl mb-12">
                        Praxis is where insight meets responsibility. We co-design and test concrete interventions—from policies to platforms to cooperative models—with communities and partners.
                    </p>

                    <div className="space-y-8">
                        <div className="border-l-4 border-[#C5B393] pl-6">
                            <h3 className="text-xl font-bold mb-3">Glenride Action Incubator</h3>
                            <p className="text-gray-600">
                                An incubator for mission-driven projects—apps, cooperatives, campaigns, and civic tools—that emerge from our Ethics and Critique work.
                            </p>
                        </div>
                        <div className="border-l-4 border-[#C5B393] pl-6">
                            <h3 className="text-xl font-bold mb-3">Policy & Movement Studio</h3>
                            <p className="text-gray-600">
                                A collaborative space where researchers, lawyers, organizers, and designers translate analysis into legislation, charters, institutional reforms, and movement strategies.
                            </p>
                        </div>
                        <div className="border-l-4 border-[#C5B393] pl-6">
                            <h3 className="text-xl font-bold mb-3">Future Systems Lab</h3>
                            <p className="text-gray-600">
                                An experimental lab using AI, distributed ledgers, and other technologies to design new forms of governance, mutual aid, and economic coordination.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4 – How to Engage */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">
                        Find your place in the work.
                    </h2>
                    <div className="space-y-6 text-lg text-gray-700 max-w-4xl mb-12">
                        <p>
                            Whether you're an individual or an institution, you can engage with Glenride at the level that fits you:
                        </p>
                        <ul className="list-none space-y-3 ml-0">
                            <li className="flex gap-4">
                                <span className="text-[#C5B393] font-bold">→</span>
                                <span>Join a <strong>Dialogue</strong> or <strong>School</strong> to deepen your understanding.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-[#C5B393] font-bold">→</span>
                                <span>Apply to a <strong>Fellowship</strong>, <strong>Lab</strong>, or <strong>Incubator</strong> to build something new.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-[#C5B393] font-bold">→</span>
                                <span>Partner with us through the <strong>Policy & Movement Studio</strong> to transform existing institutions.</span>
                            </li>
                        </ul>
                    </div>
                    <Link
                        href="/join"
                        className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                    >
                        Go to Join Glenride →
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
