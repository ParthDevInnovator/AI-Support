'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, MessageSquare, Plus, Archive, CheckCircle } from 'lucide-react';
import { TicketStatus, TicketPriority, TicketSource } from '@repo/shared';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

interface Ticket {
    id: string;
    subject: string;
    customerEmail: string;
    status: TicketStatus;
    priority: TicketPriority;
    source: TicketSource;
    createdAt: string;
    assignee?: { id: string; firstName: string; lastName: string } | null;
    aiAnalysis?: { sentiment: string; priority: string; category: string; escalationFlag: boolean } | null;
}

export default function TicketsInboxPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Filters
    const [status, setStatus] = useState<string>(searchParams.get('status') || 'all');
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (status && status !== 'all') params.set('status', status);
            if (search) params.set('search', search);
            params.set('page', page.toString());

            const res = await api.get(`/tickets?${params.toString()}`);
            setTickets(res.data.data.tickets);
            setTotal(res.data.data.pagination.total);

            // Sync URL
            router.replace(`/tickets?${params.toString()}`, { scroll: false });
        } catch (err) {
            console.error('Failed to fetch tickets', err);
        } finally {
            setIsLoading(false);
        }
    }, [status, search, page, router]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTickets();
        }, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [fetchTickets]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(tickets.map(t => t.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSet = new Set(selectedIds);
        if (checked) newSet.add(id);
        else newSet.delete(id);
        setSelectedIds(newSet);
    };

    const handleBulkAction = async (action: 'resolve' | 'close') => {
        if (selectedIds.size === 0) return;
        try {
            await api.patch('/tickets/bulk', {
                ticketIds: Array.from(selectedIds),
                action
            });
            setSelectedIds(new Set());
            fetchTickets();
        } catch (err) {
            console.error('Bulk action failed', err);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#190F0B]">
            {/* Header Toolbar */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#64290C] shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold text-[#F0ECE6]">Inbox</h1>
                    <Tabs value={status} onValueChange={(v) => { setStatus(v); setPage(1); }} className="ml-4">
                        <TabsList className="bg-[#1f1209] border border-[#64290C]">
                            <TabsTrigger value="all" className="data-[state=active]:bg-[#64290C] data-[state=active]:text-[#F0ECE6] text-[#8a7060]">All</TabsTrigger>
                            <TabsTrigger value="open" className="data-[state=active]:bg-[#64290C] data-[state=active]:text-[#F0ECE6] text-[#8a7060]">Open</TabsTrigger>
                            <TabsTrigger value="in_progress" className="data-[state=active]:bg-[#64290C] data-[state=active]:text-[#F0ECE6] text-[#8a7060]">In Progress</TabsTrigger>
                            <TabsTrigger value="resolved" className="data-[state=active]:bg-[#64290C] data-[state=active]:text-[#F0ECE6] text-[#8a7060]">Resolved</TabsTrigger>
                            <TabsTrigger value="closed" className="data-[state=active]:bg-[#64290C] data-[state=active]:text-[#F0ECE6] text-[#8a7060]">Closed</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7060]" />
                        <Input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search tickets..."
                            className="w-64 pl-9 bg-[#1f1209] border-[#64290C] text-[#F0ECE6] placeholder:text-[#5a4435] focus-visible:ring-[#EA610E]"
                        />
                    </div>
                    {/* Bulk Actions */}
                    {selectedIds.size > 0 && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                            <span className="text-sm text-[#8a7060] font-medium mr-2">{selectedIds.size} selected</span>
                            <Button variant="outline" size="sm" onClick={() => handleBulkAction('resolve')} className="border-[#64290C] text-[#F0ECE6] hover:bg-[#1f1209]">
                                <CheckCircle className="w-4 h-4 mr-2" /> Resolve
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleBulkAction('close')} className="border-[#64290C] text-[#F0ECE6] hover:bg-[#1f1209]">
                                <Archive className="w-4 h-4 mr-2" /> Close
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#190F0B] z-10 border-b border-[#64290C]">
                        <tr>
                            <th className="px-6 py-4 w-12">
                                <Checkbox
                                    checked={tickets.length > 0 && selectedIds.size === tickets.length}
                                    onCheckedChange={handleSelectAll}
                                    className="border-[#8a7060] data-[state=checked]:bg-[#EA610E] data-[state=checked]:border-[#EA610E]"
                                />
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-[#8a7060] uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-4 text-xs font-semibold text-[#8a7060] uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-xs font-semibold text-[#8a7060] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-[#8a7060] uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-4 text-xs font-semibold text-[#8a7060] uppercase tracking-wider">Assignee</th>
                            <th className="px-6 py-4 text-xs font-semibold text-[#8a7060] uppercase tracking-wider text-right">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#64290C]/50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="h-64 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#EA610E]" />
                                </td>
                            </tr>
                        ) : tickets.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-[#8a7060]">
                                        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                                        <p className="text-lg font-medium text-[#F0ECE6]">No tickets found</p>
                                        <p className="text-sm">We couldn't find any tickets matching your criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            tickets.map(ticket => (
                                <tr
                                    key={ticket.id}
                                    className="group hover:bg-[#1f1209] transition-colors cursor-pointer"
                                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                                >
                                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selectedIds.has(ticket.id)}
                                            onCheckedChange={(c) => handleSelectRow(ticket.id, !!c)}
                                            className="border-[#8a7060] data-[state=checked]:bg-[#EA610E] data-[state=checked]:border-[#EA610E]"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-[#F0ECE6]">{ticket.subject}</span>
                                            {ticket.aiAnalysis?.category && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-[#8a7060]">{ticket.aiAnalysis.category}</span>
                                                    {ticket.aiAnalysis.escalationFlag && (
                                                        <Badge variant="destructive" className="h-4 text-[10px] px-1 bg-red-900/40 text-red-400 border border-red-900/50">Escalated</Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#8a7060]">{ticket.customerEmail}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={`
                                            ${ticket.status === 'open' ? 'border-[#EA610E] text-[#EA610E] bg-[rgba(234,97,14,0.1)]' : ''}
                                            ${ticket.status === 'in_progress' ? 'border-blue-500 text-blue-500 bg-blue-500/10' : ''}
                                            ${ticket.status === 'resolved' ? 'border-green-500 text-green-500 bg-green-500/10' : ''}
                                            ${ticket.status === 'closed' ? 'border-gray-500 text-gray-400 bg-gray-500/10' : ''}
                                        `}>
                                            {ticket.status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${ticket.priority === 'urgent' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                                    ticket.priority === 'high' ? 'bg-orange-500' :
                                                        ticket.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                                                }`} />
                                            <span className="text-sm text-[#F0ECE6] capitalize">{ticket.priority}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {ticket.assignee ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#64290C] text-[#F0ECE6] flex items-center justify-center text-[10px] font-bold">
                                                    {ticket.assignee.firstName[0]}{ticket.assignee.lastName[0]}
                                                </div>
                                                <span className="text-sm text-[#F0ECE6]">{ticket.assignee.firstName} {ticket.assignee.lastName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-[#8a7060] italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#8a7060] text-right whitespace-nowrap">
                                        {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {total > 0 && (
                <div className="h-14 border-t border-[#64290C] px-6 flex items-center justify-between shrink-0">
                    <span className="text-sm text-[#8a7060]">
                        Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} tickets
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="border-[#64290C] text-[#F0ECE6] hover:bg-[#1f1209]"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={page * 20 >= total}
                            className="border-[#64290C] text-[#F0ECE6] hover:bg-[#1f1209]"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
