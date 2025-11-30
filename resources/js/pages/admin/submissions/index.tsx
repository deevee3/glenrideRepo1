import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { useState } from 'react';

declare let route: any;

interface Subscriber {
    id: string;
    email: string;
    status: 'active' | 'unsubscribed';
    created_at: string;
}

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'in_review' | 'responded' | 'archived';
    created_at: string;
}

interface JoinRequest {
    id: string;
    name: string;
    email: string;
    self_description: string;
    location: string;
    current_work: string;
    collaboration_idea: string;
    status: 'new' | 'in_review' | 'responded' | 'converted_to_user';
    created_at: string;
}

interface PageProps {
    subscribers: { data: Subscriber[]; current_page: number; last_page: number; total: number };
    contactMessages: { data: ContactMessage[]; current_page: number; last_page: number; total: number };
    joinRequests: { data: JoinRequest[]; current_page: number; last_page: number; total: number };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Submissions',
        href: '/admin/submissions',
    },
];

export default function Submissions({ subscribers, contactMessages, joinRequests }: PageProps) {
    const [activeTab, setActiveTab] = useState<'contact' | 'join' | 'subscribers'>('contact');

    const updateStatus = (type: 'contact' | 'join' | 'subscriber', id: string, status: string) => {
        router.patch(route(`admin.submissions.${type}.update`, id), { status }, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Submissions & Inbound" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Inbound & Submissions
                    </h1>
                    <p className="text-muted-foreground">
                        Manage contact messages, join requests, and newsletter subscribers.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 pb-1">
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`px-4 py-2 text-sm font-medium transition-colors hover:text-black ${
                            activeTab === 'contact' ? 'border-b-2 border-black text-black' : 'text-gray-500'
                        }`}
                    >
                        Contact Messages ({contactMessages.total})
                    </button>
                    <button
                        onClick={() => setActiveTab('join')}
                        className={`px-4 py-2 text-sm font-medium transition-colors hover:text-black ${
                            activeTab === 'join' ? 'border-b-2 border-black text-black' : 'text-gray-500'
                        }`}
                    >
                        Join Requests ({joinRequests.total})
                    </button>
                    <button
                        onClick={() => setActiveTab('subscribers')}
                        className={`px-4 py-2 text-sm font-medium transition-colors hover:text-black ${
                            activeTab === 'subscribers' ? 'border-b-2 border-black text-black' : 'text-gray-500'
                        }`}
                    >
                        Subscribers ({subscribers.total})
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Contact Messages Tab */}
                    {activeTab === 'contact' && (
                        <div className="space-y-4">
                            {contactMessages.data.map((msg) => (
                                <Card key={msg.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-base">{msg.subject}</CardTitle>
                                                <CardDescription>
                                                    From: {msg.name} ({msg.email})
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={msg.status === 'new' ? 'default' : 'secondary'}>
                                                    {msg.status}
                                                </Badge>
                                                <Select
                                                    defaultValue={msg.status}
                                                    onValueChange={(val) => updateStatus('contact', msg.id, val)}
                                                >
                                                    <SelectTrigger className="w-[130px] h-8 text-xs">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="new">New</SelectItem>
                                                        <SelectItem value="in_review">In Review</SelectItem>
                                                        <SelectItem value="responded">Responded</SelectItem>
                                                        <SelectItem value="archived">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
                                            {msg.message}
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(msg.created_at).toLocaleString()}
                                            
                                            <div className="ml-auto">
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}>
                                                        <Mail className="mr-2 h-3 w-3" />
                                                        Reply via Email
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {contactMessages.data.length === 0 && (
                                <p className="text-muted-foreground py-8 text-center">No contact messages found.</p>
                            )}
                        </div>
                    )}

                    {/* Join Requests Tab */}
                    {activeTab === 'join' && (
                        <div className="space-y-4">
                            {joinRequests.data.map((req) => (
                                <Card key={req.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-base">{req.name}</CardTitle>
                                                <CardDescription>
                                                    {req.email} · {req.location}
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{req.self_description}</Badge>
                                                <Badge variant={req.status === 'new' ? 'default' : 'secondary'}>
                                                    {req.status}
                                                </Badge>
                                                <Select
                                                    defaultValue={req.status}
                                                    onValueChange={(val) => updateStatus('join', req.id, val)}
                                                >
                                                    <SelectTrigger className="w-[130px] h-8 text-xs">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="new">New</SelectItem>
                                                        <SelectItem value="in_review">In Review</SelectItem>
                                                        <SelectItem value="responded">Responded</SelectItem>
                                                        <SelectItem value="converted_to_user">Converted</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <div>
                                            <span className="font-semibold">Current Work:</span>
                                            <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{req.current_work}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Collaboration Idea:</span>
                                            <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{req.collaboration_idea}</p>
                                        </div>
                                        
                                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(req.created_at).toLocaleString()}
                                            
                                            <div className="ml-auto">
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={`mailto:${req.email}?subject=Re: Collaboration with Glenride`}>
                                                        <Mail className="mr-2 h-3 w-3" />
                                                        Reply via Email
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {joinRequests.data.length === 0 && (
                                <p className="text-muted-foreground py-8 text-center">No join requests found.</p>
                            )}
                        </div>
                    )}

                    {/* Subscribers Tab */}
                    {activeTab === 'subscribers' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Newsletter Subscribers</CardTitle>
                                <CardDescription>
                                    List of email addresses subscribed to updates.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {subscribers.data.map((sub) => (
                                        <div key={sub.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <div>
                                                <p className="font-medium">{sub.email}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Subscribed {new Date(sub.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={sub.status === 'active' ? 'outline' : 'secondary'}>
                                                    {sub.status}
                                                </Badge>
                                                {sub.status === 'active' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-600"
                                                        onClick={() => updateStatus('subscriber', sub.id, 'unsubscribed')}
                                                    >
                                                        Unsubscribe
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {subscribers.data.length === 0 && (
                                        <p className="text-muted-foreground py-4 text-center">No subscribers found.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function Calendar({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    );
}
