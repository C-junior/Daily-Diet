import {
  DietFilterStatus,
  Meal,
  MealPayload,
  User,
  UserMetrics,
} from '../types/domain';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const TOKEN_STORAGE_KEY = '@dailydiet:token';
export const USER_STORAGE_KEY = '@dailydiet:user';

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function httpRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token && !path.startsWith('/sessions')) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      window.dispatchEvent(new Event('dailydiet:unauthorized'));
    }
    throw new ApiError(
      data?.message || 'Não foi possível concluir a operação. Tente novamente.',
      response.status,
    );
  }

  return data as T;
}

export const api = {
  auth: {
    register(payload: { name: string; email: string; password: string; dietGoal?: number }) {
      return httpRequest<{ user: User; token: string }>('/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    login(payload: { email: string; password: string }) {
      return httpRequest<{ user: User; token: string }>('/sessions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    loginDemo() {
      return httpRequest<{ user: User; token: string }>('/sessions/demo', {
        method: 'POST',
      });
    },
    logout() {
      return httpRequest<void>('/sessions', { method: 'DELETE' });
    },
    me() {
      return httpRequest<{ user: User }>('/users/me');
    },
    updateProfile(payload: { name?: string; dietGoal?: number }) {
      return httpRequest<{ user: User }>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
  },
  meals: {
    list(params?: { search?: string; status?: DietFilterStatus; date?: string }) {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
      if (params?.date) searchParams.set('date', params.date);
      const qs = searchParams.toString();
      return httpRequest<{ meals: Meal[] }>(`/meals${qs ? `?${qs}` : ''}`);
    },
    getById(id: string) {
      return httpRequest<{ meal: Meal }>(`/meals/${id}`);
    },
    create(payload: MealPayload) {
      return httpRequest<{ meal: Meal }>('/meals', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    update(id: string, payload: MealPayload) {
      return httpRequest<{ meal: Meal }>(`/meals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
    delete(id: string) {
      return httpRequest<void>(`/meals/${id}`, {
        method: 'DELETE',
      });
    },
    metrics() {
      return httpRequest<{ metrics: UserMetrics }>('/meals/metrics');
    },
  },
};
