import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedResponse, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';

interface PeopleProps {
    members: PaginatedResponse<User>;
    filters: {
        pillar?: string;
        role?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Community', href: '/community' },
    { title: 'People', href: '/community/people' },
];

export default function People({ members, filters }: PeopleProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/community/people', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="People" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Back Link */}
                <Link href="/community" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Community
                </Link>

                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">People Directory</h1>
                        <p className="text-muted-foreground">
                            {members.meta.total} members in the Glenride network
                        </p>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search members..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>
                </div>

                {/* Members Grid */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {members.data.map((member) => (
                        <Link key={member.id} href={`/members/${member.id}`}>
                            <Card className="hover:border-primary/50 h-full transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-muted mb-3 flex h-16 w-16 items-center justify-center rounded-full text-lg font-medium">
                                            {member.first_name?.[0]}
                                            {member.last_name?.[0]}
                                        </div>
                                        <p className="font-medium">{member.name}</p>
                                        {member.location && (
                                            <p className="text-muted-foreground text-sm">{member.location}</p>
                                        )}
                                        <div className="mt-2 flex flex-wrap justify-center gap-1">
                                            {member.pillars?.slice(0, 3).map((p) => (
                                                <Badge key={p.id} variant="secondary" className="text-xs">
                                                    {p.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {members.data.length === 0 && (
                    <Card className="py-12 text-center">
                        <CardContent>
                            <p className="text-muted-foreground">No members found matching your search.</p>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {members.meta.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {members.links.prev && (
                            <Button variant="outline" asChild>
                                <Link href={members.links.prev}>Previous</Link>
                            </Button>
                        )}
                        <span className="text-muted-foreground flex items-center px-4 text-sm">
                            Page {members.meta.current_page} of {members.meta.last_page}
                        </span>
                        {members.links.next && (
                            <Button variant="outline" asChild>
                                <Link href={members.links.next}>Next</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
