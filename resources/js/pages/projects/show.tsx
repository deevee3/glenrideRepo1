import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Project, Task, User } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    Check,
    ChevronDown,
    ChevronUp,
    Clock,
    Edit2,
    Plus,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface ProjectShowProps {
    project: { data: Project };
    userRole: string;
    tasks: { data: Task[] };
}

const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const statusColors: Record<string, string> = {
    todo: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    review: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    done: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    archived: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
};

type FilterType = 'all' | 'overdue' | 'due_soon' | 'in_progress' | 'todo';

export default function ProjectShow({ project: { data: project }, userRole, tasks }: ProjectShowProps) {
    const [showNewTask, setShowNewTask] = useState(false);
    const [filter, setFilter] = useState<FilterType>('all');
    const [showCompleted, setShowCompleted] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editingHoursTaskId, setEditingHoursTaskId] = useState<string | null>(null);
    const [hoursValue, setHoursValue] = useState<string>('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.title, href: `/projects/${project.slug}` },
    ];

    const taskForm = useForm({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        start_date: '',
        estimated_hours: '',
        assigned_to: '',
    });

    const editForm = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        due_date: '',
        start_date: '',
        estimated_hours: '',
        actual_hours: '',
        assigned_to: '',
    });

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        taskForm.post(`/projects/${project.id}/tasks`, {
            onSuccess: () => {
                taskForm.reset();
                setShowNewTask(false);
            },
        });
    };

    const handleUpdateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTask) return;
        editForm.patch(`/projects/${project.id}/tasks/${editingTask.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingTask(null);
                editForm.reset();
            },
        });
    };

    const startEditing = (task: Task) => {
        setEditingTask(task);
        editForm.setData({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            status: task.status,
            due_date: task.due_date || '',
            start_date: task.start_date || '',
            estimated_hours: task.estimated_hours?.toString() || '',
            actual_hours: task.actual_hours?.toString() || '',
            assigned_to: task.assignee?.id || '',
        });
    };

    const toggleTaskStatus = (task: Task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        router.patch(`/projects/${project.id}/tasks/${task.id}`, { status: newStatus }, { preserveScroll: true });
    };

    const startEditingHours = (task: Task) => {
        setEditingHoursTaskId(task.id);
        setHoursValue(task.actual_hours?.toString() || '0');
    };

    const saveHours = (taskId: string) => {
        const hours = parseFloat(hoursValue) || 0;
        router.patch(
            `/projects/${project.id}/tasks/${taskId}`,
            { actual_hours: hours },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingHoursTaskId(null);
                    setHoursValue('');
                },
            }
        );
    };

    const cancelEditingHours = () => {
        setEditingHoursTaskId(null);
        setHoursValue('');
    };

    const deleteTask = (task: Task) => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(`/projects/${project.id}/tasks/${task.id}`, { preserveScroll: true });
        }
    };

    // Filter and categorize tasks
    const allTasks = tasks?.data || [];
    const activeTasks = allTasks.filter((t) => t.status !== 'done' && t.status !== 'archived');
    const doneTasks = allTasks.filter((t) => t.status === 'done');

    const filteredTasks = activeTasks.filter((task) => {
        switch (filter) {
            case 'overdue':
                return task.is_overdue;
            case 'due_soon':
                return task.is_due_soon;
            case 'in_progress':
                return task.status === 'in_progress';
            case 'todo':
                return task.status === 'todo';
            default:
                return true;
        }
    });

    // Calculate project stats
    const overdueCount = activeTasks.filter((t) => t.is_overdue).length;
    const dueSoonCount = activeTasks.filter((t) => t.is_due_soon && !t.is_overdue).length;
    const totalEstimated = allTasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
    const totalActual = allTasks.reduce((sum, t) => sum + (t.actual_hours || 0), 0);
    const completionRate = allTasks.length > 0 ? Math.round((doneTasks.length / allTasks.length) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.title} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Back Link */}
                <Link href="/projects" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Projects
                </Link>

                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                            <Badge variant="outline">{project.status}</Badge>
                        </div>
                        <div className="flex gap-2">
                            {project.pillars?.map((p) => (
                                <Badge key={p.id} variant="secondary">
                                    {p.name}
                                </Badge>
                            ))}
                        </div>
                        {project.summary && <p className="text-muted-foreground max-w-2xl">{project.summary}</p>}
                    </div>
                    <Badge>{userRole}</Badge>
                </div>

                {/* Project Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="pt-4">
                            <div className="text-muted-foreground text-sm">Completion</div>
                            <div className="mt-1 flex items-center gap-2">
                                <Progress value={completionRate} className="h-2 flex-1" />
                                <span className="text-sm font-medium">{completionRate}%</span>
                            </div>
                            <div className="text-muted-foreground mt-1 text-xs">
                                {doneTasks.length} of {allTasks.length} tasks
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={overdueCount > 0 ? 'border-red-200 dark:border-red-900' : ''}>
                        <CardContent className="pt-4">
                            <div className="text-muted-foreground text-sm">Overdue</div>
                            <div className={`text-2xl font-bold ${overdueCount > 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
                                {overdueCount}
                            </div>
                            <div className="text-muted-foreground text-xs">tasks past due date</div>
                        </CardContent>
                    </Card>
                    <Card className={dueSoonCount > 0 ? 'border-amber-200 dark:border-amber-900' : ''}>
                        <CardContent className="pt-4">
                            <div className="text-muted-foreground text-sm">Due Soon</div>
                            <div className={`text-2xl font-bold ${dueSoonCount > 0 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                                {dueSoonCount}
                            </div>
                            <div className="text-muted-foreground text-xs">due within 3 days</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4">
                            <div className="text-muted-foreground text-sm">Time Tracking</div>
                            <div className="text-2xl font-bold">{totalActual.toFixed(1)}h</div>
                            <div className="text-muted-foreground text-xs">
                                of {totalEstimated.toFixed(1)}h estimated
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Tasks */}
                    <div className="space-y-4 lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle>Tasks</CardTitle>
                                <Button size="sm" onClick={() => setShowNewTask(!showNewTask)}>
                                    <Plus className="mr-1 h-4 w-4" /> Add Task
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Filter Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: 'all', label: 'All', count: activeTasks.length },
                                        { key: 'overdue', label: 'Overdue', count: overdueCount },
                                        { key: 'due_soon', label: 'Due Soon', count: dueSoonCount },
                                        { key: 'in_progress', label: 'In Progress', count: activeTasks.filter((t) => t.status === 'in_progress').length },
                                        { key: 'todo', label: 'To Do', count: activeTasks.filter((t) => t.status === 'todo').length },
                                    ].map((f) => (
                                        <Button
                                            key={f.key}
                                            variant={filter === f.key ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setFilter(f.key as FilterType)}
                                        >
                                            {f.label} ({f.count})
                                        </Button>
                                    ))}
                                </div>

                                {/* New Task Form */}
                                {showNewTask && (
                                    <form onSubmit={handleCreateTask} className="space-y-4 rounded-lg border p-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Task Title *</Label>
                                            <Input
                                                id="title"
                                                placeholder="What needs to be done?"
                                                value={taskForm.data.title}
                                                onChange={(e) => taskForm.setData('title', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Add more details..."
                                                value={taskForm.data.description}
                                                onChange={(e) => taskForm.setData('description', e.target.value)}
                                                rows={2}
                                            />
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="priority">Priority</Label>
                                                <select
                                                    id="priority"
                                                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                                    value={taskForm.data.priority}
                                                    onChange={(e) => taskForm.setData('priority', e.target.value)}
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="estimated_hours">Estimated Hours</Label>
                                                <Input
                                                    id="estimated_hours"
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    placeholder="e.g. 4"
                                                    value={taskForm.data.estimated_hours}
                                                    onChange={(e) => taskForm.setData('estimated_hours', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="start_date">Start Date</Label>
                                                <Input
                                                    id="start_date"
                                                    type="date"
                                                    value={taskForm.data.start_date}
                                                    onChange={(e) => taskForm.setData('start_date', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="due_date">Due Date</Label>
                                                <Input
                                                    id="due_date"
                                                    type="date"
                                                    value={taskForm.data.due_date}
                                                    onChange={(e) => taskForm.setData('due_date', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        {project.members && project.members.length > 0 && (
                                            <div className="space-y-2">
                                                <Label htmlFor="assigned_to">Assign To</Label>
                                                <select
                                                    id="assigned_to"
                                                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                                    value={taskForm.data.assigned_to}
                                                    onChange={(e) => taskForm.setData('assigned_to', e.target.value)}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {project.members.map((member) => (
                                                        <option key={member.id} value={member.id}>
                                                            {member.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <Button type="submit" disabled={taskForm.processing}>
                                                Create Task
                                            </Button>
                                            <Button type="button" variant="ghost" onClick={() => setShowNewTask(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {/* Active Tasks */}
                                <div className="space-y-2">
                                    {filteredTasks.length > 0 ? (
                                        filteredTasks.map((task) =>
                                            editingTask?.id === task.id ? (
                                                <TaskEditForm
                                                    key={task.id}
                                                    task={task}
                                                    form={editForm}
                                                    members={project.members}
                                                    onSubmit={handleUpdateTask}
                                                    onCancel={() => setEditingTask(null)}
                                                />
                                            ) : (
                                                <TaskItem
                                                    key={task.id}
                                                    task={task}
                                                    onToggle={() => toggleTaskStatus(task)}
                                                    onEdit={() => startEditing(task)}
                                                    onDelete={() => deleteTask(task)}
                                                    editingHours={editingHoursTaskId === task.id}
                                                    hoursValue={hoursValue}
                                                    onHoursChange={setHoursValue}
                                                    onStartEditingHours={() => startEditingHours(task)}
                                                    onSaveHours={() => saveHours(task.id)}
                                                    onCancelEditingHours={cancelEditingHours}
                                                />
                                            )
                                        )
                                    ) : (
                                        <p className="text-muted-foreground py-4 text-center text-sm">
                                            {filter === 'all' ? 'No active tasks. Add one above!' : `No ${filter.replace('_', ' ')} tasks.`}
                                        </p>
                                    )}
                                </div>

                                {/* Completed Tasks */}
                                {doneTasks.length > 0 && (
                                    <div className="border-t pt-4">
                                        <button
                                            onClick={() => setShowCompleted(!showCompleted)}
                                            className="text-muted-foreground hover:text-foreground mb-2 flex w-full items-center justify-between text-sm font-medium"
                                        >
                                            <span>Completed ({doneTasks.length})</span>
                                            {showCompleted ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </button>
                                        {showCompleted && (
                                            <div className="space-y-2 opacity-60">
                                                {doneTasks.map((task) => (
                                                    <TaskItem
                                                        key={task.id}
                                                        task={task}
                                                        onToggle={() => toggleTaskStatus(task)}
                                                        onEdit={() => startEditing(task)}
                                                        onDelete={() => deleteTask(task)}
                                                        editingHours={editingHoursTaskId === task.id}
                                                        hoursValue={hoursValue}
                                                        onHoursChange={setHoursValue}
                                                        onStartEditingHours={() => startEditingHours(task)}
                                                        onSaveHours={() => saveHours(task.id)}
                                                        onCancelEditingHours={cancelEditingHours}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Team */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-4 w-4" /> Team
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {project.members?.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                                            {member.first_name?.[0]}
                                            {member.last_name?.[0]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{member.name}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {activeTasks.filter((t) => t.assignee?.id === member.id).length} active tasks
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {(!project.members || project.members.length === 0) && (
                                    <p className="text-muted-foreground text-sm">No team members yet.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Project Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                                <dl className="space-y-2">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Status</dt>
                                        <dd className="capitalize">{project.status}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Created</dt>
                                        <dd>{new Date(project.created_at).toLocaleDateString()}</dd>
                                    </div>
                                    {project.program && (
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">Program</dt>
                                            <dd>{project.program.title}</dd>
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

function TaskItem({
    task,
    onToggle,
    onEdit,
    onDelete,
    editingHours = false,
    hoursValue = '',
    onHoursChange,
    onStartEditingHours,
    onSaveHours,
    onCancelEditingHours,
}: {
    task: Task;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
    editingHours?: boolean;
    hoursValue?: string;
    onHoursChange?: (value: string) => void;
    onStartEditingHours?: () => void;
    onSaveHours?: () => void;
    onCancelEditingHours?: () => void;
}) {
    const getDueDateDisplay = () => {
        if (!task.due_date) return null;

        const dueDate = new Date(task.due_date);
        const formattedDate = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        if (task.is_overdue) {
            return (
                <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    Overdue ({formattedDate})
                </span>
            );
        }

        if (task.is_due_soon) {
            return (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <Calendar className="h-3 w-3" />
                    {task.days_until_due === 0 ? 'Due today' : `Due in ${task.days_until_due}d`}
                </span>
            );
        }

        return (
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                {formattedDate}
            </span>
        );
    };

    return (
        <div
            className={`rounded-lg border p-3 ${
                task.is_overdue
                    ? 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20'
                    : task.is_due_soon
                      ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20'
                      : ''
            }`}
        >
            <div className="flex items-start gap-3">
                <Checkbox checked={task.status === 'done'} onCheckedChange={onToggle} className="mt-1" />
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${task.status === 'done' ? 'text-muted-foreground line-through' : ''}`}>
                            {task.title}
                        </p>
                        <div className="flex shrink-0 items-center gap-1">
                            <Badge className={priorityColors[task.priority]} variant="secondary">
                                {task.priority}
                            </Badge>
                            <Badge className={statusColors[task.status]} variant="secondary">
                                {task.status.replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>

                    {task.description && (
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{task.description}</p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        {getDueDateDisplay()}

                        {editingHours ? (
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <Clock className="h-3 w-3 text-blue-500" />
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={hoursValue}
                                    onChange={(e) => onHoursChange?.(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            onSaveHours?.();
                                        } else if (e.key === 'Escape') {
                                            onCancelEditingHours?.();
                                        }
                                    }}
                                    className="h-6 w-16 px-1 text-xs"
                                    autoFocus
                                />
                                <span className="text-muted-foreground text-xs">/ {task.estimated_hours || '?'}h</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
                                    onClick={onSaveHours}
                                >
                                    <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
                                    onClick={onCancelEditingHours}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ) : (
                            <button
                                onClick={onStartEditingHours}
                                className="hover:bg-muted text-muted-foreground flex items-center gap-1 rounded px-1 text-xs transition-colors hover:text-blue-600"
                                title="Click to log hours"
                            >
                                <Clock className="h-3 w-3" />
                                {task.actual_hours || 0}/{task.estimated_hours || '?'}h
                            </button>
                        )}

                        {task.progress_percentage !== null && task.progress_percentage !== undefined && !editingHours && (
                            <button
                                onClick={onStartEditingHours}
                                className="flex items-center gap-1 transition-opacity hover:opacity-80"
                                title="Click to update hours worked"
                            >
                                <Progress value={task.progress_percentage} className="h-1.5 w-16" />
                                <span className="text-muted-foreground text-xs">{task.progress_percentage}%</span>
                            </button>
                        )}

                        {task.assignee && (
                            <span className="text-muted-foreground text-xs">
                                → {task.assignee.first_name || task.assignee.name}
                            </span>
                        )}

                        {task.labels && task.labels.length > 0 && (
                            <div className="flex gap-1">
                                {task.labels.map((label, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                        {label}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="sm" onClick={onEdit}>
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function TaskEditForm({
    task,
    form,
    members,
    onSubmit,
    onCancel,
}: {
    task: Task;
    form: ReturnType<typeof useForm<{
        title: string;
        description: string;
        priority: string;
        status: string;
        due_date: string;
        start_date: string;
        estimated_hours: string;
        actual_hours: string;
        assigned_to: string;
    }>>;
    members?: User[];
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border-2 border-blue-200 p-4 dark:border-blue-900">
            <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                    id="edit-title"
                    value={form.data.title}
                    onChange={(e) => form.setData('title', e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                    id="edit-description"
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    rows={2}
                />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <select
                        id="edit-status"
                        className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                        value={form.data.status}
                        onChange={(e) => form.setData('status', e.target.value)}
                    >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <select
                        id="edit-priority"
                        className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                        value={form.data.priority}
                        onChange={(e) => form.setData('priority', e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="edit-start_date">Start Date</Label>
                    <Input
                        id="edit-start_date"
                        type="date"
                        value={form.data.start_date}
                        onChange={(e) => form.setData('start_date', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-due_date">Due Date</Label>
                    <Input
                        id="edit-due_date"
                        type="date"
                        value={form.data.due_date}
                        onChange={(e) => form.setData('due_date', e.target.value)}
                    />
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="edit-estimated_hours">Estimated Hours</Label>
                    <Input
                        id="edit-estimated_hours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={form.data.estimated_hours}
                        onChange={(e) => form.setData('estimated_hours', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-actual_hours">Actual Hours</Label>
                    <Input
                        id="edit-actual_hours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={form.data.actual_hours}
                        onChange={(e) => form.setData('actual_hours', e.target.value)}
                    />
                </div>
            </div>
            {members && members.length > 0 && (
                <div className="space-y-2">
                    <Label htmlFor="edit-assigned_to">Assign To</Label>
                    <select
                        id="edit-assigned_to"
                        className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                        value={form.data.assigned_to}
                        onChange={(e) => form.setData('assigned_to', e.target.value)}
                    >
                        <option value="">Unassigned</option>
                        {members.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className="flex gap-2">
                <Button type="submit" disabled={form.processing}>
                    Save Changes
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
