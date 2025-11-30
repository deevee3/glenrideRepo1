import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function Manifesto() {
    return (
        <PublicLayout>
            <Head title="The Glenride Manifesto" />

            {/* Hero */}
            <section className="px-8 py-20 lg:px-12 lg:py-32 bg-black text-white">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        We refuse to be spectators of collapse.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mb-8">
                        The Glenride Manifesto sets out why we exist, what we are committed to, and how we intend to act.
                    </p>
                    <p className="text-lg text-gray-300 max-w-4xl">
                        This is a living document. It will evolve as our work, our partners, and our world change. But its core conviction will remain: the future is not something that happens to us—it is something we engineer together, ethically and courageously.
                    </p>
                </div>
            </section>

            {/* Manifesto Body */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="max-w-4xl mx-auto prose prose-lg">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">The future is not a forecast; it is an engineered decision.</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Every crisis we face today—climate collapse, algorithmic surveillance, mass displacement, systematic inequality—is the result of choices made by people, institutions, and systems. If the present was engineered, so too can the future be.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold mb-6">We refuse to treat crisis as the natural state of humanity.</h2>
                            <p className="text-gray-700 leading-relaxed">
                                There is nothing inevitable about suffering. Poverty, oppression, and ecological destruction are not laws of nature—they are the products of extraction, domination, and neglect. We reject the idea that this is simply "how things are."
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold mb-6">Our work begins with three pillars: Ethics, Critique, and Praxis.</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                These are not separate activities—they are interlocking modes of engagement:
                            </p>
                            <ul className="space-y-4 list-none ml-0">
                                <li className="flex gap-4">
                                    <span className="text-[#C5B393] font-bold text-xl">→</span>
                                    <span><strong>Ethics</strong> asks what justice demands, who is owed what, and why.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-[#C5B393] font-bold text-xl">→</span>
                                    <span><strong>Critique</strong> unmasks how power is structured, who benefits, and who is harmed.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-[#C5B393] font-bold text-xl">→</span>
                                    <span><strong>Praxis</strong> builds the interventions—policies, platforms, institutions—that redistribute power and expand freedom.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold mb-6">We center the greatest good, especially for those most harmed.</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Our ethical commitments are not abstract. We prioritize the wellbeing of communities that have been systematically marginalized, exploited, or erased. Justice is not a thought experiment—it is a debt that must be paid.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold mb-6">We are global, interdisciplinary, and accountable.</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Glenride brings together scholars, technologists, organizers, artists, and affected communities from around the world. We work across sectors and disciplines because the problems we face do not respect boundaries. And we hold ourselves accountable to the people and communities our work is meant to serve.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold mb-6">We co-create, not prescribe.</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We do not parachute in with solutions. We build alongside communities, movements, and partners who have deep knowledge of the systems we seek to change. Our role is to provide research, tools, and infrastructure—not to dictate the future.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold mb-6">We prototype, test, and scale.</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Ideas are not enough. We build prototypes, run pilots, measure impacts, and refine our models. When something works, we help it scale. When it doesn't, we learn and iterate.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold mb-6">Glenride is a movement, not a monument.</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We are not building an institution to preserve ourselves. We are building a network, a practice, and a set of tools that others can use, adapt, and carry forward. Our success will be measured by what outlives us.
                            </p>
                        </div>

                        <div className="pt-12 border-t border-gray-200">
                            <p className="text-xl font-medium text-gray-900 italic">
                                "The future begins wherever someone decides the world must be otherwise."
                            </p>
                            <p className="text-gray-600 mt-4">
                                If you share this commitment, you are already part of Glenride.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTAs */}
            <section className="px-8 py-20 lg:px-12 bg-gray-50">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <Link
                            href="/"
                            className="border border-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                        >
                            Return to Home →
                        </Link>
                        <Link
                            href="/pillars"
                            className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                        >
                            Explore Pillars & Programs →
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
