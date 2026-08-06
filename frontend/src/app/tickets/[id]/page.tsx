'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, Loader2, Send, Wand2, Sparkles, User, Tag, Clock, Flag, AlertCircle, CheckCircle } from 'lucide-react';
import { Editor } from '@/components/ui/editor';
import { TicketStatus, TicketPriority } from '@repo/shared';

interface Message {
    id: string;
    body: string;
    isInternal: boolean;
    senderType: 'customer' | 'agent' | 'bot' | 'system';
    isAiGenerated: boolean;
    createdAt: string;
}

interface TicketDetail {
    id: string;
    subject: string;
    customerEmail: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: string;
    assignee?: { id: string; firstName: string; lastName: string } | null;
    messages: Message[];
    aiAnalysis?: {
        sentiment: string;
        priority: string;
        category: string;
        escalationFlag: boolean;
        confidenceScore: number;
        summary: string;
        urgency: string;
        language: string;
    } | null;
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();

    // States
    const [ticket, setTicket] = useState<TicketDetail | null>(null);
    const [inboxTickets, setInboxTickets] = useState<any[]>([]); // simplified for left rail
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    // Composer States
    const [replyBody, setReplyBody] = useState('');
    const [isInternalNote, setIsInternalNote] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch Ticket Data
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Fetch the specific ticket
                const ticketRes = await api.get(`/tickets/${params.id}`);
                setTicket(ticketRes.data.data.ticket);

                // Fetch latest open tickets for the mini inbox left rail
                const inboxRes = await api.get('/tickets?status=open&limit=15');
                setInboxTickets(inboxRes.data.data.tickets);
            } catch (err) {
                console.error("Failed to load ticket", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [params.id]);

    // Scroll to bottom on load
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [ticket?.messages]);

    const handleUpdateTicket = async (field: string, value: string) => {
        try {
            await api.patch(`/tickets/${params.id}`, { [field]: value });
            setTicket(prev => prev ? { ...prev, [field]: value } : prev);
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const handleSendMessage = async () => {
        if (!replyBody || replyBody === '<p></p>') return;
        setIsSending(true);
        try {
            const res = await api.post(`/tickets/${params.id}/messages`, {
                body: replyBody,
                isInternal: isInternalNote
            });
            // append message to local state
            setTicket(prev => prev ? {
                ...prev,
                messages: [...prev.messages, res.data.data.message]
            } : prev);
            setReplyBody(''); // clear
        } catch (err) {
            console.error("Failed to send message", err);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center bg-[#190F0B]"><Loader2 className="w-8 h-8 animate-spin text-[#EA610E]" /></div>;
    }

    if (!ticket) {
        return <div className="flex-1 flex items-center justify-center bg-[#190F0B] text-[#F0ECE6]">Ticket not found.</div>;
    }

    return (
        <div className="flex-1 flex h-full bg-[#190F0B] overflow-hidden">
            {/* Left Rail: Mini Inbox */}
            <div className="w-80 border-r border-[#64290C] flex flex-col shrink-0 bg-[#1f1209]">
                <div className="h-16 px-4 flex items-center border-b border-[#64290C] shrink-0 gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/tickets')} className="text-[#8a7060] hover:text-[#F0ECE6]">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold text-[#F0ECE6]">Queue</span>
                </div>
                <ScrollArea className="flex-1">
                    {inboxTickets.map(t => (
                        <div
                            key={t.id}
                            onClick={() => router.push(`/tickets/${t.id}`)}
                            className={`p-4 border-b border-[#64290C]/50 cursor-pointer transition-colors ${t.id === params.id ? 'bg-[#64290C]/30 border-l-2 border-l-[#EA610E]' : 'hover:bg-[#64290C]/10'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-sm font-medium text-[#F0ECE6] truncate pr-2">{t.subject}</span>
                                <span className="text-xs text-[#8a7060] shrink-0">{formatDistanceToNow(new Date(t.createdAt))}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-[#8a7060]">
                                <span>{t.customerEmail}</span>
                                {t.priority === 'urgent' && <AlertCircle className="w-3 h-3 text-red-500" />}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Center: Thread */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#190F0B]">
                {/* Ticket Header Toolbar */}
                <div className="h-[72px] px-6 border-b border-[#64290C] flex items-center justify-between shrink-0">
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-[#F0ECE6] truncate">{ticket.subject}</h2>
                            {ticket.aiAnalysis?.escalationFlag && (
                                <Badge variant="destructive" className="bg-red-900/40 text-red-400 border border-red-900/50">Escalated</Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#8a7060] mt-1">
                            <span>#{ticket.id.split('-')[0]}</span>
                            <span>•</span>
                            <span>Created {format(new Date(ticket.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                    </div>

                    {/* Action Selectors */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Select value={ticket.status as string} onValueChange={v => v && handleUpdateTicket('status', v as string)}>
                            <SelectTrigger className="w-[130px] h-9 bg-[#1f1209] border-[#64290C] text-[#F0ECE6]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1f1209] border-[#64290C] text-[#F0ECE6]">
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={ticket.priority as string} onValueChange={v => v && handleUpdateTicket('priority', v as string)}>
                            <SelectTrigger className="w-[120px] h-9 bg-[#1f1209] border-[#64290C] text-[#F0ECE6]">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1f1209] border-[#64290C] text-[#F0ECE6]">
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUpdateTicket('status', 'resolved')}
                            className="bg-[#EA610E] hover:bg-[#c9530c] text-white ml-2"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" /> Mark Resolved
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {ticket.messages.map((msg) => {
                        const isCustomer = msg.senderType === 'customer';
                        const isInternal = msg.isInternal;

                        return (
                            <div key={msg.id} className={`flex gap-4 max-w-[90%] ${isCustomer ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                                <Avatar className="h-10 w-10 border border-[#64290C] shrink-0">
                                    <AvatarFallback className={isCustomer ? 'bg-[#1f1209] text-[#8a7060]' : isInternal ? 'bg-yellow-900/40 text-yellow-500' : 'bg-[#64290C] text-[#F0ECE6]'}>
                                        {isCustomer ? <User className="w-5 h-5" /> : 'AG'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`flex flex-col gap-1 ${isCustomer ? 'items-start' : 'items-end'}`}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-[#8a7060]">
                                            {isCustomer ? ticket.customerEmail : isInternal ? 'Internal Note (Agent)' : 'Agent'}
                                        </span>
                                        <span className="text-[10px] text-[#5a4435]">{format(new Date(msg.createdAt), 'h:mm a')}</span>
                                    </div>
                                    <div
                                        className={`p-4 rounded-2xl text-sm whitespace-pre-wrap prose prose-sm max-w-none ${isCustomer
                                            ? 'bg-[#1f1209] text-[#F0ECE6] rounded-tl-sm border border-[#64290C]/50'
                                            : isInternal
                                                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-600/30 rounded-tr-sm'
                                                : 'bg-[#64290C]/40 text-[#F0ECE6] rounded-tr-sm border border-[#64290C]'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: msg.body }}
                                    />
                                    {msg.isAiGenerated && (
                                        <div className="flex items-center gap-1 text-[10px] text-[#EA610E] mt-1">
                                            <Sparkles className="w-3 h-3" /> AI Suggested
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Composer */}
                <div className="p-4 border-t border-[#64290C] bg-[#190F0B] shrink-0">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2 text-sm">
                            <Switch
                                checked={isInternalNote}
                                onCheckedChange={setIsInternalNote}
                                className="data-[state=checked]:bg-yellow-600"
                            />
                            <span className={isInternalNote ? 'text-yellow-500 font-medium' : 'text-[#8a7060]'}>
                                Internal Note
                            </span>
                        </div>
                        {/* Phase 2: AI Reply Button will go here */}
                        <Button variant="ghost" size="sm" className="text-[#EA610E] hover:text-[#EA610E] hover:bg-[#EA610E]/10 font-medium hidden">
                            <Wand2 className="w-4 h-4 mr-2" /> Generate Reply
                        </Button>
                    </div>

                    <Editor
                        value={replyBody}
                        onChange={setReplyBody}
                        isInternalMode={isInternalNote}
                        placeholder={isInternalNote ? "Write a private note to your team..." : "Type your reply to the customer..."}
                    />

                    <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-[#5a4435]">Tip: You can use markdown shortcuts (**, *, &gt;)</span>
                        <Button onClick={handleSendMessage} disabled={isSending} className="bg-[#EA610E] hover:bg-[#c9530c] text-white">
                            {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                            {isInternalNote ? 'Save Note' : 'Send Reply'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: AI Analysis & Context */}
            <div className="w-72 border-l border-[#64290C] bg-[#1f1209] shrink-0 flex flex-col">
                <div className="h-16 px-4 flex items-center justify-between border-b border-[#64290C] shrink-0">
                    <span className="font-semibold text-[#F0ECE6]">Context</span>
                </div>

                <ScrollArea className="flex-1 p-4">
                    {/* User Info Block */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-[#8a7060] uppercase tracking-wider mb-3">Customer</h3>
                        <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-9 w-9 border border-[#64290C] bg-[#190F0B]">
                                <AvatarFallback className="text-[#8a7060]"><User className="w-4 h-4" /></AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-[#F0ECE6] truncate">{ticket.customerEmail.split('@')[0]}</p>
                                <p className="text-xs text-[#8a7060] truncate">{ticket.customerEmail}</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-[#64290C]/50 my-6" />

                    {/* AI Analysis Block */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-[#EA610E]" />
                            <h3 className="text-xs font-semibold text-[#8a7060] uppercase tracking-wider">Resolvo AI Analysis</h3>
                        </div>

                        {ticket.aiAnalysis ? (
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs text-[#5a4435] block mb-1">Intent & Category</span>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="border-[#64290C] text-[#F0ECE6] bg-[#190F0B]">{ticket.aiAnalysis.category}</Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#190F0B] p-2.5 rounded-lg border border-[#64290C]">
                                        <span className="text-[10px] text-[#8a7060] flex items-center justify-center gap-1 mb-1"><Tag className="w-3 h-3" /> Sentiment</span>
                                        <p className="text-sm font-medium text-center text-[#F0ECE6] capitalize">{ticket.aiAnalysis.sentiment}</p>
                                    </div>
                                    <div className="bg-[#190F0B] p-2.5 rounded-lg border border-[#64290C]">
                                        <span className="text-[10px] text-[#8a7060] flex items-center justify-center gap-1 mb-1"><Clock className="w-3 h-3" /> Urgency</span>
                                        <p className="text-sm font-medium text-center text-[#F0ECE6] capitalize">{ticket.aiAnalysis.urgency}</p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs text-[#5a4435] block mb-1">Summary</span>
                                    <p className="text-sm text-[#F0ECE6] leading-relaxed bg-[#190F0B] p-3 rounded-lg border border-[#64290C]">
                                        {ticket.aiAnalysis.summary}
                                    </p>
                                </div>

                                {ticket.aiAnalysis.confidenceScore > 0 && (
                                    <div>
                                        <div className="flex justify-between text-[10px] text-[#8a7060] mb-1">
                                            <span>AI Confidence</span>
                                            <span>{ticket.aiAnalysis.confidenceScore}%</span>
                                        </div>
                                        <div className="w-full bg-[#190F0B] rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-[#EA610E] h-1.5 rounded-full"
                                                style={{ width: `${ticket.aiAnalysis.confidenceScore}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6 border border-dashed border-[#64290C] rounded-lg">
                                <p className="text-xs text-[#8a7060]">AI Analysis Pending...</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
