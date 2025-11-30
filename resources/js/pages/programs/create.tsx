import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pillar, Theme } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface CreateProgramProps {
    pillars: { data: Pillar[] };
    themes: { data: Theme[] };
    programTypes: string[];
    statuses: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Programs', href: '/programs' },
    { title: 'Create', href: '/programs/create' },
];

export default function CreateProgram({ pillars, themes, programTypes, statuses }: CreateProgramProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        short_description: '',
        long_description: '',
        program_type: 'fellowship',
        status: 'draft',
        is_public: true,
        application_open_at: '',
        application_close_at: '',
        default_duration_weeks: '',
        pillars: [] as string[],
        themes: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/programs');
    };

    const togglePillar = (pillarId: string) => {
        setData(
            'pillars',
            data.pillars.includes(pillarId)
                ? data.pillars.filter((id) => id !== pillarId)
                : [...data.pillars, pillarId]
        );
    };

    const toggleTheme = (themeId: string) => {
        setData(
            'themes',
            data.themes.includes(themeId)
                ? data.themes.filter((id) => id !== themeId)
                : [...data.themes, themeId]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Program" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/programs">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Program</h1>
                        <p className="text-muted-foreground">Set up a new fellowship, lab, or school.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Core details about your program.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Ethics Lab Fall 2025"
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="short_description">Short Description *</Label>
                                    <Textarea
                                        id="short_description"
                                        value={data.short_description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('short_description', e.target.value)}
                                        placeholder="A brief summary for listings (max 500 characters)"
                                        rows={2}
                                    />
                                    {errors.short_description && (
                                        <p className="text-sm text-red-500">{errors.short_description}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="long_description">Full Description</Label>
                                    <Textarea
                                        id="long_description"
                                        value={data.long_description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('long_description', e.target.value)}
                                        placeholder="Detailed description of the program..."
                                        rows={6}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="program_type">Program Type *</Label>
                                        <select
                                            id="program_type"
                                            className="border-input bg-background w-full rounded-md border px-3 py-2"
                                            value={data.program_type}
                                            onChange={(e) => setData('program_type', e.target.value)}
                                        >
                                            {programTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status *</Label>
                                        <select
                                            id="status"
                                            className="border-input bg-background w-full rounded-md border px-3 py-2"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                        >
                                            {statuses.map((s) => (
                                                <option key={s} value={s}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Applications</CardTitle>
                                <CardDescription>Configure application period and duration.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="application_open_at">Applications Open</Label>
                                        <Input
                                            id="application_open_at"
                                            type="datetime-local"
                                            value={data.application_open_at}
                                            onChange={(e) => setData('application_open_at', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="application_close_at">Applications Close</Label>
                                        <Input
                                            id="application_close_at"
                                            type="datetime-local"
                                            value={data.application_close_at}
                                            onChange={(e) => setData('application_close_at', e.target.value)}
                                        />
                                        {errors.application_close_at && (
                                            <p className="text-sm text-red-500">{errors.application_close_at}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="default_duration_weeks">Default Duration (weeks)</Label>
                                    <Input
                                        id="default_duration_weeks"
                                        type="number"
                                        min="1"
                                        max="52"
                                        value={data.default_duration_weeks}
                                        onChange={(e) => setData('default_duration_weeks', e.target.value)}
                                        placeholder="e.g., 12"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_public"
                                        checked={data.is_public}
                                        onChange={(e) => setData('is_public', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="is_public">Make this program publicly visible</Label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pillars</CardTitle>
                                <CardDescription>Select which pillars this program focuses on.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {pillars.data.map((pillar) => (
                                        <Badge
                                            key={pillar.id}
                                            variant={data.pillars.includes(pillar.id) ? 'default' : 'outline'}
                                            className="cursor-pointer"
                                            onClick={() => togglePillar(pillar.id)}
                                        >
                                            {pillar.name}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Themes</CardTitle>
                                <CardDescription>Select relevant themes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {themes.data.map((theme) => (
                                        <Badge
                                            key={theme.id}
                                            variant={data.themes.includes(theme.id) ? 'default' : 'outline'}
                                            className="cursor-pointer"
                                            onClick={() => toggleTheme(theme.id)}
                                        >
                                            {theme.name}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Program'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
