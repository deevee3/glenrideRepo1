import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Channel, Post, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Hash, MessageSquare, Users } from 'lucide-react';

interface CommunityIndexProps {
    channels: { data: Channel[] };
    recentPosts: { data: Post[] };
    members: { data: User[] };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Community', href: '/community' },
];

export default function CommunityIndex({ channels, recentPosts, members }: CommunityIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Community" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Community</h1>
                    <p className="text-muted-foreground">
                        Connect with builders, scholars, and organizers across the Glenride network.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Channels */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Hash className="h-5 w-5" /> Channels
                                </CardTitle>
                                <CardDescription>
                                    Join conversations across different topics.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {channels?.data?.map((channel) => (
                                    <Link
                                        key={channel.id}
                                        href={`/community/channels/${channel.name}`}
                                        className="hover:bg-accent flex items-center justify-between rounded-lg border p-4 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Hash className="text-muted-foreground h-5 w-5" />
                                            <div>
                                                <p className="font-medium">{channel.display_name}</p>
                                                {channel.description && (
                                                    <p className="text-muted-foreground text-sm">
                                                        {channel.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {channel.is_read_only && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Read-only
                                                </Badge>
                                            )}
                                            <span className="text-muted-foreground text-sm">
                                                {channel.posts_count || 0} posts
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                                {(!channels?.data || channels.data.length === 0) && (
                                    <p className="text-muted-foreground py-4 text-center">No channels available.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* People Directory */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" /> People
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {members?.data?.slice(0, 5).map((member) => (
                                    <Link
                                        key={member.id}
                                        href={`/members/${member.id}`}
                                        className="hover:bg-accent flex items-center gap-3 rounded-lg p-2 transition-colors"
                                    >
                                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium">
                                            {member.first_name?.[0]}
                                            {member.last_name?.[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{member.name}</p>
                                            {member.location && (
                                                <p className="text-muted-foreground text-xs">{member.location}</p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/community/people">View All Members</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" /> Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {recentPosts?.data?.slice(0, 5).map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/community/channels/${post.channel?.name}`}
                                        className="hover:bg-accent block rounded-lg p-2 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground text-xs">
                                                #{post.channel?.display_name}
                                            </span>
                                        </div>
                                        <p className="line-clamp-2 text-sm">{post.body}</p>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            {post.author?.name} ·{' '}
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </p>
                                    </Link>
                                ))}
                                {(!recentPosts?.data || recentPosts.data.length === 0) && (
                                    <p className="text-muted-foreground text-sm">No recent activity.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
