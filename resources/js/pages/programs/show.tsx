import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Program } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Clock, Users } from 'lucide-react';

interface ProgramShowProps {
    program: { data: Program };
    existingApplication?: {
        id: string;
        status: string;
        created_at: string;
    };
    isEnrolled: boolean;
}

export default function ProgramShow({ program: { data: program }, existingApplication, isEnrolled }: ProgramShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Programs', href: '/programs' },
        { title: program.title, href: `/programs/${program.slug}` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        program_id: program.id,
        role_self_identified: '',
        background: '',
        motivation: '',
        how_they_want_to_collaborate: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/programs/${program.id}/apply`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={program.title} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Back Link */}
                <Link href="/programs" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Programs
                </Link>

                {/* Header */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight">{program.title}</h1>
                                <Badge variant="outline">{program.program_type}</Badge>
                            </div>
                            <div className="flex gap-2">
                                {program.pillars?.map((p) => (
                                    <Badge key={p.id} variant="secondary">
                                        {p.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isEnrolled && (
                                <Badge className="bg-green-600">
                                    <CheckCircle className="mr-1 h-3 w-3" /> Enrolled
                                </Badge>
                            )}
                            {existingApplication && !isEnrolled && (
                                <Badge variant="outline">
                                    Application: {existingApplication.status}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="prose dark:prose-invert max-w-none">
                                <p>{program.short_description}</p>
                                {program.long_description && (
                                    <div dangerouslySetInnerHTML={{ __html: program.long_description }} />
                                )}
                            </CardContent>
                        </Card>

                        {/* Cohorts */}
                        {program.cohorts && program.cohorts.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Active Cohorts</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {program.cohorts.map((cohort) => (
                                        <div key={cohort.id} className="flex items-center justify-between rounded-lg border p-4">
                                            <div>
                                                <p className="font-medium">{cohort.name}</p>
                                                <p className="text-muted-foreground text-sm">
                                                    {cohort.start_date && new Date(cohort.start_date).toLocaleDateString()} -{' '}
                                                    {cohort.end_date && new Date(cohort.end_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge>{cohort.status}</Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Application Form */}
                        {program.is_accepting_applications && !existingApplication && !isEnrolled && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Apply to This Program</CardTitle>
                                    <CardDescription>
                                        Tell us about yourself and why you want to join.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="role_self_identified">How do you identify?</Label>
                                            <Input
                                                id="role_self_identified"
                                                placeholder="e.g., Scholar, Builder, Organizer, Partner"
                                                value={data.role_self_identified}
                                                onChange={(e) => setData('role_self_identified', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="background">Your Background *</Label>
                                            <textarea
                                                id="background"
                                                className="border-input bg-background min-h-[100px] w-full rounded-md border px-3 py-2 text-sm"
                                                placeholder="Tell us about your background and experience..."
                                                value={data.background}
                                                onChange={(e) => setData('background', e.target.value)}
                                                required
                                            />
                                            {errors.background && (
                                                <p className="text-sm text-red-500">{errors.background}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="motivation">Why This Program? *</Label>
                                            <textarea
                                                id="motivation"
                                                className="border-input bg-background min-h-[100px] w-full rounded-md border px-3 py-2 text-sm"
                                                placeholder="What draws you to this program? What do you hope to learn or contribute?"
                                                value={data.motivation}
                                                onChange={(e) => setData('motivation', e.target.value)}
                                                required
                                            />
                                            {errors.motivation && (
                                                <p className="text-sm text-red-500">{errors.motivation}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="how_they_want_to_collaborate">How You Want to Collaborate</Label>
                                            <textarea
                                                id="how_they_want_to_collaborate"
                                                className="border-input bg-background min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
                                                placeholder="What kind of collaboration are you looking for?"
                                                value={data.how_they_want_to_collaborate}
                                                onChange={(e) => setData('how_they_want_to_collaborate', e.target.value)}
                                            />
                                        </div>

                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Submitting...' : 'Submit Application'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-muted-foreground h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Duration</p>
                                        <p className="text-muted-foreground text-sm">
                                            {program.default_duration_weeks
                                                ? `${program.default_duration_weeks} weeks`
                                                : 'Varies'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Users className="text-muted-foreground h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Format</p>
                                        <p className="text-muted-foreground text-sm">Cohort-based</p>
                                    </div>
                                </div>

                                {program.application_close_at && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="text-muted-foreground h-5 w-5" />
                                        <div>
                                            <p className="text-sm font-medium">Application Deadline</p>
                                            <p className="text-muted-foreground text-sm">
                                                {new Date(program.application_close_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t pt-4">
                                    <Badge
                                        variant={program.is_accepting_applications ? 'default' : 'secondary'}
                                        className="w-full justify-center"
                                    >
                                        {program.is_accepting_applications
                                            ? 'Accepting Applications'
                                            : 'Applications Closed'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Themes */}
                        {program.themes && program.themes.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Themes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {program.themes.map((theme) => (
                                            <Badge key={theme.id} variant="outline">
                                                {theme.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
