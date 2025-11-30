import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pillar, Project, Theme } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Plus, Users } from 'lucide-react';
import { useState } from 'react';

interface ProjectsIndexProps {
    userProjects: { data: Project[] };
    pillars: Pillar[];
    themes: Theme[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/projects' },
];

export default function ProjectsIndex({ userProjects, pillars, themes }: ProjectsIndexProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        summary: '',
        description: '',
        pillar_ids: [] as string[],
        theme_ids: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/projects', {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            },
        });
    };

    const togglePillar = (id: string) => {
        setData(
            'pillar_ids',
            data.pillar_ids.includes(id)
                ? data.pillar_ids.filter((p) => p !== id)
                : [...data.pillar_ids, id]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                        <p className="text-muted-foreground">
                            Where Glenride becomes real. Build policies, tools, campaigns, and models.
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Create a New Project</DialogTitle>
                                <DialogDescription>
                                    Start a new initiative. You can add team members later.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Project Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Community Data Commons"
                                        required
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="summary">Summary</Label>
                                    <textarea
                                        id="summary"
                                        className="border-input bg-background min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
                                        value={data.summary}
                                        onChange={(e) => setData('summary', e.target.value)}
                                        placeholder="A brief description of the project..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Pillars</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {pillars?.map((pillar) => (
                                            <Badge
                                                key={pillar.id}
                                                variant={data.pillar_ids.includes(pillar.id) ? 'default' : 'outline'}
                                                className="cursor-pointer"
                                                onClick={() => togglePillar(pillar.id)}
                                            >
                                                {pillar.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Project'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Projects Grid */}
                {userProjects?.data?.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {userProjects.data.map((project) => (
                            <Card key={project.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-lg">{project.title}</CardTitle>
                                        <Badge variant="outline">{project.status}</Badge>
                                    </div>
                                    <div className="flex gap-1">
                                        {project.pillars?.map((p) => (
                                            <Badge key={p.id} variant="secondary" className="text-xs">
                                                {p.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col">
                                    {project.summary && (
                                        <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm">
                                            {project.summary}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                            <Users className="h-4 w-4" />
                                            {project.members_count || 0} members
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/projects/${project.slug}`}>
                                                Open <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="py-12 text-center">
                        <CardContent>
                            <p className="text-muted-foreground mb-4">You're not part of any projects yet.</p>
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Create Your First Project
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
