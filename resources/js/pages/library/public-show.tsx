import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import type { LibraryItem } from '@/types';
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

export default function PublicLibraryShow({ item: { data: item }, relatedItems }: LibraryShowProps) {
    const Icon = contentTypeIcons[item.content_type] || FileText;

    return (
        <PublicLayout>
            <Head title={item.title} />
            
            {/* Header Section */}
            <div className="px-8 py-12 lg:px-12 bg-gray-50 border-b border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col gap-6">
                        <Link href="/library" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-medium transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Back to Library
                        </Link>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Icon className="text-muted-foreground h-5 w-5" />
                                <Badge variant="outline" className="uppercase tracking-wider bg-white">{item.content_type}</Badge>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{item.title}</h1>
                            <div className="flex flex-wrap gap-2">
                                {item.pillars?.map((p) => (
                                    <Badge key={p.id} variant="secondary" className="bg-gray-200 text-gray-700">
                                        {p.name}
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
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-8 py-12 lg:px-12">
                <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        {/* Description */}
                        {item.description && (
                            <div className="prose prose-lg max-w-none">
                                <p className="text-xl leading-relaxed text-gray-600">{item.description}</p>
                            </div>
                        )}

                        {/* External Link / Embed */}
                        {item.external_url && (
                            <Card className="overflow-hidden border-gray-200 shadow-sm">
                                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <ExternalLink className="h-5 w-5 text-gray-500" />
                                        Content
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
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
                                                    <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-900 shadow-lg">
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
                                                            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors"
                                                        >
                                                            View Content <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="space-y-4">
                                                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
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
                                                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors"
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
                                <Card className="overflow-hidden border-gray-200 shadow-sm">
                                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <BookOpen className="h-5 w-5 text-gray-500" />
                                            Full Text
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="prose prose-lg max-w-none p-6 md:p-8">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: body.replace(/<p>/g, '<p class="text-gray-600 leading-relaxed mb-4">'),
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            );
                        })()}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {relatedItems?.data?.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Related Content</h3>
                                <div className="flex flex-col gap-4">
                                    {relatedItems.data.map((related) => {
                                        const RelatedIcon = contentTypeIcons[related.content_type] || FileText;
                                        return (
                                            <Link
                                                key={related.id}
                                                href={`/library/${related.slug}`}
                                                className="group block bg-white border border-gray-200 p-4 rounded-lg hover:border-black transition-colors"
                                            >
                                                <div className="mb-2 flex items-center gap-2">
                                                    <RelatedIcon className="text-gray-400 h-4 w-4" />
                                                    <Badge variant="outline" className="text-xs uppercase bg-gray-50">
                                                        {related.content_type}
                                                    </Badge>
                                                </div>
                                                <p className="font-bold leading-tight group-hover:text-gray-700 transition-colors">{related.title}</p>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
