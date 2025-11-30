import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    FolderKanban,
    HelpCircle,
    Inbox,
    LayoutGrid,
    Library,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Help & FAQ',
        href: '/faq',
        icon: HelpCircle,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Programs',
            href: '/programs',
            icon: BookOpen,
        },
        {
            title: 'Projects',
            href: '/projects',
            icon: FolderKanban,
        },
        {
            title: 'Community',
            href: '/community',
            icon: Users,
        },
        {
            title: 'Events',
            href: '/events',
            icon: Calendar,
        },
        {
            title: 'Library',
            href: '/library/browse',
            icon: Library,
        },
    ];

    if (auth.can?.access_admin) {
        mainNavItems.push({
            title: 'Inbound',
            href: '/admin/submissions',
            icon: Inbox,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
