import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth & { can?: { access_admin?: boolean } };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: string; // UUID
    first_name: string;
    last_name: string;
    name: string; // computed accessor
    email: string;
    display_name?: string | null;
    pronouns?: string | null;
    location?: string | null;
    bio?: string | null;
    profile_image_url?: string | null;
    website_url?: string | null;
    status: 'active' | 'invited' | 'deactivated' | 'banned';
    avatar?: string;
    email_verified_at: string | null;
    last_login_at?: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles?: string[];
    pillars?: Pillar[];
    themes?: Theme[];
    skills?: Skill[];
    [key: string]: unknown;
}

export interface Pillar {
    id: string;
    name: 'ethics' | 'critique' | 'praxis';
    description?: string;
}

export interface Theme {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface Skill {
    id: string;
    name: string;
    category?: string;
    proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Program {
    id: string;
    title: string;
    slug: string;
    short_description?: string;
    long_description?: string;
    program_type: 'fellowship' | 'lab' | 'school' | 'incubator' | 'studio' | 'other';
    application_open_at?: string;
    application_close_at?: string;
    default_duration_weeks?: number;
    is_public: boolean;
    status: 'draft' | 'upcoming' | 'active' | 'completed' | 'archived';
    is_accepting_applications: boolean;
    pillars?: Pillar[];
    themes?: Theme[];
    cohorts?: ProgramCohort[];
    cohorts_count?: number;
    creator?: User;
    created_at: string;
    updated_at: string;
}

export interface ProgramCohort {
    id: string;
    name: string;
    start_date?: string;
    end_date?: string;
    max_participants?: number;
    status: 'upcoming' | 'active' | 'completed' | 'archived';
    meeting_cadence?: string;
    has_capacity: boolean;
    program?: Program;
    participants?: User[];
    participants_count?: number;
    sessions?: ProgramSession[];
    next_session?: ProgramSession;
    created_at: string;
}

export interface ProgramSession {
    id: string;
    title: string;
    description?: string;
    starts_at: string;
    ends_at?: string;
    location_type: 'online' | 'in_person' | 'hybrid';
    location_details?: string;
    is_upcoming: boolean;
    is_in_progress: boolean;
    cohort?: ProgramCohort;
    created_at: string;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    summary?: string;
    description?: string;
    status: 'idea' | 'design' | 'in_progress' | 'paused' | 'completed' | 'archived';
    pillars?: Pillar[];
    themes?: Theme[];
    members?: User[];
    members_count?: number;
    tasks?: Task[];
    tasks_count?: number;
    program?: Program;
    creator?: User;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'review' | 'done' | 'archived';
    priority: 'low' | 'medium' | 'high' | 'urgent';

    // Date fields
    due_date?: string;
    start_date?: string;
    completed_at?: string;

    // Time tracking
    estimated_hours?: number;
    actual_hours?: number;

    // Organization
    sort_order: number;
    labels: string[];
    notes?: string;

    // Computed status indicators
    is_overdue: boolean;
    is_due_soon: boolean;
    is_start_overdue: boolean;
    days_until_due?: number;
    progress_percentage?: number;
    time_remaining?: number;

    // Relationships
    project?: Project;
    creator?: User;
    assignee?: User;
    comments?: TaskComment[];
    comments_count?: number;

    created_at: string;
    updated_at: string;
}

export interface TaskComment {
    id: string;
    body: string;
    author?: User;
    created_at: string;
    updated_at: string;
}

export interface Channel {
    id: string;
    name: string;
    display_name: string;
    description?: string;
    visibility: 'public' | 'members' | 'program_only';
    is_read_only: boolean;
    program?: Program;
    members_count?: number;
    posts_count?: number;
    unread_count?: number;
    created_at: string;
}

export interface Post {
    id: string;
    body: string;
    is_edited: boolean;
    is_deleted: boolean;
    context_type: 'channel' | 'project' | 'program' | 'event' | 'direct_message_thread';
    context_id?: string;
    channel?: Channel;
    author?: User;
    parent?: Post;
    replies?: Post[];
    replies_count?: number;
    reactions?: PostReaction[];
    reactions_summary?: Record<string, number>;
    created_at: string;
    updated_at: string;
}

export interface PostReaction {
    id: string;
    reaction_type: 'like' | 'insightful' | 'support' | 'celebrate';
    user?: User;
    created_at: string;
}

export interface Event {
    id: string;
    title: string;
    description?: string;
    starts_at: string;
    ends_at?: string;
    location_type: 'online' | 'in_person' | 'hybrid';
    location_details?: string;
    visibility: 'public' | 'members' | 'program_only' | 'cohort_only';
    is_upcoming: boolean;
    is_in_progress: boolean;
    has_ended: boolean;
    program?: Program;
    cohort?: ProgramCohort;
    creator?: User;
    registrants_count?: number;
    user_registration?: {
        id?: string;
        status: string;
        registered_at: string;
    };
    created_at: string;
}

export interface LibraryItem {
    id: string;
    title: string;
    slug: string;
    description?: string;
    content_type: 'article' | 'video' | 'audio' | 'briefing' | 'guide' | 'recording' | 'other';
    access_level: 'public' | 'members' | 'program_members' | 'cohort_members';
    external_url?: string;
    rich_content?: Record<string, unknown>;
    published_at?: string;
    status: 'draft' | 'published' | 'archived';
    pillars?: Pillar[];
    themes?: Theme[];
    author?: User;
    program?: Program;
    views_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: string;
    type: string;
    data?: Record<string, unknown>;
    is_read: boolean;
    read_at?: string;
    created_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}
