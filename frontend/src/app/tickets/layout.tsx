'use client';

import AuthGuard from '@/components/auth-guard';
import { useAuthStore } from '@/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Inbox, Settings, Users, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function TicketsLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuthStore();
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/tickets', label: 'Inbox', icon: Inbox },
        ...(user?.role === 'admin' ? [
            { href: '/settings/team', label: 'Team', icon: Users },
            { href: '/settings', label: 'Settings', icon: Settings }
        ] : [])
    ];

    return (
        <AuthGuard>
            <div className="flex h-screen w-full bg-[#190F0B] text-[#F0ECE6]">
                {/* Sidebar */}
                <aside className="w-64 border-r border-[#64290C] flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-[#64290C]">
                        <span className="font-display font-bold text-xl text-[#F0ECE6]">Resolvo</span>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-[rgba(234,97,14,0.1)] text-[#EA610E]'
                                            : 'text-[#8a7060] hover:bg-[#1f1209] hover:text-[#F0ECE6]'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-[#64290C]">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#1f1209] transition-colors text-left">
                                    <Avatar className="h-9 w-9 bg-[#2C3647] border border-[#64290C]">
                                        <AvatarFallback className="bg-transparent text-[#EA610E] text-xs font-semibold">
                                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#F0ECE6] truncate">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-xs text-[#8a7060] truncate uppercase tracking-wider">
                                            {user?.orgName}
                                        </p>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-[#1f1209] border-[#64290C] text-[#F0ECE6]">
                                <DropdownMenuItem className="focus:bg-[#64290C] focus:text-[#F0ECE6] cursor-pointer" onClick={logout}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
