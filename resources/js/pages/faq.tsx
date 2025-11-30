import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs: FAQItem[] = [
        {
            question: 'Is Glenride an academic institution, a nonprofit, or a company?',
            answer: 'Glenride is a hybrid think tank and build space. We work with universities, community organizations, and partners across sectors, but our core commitment is to build an ecosystem—not a single institution. As we grow, we may use different legal structures in different regions to best support our mission.'
        },
        {
            question: 'Do I need a specific degree or background to participate?',
            answer: 'No. We welcome scholars, technologists, organizers, artists, and people whose expertise comes from lived experience and community work. Some fellowships or programs may have specific criteria, but the Glenride movement itself is open.'
        },
        {
            question: 'How do you decide which projects to support?',
            answer: 'We prioritize projects that: (1) Address structural issues rather than surface symptoms, (2) Are grounded in clear ethical reflection and critical analysis, (3) Are co-created with, or accountable to, affected communities, and (4) Have a plausible path from prototype to real-world impact.'
        },
        {
            question: 'How is Glenride funded?',
            answer: 'We aim to blend philanthropic support, values-aligned partnerships, and potentially member-driven models over time. Our goal is to protect intellectual and political independence while remaining materially accountable to the communities we serve.'
        },
        {
            question: 'Can my organization partner with Glenride?',
            answer: 'Yes. We collaborate with community organizations, research centers, public-interest groups, and values-aligned companies. Start on the Join or Contact page and share what you're envisioning.'
        },
        {
            question: 'What does "engineering the future" mean?',
            answer: 'We believe the future is not predetermined—it is the result of deliberate choices, systems, and interventions. When we say "engineering the future," we mean applying rigorous analysis, ethical frameworks, and collaborative design to build new institutions, tools, and practices that serve justice and collective flourishing.'
        },
        {
            question: 'How can I stay updated on Glenride's work?',
            answer: 'You can subscribe to updates through our Library page, follow our published work as it comes online, or reach out directly via the Contact or Join pages to get involved more directly.'
        }
    ];

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <PublicLayout>
            <Head title="FAQ" />

            {/* Hero */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        What people ask before they join us.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl">
                        If you don't see your question here, you can always reach out directly.
                    </p>
                </div>
            </section>

            {/* FAQ List */}
            <section className="px-8 py-20 lg:px-12">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 hover:border-black transition-colors"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left"
                                >
                                    <span className="text-lg font-bold pr-8">
                                        {faq.question}
                                    </span>
                                    {openIndex === index ? (
                                        <ChevronUp className="w-5 h-5 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 flex-shrink-0" />
                                    )}
                                </button>
                                {openIndex === index && (
                                    <div className="px-8 pb-6 text-gray-700 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-8 py-20 lg:px-12 lg:py-32 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Still have questions?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        We're here to help. Reach out and we'll get back to you.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                    >
                        Contact us →
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
