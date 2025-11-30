import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Program } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Plus } from 'lucide-react';

interface UserCohort {
    id: string;
    name: string;
    status: string;
    program: {
        id: string;
        title: string;
        slug: string;
        pillars: string[];
    };
    next_session?: {
        title: string;
        starts_at: string;
    };
}

interface ProgramsIndexProps {
    userCohorts: UserCohort[];
    openPrograms: { data: Program[] };
    upcomingPrograms: { data: Program[] };
    activePrograms: { data: Program[] };
    canCreate: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Programs', href: '/programs' },
];

export default function ProgramsIndex({
    userCohorts,
    openPrograms,
    upcomingPrograms,
    activePrograms,
    canCreate,
}: ProgramsIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Programs</h1>
                        <p className="text-muted-foreground">
                            Explore fellowships, labs, schools, and incubators across Ethics, Critique, and Praxis.
                        </p>
                    </div>
                    {canCreate && (
                        <Button asChild>
                            <Link href="/programs/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Program
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Your Programs */}
                {userCohorts?.length > 0 && (
                    <section>
                        <h2 className="mb-4 text-lg font-semibold">You're Currently Involved In</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {userCohorts.map((cohort) => (
                                <Card key={cohort.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle>{cohort.program.title}</CardTitle>
                                                <CardDescription>{cohort.name}</CardDescription>
                                            </div>
                                            <Badge>{cohort.status}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-3 flex gap-1">
                                            {cohort.program.pillars?.map((p) => (
                                                <Badge key={p} variant="secondary" className="text-xs">
                                                    {p}
                                                </Badge>
                                            ))}
                                        </div>
                                        {cohort.next_session && (
                                            <p className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4" />
                                                Next: {cohort.next_session.title} ·{' '}
                                                {new Date(cohort.next_session.starts_at).toLocaleDateString()}
                                            </p>
                                        )}
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/programs/${cohort.program.slug}`}>
                                                Enter workspace <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Open for Applications */}
                {openPrograms?.data?.length > 0 && (
                    <section>
                        <h2 className="mb-4 text-lg font-semibold">Open for Applications</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {openPrograms.data.map((program) => (
                                <ProgramCard key={program.id} program={program} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Upcoming Programs */}
                {upcomingPrograms?.data?.length > 0 && (
                    <section>
                        <h2 className="mb-4 text-lg font-semibold">Coming Soon</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingPrograms.data.map((program) => (
                                <ProgramCard key={program.id} program={program} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Active Programs */}
                {activePrograms?.data?.length > 0 && (
                    <section>
                        <h2 className="mb-4 text-lg font-semibold">Currently Running</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {activePrograms.data.map((program) => (
                                <ProgramCard key={program.id} program={program} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {!openPrograms?.data?.length &&
                    !upcomingPrograms?.data?.length &&
                    !activePrograms?.data?.length && (
                        <Card className="py-12 text-center">
                            <CardContent>
                                <p className="text-muted-foreground">No programs available at this time.</p>
                            </CardContent>
                        </Card>
                    )}
            </div>
        </AppLayout>
    );
}

function ProgramCard({ program }: { program: Program }) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <Badge variant="outline" className="shrink-0">
                        {program.program_type}
                    </Badge>
                </div>
                <div className="flex gap-1">
                    {program.pillars?.map((p) => (
                        <Badge key={p.id} variant="secondary" className="text-xs">
                            {p.name}
                        </Badge>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
                <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
                    {program.short_description}
                </p>
                {program.application_close_at && (
                    <p className="text-muted-foreground mb-3 text-sm">
                        Applications due: {new Date(program.application_close_at).toLocaleDateString()}
                    </p>
                )}
                <Button variant="outline" className="w-full" asChild>
                    <Link href={`/programs/${program.slug}`}>
                        View Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
