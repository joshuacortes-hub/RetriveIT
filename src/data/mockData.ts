import { Item, User, Conversation, ChatMessage, AppNotification } from '../types';

// Clean initial state with no dummy accounts or pre-seeded items
export const initialCurrentUser: User | null = null;

export const initialItems: Item[] = [];

export const initialConversations: Conversation[] = [];

export const initialMessages: Record<string, ChatMessage[]> = {};

export const initialNotifications: AppNotification[] = [];
