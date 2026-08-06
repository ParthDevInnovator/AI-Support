'use client';

import AuthGuard from '@/components/auth-guard';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Inbox, LayoutDashboard, Settings, Users, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function DashboardPage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    return (
        <AuthGuard>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">

                {/* Navbar */}
                <nav className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-semibold text-lg">{user?.orgName || 'Workspace'}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button onClick={() => router.push('/tickets')} variant="default" className="gap-2">
                            <Inbox className="w-4 h-4" /> Go to Inbox
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                                <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800">
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-semibold text-xs">
                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="px-2 py-1.5 mb-1 border-b">
                                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                                <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                                    <Settings className="w-4 h-4 mr-2" /> Settings
                                </DropdownMenuItem>
                                {user?.role === 'admin' && (
                                    <DropdownMenuItem onClick={() => router.push('/settings/team')} className="cursor-pointer">
                                        <Users className="w-4 h-4 mr-2" /> Manage Team
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-8 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold mb-4">Welcome back, {user?.firstName}!</h1>
                    <p className="text-muted-foreground mb-8 text-center max-w-md">
                        Your AI-powered support triage dashboard is ready. Head over to the Ticket Inbox to start resolving customer requests.
                    </p>
                    <Button onClick={() => router.push('/tickets')} size="lg" className="h-12 px-8 text-base">
                        Open Ticket Inbox <Inbox className="w-5 h-5 ml-2" />
                    </Button>
                </main>
            </div>
        </AuthGuard>
    );
}
