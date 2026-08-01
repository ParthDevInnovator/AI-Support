// Shared enum types used across frontend and backend

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    USER = 'user',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    INVITED = 'invited',
}

export enum TicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    WAITING_FOR_CUSTOMER = 'waiting_for_customer',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

export enum TicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

export enum TicketSource {
    MANUAL = 'manual',
    GMAIL = 'gmail',
    ZENDESK = 'zendesk',
    API = 'api',
}

export enum SenderType {
    CUSTOMER = 'customer',
    AGENT = 'agent',
    AI = 'ai',
    SYSTEM = 'system',
}

export enum TicketSentiment {
    POSITIVE = 'positive',
    NEUTRAL = 'neutral',
    NEGATIVE = 'negative',
    FRUSTRATED = 'frustrated',
    ANGRY = 'angry',
    HAPPY = 'happy',
}

export enum ReplyTone {
    PROFESSIONAL = 'professional',
    EMPATHETIC = 'empathetic',
    CONCISE = 'concise',
}

export enum OrgPlan {
    FREE = 'free',
    STARTER = 'starter',
    PRO = 'pro',
    ENTERPRISE = 'enterprise',
}

export enum OrgStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
}
