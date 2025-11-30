import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Event, LibraryItem, Notification, ProgramCohort, Project } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Bell, BookOpen, Calendar, FolderKanban } from 'lucide-react';

interface DashboardProps {
    activeCohorts: { data: ProgramCohort[] };
    activeProjects: { data: Project[] };
    upcomingEvents: { data: Event[] };
    recentLibraryItems: { data: LibraryItem[] };
    unreadNotifications: { data: Notification[] };
    openPrograms: Array<{
        id: string;
        title: string;
        slug: string;
        short_description: string;
        program_type: string;
        pillars: string[];
        application_close_at?: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    activeCohorts,
    activeProjects,
    upcomingEvents,
    recentLibraryItems,
    unreadNotifications,
    openPrograms,
}: DashboardProps) {
    const { auth } = usePage<{ auth: { user: { first_name: string } } }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Welcome Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome back, {auth.user.first_name}.
                    </h1>
                    <p className="text-muted-foreground">
                        Here's what's moving across Ethics, Critique, and Praxis.
                    </p>
                </div>

                {/* Notifications Alert */}
                {unreadNotifications?.data?.length > 0 && (
                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-primary" />
                                <span className="text-sm font-medium">
                                    You have {unreadNotifications.data.length} unread notification
                                    {unreadNotifications.data.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/notifications">View all</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Main Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Active Involvements */}
                    <Card className="md:col-span-2 lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderKanban className="h-5 w-5" />
                                Your Active Involvements
                            </CardTitle>
                            <CardDescription>Where you're currently building.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Cohorts */}
                            {activeCohorts?.data?.length > 0 ? (
                                activeCohorts.data.map((cohort) => (
                                    <div
                                        key={cohort.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{cohort.program?.title}</span>
                                                <Badge variant="secondary">{cohort.name}</Badge>
                                            </div>
                                            {cohort.next_session && (
                                                <p className="text-muted-foreground text-sm">
                                                    Next: {cohort.next_session.title} ·{' '}
                                                    {new Date(cohort.next_session.starts_at).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/programs/${cohort.program?.slug}`}>
                                                View <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-sm">
                                    You're not enrolled in any programs yet.
                                </p>
                            )}

                            {/* Projects */}
                            {activeProjects?.data?.length > 0 &&
                                activeProjects.data.map((project) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{project.title}</span>
                                                <Badge variant="outline">{project.status}</Badge>
                                            </div>
                                            <div className="flex gap-1">
                                                {project.pillars?.map((p) => (
                                                    <Badge key={p.id} variant="secondary" className="text-xs">
                                                        {p.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/projects/${project.slug}`}>
                                                Workspace <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                ))}

                            {(!activeCohorts?.data?.length && !activeProjects?.data?.length) && (
                                <div className="py-8 text-center">
                                    <p className="text-muted-foreground mb-4">Start your journey with Glenride</p>
                                    <Button asChild>
                                        <Link href="/programs">Browse Programs</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Upcoming Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingEvents?.data?.length > 0 ? (
                                upcomingEvents.data.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={`/events/${event.id}`}
                                        className="block rounded-lg border p-3 transition-colors hover:bg-accent"
                                    >
                                        <p className="font-medium">{event.title}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {new Date(event.starts_at).toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-sm">No upcoming events.</p>
                            )}
                            <Button variant="ghost" className="w-full" asChild>
                                <Link href="/events">View all events</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent from Library */}
                    <Card className="md:col-span-2 lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Updates from Glenride
                            </CardTitle>
                            <CardDescription>Movement updates and new content.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {recentLibraryItems?.data?.length > 0 ? (
                                    recentLibraryItems.data.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/library/items/${item.slug}`}
                                            className="block rounded-lg border p-4 transition-colors hover:bg-accent"
                                        >
                                            <Badge variant="outline" className="mb-2">
                                                {item.content_type}
                                            </Badge>
                                            <p className="line-clamp-2 font-medium">{item.title}</p>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground col-span-3 text-sm">
                                        No new content yet.
                                    </p>
                                )}
                            </div>
                            <Button variant="ghost" className="mt-4 w-full" asChild>
                                <Link href="/library/browse">Go to Library</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Discovery */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Where You Might Plug In</CardTitle>
                            <CardDescription>Open opportunities.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {openPrograms?.length > 0 ? (
                                openPrograms.map((program) => (
                                    <Link
                                        key={program.id}
                                        href={`/programs/${program.slug}`}
                                        className="block rounded-lg border p-3 transition-colors hover:bg-accent"
                                    >
                                        <p className="font-medium">{program.title}</p>
                                        <p className="text-muted-foreground line-clamp-2 text-sm">
                                            {program.short_description}
                                        </p>
                                        <div className="mt-2 flex gap-1">
                                            {program.pillars?.map((p) => (
                                                <Badge key={p} variant="secondary" className="text-xs">
                                                    {p}
                                                </Badge>
                                            ))}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-sm">
                                    No open programs at this time.
                                </p>
                            )}
                            <Button variant="ghost" className="w-full" asChild>
                                <Link href="/programs">Browse all programs</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
