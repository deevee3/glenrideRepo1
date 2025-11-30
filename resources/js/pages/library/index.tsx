import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, LibraryItem, PaginatedResponse, Pillar, Theme } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, FileText, Headphones, Plus, Search, Video } from 'lucide-react';
import { useState } from 'react';

interface LibraryIndexProps {
    items: PaginatedResponse<LibraryItem>;
    recommendedItems: { data: LibraryItem[] };
    pillars: { data: Pillar[] };
    themes: { data: Theme[] };
    contentTypes: string[];
    filters: {
        pillar?: string;
        theme?: string;
        type?: string;
        search?: string;
    };
    canCreate: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Library', href: '/library/browse' },
];

const contentTypeIcons: Record<string, React.ElementType> = {
    article: FileText,
    video: Video,
    audio: Headphones,
    briefing: FileText,
    guide: BookOpen,
    recording: Video,
};

export default function LibraryIndex({
    items,
    recommendedItems,
    pillars,
    themes,
    contentTypes,
    filters,
    canCreate,
}: LibraryIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/library/browse', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string | undefined) => {
        router.get('/library/browse', { ...filters, [key]: value }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Library" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Library</h1>
                        <p className="text-muted-foreground">
                            Readings, videos, briefings, and guides across Ethics, Critique, and Praxis.
                        </p>
                    </div>
                    {canCreate && (
                        <Button asChild>
                            <Link href="/library/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Content
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Search & Filters */}
                <div className="flex flex-wrap gap-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search library..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-64 pl-9"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        {/* Pillar Filter */}
                        <select
                            className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                            value={filters.pillar || ''}
                            onChange={(e) => handleFilter('pillar', e.target.value || undefined)}
                        >
                            <option value="">All Pillars</option>
                            {pillars?.data?.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>

                        {/* Type Filter */}
                        <select
                            className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                            value={filters.type || ''}
                            onChange={(e) => handleFilter('type', e.target.value || undefined)}
                        >
                            <option value="">All Types</option>
                            {contentTypes?.map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>

                        {(filters.pillar || filters.type || filters.search) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.get('/library/browse')}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                {/* Recommended Section */}
                {recommendedItems?.data?.length > 0 && !filters.search && !filters.pillar && !filters.type && (
                    <section>
                        <h2 className="mb-4 text-lg font-semibold">Recommended for You</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {recommendedItems.data.map((item) => (
                                <LibraryItemCard key={item.id} item={item} compact />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Items */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">
                        {filters.search || filters.pillar || filters.type ? 'Results' : 'All Content'}
                    </h2>
                    {items?.data?.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {items.data.map((item) => (
                                <LibraryItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <Card className="py-12 text-center">
                            <CardContent>
                                <p className="text-muted-foreground">No content found matching your criteria.</p>
                            </CardContent>
                        </Card>
                    )}
                </section>

                {/* Pagination */}
                {items?.meta?.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {items.links.prev && (
                            <Button variant="outline" asChild>
                                <Link href={items.links.prev}>Previous</Link>
                            </Button>
                        )}
                        <span className="text-muted-foreground flex items-center px-4 text-sm">
                            Page {items.meta.current_page} of {items.meta.last_page}
                        </span>
                        {items.links.next && (
                            <Button variant="outline" asChild>
                                <Link href={items.links.next}>Next</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function LibraryItemCard({ item, compact }: { item: LibraryItem; compact?: boolean }) {
    const Icon = contentTypeIcons[item.content_type] || FileText;

    return (
        <Link href={`/library/items/${item.slug}`}>
            <Card className={`hover:border-primary/50 h-full transition-colors ${compact ? 'p-4' : ''}`}>
                {compact ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Icon className="text-muted-foreground h-4 w-4" />
                            <Badge variant="outline" className="text-xs">
                                {item.content_type}
                            </Badge>
                        </div>
                        <p className="line-clamp-2 font-medium">{item.title}</p>
                    </div>
                ) : (
                    <>
                        <CardHeader>
                            <div className="mb-2 flex items-center gap-2">
                                <Icon className="text-muted-foreground h-4 w-4" />
                                <Badge variant="outline" className="text-xs">
                                    {item.content_type}
                                </Badge>
                            </div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <div className="flex gap-1">
                                {item.pillars?.map((p) => (
                                    <Badge key={p.id} variant="secondary" className="text-xs">
                                        {p.name}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {item.description && (
                                <p className="text-muted-foreground line-clamp-2 text-sm">{item.description}</p>
                            )}
                            {item.author && (
                                <p className="text-muted-foreground mt-2 text-xs">By {item.author.name}</p>
                            )}
                        </CardContent>
                    </>
                )}
            </Card>
        </Link>
    );
}
