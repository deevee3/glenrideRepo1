import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-[#C5B393] selection:text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-8 lg:px-12 border-b border-gray-100">
                <Link href="/" className="w-12 h-12">
                    <img src="/glenride-logo.png" alt="Glenride" className="w-full h-full object-contain" />
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/about" className="text-xs font-bold uppercase tracking-wider hover:underline transition-colors">
                        About
                    </Link>
                    <Link href="/pillars" className="text-xs font-bold uppercase tracking-wider hover:underline transition-colors">
                        Pillars
                    </Link>
                    <Link href="/manifesto" className="text-xs font-bold uppercase tracking-wider hover:underline transition-colors">
                        Manifesto
                    </Link>
                    <Link href="/library" className="text-xs font-bold uppercase tracking-wider hover:underline transition-colors">
                        Library
                    </Link>
                    <Link href="/join" className="text-xs font-bold uppercase tracking-wider hover:underline transition-colors">
                        Join
                    </Link>
                    <Link href="/contact" className="text-xs font-bold uppercase tracking-wider hover:underline transition-colors">
                        Contact
                    </Link>
                </nav>

                <Link href="/login" className="text-xs font-bold uppercase tracking-wider hover:underline transition-colors">
                    Log in
                </Link>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 px-8 py-16 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-4">About</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link href="/about" className="hover:text-black transition-colors">About Glenride</Link></li>
                                <li><Link href="/manifesto" className="hover:text-black transition-colors">Manifesto</Link></li>
                                <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Programs</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link href="/pillars" className="hover:text-black transition-colors">Pillars & Programs</Link></li>
                                <li><Link href="/library" className="hover:text-black transition-colors">Library</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Get Involved</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link href="/join" className="hover:text-black transition-colors">Join Glenride</Link></li>
                                <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-4">Connect</h3>
                            <p className="text-sm text-gray-600">
                                Building the future together.
                            </p>
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-500">
                        © {new Date().getFullYear()} Glenride. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
