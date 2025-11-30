import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Channel, Post } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Hash, Heart, MessageSquare, Send } from 'lucide-react';

interface ChannelShowProps {
    channel: { data: Channel };
    posts: { data: Post[] };
    membership: {
        role: string;
        notification_level: string;
    };
}

export default function ChannelShow({ channel: { data: channel }, posts, membership }: ChannelShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Community', href: '/community' },
        { title: channel.display_name, href: `/community/channels/${channel.name}` },
    ];

    const { data, setData, post: submitPost, processing, reset } = useForm({
        body: '',
        channel_id: channel.id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitPost('/community/posts', {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`#${channel.display_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                {/* Back Link */}
                <Link href="/community" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Community
                </Link>

                {/* Channel Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Hash className="h-6 w-6" />
                        <div>
                            <h1 className="text-xl font-bold">{channel.display_name}</h1>
                            {channel.description && (
                                <p className="text-muted-foreground text-sm">{channel.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {channel.is_read_only && <Badge variant="secondary">Read-only</Badge>}
                        <Badge variant="outline">{membership.role}</Badge>
                    </div>
                </div>

                {/* Posts */}
                <Card className="flex-1">
                    <CardContent className="flex h-full flex-col p-4">
                        {/* Messages */}
                        <div className="flex-1 space-y-4 overflow-y-auto">
                            {posts?.data?.length > 0 ? (
                                posts.data.map((post) => <PostItem key={post.id} post={post} />)
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <p className="text-muted-foreground">
                                        No posts yet. Be the first to share something!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Compose */}
                        {!channel.is_read_only && (
                            <form onSubmit={handleSubmit} className="mt-4 flex gap-2 border-t pt-4">
                                <textarea
                                    className="border-input bg-background min-h-[80px] flex-1 rounded-md border px-3 py-2 text-sm"
                                    placeholder={`Message #${channel.display_name}...`}
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    required
                                />
                                <Button type="submit" disabled={processing || !data.body.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function PostItem({ post }: { post: Post }) {
    return (
        <div className="group rounded-lg p-3 hover:bg-accent/50">
            <div className="flex gap-3">
                <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                    {post.author?.first_name?.[0]}
                    {post.author?.last_name?.[0]}
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{post.author?.name}</span>
                        <span className="text-muted-foreground text-xs">
                            {new Date(post.created_at).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                            })}
                        </span>
                        {post.is_edited && (
                            <span className="text-muted-foreground text-xs">(edited)</span>
                        )}
                    </div>
                    <p className="whitespace-pre-wrap text-sm">{post.body}</p>

                    {/* Reactions */}
                    {post.reactions_summary && Object.keys(post.reactions_summary).length > 0 && (
                        <div className="flex gap-1 pt-1">
                            {Object.entries(post.reactions_summary).map(([type, count]) => (
                                <Badge key={type} variant="secondary" className="text-xs">
                                    {type === 'like' && '👍'}
                                    {type === 'insightful' && '💡'}
                                    {type === 'support' && '🤝'}
                                    {type === 'celebrate' && '🎉'} {count}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Replies count */}
                    {post.replies_count && post.replies_count > 0 && (
                        <button className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs">
                            <MessageSquare className="h-3 w-3" />
                            {post.replies_count} replies
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
