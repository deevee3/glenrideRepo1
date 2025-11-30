import { Head, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { FormEventHandler } from 'react';

declare let route: any;

export default function Join() {
    const { data, setData, post, processing, errors, reset, wasSuccessful, transform } = useForm({
        name: '',
        email: '',
        self_description: '',
        location: '',
        current_work: '',
        collaboration_idea: '',
        other: ''
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Combine other into collaboration_idea if present
        transform((data) => ({
            ...data,
            collaboration_idea: data.other 
                ? `${data.collaboration_idea}\n\nOther Context:\n${data.other}`
                : data.collaboration_idea
        }));

        post(route('join.store'), {
            onSuccess: () => reset(),
        });
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
                                className={`border-2 p-8 transition-all cursor-pointer ${data.self_description === card.id
                                        ? 'border-black bg-white shadow-lg'
                                        : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                onClick={() => {
                                    setData('self_description', card.id);
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

                    {wasSuccessful && (
                        <div className="mb-8 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
                            <p className="font-bold">Thank you!</p>
                            <p>Your request has been sent successfully. We will get back to you soon.</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                            />
                            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                            />
                            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                How would you describe yourself? *
                            </label>
                            <select
                                required
                                value={data.self_description}
                                onChange={(e) => setData('self_description', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none bg-white"
                            >
                                <option value="">Select one...</option>
                                <option value="scholar">Scholar / Thinker</option>
                                <option value="builder">Technologist / Builder</option>
                                <option value="organizer">Organizer / Movement Leader</option>
                                <option value="partner">Partner / Funder</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.self_description && <div className="text-red-500 text-sm mt-1">{errors.self_description}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                Where are you based?
                            </label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                                placeholder="City, Country or Region"
                            />
                            {errors.location && <div className="text-red-500 text-sm mt-1">{errors.location}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                What are you working on or interested in? *
                            </label>
                            <textarea
                                required
                                value={data.current_work}
                                onChange={(e) => setData('current_work', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none"
                                placeholder="Tell us about your current work, research, projects, or interests..."
                            />
                            {errors.current_work && <div className="text-red-500 text-sm mt-1">{errors.current_work}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                How would you like to collaborate with Glenride? *
                            </label>
                            <textarea
                                required
                                value={data.collaboration_idea}
                                onChange={(e) => setData('collaboration_idea', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none"
                                placeholder="What kind of partnership or collaboration are you envisioning?"
                            />
                            {errors.collaboration_idea && <div className="text-red-500 text-sm mt-1">{errors.collaboration_idea}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                Anything else we should know?
                            </label>
                            <textarea
                                value={data.other}
                                onChange={(e) => setData('other', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none"
                                placeholder="Optional additional context..."
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full md:w-auto bg-black text-white px-12 py-4 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Sending...' : 'Send to Glenride'}
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
