import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Event, PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, MapPin, Plus, Video } from 'lucide-react';

interface EventsIndexProps {
    upcomingEvents: PaginatedResponse<Event>;
    myEvents: { data: Event[] };
    canCreate: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Events', href: '/events' },
];

export default function EventsIndex({ upcomingEvents, myEvents, canCreate }: EventsIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Events</h1>
                        <p className="text-muted-foreground">
                            Workshops, talks, and gatherings across the Glenride network.
                        </p>
                    </div>
                    {canCreate && (
                        <Button asChild>
                            <Link href="/events/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Event
                            </Link>
                        </Button>
                    )}
                </div>

                {/* My Registered Events */}
                {myEvents?.data?.length > 0 && (
                    <section>
                        <h2 className="mb-4 text-lg font-semibold">Your Upcoming Events</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {myEvents.data.map((event) => (
                                <EventCard key={event.id} event={event} showRegistration />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Upcoming Events */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">Upcoming Events</h2>
                    {upcomingEvents?.data?.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingEvents.data.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <Card className="py-12 text-center">
                            <CardContent>
                                <p className="text-muted-foreground">No upcoming events at this time.</p>
                            </CardContent>
                        </Card>
                    )}
                </section>

                {/* Pagination */}
                {upcomingEvents?.meta?.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {upcomingEvents.links.prev && (
                            <Button variant="outline" asChild>
                                <Link href={upcomingEvents.links.prev}>Previous</Link>
                            </Button>
                        )}
                        <span className="text-muted-foreground flex items-center px-4 text-sm">
                            Page {upcomingEvents.meta.current_page} of {upcomingEvents.meta.last_page}
                        </span>
                        {upcomingEvents.links.next && (
                            <Button variant="outline" asChild>
                                <Link href={upcomingEvents.links.next}>Next</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function EventCard({ event, showRegistration }: { event: Event; showRegistration?: boolean }) {
    const isRegistered = !!event.user_registration;

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    {showRegistration && isRegistered && (
                        <Badge className="bg-green-600 shrink-0">
                            <CheckCircle className="mr-1 h-3 w-3" /> Registered
                        </Badge>
                    )}
                </div>
                <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.starts_at).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                    })}
                    <Clock className="ml-2 h-4 w-4" />
                    {new Date(event.starts_at).toLocaleTimeString(undefined, {
                        hour: 'numeric',
                        minute: '2-digit',
                    })}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
                {event.description && (
                    <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm">
                        {event.description}
                    </p>
                )}
                <div className="space-y-3">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        {event.location_type === 'online' && <Video className="h-4 w-4" />}
                        {event.location_type === 'in_person' && <MapPin className="h-4 w-4" />}
                        {event.location_type === 'hybrid' && (
                            <>
                                <Video className="h-4 w-4" />
                                <MapPin className="h-4 w-4" />
                            </>
                        )}
                        <span className="capitalize">{event.location_type.replace('_', ' ')}</span>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
