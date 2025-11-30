import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Activity, Award, Calendar, ExternalLink, Filter, Search, TrendingUp, User, Users } from 'lucide-react';
import { useState } from 'react';

interface ActivityMetadata {
    title?: string;
    slug?: string;
    url?: string;
    channel_id?: string;
    channel_name?: string;
    channel_display_name?: string;
    project_id?: string;
    project_title?: string;
    project_slug?: string;
    content_type?: string;
    reaction_type?: string;
    body_preview?: string;
    [key: string]: unknown;
}

interface ActivityLog {
    id: string;
    action: string;
    action_label: string;
    entity_type: string;
    entity_type_label: string;
    entity_id: string | null;
    metadata: ActivityMetadata | null;
    points_value: number;
    ip_address: string | null;
    created_at: string;
    created_at_human: string;
    actor: {
        id: string;
        name: string;
        email: string;
    } | null;
}

interface TopUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    activity_count: number;
    points_total: number;
}

interface Stats {
    total_today: number;
    total_week: number;
    total_month: number;
    points_awarded_today: number;
    unique_users_today: number;
}

interface PageProps {
    activities: {
        data: ActivityLog[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    stats: Stats;
    actionTypes: string[];
    entityTypes: string[];
    topUsers: TopUser[];
    filters: {
        action?: string;
        entity_type?: string;
        user_id?: string;
        from_date?: string;
        to_date?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Activity Log', href: '/admin/activity' },
];

const actionColors: Record<string, string> = {
    created: 'bg-green-100 text-green-800',
    updated: 'bg-blue-100 text-blue-800',
    deleted: 'bg-red-100 text-red-800',
    published: 'bg-purple-100 text-purple-800',
    viewed: 'bg-gray-100 text-gray-800',
    registered: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-emerald-100 text-emerald-800',
    reacted: 'bg-pink-100 text-pink-800',
    applied: 'bg-indigo-100 text-indigo-800',
};

function getActionColor(action: string): string {
    const key = Object.keys(actionColors).find((k) => action.includes(k));
    return key ? actionColors[key] : 'bg-gray-100 text-gray-800';
}

export default function ActivityIndex({ activities, stats, actionTypes, entityTypes, topUsers, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);

    const applyFilters = (newFilters: Partial<typeof filters>) => {
        router.get(
            '/admin/activity',
            { ...filters, ...newFilters },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearFilters = () => {
        router.get('/admin/activity', {}, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Log" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Platform Activity</h1>
                        <p className="text-muted-foreground">
                            Monitor all events and interactions happening on the platform.
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_today}</div>
                            <p className="text-xs text-muted-foreground">events logged</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_week}</div>
                            <p className="text-xs text-muted-foreground">events this week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Month</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_month}</div>
                            <p className="text-xs text-muted-foreground">events this month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Points Today</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.points_awarded_today}</div>
                            <p className="text-xs text-muted-foreground">points awarded</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.unique_users_today}</div>
                            <p className="text-xs text-muted-foreground">users today</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Main Activity Feed */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Search and Filters */}
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-2">
                                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search activities, users..."
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    className="pl-9"
                                                />
                                            </div>
                                            <Button type="submit" variant="secondary">
                                                Search
                                            </Button>
                                        </form>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowFilters(!showFilters)}
                                        >
                                            <Filter className="mr-2 h-4 w-4" />
                                            Filters
                                        </Button>
                                    </div>

                                    {showFilters && (
                                        <div className="flex flex-wrap gap-2 border-t pt-4">
                                            <Select
                                                value={filters.action || ''}
                                                onValueChange={(val) => applyFilters({ action: val || undefined })}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Action type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All Actions</SelectItem>
                                                    {actionTypes.map((action) => (
                                                        <SelectItem key={action} value={action}>
                                                            {action.replace(/_/g, ' ')}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={filters.entity_type || ''}
                                                onValueChange={(val) => applyFilters({ entity_type: val || undefined })}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Entity type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All Entities</SelectItem>
                                                    {entityTypes.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type.replace(/_/g, ' ')}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Input
                                                type="date"
                                                placeholder="From date"
                                                value={filters.from_date || ''}
                                                onChange={(e) => applyFilters({ from_date: e.target.value || undefined })}
                                                className="w-[160px]"
                                            />

                                            <Input
                                                type="date"
                                                placeholder="To date"
                                                value={filters.to_date || ''}
                                                onChange={(e) => applyFilters({ to_date: e.target.value || undefined })}
                                                className="w-[160px]"
                                            />

                                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                                Clear filters
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Showing {activities.data.length} of {activities.total} events
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activities.data.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {activity.actor ? (
                                                        <span className="font-medium">{activity.actor.name}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">System</span>
                                                    )}
                                                    <Badge className={getActionColor(activity.action)} variant="secondary">
                                                        {activity.action_label}
                                                    </Badge>
                                                    <span className="text-muted-foreground">
                                                        {activity.entity_type_label}
                                                    </span>
                                                    {activity.points_value > 0 && (
                                                        <Badge variant="outline" className="ml-auto">
                                                            +{activity.points_value} pts
                                                        </Badge>
                                                    )}
                                                </div>
                                                {activity.metadata && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        {activity.metadata.title && (
                                                            <span className="text-muted-foreground">
                                                                "{String(activity.metadata.title)}"
                                                            </span>
                                                        )}
                                                        {(activity.metadata.channel_display_name || activity.metadata.channel_name) && (
                                                            <span className="text-muted-foreground">
                                                                #{String(activity.metadata.channel_display_name || activity.metadata.channel_name)}
                                                            </span>
                                                        )}
                                                        {activity.metadata.url && (
                                                            <Link
                                                                href={String(activity.metadata.url)}
                                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                <ExternalLink className="h-3 w-3" />
                                                                View
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>{activity.created_at_human}</span>
                                                    {activity.actor && (
                                                        <span className="text-muted-foreground/70">{activity.actor.email}</span>
                                                    )}
                                                    {activity.ip_address && (
                                                        <span>IP: {activity.ip_address}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {activities.data.length === 0 && (
                                        <p className="py-8 text-center text-muted-foreground">
                                            No activity found matching your filters.
                                        </p>
                                    )}
                                </div>

                                {/* Pagination */}
                                {activities.last_page > 1 && (
                                    <div className="mt-6 flex items-center justify-center gap-2">
                                        {activities.links.map((link, idx) => (
                                            <Button
                                                key={idx}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Top Users */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Top Contributors</CardTitle>
                                <CardDescription>Most active users this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topUsers.map((user, idx) => (
                                        <div key={user.id} className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.activity_count} activities · {user.points_total || 0} pts
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {topUsers.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No activity yet</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Events</span>
                                    <span className="font-medium">{activities.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Action Types</span>
                                    <span className="font-medium">{actionTypes.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Entity Types</span>
                                    <span className="font-medium">{entityTypes.length}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
