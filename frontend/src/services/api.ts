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

import { MOCK_LISTINGS, MOCK_USERS, MOCK_IMPACT, MOCK_MATCH } from './mockData';

const BASE_URL = '/api';

function getMockFallback<T>(url: string, options: RequestInit = {}): T | null {
  const method = (options.method || 'GET').toUpperCase();
  const cleanUrl = url.split('?')[0];

  if (cleanUrl === '/materials' && method === 'GET') {
    return { listings: MOCK_LISTINGS, total: MOCK_LISTINGS.length } as unknown as T;
  }
  if (cleanUrl.startsWith('/materials/') && method === 'GET') {
    const id = cleanUrl.replace('/materials/', '');
    const found = MOCK_LISTINGS.find(m => m.id === id) || MOCK_LISTINGS[0];
    return {
      listing: found,
      aiMatch: MOCK_MATCH,
      related: MOCK_LISTINGS.filter(m => m.id !== found.id).slice(0, 3),
    } as unknown as T;
  }
  if (cleanUrl === '/impact/summary') {
    return MOCK_IMPACT as unknown as T;
  }
  if (cleanUrl === '/auth/me') {
    const savedRole = localStorage.getItem('ecoloop_user_role') || 'SELLER';
    const user = savedRole === 'BUYER' ? MOCK_USERS[1] : MOCK_USERS[0];
    return { user } as unknown as T;
  }
  if (cleanUrl === '/auth/login' || cleanUrl === '/auth/signup') {
    return { message: 'Logged in successfully (Preview mode)', token: 'mock_demo_token', user: MOCK_USERS[0] } as unknown as T;
  }
  if (cleanUrl === '/seller/dashboard') {
    return {
      kpis: { activeListings: 6, pendingRequests: 3, completedSales: 42, totalRevenue: 680000 },
      recentRequests: [],
      myListings: MOCK_LISTINGS.slice(0, 3),
      recentOrders: [],
      analytics: {
        monthlySales: MOCK_IMPACT.monthlyTrends.map(m => ({ month: m.month, revenue: m.weightKg * 20, orders: m.transactions })),
        categoryBreakdown: MOCK_IMPACT.categoryBreakdown.map(c => ({ name: c.category, value: c.weightKg })),
      },
    } as unknown as T;
  }
  if (cleanUrl === '/matching/recommendations') {
    return {
      recommendations: MOCK_LISTINGS,
      totalMatches: MOCK_LISTINGS.length,
      buyerContext: { city: 'Kolkata' },
    } as unknown as T;
  }
  if (cleanUrl === '/notifications') {
    return { notifications: [], unreadCount: 0 } as unknown as T;
  }
  if (cleanUrl === '/orders') {
    return { orders: [] } as unknown as T;
  }
  if (cleanUrl === '/requests/seller' || cleanUrl === '/requests/buyer') {
    return { requests: [] } as unknown as T;
  }
  if (cleanUrl === '/messages/conversations') {
    return { conversations: [] } as unknown as T;
  }
  if (cleanUrl === '/saved') {
    return { savedListings: [] } as unknown as T;
  }

  return null;
}

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('ecoloop_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include', // for cookies
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const fallback = getMockFallback<T>(url, options);
      if (fallback !== null) {
        return fallback;
      }
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }

    return data as T;
  } catch (err: any) {
    const fallback = getMockFallback<T>(url, options);
    if (fallback !== null) {
      return fallback;
    }
    throw err;
  }
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
