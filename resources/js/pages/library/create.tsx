import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pillar, Program, Theme } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface CreateLibraryItemProps {
    pillars: { data: Pillar[] };
    themes: { data: Theme[] };
    programs: { data: Program[] };
    contentTypes: string[];
    accessLevels: string[];
    statuses: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Library', href: '/library/browse' },
    { title: 'Create', href: '/library/create' },
];

export default function CreateLibraryItem({
    pillars,
    themes,
    programs,
    contentTypes,
    accessLevels,
    statuses,
}: CreateLibraryItemProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        content_type: 'article',
        access_level: 'members',
        external_url: '',
        rich_content: '',
        status: 'draft',
        program_id: '',
        pillars: [] as string[],
        themes: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/library');
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
            data.themes.includes(themeId) ? data.themes.filter((id) => id !== themeId) : [...data.themes, themeId]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Library Content" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/library/browse">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add Library Content</h1>
                        <p className="text-muted-foreground">Share articles, videos, guides, and other resources.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Details</CardTitle>
                                <CardDescription>Basic information about this resource.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Introduction to Ethical AI"
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            setData('description', e.target.value)
                                        }
                                        placeholder="A brief summary of this content (max 500 characters)"
                                        rows={2}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="content_type">Content Type *</Label>
                                        <select
                                            id="content_type"
                                            className="border-input bg-background w-full rounded-md border px-3 py-2"
                                            value={data.content_type}
                                            onChange={(e) => setData('content_type', e.target.value)}
                                        >
                                            {contentTypes.map((type) => (
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

                                <div className="space-y-2">
                                    <Label htmlFor="external_url">External URL</Label>
                                    <Input
                                        id="external_url"
                                        type="url"
                                        value={data.external_url}
                                        onChange={(e) => setData('external_url', e.target.value)}
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                    <p className="text-muted-foreground text-xs">
                                        For videos, audio, or external resources
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rich_content">Content Body</Label>
                                    <Textarea
                                        id="rich_content"
                                        value={data.rich_content}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            setData('rich_content', e.target.value)
                                        }
                                        placeholder="Full content for articles and guides..."
                                        rows={8}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Access & Visibility</CardTitle>
                                <CardDescription>Who can access this content?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="access_level">Access Level *</Label>
                                    <select
                                        id="access_level"
                                        className="border-input bg-background w-full rounded-md border px-3 py-2"
                                        value={data.access_level}
                                        onChange={(e) => setData('access_level', e.target.value)}
                                    >
                                        {accessLevels.map((level) => (
                                            <option key={level} value={level}>
                                                {level
                                                    .split('_')
                                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                    .join(' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="program_id">Program (optional)</Label>
                                    <select
                                        id="program_id"
                                        className="border-input bg-background w-full rounded-md border px-3 py-2"
                                        value={data.program_id}
                                        onChange={(e) => setData('program_id', e.target.value)}
                                    >
                                        <option value="">None</option>
                                        {programs.data.map((program) => (
                                            <option key={program.id} value={program.id}>
                                                {program.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Pillars</CardTitle>
                                <CardDescription>Select relevant pillars.</CardDescription>
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

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? 'Creating...' : 'Add to Library'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
