import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import { LibraryItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { BookOpen, Calendar, FileText, Headphones, Video } from 'lucide-react';
import { FormEventHandler } from 'react';

declare let route: any;

interface LibraryProps {
    items: {
        data: LibraryItem[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    };
    filters: {
        type?: string;
        pillar?: string;
    };
}

const contentTypeIcons: Record<string, React.ElementType> = {
    article: FileText,
    video: Video,
    audio: Headphones,
    briefing: FileText,
    guide: BookOpen,
    recording: Video,
};

export default function Library({ items, filters }: LibraryProps) {
    const activeFilter = filters.type || 'all';
    const activePillar = filters.pillar || 'all';

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        email: '',
    });

    const handleSubscribe: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('subscribe'), {
            onSuccess: () => reset(),
        });
    };

    const handleFilter = (type: string, value: string) => {
        router.get(
            '/library',
            {
                ...filters,
                [type]: value === 'all' ? undefined : value,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['items', 'filters'],
            }
        );
    };

    return (
        <PublicLayout>
            <Head title="Library" />

            {/* Hero */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="mx-auto max-w-6xl">
                    <h1 className="mb-8 text-5xl font-bold leading-tight md:text-7xl">
                        A library for rethinking the future.
                    </h1>
                    <p className="max-w-4xl text-xl text-gray-600 md:text-2xl">
                        Dive into essays, talks, conversations, and prototypes that explore ethics, critique power, and
                        document experiments in praxis.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="border-b border-gray-200 px-8 pb-12 lg:px-12">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8">
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">Content Type</h3>
                        <div className="flex flex-wrap gap-4">
                            {(['all', 'read', 'watch', 'listen'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => handleFilter('type', filter)}
                                    className={`px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                                        activeFilter === filter
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {filter === 'all' ? 'All' : filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">Filter by Pillar</h3>
                        <div className="flex flex-wrap gap-4">
                            {(['all', 'ethics', 'critique', 'praxis'] as const).map((pillar) => (
                                <button
                                    key={pillar}
                                    onClick={() => handleFilter('pillar', pillar)}
                                    className={`px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                                        activePillar === pillar
                                            ? 'bg-[#C5B393] text-white'
                                            : 'border border-gray-300 text-gray-700 hover:border-black'
                                    }`}
                                >
                                    {pillar === 'all' ? 'All Pillars' : pillar}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <section className="px-8 py-12 lg:px-12">
                <div className="mx-auto max-w-6xl">
                    {items.data.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {items.data.map((item) => {
                                const Icon = contentTypeIcons[item.content_type] || FileText;
                                return (
                                    <Link key={item.id} href={`/library/${item.slug}`} className="group h-full">
                                        <Card className="h-full border-gray-200 bg-transparent shadow-none transition-colors hover:border-black hover:bg-gray-50">
                                            <CardHeader>
                                                <div className="mb-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="text-muted-foreground h-4 w-4" />
                                                        <Badge variant="outline" className="uppercase">
                                                            {item.content_type}
                                                        </Badge>
                                                    </div>
                                                    {item.published_at && (
                                                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(item.published_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <CardTitle className="group-hover:text-primary text-xl leading-tight transition-colors">
                                                    {item.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground line-clamp-3 text-sm">
                                                    {item.description}
                                                </p>
                                            </CardContent>
                                            <CardFooter className="gap-2 pt-0">
                                                {item.pillars?.map((p) => (
                                                    <Badge
                                                        key={p.id}
                                                        variant="secondary"
                                                        className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    >
                                                        {p.name}
                                                    </Badge>
                                                ))}
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-lg text-gray-600">No content found matching your filters.</p>
                            <button
                                onClick={() => router.get('/library')}
                                className="mt-4 text-sm font-bold uppercase tracking-wider underline hover:text-black"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination could go here if needed */}
                </div>
            </section>

            {/* Newsletter / Bottom Section */}
            <section className="px-8 py-20 lg:px-12 lg:py-32">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">Coming online as we build.</h2>
                    <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600">
                        As Glenride launches, our library will grow with new essays, video explainers, and recorded
                        conversations. Sign up below to be notified when we publish.
                    </p>

                    <div className="mx-auto max-w-md">
                        {wasSuccessful && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded">
                                Subscribed successfully!
                            </div>
                        )}
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <div className="text-red-500 text-xs mt-1 text-left">{errors.email}</div>}
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="whitespace-nowrap bg-black px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                            >
                                {processing ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                        <p className="mt-4 text-xs text-gray-500">
                            We'll only send you updates when new content is published.
                        </p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
