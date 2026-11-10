import {
  User,
  MaterialListing,
  MaterialRequest,
  Conversation,
  Message,
  Order,
  Payment,
  ImpactSummary,
  Notification,
  MatchResult,
} from '../types';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('ecoloop_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include', // for cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  auth: {
    signup: (body: any) => fetchJson<{ message: string; token: string; user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
    login: (body: any) => fetchJson<{ message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
    logout: () => fetchJson<{ message: string }>('/auth/logout', { method: 'POST' }),
    me: () => fetchJson<{ user: User }>('/auth/me'),
  },

  profile: {
    getMe: () => fetchJson<{ profile: User }>('/profile/me'),
    updateMe: (body: any) => fetchJson<{ message: string; profile: User }>('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
    getPublic: (id: string) => fetchJson<{ profile: User }>(`/profile/public/${id}`),
  },

  materials: {
    getAll: (params: Record<string, any> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return fetchJson<{ listings: MaterialListing[]; total: number }>(`/materials${query}`);
    },
    getById: (id: string) => fetchJson<{ listing: MaterialListing; aiMatch: MatchResult | null; related: MaterialListing[] }>(`/materials/${id}`),
    getMyListings: () => fetchJson<{ listings: MaterialListing[] }>('/materials/seller/my-listings'),
    create: (body: any) => fetchJson<{ message: string; listing: MaterialListing }>('/materials', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
    update: (id: string, body: any) => fetchJson<{ message: string; listing: MaterialListing }>(`/materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
    delete: (id: string) => fetchJson<{ message: string }>(`/materials/${id}`, { method: 'DELETE' }),
  },

  matching: {
    getRecommendations: () => fetchJson<{ recommendations: MaterialListing[]; totalMatches: number; buyerContext: any }>('/matching/recommendations'),
    getMaterialMatch: (id: string) => fetchJson<{ match: MatchResult }>(`/matching/material/${id}`),
    getBuyersForListing: (listingId: string) => fetchJson<{ matchedBuyers: Array<{ buyer: User; aiMatch: MatchResult }> }>(`/matching/buyers-for-listing/${listingId}`),
  },

  requests: {
    create: (body: any) => fetchJson<{ message: string; request: MaterialRequest }>('/requests', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
    getSellerRequests: () => fetchJson<{ requests: MaterialRequest[] }>('/requests/seller'),
    getBuyerRequests: () => fetchJson<{ requests: MaterialRequest[] }>('/requests/buyer'),
    updateStatus: (id: string, body: { status: string; counterPrice?: number; counterNotes?: string }) =>
      fetchJson<{ message: string; request: MaterialRequest; order?: Order }>(`/requests/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
  },

  messages: {
    getConversations: () => fetchJson<{ conversations: Conversation[] }>('/messages/conversations'),
    getConversation: (id: string) => fetchJson<{ conversation: any; messages: Message[] }>(`/messages/conversation/${id}`),
    send: (body: { conversationId?: string; receiverId?: string; content: string; isNegotiation?: boolean; proposedPrice?: number }) =>
      fetchJson<{ message: Message }>('/messages/send', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  orders: {
    getAll: (params: { status?: string; role?: string } = {}) => {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.append('status', params.status);
      if (params.role) searchParams.append('role', params.role);
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return fetchJson<{ orders: Order[] }>(`/orders${query}`);
    },
    getById: (id: string) => fetchJson<{ order: Order }>(`/orders/${id}`),
    updateDeliveryStatus: (id: string, body: { deliveryStatus: string; trackingNotes?: string }) =>
      fetchJson<{ message: string; order: Order }>(`/orders/${id}/delivery-status`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
  },

  checkout: {
    getOrder: (orderId: string) => fetchJson<{ order: Order }>(`/checkout/${orderId}`),
    pay: (orderId: string, body: { paymentMethod: string; paymentDetails?: any }) =>
      fetchJson<{ message: string; payment: Payment; order: Order; impactRecord: any }>(`/checkout/${orderId}/pay`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  seller: {
    getDashboard: () => fetchJson<{
      kpis: { activeListings: number; pendingRequests: number; completedSales: number; totalRevenue: number };
      recentRequests: MaterialRequest[];
      myListings: MaterialListing[];
      recentOrders: Order[];
      analytics: {
        monthlySales: Array<{ month: string; revenue: number; orders: number }>;
        categoryBreakdown: Array<{ name: string; value: number }>;
      };
    }>('/seller/dashboard'),
  },

  impact: {
    getSummary: () => fetchJson<ImpactSummary>('/impact/summary'),
  },

  saved: {
    getSaved: () => fetchJson<{ savedListings: MaterialListing[] }>('/saved'),
    save: (listingId: string) => fetchJson<{ message: string; isSaved: boolean }>(`/saved/${listingId}`, { method: 'POST' }),
    unsave: (listingId: string) => fetchJson<{ message: string; isSaved: boolean }>(`/saved/${listingId}`, { method: 'DELETE' }),
  },

  notifications: {
    getAll: () => fetchJson<{ notifications: Notification[]; unreadCount: number }>('/notifications'),
    markRead: (id: string) => fetchJson<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => fetchJson<{ success: boolean }>('/notifications/mark-all-read', { method: 'PUT' }),
  },
};
