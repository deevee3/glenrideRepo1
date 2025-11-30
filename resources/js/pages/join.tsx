import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { useState } from 'react';

export default function Join() {
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        location: '',
        workingOn: '',
        collaboration: '',
        other: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement form submission
        console.log('Form submitted:', formData);
        alert('Thank you for reaching out. We will review your submission and follow up with next steps.');
    };

    const audienceCards = [
        {
            id: 'scholar',
            title: 'Scholars & Thinkers',
            description: 'Collaborate on research, frameworks, and public-facing work that shapes real decisions.',
            cta: "I'm a Scholar"
        },
        {
            id: 'builder',
            title: 'Technologists & Builders',
            description: 'Prototype tools, infrastructures, and platforms rooted in ethics and critical analysis.',
            cta: "I'm a Builder"
        },
        {
            id: 'organizer',
            title: 'Organizers & Movements',
            description: 'Access research, strategy, and tech partners for campaigns and community projects.',
            cta: "I'm an Organizer"
        },
        {
            id: 'partner',
            title: 'Partners & Funders',
            description: 'Support rigorous, accountable work that targets structural change, not cosmetic fixes.',
            cta: "I'm a Partner"
        }
    ];

    return (
        <PublicLayout>
            <Head title="Join Glenride" />

            {/* Hero */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Bring your skills to the work of rewriting the future.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl">
                        Glenride is built by people like you—scholars, technologists, organizers, artists, and partners who refuse to accept business as usual.
                    </p>
                </div>
            </section>

            {/* Section 1 – Choose Your Path */}
            <section className="px-8 py-20 lg:px-12 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Choose Your Path
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl">
                            Tell us how you want to plug in, and we'll follow up with opportunities that fit—fellowships, labs, collaborations, and partnerships.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {audienceCards.map((card) => (
                            <div
                                key={card.id}
                                className={`border-2 p-8 transition-all cursor-pointer ${selectedRole === card.id
                                        ? 'border-black bg-white shadow-lg'
                                        : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                onClick={() => {
                                    setSelectedRole(card.id);
                                    setFormData({ ...formData, role: card.id });
                                    // Scroll to form
                                    document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {card.description}
                                </p>
                                <span className="text-xs font-bold uppercase tracking-wider hover:underline">
                                    {card.cta} →
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 2 – Interest Form */}
            <section id="join-form" className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Tell us about you.
                    </h2>
                    <p className="text-lg text-gray-600 mb-12">
                        We review every submission carefully. Share as much context as you can about your work, your questions, and the kind of collaboration you're imagining.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                How would you describe yourself? *
                            </label>
                            <select
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white"
                            >
                                <option value="">Select one...</option>
                                <option value="scholar">Scholar / Thinker</option>
                                <option value="builder">Technologist / Builder</option>
                                <option value="organizer">Organizer / Movement Leader</option>
                                <option value="partner">Partner / Funder</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                Where are you based?
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                                placeholder="City, Country or Region"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                What are you working on or interested in? *
                            </label>
                            <textarea
                                required
                                value={formData.workingOn}
                                onChange={(e) => setFormData({ ...formData, workingOn: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none"
                                placeholder="Tell us about your current work, research, projects, or interests..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                How would you like to collaborate with Glenride? *
                            </label>
                            <textarea
                                required
                                value={formData.collaboration}
                                onChange={(e) => setFormData({ ...formData, collaboration: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none"
                                placeholder="What kind of partnership or collaboration are you envisioning?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                Anything else we should know?
                            </label>
                            <textarea
                                value={formData.other}
                                onChange={(e) => setFormData({ ...formData, other: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none"
                                placeholder="Optional additional context..."
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-black text-white px-12 py-4 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                            >
                                Send to Glenride
                            </button>
                            <p className="text-sm text-gray-500 mt-4">
                                Thank you for reaching out. We'll review your submission and follow up with next steps, opportunities, or clarifying questions.
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}
