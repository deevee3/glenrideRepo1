import { login } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Hammer, Lightbulb, Users, Building, UserCheck } from 'lucide-react';

export default function Future() {
    return (
        <>
            <Head title="A Campaign for Glenride's Future" />
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

                    {/* Section 1 – Campaign Intro */}
                    <section className="mb-24 mt-16 w-full max-w-4xl px-4 text-center">
                        <span className="mb-6 block text-xs font-bold uppercase tracking-widest text-[#C5B393]">The Founding Campaign</span>
                        <h1 className="mb-8 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                            A Campaign for Glenride's Future
                        </h1>
                        <div className="mx-auto mb-12 h-1 w-24 bg-black"></div>
                        
                        <div className="prose prose-xl mx-auto text-gray-600">
                            <p className="mb-6 text-xl">
                                Glenride is still young. The choices we make now will decide what it can be ten, twenty, fifty years from today.
                            </p>
                            <p className="mb-6 text-lg">
                                This campaign is my commitment—our commitment—to build Glenride into a lasting institution: a global think tank where serious thinkers don't just describe what's wrong, they help design what comes next.
                            </p>
                            <p className="text-lg font-medium text-gray-900">
                                This page lays out:
                            </p>
                            <ul className="mt-4 list-none space-y-2 text-left text-lg">
                                <li className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-[#C5B393]"></span>
                                    what we're building,
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-[#C5B393]"></span>
                                    why this moment can't be ignored, and
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-[#C5B393]"></span>
                                    how you can help shape Glenride's future.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 – The Future We Refuse to Inherit */}
                    <section className="mb-24 w-full max-w-7xl px-4">
                        <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-20 text-white md:px-16">
                            <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 transform rounded-full bg-red-500 opacity-10 blur-[100px]"></div>
                            
                            <div className="relative z-10 mx-auto max-w-4xl">
                                <h2 className="mb-8 text-3xl font-bold md:text-5xl">What Keeps Us Up at Night</h2>
                                <div className="mb-12 h-1 w-24 bg-[#C5B393]"></div>
                                
                                <p className="mb-8 text-xl text-gray-300">
                                    We are living through overlapping emergencies:
                                </p>
                                
                                <div className="mb-12 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <span className="mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-[#C5B393]"></span>
                                        <p className="text-lg text-gray-300">a climate that is becoming less predictable and more violent,</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <span className="mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-[#C5B393]"></span>
                                        <p className="text-lg text-gray-300">democracies that feel more fragile every year,</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <span className="mt-2 h-3 w-3 flex-shrink-0 rounded-full bg-[#C5B393]"></span>
                                        <p className="text-lg text-gray-300">economies that work well for a few and exhaust everyone else.</p>
                                    </div>
                                </div>
                                
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12">
                                    <p className="mb-6 text-xl text-gray-300">
                                        What keeps us awake is not that we don't understand these crises.
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        It's that we <span className="text-[#C5B393]">do</span> understand them—and still watch our institutions move too slowly, too timidly, or not at all.
                                    </p>
                                </div>
                                
                                <p className="mt-12 text-xl text-gray-300">
                                    Glenride was created for the people who can't make peace with that gap between what we know and what we are doing.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 – Glenride's Role */}
                    <section className="mb-24 w-full max-w-6xl px-4">
                        <div className="text-center mb-16">
                            <h2 className="mb-6 text-3xl font-bold md:text-5xl">What Glenride Exists to Do</h2>
                            <div className="mx-auto mb-8 h-1 w-24 bg-black"></div>
                            <p className="mx-auto max-w-3xl text-xl text-gray-600">
                                Glenride is a think tank and build space where:
                            </p>
                        </div>
                        
                        <div className="grid gap-8 md:grid-cols-3 mb-16">
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-colors hover:bg-white hover:shadow-md">
                                <div className="mb-6 rounded-full bg-black p-4 text-white inline-block">
                                    <Lightbulb className="h-6 w-6" />
                                </div>
                                <h3 className="mb-4 text-2xl font-bold">Ethics</h3>
                                <p className="text-gray-600">forces us to ask what justice requires in every decision,</p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-colors hover:bg-white hover:shadow-md">
                                <div className="mb-6 rounded-full bg-black p-4 text-white inline-block">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <h3 className="mb-4 text-2xl font-bold">Critique</h3>
                                <p className="text-gray-600">maps how power and harm really move,</p>
                            </div>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-colors hover:bg-white hover:shadow-md">
                                <div className="mb-6 rounded-full bg-black p-4 text-white inline-block">
                                    <Hammer className="h-6 w-6" />
                                </div>
                                <h3 className="mb-4 text-2xl font-bold">Praxis</h3>
                                <p className="text-gray-600">turns all of that into tools, laws, and institutions.</p>
                            </div>
                        </div>
                        
                        <div className="rounded-3xl bg-gray-50 p-8 md:p-12">
                            <h3 className="mb-8 text-2xl font-bold">In practice, that means:</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-[#C5B393]" />
                                    <p className="text-lg text-gray-700">research that becomes model legislation and governance frameworks,</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-[#C5B393]" />
                                    <p className="text-lg text-gray-700">analysis that becomes products, platforms, and cooperative ventures,</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-[#C5B393]" />
                                    <p className="text-lg text-gray-700">critique that becomes strategy for movements and communities.</p>
                                </div>
                            </div>
                            <div className="mt-10 rounded-2xl bg-black p-8 text-white">
                                <p className="text-xl font-bold">
                                    Glenride unites serious thinkers to turn hard truths into tools and laws that change how power works.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 – The Campaign: How We Intend to Grow */}
                    <section className="mb-24 w-full max-w-6xl px-4">
                        <div className="text-center mb-16">
                            <h2 className="mb-6 text-3xl font-bold md:text-5xl">What This Campaign Will Build</h2>
                            <div className="mx-auto mb-8 h-1 w-24 bg-[#C5B393]"></div>
                            <p className="mx-auto max-w-3xl text-xl text-gray-600">
                                This campaign is about giving Glenride enough stability and courage to do its work properly.
                            </p>
                        </div>
                        
                        <p className="mb-12 text-lg text-gray-700 text-center">
                            Over the next phase, support for Glenride's future will:
                        </p>
                        
                        <div className="space-y-8">
                            {/* Phase 1 */}
                            <div className="rounded-2xl border border-gray-100 p-8 hover:border-black transition-colors">
                                <div className="flex items-start gap-6">
                                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black text-xl font-bold text-white">1</span>
                                    <div>
                                        <h3 className="mb-4 text-2xl font-bold">Strengthen the Think Tank Core</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#C5B393]"></span>
                                                bring together a founding circle of scholars, technologists, and organizers,
                                            </li>
                                            <li className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#C5B393]"></span>
                                                create the time and support they need to go deep, not just react.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Phase 2 */}
                            <div className="rounded-2xl border border-gray-100 p-8 hover:border-black transition-colors">
                                <div className="flex items-start gap-6">
                                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black text-xl font-bold text-white">2</span>
                                    <div>
                                        <h3 className="mb-4 text-2xl font-bold">Launch and Sustain Key Labs</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#C5B393]"></span>
                                                an Ethics Lab focused on AI, climate, and public institutions,
                                            </li>
                                            <li className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#C5B393]"></span>
                                                a Critique & Diagnostics program that maps how power operates in housing, policing, work, and digital life,
                                            </li>
                                            <li className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#C5B393]"></span>
                                                a Praxis Studio that prototypes policies, tools, and ventures with real communities.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Phase 3 */}
                            <div className="rounded-2xl border border-gray-100 p-8 hover:border-black transition-colors">
                                <div className="flex items-start gap-6">
                                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black text-xl font-bold text-white">3</span>
                                    <div>
                                        <h3 className="mb-4 text-2xl font-bold">Seed Glenride‑Born Initiatives</h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#C5B393]"></span>
                                                early products, legal frameworks, and pilot projects that can one day spin out into independent organizations or community‑owned entities.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <p className="mt-12 text-center text-xl font-medium text-gray-900">
                            This isn't about one‑off programs. It's about building the spine that will support Glenride's work for years to come.
                        </p>
                    </section>

                    {/* Section 5 – Why Now Is the Window */}
                    <section className="mb-24 w-full max-w-7xl px-4">
                        <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-20 text-white md:px-16">
                            <div className="absolute left-0 bottom-0 h-[500px] w-[500px] translate-y-1/2 -translate-x-1/2 transform rounded-full bg-[#C5B393] opacity-10 blur-[100px]"></div>
                            
                            <div className="relative z-10 mx-auto max-w-4xl">
                                <h2 className="mb-8 text-3xl font-bold md:text-5xl">Why This Moment Matters</h2>
                                <div className="mb-12 h-1 w-24 bg-[#C5B393]"></div>
                                
                                <p className="mb-12 text-xl text-gray-300">
                                    Right now, three things are true at the same time:
                                </p>
                                
                                <div className="grid gap-8 md:grid-cols-3 mb-12">
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                                        <h3 className="mb-4 text-xl font-bold text-[#C5B393]">The crises are accelerating.</h3>
                                        <p className="text-gray-400">Each year we wait, the work gets harder.</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                                        <h3 className="mb-4 text-xl font-bold text-[#C5B393]">The talent is here.</h3>
                                        <p className="text-gray-400">Brilliant people are ready to work differently, if there is somewhere serious to go.</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                                        <h3 className="mb-4 text-xl font-bold text-[#C5B393]">The old models are cracking.</h3>
                                        <p className="text-gray-400">Traditional funding and institutions are struggling to keep up with the pace and scale of change.</p>
                                    </div>
                                </div>
                                
                                <p className="mb-8 text-xl text-gray-300">
                                    Glenride sits in the middle of those facts.
                                </p>
                                
                                <div className="space-y-6 text-lg text-gray-300">
                                    <p>
                                        If we build this institution well now, it can hold work that will outlast all of us.
                                    </p>
                                    <p>
                                        If we let the moment pass, we risk another decade of scattered efforts that never add up to structural change.
                                    </p>
                                </div>
                                
                                <p className="mt-12 text-2xl font-bold text-white">
                                    This campaign is our decision not to let that happen.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 6 – How You Can Shape Glenride's Future */}
                    <section className="mb-24 w-full max-w-6xl px-4">
                        <div className="text-center mb-16">
                            <h2 className="mb-6 text-3xl font-bold md:text-5xl">Ways to Support the Campaign</h2>
                            <div className="mx-auto mb-8 h-1 w-24 bg-black"></div>
                        </div>
                        
                        <div className="grid gap-8 md:grid-cols-3 mb-16">
                            <div className="group rounded-2xl border border-gray-100 p-8 hover:border-black hover:shadow-lg transition-all">
                                <div className="mb-6 rounded-full bg-[#C5B393]/10 p-4 inline-block">
                                    <Users className="h-8 w-8 text-[#C5B393]" />
                                </div>
                                <h3 className="mb-4 text-2xl font-bold">Founding Supporter</h3>
                                <p className="text-gray-600">
                                    Provide multi‑year financial support that anchors Glenride's core team and labs.
                                </p>
                            </div>
                            <div className="group rounded-2xl border border-gray-100 p-8 hover:border-black hover:shadow-lg transition-all">
                                <div className="mb-6 rounded-full bg-[#C5B393]/10 p-4 inline-block">
                                    <Building className="h-8 w-8 text-[#C5B393]" />
                                </div>
                                <h3 className="mb-4 text-2xl font-bold">Strategic Partner</h3>
                                <p className="text-gray-600">
                                    Bring Glenride's research and tools into your city, institution, or movement—and help us test ideas in the real world.
                                </p>
                            </div>
                            <div className="group rounded-2xl border border-gray-100 p-8 hover:border-black hover:shadow-lg transition-all">
                                <div className="mb-6 rounded-full bg-[#C5B393]/10 p-4 inline-block">
                                    <UserCheck className="h-8 w-8 text-[#C5B393]" />
                                </div>
                                <h3 className="mb-4 text-2xl font-bold">Scholar, Builder, or Organizer in Residence</h3>
                                <p className="text-gray-600">
                                    Contribute your expertise directly through fellowships, residencies, and collaborative projects.
                                </p>
                            </div>
                        </div>
                        
                        <div className="rounded-3xl bg-gray-50 p-8 md:p-12 text-center">
                            <p className="mb-8 text-xl text-gray-700">
                                However you show up, you're not just "helping a project."<br />
                                <span className="font-bold text-gray-900">You are helping decide what kind of institution Glenride becomes.</span>
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-black px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-gray-800">
                                Talk with Glenride About Supporting the Future <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </section>

                    {/* Section 7 – D'Vaughn's Promise */}
                    <section id="letter" className="mb-32 w-full max-w-4xl px-4">
                        <div className="bg-gray-50 p-10 md:p-16 rounded-3xl border border-gray-100 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm">
                                <span className="text-sm font-bold uppercase tracking-wider text-[#C5B393]">A Personal Commitment</span>
                            </div>
                            
                            <h2 className="text-3xl font-bold mb-8 text-center mt-4">D'Vaughn's Promise</h2>
                            
                            <div className="prose prose-lg mx-auto text-gray-700 mb-10">
                                <p className="mb-8">
                                    Glenride is not an abstract idea for me. It is the answer to a question I've been carrying for years:
                                </p>
                                
                                <blockquote className="border-l-4 border-[#C5B393] pl-6 my-8 italic text-xl font-medium text-gray-900">
                                    "Knowing what I know about how our systems work, what is my responsibility now?"
                                </blockquote>
                                
                                <p className="mb-8">
                                    My promise is this: every contribution to this campaign—money, time, trust—will be treated as an obligation to be braver, more honest, and more accountable in the work we do.
                                </p>
                                
                                <p className="text-lg">
                                    If Glenride succeeds, it won't be because one person had a vision. It will be because enough of us decided to build a serious home for the kind of work we can no longer postpone.
                                </p>
                            </div>

                            <div className="text-center">
                                <Link href="/#letter" className="inline-block border-b-2 border-black pb-1 text-lg font-bold hover:border-[#C5B393] hover:text-[#C5B393] transition-colors">
                                    Read D'Vaughn's Full Letter
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <footer className="mb-24 w-full max-w-4xl text-center px-4">
                        <div className="mb-12 rounded-3xl bg-black p-12 text-white shadow-2xl md:p-20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none"></div>
                             
                            <div className="relative z-10">
                                <h2 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">Shape Glenride's Future</h2>
                                <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-300">
                                    We are looking for people and institutions who feel the same unease we do, and who are ready to turn that unease into structure.
                                </p>
                                <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
                                    <Link href="/contact" className="w-full rounded-lg bg-[#C5B393] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#b09f80] md:w-auto">
                                        Become a Founding Supporter
                                    </Link>
                                    <Link href="/contact" className="w-full rounded-lg border border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10 md:w-auto">
                                        Start a Conversation
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
