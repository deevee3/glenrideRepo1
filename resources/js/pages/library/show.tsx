import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, LibraryItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, ExternalLink, FileText, Headphones, User, Video } from 'lucide-react';

interface LibraryShowProps {
    item: { data: LibraryItem };
    relatedItems: { data: LibraryItem[] };
}

const contentTypeIcons: Record<string, React.ElementType> = {
    article: FileText,
    video: Video,
    audio: Headphones,
    briefing: FileText,
    guide: BookOpen,
    recording: Video,
};

export default function LibraryShow({ item: { data: item }, relatedItems }: LibraryShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Library', href: '/library/browse' },
        { title: item.title, href: `/library/items/${item.slug}` },
    ];

    const Icon = contentTypeIcons[item.content_type] || FileText;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={item.title} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Back Link */}
                <Link href="/library/browse" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Library
                </Link>

                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Icon className="text-muted-foreground h-5 w-5" />
                        <Badge variant="outline">{item.content_type}</Badge>
                        <Badge variant="secondary">{item.access_level}</Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>
                    <div className="flex flex-wrap gap-2">
                        {item.pillars?.map((p) => (
                            <Badge key={p.id} variant="secondary">
                                {p.name}
                            </Badge>
                        ))}
                        {item.themes?.map((t) => (
                            <Badge key={t.id} variant="outline">
                                {t.name}
                            </Badge>
                        ))}
                    </div>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                        {item.author && (
                            <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {item.author.name}
                            </span>
                        )}
                        {item.published_at && (
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(item.published_at).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Description */}
                        {item.description && (
                            <Card className="bg-card/40 border-primary/10 shadow-xl backdrop-blur-xl transition-all hover:bg-card/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <FileText className="text-primary h-5 w-5" />
                                        Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* External Link / Embed */}
                        {item.external_url && (
                            <Card className="bg-card/40 border-primary/10 shadow-xl backdrop-blur-xl transition-all hover:bg-card/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <ExternalLink className="text-primary h-5 w-5" />
                                        Content
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {(() => {
                                        const isYoutube = item.external_url.includes('youtube.com') || item.external_url.includes('youtu.be');
                                        const isVimeo = item.external_url.includes('vimeo.com');
                                        const isVideo = item.content_type === 'video' || isYoutube || isVimeo;

                                        if (isVideo) {
                                            let embedUrl = item.external_url;
                                            if (isYoutube) {
                                                if (item.external_url.includes('watch?v=')) {
                                                    embedUrl = item.external_url.replace('watch?v=', 'embed/');
                                                } else if (item.external_url.includes('youtu.be/')) {
                                                    embedUrl = item.external_url.replace('youtu.be/', 'www.youtube.com/embed/');
                                                }
                                            } else if (isVimeo) {
                                                embedUrl = item.external_url.replace('vimeo.com/', 'player.vimeo.com/video/');
                                            }

                                            return (
                                                <div className="space-y-4">
                                                    <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                                                        <iframe
                                                            src={embedUrl}
                                                            className="h-full w-full"
                                                            allowFullScreen
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        />
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <a
                                                            href={item.external_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium transition-colors"
                                                        >
                                                            View Content <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="space-y-4">
                                                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-muted/30 shadow-inner">
                                                    <iframe
                                                        src={item.external_url}
                                                        className="h-full w-full opacity-90 transition-opacity hover:opacity-100"
                                                        title="Content Preview"
                                                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                                    />
                                                </div>
                                                <div className="flex justify-end">
                                                    <a
                                                        href={item.external_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium transition-colors"
                                                    >
                                                        View Content <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        )}

                        {/* Rich Content / Full Text */}
                        {(() => {
                            const content = item.rich_content;
                            let body = '';

                            if (typeof content === 'string') {
                                try {
                                    const parsed = JSON.parse(content);
                                    body = parsed.body || content;
                                } catch {
                                    body = content;
                                }
                            } else if (content && typeof content === 'object') {
                                body = (content as any).body || '';
                            }

                            if (!body) return null;

                            return (
                                <Card className="bg-card/60 border-primary/10 shadow-2xl backdrop-blur-2xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-2xl">
                                            <BookOpen className="text-primary h-6 w-6" />
                                            Full Text
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="prose prose-lg dark:prose-invert prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80 max-w-none p-6 md:p-8">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: body.replace(/<p>/g, '<p class="text-muted-foreground text-lg leading-relaxed">'),
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            );
                        })()}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Related Items */}
                        {relatedItems?.data?.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Related Content</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {relatedItems.data.map((related) => {
                                        const RelatedIcon = contentTypeIcons[related.content_type] || FileText;
                                        return (
                                            <Link
                                                key={related.id}
                                                href={`/library/items/${related.slug}`}
                                                className="hover:bg-accent block rounded-lg p-3 transition-colors"
                                            >
                                                <div className="mb-1 flex items-center gap-2">
                                                    <RelatedIcon className="text-muted-foreground h-4 w-4" />
                                                    <Badge variant="outline" className="text-xs">
                                                        {related.content_type}
                                                    </Badge>
                                                </div>
                                                <p className="line-clamp-2 text-sm font-medium">{related.title}</p>
                                            </Link>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        )}

                        {/* Program Association */}
                        {item.program && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>From Program</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Link
                                        href={`/programs/${item.program.slug}`}
                                        className="text-primary hover:underline"
                                    >
                                        {item.program.title}
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
