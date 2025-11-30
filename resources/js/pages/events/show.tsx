import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Event } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Clock, ExternalLink, MapPin, Users, Video } from 'lucide-react';

interface EventShowProps {
    event: { data: Event };
}

export default function EventShow({ event: { data: event } }: EventShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Events', href: '/events' },
        { title: event.title, href: `/events/${event.id}` },
    ];

    const isRegistered = !!event.user_registration;

    const handleRegister = () => {
        router.post(`/events/${event.id}/register`, {}, { preserveScroll: true });
    };

    const handleCancelRegistration = () => {
        router.delete(`/events/${event.id}/register`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={event.title} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Back Link */}
                <Link href="/events" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Events
                </Link>

                {/* Header */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
                            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(event.starts_at).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {new Date(event.starts_at).toLocaleTimeString(undefined, {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                    })}
                                    {event.ends_at &&
                                        ` - ${new Date(event.ends_at).toLocaleTimeString(undefined, {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                        })}`}
                                </span>
                            </div>
                        </div>
                        {isRegistered && (
                            <Badge className="bg-green-600">
                                <CheckCircle className="mr-1 h-3 w-3" /> You're Registered
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>About This Event</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {event.description ? (
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-wrap">{event.description}</p>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No description provided.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Location Details */}
                        {event.location_details && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Location</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-start gap-3">
                                        {event.location_type === 'online' && <Video className="text-muted-foreground h-5 w-5" />}
                                        {event.location_type === 'in_person' && <MapPin className="text-muted-foreground h-5 w-5" />}
                                        {event.location_type === 'hybrid' && <Video className="text-muted-foreground h-5 w-5" />}
                                        <div>
                                            <p className="mb-1 font-medium capitalize">
                                                {event.location_type.replace('_', ' ')}
                                            </p>
                                            {event.location_details.startsWith('http') ? (
                                                <a
                                                    href={event.location_details}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline flex items-center gap-1"
                                                >
                                                    Join Link <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : (
                                                <p className="text-muted-foreground">{event.location_details}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Registration Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Registration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Users className="text-muted-foreground h-5 w-5" />
                                    <div>
                                        <p className="text-sm font-medium">Attendees</p>
                                        <p className="text-muted-foreground text-sm">
                                            {event.registrants_count || 0} registered
                                        </p>
                                    </div>
                                </div>

                                {event.is_upcoming && (
                                    <>
                                        {isRegistered ? (
                                            <div className="space-y-2">
                                                <p className="text-sm text-green-600">
                                                    You registered on{' '}
                                                    {new Date(event.user_registration!.registered_at).toLocaleDateString()}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={handleCancelRegistration}
                                                >
                                                    Cancel Registration
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button className="w-full" onClick={handleRegister}>
                                                Register for This Event
                                            </Button>
                                        )}
                                    </>
                                )}

                                {event.has_ended && (
                                    <Badge variant="secondary" className="w-full justify-center">
                                        This event has ended
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>

                        {/* Event Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                                <dl className="space-y-2">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Format</dt>
                                        <dd className="capitalize">{event.location_type.replace('_', ' ')}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Visibility</dt>
                                        <dd className="capitalize">{event.visibility.replace('_', ' ')}</dd>
                                    </div>
                                    {event.program && (
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">Program</dt>
                                            <dd>{event.program.title}</dd>
                                        </div>
                                    )}
                                </dl>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
