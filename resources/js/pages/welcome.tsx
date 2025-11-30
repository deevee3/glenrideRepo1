import { login } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Hammer, Lightbulb } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-white font-sans text-black selection:bg-[#C5B393] selection:text-white">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-gray-100 px-8 py-8 lg:px-12">
                    <Link href="/" className="h-12 w-12">
                        <img src="/glenride-logo.png" alt="Glenride" className="h-full w-full object-contain" />
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        <Link href="/about" className="text-xs font-bold uppercase tracking-wider transition-colors hover:underline">
                            About
                        </Link>
                        <Link href="/pillars" className="text-xs font-bold uppercase tracking-wider transition-colors hover:underline">
                            Pillars
                        </Link>
                        <Link href="/manifesto" className="text-xs font-bold uppercase tracking-wider transition-colors hover:underline">
                            Manifesto
                        </Link>
                        <Link href="/library" className="text-xs font-bold uppercase tracking-wider transition-colors hover:underline">
                            Library
                        </Link>
                        <Link href="/join" className="text-xs font-bold uppercase tracking-wider transition-colors hover:underline">
                            Join
                        </Link>
                        <Link href="/contact" className="text-xs font-bold uppercase tracking-wider transition-colors hover:underline">
                            Contact
                        </Link>
                    </nav>

                    <Link href={login()} className="text-xs font-bold uppercase tracking-wider transition-colors hover:underline">
                        Log in
                    </Link>
                </header>

                {/* Main Content */}
                <main className="mx-auto flex w-full max-w-[1400px] flex-col items-center px-4 lg:px-8">

                    {/* Hero Section */}
                    <div className="relative mb-24 mt-4 flex min-h-[85vh] w-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-gray-900 mx-4 lg:mx-0">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src="/hero-image.jpg"
                                alt="Glenride team collaboration"
                                className="h-full w-full object-cover opacity-40 grayscale"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/60 to-gray-900"></div>
                        </div>

                        {/* Main Content */}
                        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
                            {/* Headline */}
                            <h1 className="mb-12 max-w-6xl text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-xl md:text-7xl">
                                Serious thinkers.<br />Hard truths.<br />New power.
                            </h1>

                            {/* CTAs */}
                            <div className="mb-6 flex flex-col items-center gap-6 md:flex-row">
                                <Link href="/future" className="rounded-lg bg-[#C5B393] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-[#b09f80] hover:shadow-[#C5B393]/20">
                                    Support Glenride's Founding Fund
                                </Link>
                                <a href="#letter" className="flex items-center gap-2 border-b border-transparent text-lg font-bold text-white transition-colors hover:border-[#C5B393] hover:text-[#C5B393]">
                                    Read D'Vaughn's Letter <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Brand Story: What Glenride Is */}
                    <section className="mb-32 w-full max-w-6xl px-4">
                        <div className="grid gap-16 lg:grid-cols-2 items-center">
                            <div>
                                <h2 className="mb-6 text-3xl font-bold md:text-5xl">What Glenride Is</h2>
                                <div className="mb-8 h-1 w-24 bg-black"></div>
                                <p className="mb-6 text-xl font-medium leading-relaxed text-gray-900">
                                    Glenride is a global think tank and build space where scholarship meets lived experience, analysis meets engineering, and outrage meets responsibility.
                                </p>
                                <p className="mb-6 text-lg text-gray-600">
                                    We bring together philosophers, data scientists, lawyers, organizers, artists, and technologists who are tired of watching their work die in PDFs and internal memos.
                                </p>
                                <p className="text-lg text-gray-600">
                                    At Glenride, deep analysis is the starting point—not the end. We are here because we can no longer sleep at night <em>only</em> commenting on crisis.
                                </p>
                            </div>
                            <div className="grid gap-6">
                                {[
                                    { icon: Lightbulb, title: 'Think', desc: 'Deep, interdisciplinary research into ethics, power, and systems.' },
                                    { icon: BookOpen, title: 'Diagnose', desc: 'Clear mapping of how harm is produced and who benefits.' },
                                    { icon: Hammer, title: 'Build', desc: 'Co-creation of products, legal frameworks, and prototypes with communities most affected.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-6 rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-colors hover:bg-white hover:shadow-md">
                                        <div className="rounded-full bg-black p-3 text-white">
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                                            <p className="text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* The Problem / Why Now */}
                    <section className="mb-32 w-full max-w-4xl px-4 text-center">
                        <h2 className="mb-8 text-3xl font-bold md:text-5xl">Why Now, Really</h2>
                        <div className="mx-auto mb-12 h-1 w-24 bg-[#C5B393]"></div>
                        
                        <div className="prose prose-xl mx-auto text-gray-600">
                            <p className="mb-8">
                                There is a moment—maybe you’ve felt it too—when it becomes impossible to tell yourself that “someone else” will handle it.
                            </p>
                            <p className="mb-8">
                                When fires and floods are annual, not exceptional. When rights you thought were settled are suddenly up for debate. When entire generations are told to get used to less: less safety, less stability, less say.
                            </p>
                            <div className="rounded-2xl bg-black p-8 text-white shadow-xl md:p-12 my-12">
                                <p className="text-2xl font-bold italic">
                                    "What keeps you awake is the gap between what the brightest people already understand, and what our institutions are willing to change."
                                </p>
                            </div>
                            <p className="mb-8">
                                Glenride is your decision not to let that gap stay empty. We are realists who refuse to accept that nothing else is possible.
                            </p>
                        </div>
                    </section>

                    {/* Founding Fund */}
                    <section className="mb-32 w-full max-w-7xl px-4">
                        <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-20 text-white md:px-16">
                            {/* Decorative bg element */}
                            <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 transform rounded-full bg-[#C5B393] opacity-10 blur-[100px]"></div>

                            <div className="relative z-10 grid gap-16 lg:grid-cols-2">
                                <div>
                                    <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-[#C5B393]">The Investment</span>
                                    <h2 className="mb-6 text-3xl font-bold md:text-5xl">The Founding Fund</h2>
                                    <p className="text-xl text-gray-300 mb-8">
                                        We aren’t raising capital to hoard it. We are raising capital so we can stop pretending world-scale problems can be solved on pocket change.
                                    </p>
                                    <Link href="/future" className="inline-flex items-center gap-2 text-[#C5B393] hover:text-white transition-colors font-bold uppercase tracking-wider text-sm">
                                        See how the fund is used <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">1. Build the Think Tank</h3>
                                        <p className="text-gray-400">Recruit and support a core circle of scholars, technologists, and organizers who set Glenride’s intellectual and ethical backbone.</p>
                                    </div>
                                    <div className="h-px w-full bg-white/10"></div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">2. Launch Labs & Pilots</h3>
                                        <p className="text-gray-400">Ethics, Critique, and Praxis projects that address specific crises—starting with climate justice, data and surveillance, and economic dignity.</p>
                                    </div>
                                    <div className="h-px w-full bg-white/10"></div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">3. Prototype & Spin Out</h3>
                                        <p className="text-gray-400">Early products, legal frameworks, and community-owned ventures that prove what Glenride can be.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What We'll Do First */}
                    <section className="mb-32 w-full max-w-6xl px-4">
                        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">What Your Support Makes Possible<br /><span className="text-gray-400 text-2xl">(First 3–5 Years)</span></h2>
                        
                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="group p-8 border border-gray-100 hover:border-black transition-colors rounded-2xl">
                                <div className="mb-4 inline-block rounded bg-[#C5B393]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#C5B393]">Launch</div>
                                <h3 className="text-2xl font-bold mb-4">Ethics Lab on AI & Governance</h3>
                                <p className="text-gray-600">Producing concrete guidelines and model laws adopted by real institutions to protect against algorithmic harm.</p>
                            </div>
                            
                            <div className="group p-8 border border-gray-100 hover:border-black transition-colors rounded-2xl">
                                <div className="mb-4 inline-block rounded bg-[#C5B393]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#C5B393]">Build</div>
                                <h3 className="text-2xl font-bold mb-4">Climate Justice Praxis Hub</h3>
                                <p className="text-gray-600">Partnering with communities to design and test new energy, housing, and land-use models that build resilience.</p>
                            </div>

                            <div className="group p-8 border border-gray-100 hover:border-black transition-colors rounded-2xl">
                                <div className="mb-4 inline-block rounded bg-[#C5B393]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#C5B393]">Establish</div>
                                <h3 className="text-2xl font-bold mb-4">Critique & Diagnostics Program</h3>
                                <p className="text-gray-600">Mapping how power and harm move through systems like policing, housing, and employment—feeding directly into legal and policy work.</p>
                            </div>

                            <div className="group p-8 border border-gray-100 hover:border-black transition-colors rounded-2xl">
                                <div className="mb-4 inline-block rounded bg-[#C5B393]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#C5B393]">Create</div>
                                <h3 className="text-2xl font-bold mb-4">Glenride Product Studio</h3>
                                <p className="text-gray-600">Multidisciplinary teams turning insights into prototypes, some of which become independent, community-owned ventures.</p>
                            </div>
                        </div>
                    </section>

                    {/* Founder's Letter */}
                    <section id="letter" className="mb-32 w-full max-w-4xl px-4">
                        <div className="bg-gray-50 p-10 md:p-16 rounded-3xl border border-gray-100 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm">
                                <span className="text-sm font-bold uppercase tracking-wider text-[#C5B393]">From the Founder</span>
                            </div>
                            
                            <h2 className="text-3xl font-bold mb-8 text-center">A Letter from D’Vaughn</h2>
                            
                            <div className="prose prose-lg mx-auto text-gray-700 mb-10">
                                <p className="italic text-xl font-medium text-gray-900">
                                    "I founded Glenride because I reached a point where the gap between what I knew and what I was doing became unbearable."
                                </p>
                                <p>
                                    I knew how data gets weaponized. I knew how climate decisions are delayed by people who will never live with the consequences. I knew how many of us are quietly keeping track—of every broken promise, every preventable loss, every missed chance to build something better.
                                </p>
                                <p>
                                    I also knew this: I was surrounded by people who could help design a different path. People with the kind of minds that governments and corporations consult when they want new ways to extract value.
                                </p>
                                <p>
                                    I kept asking myself: <strong>what if those same people had a place to build for the public good instead?</strong>
                                </p>
                                <p>
                                    Glenride is my answer to that question. Not a perfect answer, not a guaranteed one—but a serious one.
                                </p>
                                <p>
                                    If you feel that same dissonance between what you know and what you’re allowed to do inside existing institutions, I’m asking you to help me build a new one.
                                </p>
                            </div>

                            <div className="text-center">
                                <Link href="/contact" className="inline-block border-b-2 border-black pb-1 text-lg font-bold hover:border-[#C5B393] hover:text-[#C5B393] transition-colors">
                                    Talk with Us About Supporting Glenride
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* The Ask / Footer */}
                    <footer className="mb-24 w-full max-w-4xl text-center px-4">
                        <div className="mb-12 rounded-3xl bg-black p-12 text-white shadow-2xl md:p-20 relative overflow-hidden">
                             {/* Glassmorphic Shine */}
                             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none"></div>
                             
                             <div className="relative z-10">
                                <h2 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">What We’re Asking For</h2>
                                <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-300">
                                    We are looking for people and institutions who feel the same unease we do, and who are ready to turn that unease into structure. Whether through founding capital, strategic partnership, or time and expertise.
                                </p>
                                <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
                                    <Link href="/contact" className="w-full rounded-lg bg-[#C5B393] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#b09f80] md:w-auto">
                                        Become a Founding Supporter
                                    </Link>
                                    <a href="/contact" className="w-full rounded-lg border border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10 md:w-auto">
                                        Start a Conversation
                                    </a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
