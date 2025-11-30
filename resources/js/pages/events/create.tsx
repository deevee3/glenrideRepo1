import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Program } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface CreateEventProps {
    programs: { data: Program[] };
    locationTypes: string[];
    visibilities: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Events', href: '/events' },
    { title: 'Create', href: '/events/create' },
];

export default function CreateEvent({ programs, locationTypes, visibilities }: CreateEventProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        starts_at: '',
        ends_at: '',
        location_type: 'online',
        location_details: '',
        visibility: 'members',
        program_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/events');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Event" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/events">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
                        <p className="text-muted-foreground">Schedule a new workshop, talk, or gathering.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                                <CardDescription>Basic information about your event.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Ethics in AI Workshop"
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            setData('description', e.target.value)
                                        }
                                        placeholder="Describe the event, topics covered, who should attend..."
                                        rows={4}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="starts_at">Start Date & Time *</Label>
                                        <Input
                                            id="starts_at"
                                            type="datetime-local"
                                            value={data.starts_at}
                                            onChange={(e) => setData('starts_at', e.target.value)}
                                        />
                                        {errors.starts_at && <p className="text-sm text-red-500">{errors.starts_at}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ends_at">End Date & Time</Label>
                                        <Input
                                            id="ends_at"
                                            type="datetime-local"
                                            value={data.ends_at}
                                            onChange={(e) => setData('ends_at', e.target.value)}
                                        />
                                        {errors.ends_at && <p className="text-sm text-red-500">{errors.ends_at}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Location</CardTitle>
                                <CardDescription>Where will this event take place?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location_type">Location Type *</Label>
                                    <select
                                        id="location_type"
                                        className="border-input bg-background w-full rounded-md border px-3 py-2"
                                        value={data.location_type}
                                        onChange={(e) => setData('location_type', e.target.value)}
                                    >
                                        {locationTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type
                                                    .split('_')
                                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                    .join(' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location_details">Location Details</Label>
                                    <Input
                                        id="location_details"
                                        value={data.location_details}
                                        onChange={(e) => setData('location_details', e.target.value)}
                                        placeholder={
                                            data.location_type === 'online'
                                                ? 'Zoom link or meeting URL'
                                                : 'Address or venue name'
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Visibility</CardTitle>
                                <CardDescription>Who can see and register for this event?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="visibility">Access Level *</Label>
                                    <select
                                        id="visibility"
                                        className="border-input bg-background w-full rounded-md border px-3 py-2"
                                        value={data.visibility}
                                        onChange={(e) => setData('visibility', e.target.value)}
                                    >
                                        {visibilities.map((v) => (
                                            <option key={v} value={v}>
                                                {v
                                                    .split('_')
                                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                    .join(' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Program Association</CardTitle>
                                <CardDescription>Optional: Link this event to a program.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="program_id">Program</Label>
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

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Event'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
