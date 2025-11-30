import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement form submission
        console.log('Contact form submitted:', formData);
        alert('Thank you for your message. We will get back to you soon.');
    };

    return (
        <PublicLayout>
            <Head title="Contact" />

            {/* Hero */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Get in touch.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl">
                        Questions, media inquiries, invitations, or ideas that don't fit anywhere else—start here.
                    </p>
                </div>
            </section>

            {/* Body */}
            <section className="px-8 py-20 lg:px-12">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">
                            We're building Glenride in public.
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            If you have a question about our work, want to invite us into a dialogue, or are exploring potential collaboration, send us a note.
                        </p>
                        <div className="bg-gray-50 p-6 border-l-4 border-[#C5B393]">
                            <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Email us directly
                            </p>
                            <p className="text-lg">
                                <a href="mailto:contact@glenride.org" className="hover:underline font-medium">
                                    contact@glenride.org
                                </a>
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                or use the form below
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
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
                                Subject *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none"
                                placeholder="What's this about?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                                Message *
                            </label>
                            <textarea
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={8}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none"
                                placeholder="Tell us more..."
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-black text-white px-12 py-4 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Additional Info */}
            <section className="px-8 py-20 lg:px-12 bg-gray-50">
                <div className="max-w-3xl mx-auto text-center">
                    <h3 className="text-xl font-bold mb-4">
                        Looking to join or partner with Glenride?
                    </h3>
                    <p className="text-gray-600 mb-8">
                        If you're interested in fellowships, programs, or partnerships, head to our Join page for a more structured application.
                    </p>
                    <a
                        href="/join"
                        className="inline-block border border-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                    >
                        Go to Join Page →
                    </a>
                </div>
            </section>
        </PublicLayout>
    );
}
