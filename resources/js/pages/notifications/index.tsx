import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Notification, PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Bell, Check, CheckCheck } from 'lucide-react';

interface NotificationsIndexProps {
    notifications: PaginatedResponse<Notification>;
    unreadCount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notifications', href: '/notifications' },
];

export default function NotificationsIndex({ notifications, unreadCount }: NotificationsIndexProps) {
    const handleMarkAsRead = (notification: Notification) => {
        if (!notification.is_read) {
            router.patch(`/notifications/${notification.id}/read`, {}, { preserveScroll: true });
        }
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                        <p className="text-muted-foreground">
                            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={handleMarkAllAsRead}>
                            <CheckCheck className="mr-2 h-4 w-4" /> Mark All as Read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="space-y-2">
                    {notifications?.data?.length > 0 ? (
                        notifications.data.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`cursor-pointer transition-colors ${
                                    !notification.is_read ? 'border-primary/50 bg-primary/5' : ''
                                }`}
                                onClick={() => handleMarkAsRead(notification)}
                            >
                                <CardContent className="flex items-start gap-4 p-4">
                                    <div
                                        className={`rounded-full p-2 ${
                                            notification.is_read ? 'bg-muted' : 'bg-primary/20'
                                        }`}
                                    >
                                        <Bell
                                            className={`h-4 w-4 ${
                                                notification.is_read ? 'text-muted-foreground' : 'text-primary'
                                            }`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className={`${!notification.is_read ? 'font-medium' : ''}`}>
                                                    {notification.type.replace(/_/g, ' ')}
                                                </p>
                                                {notification.data && (
                                                    <p className="text-muted-foreground text-sm">
                                                        {JSON.stringify(notification.data)}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground text-xs">
                                                    {new Date(notification.created_at).toLocaleDateString()}
                                                </span>
                                                {notification.is_read && (
                                                    <Check className="text-muted-foreground h-4 w-4" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="py-12 text-center">
                            <CardContent>
                                <Bell className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                                <p className="text-muted-foreground">No notifications yet.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {notifications?.meta?.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {notifications.links.prev && (
                            <Button variant="outline" asChild>
                                <Link href={notifications.links.prev}>Previous</Link>
                            </Button>
                        )}
                        <span className="text-muted-foreground flex items-center px-4 text-sm">
                            Page {notifications.meta.current_page} of {notifications.meta.last_page}
                        </span>
                        {notifications.links.next && (
                            <Button variant="outline" asChild>
                                <Link href={notifications.links.next}>Next</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
