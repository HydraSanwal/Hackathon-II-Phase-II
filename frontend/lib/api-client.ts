// API client for task operations
// Connects to the backend API

class ApiError extends Error {
  public statusCode: number;
  public error_code?: string;

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error_code = errorCode;
  }
}

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

// Base API class
class BaseApi {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    const token = getAuthToken();
    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || 'Request failed',
        response.status,
        errorData.error_code
      );
    }

    return response.json();
  }
}

// Task API class
class TaskApi extends BaseApi {
  async getTasks(params?: {
    is_completed?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ items: any[]; total: number; limit: number; offset: number }> {
    const queryParams = new URLSearchParams();
    if (params?.is_completed !== undefined) {
      queryParams.append('is_completed', String(params.is_completed));
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', String(params.limit));
    }
    if (params?.offset !== undefined) {
      queryParams.append('offset', String(params.offset));
    }

    const queryString = queryParams.toString();
    const endpoint = `/api/v1/tasks${queryString ? '?' + queryString : ''}`;

    return this.request(endpoint);
  }

  async getTask(id: number): Promise<any> {
    return this.request(`/api/v1/tasks/${id}`);
  }

  async createTask(data: { title: string; description?: string }): Promise<any> {
    return this.request('/api/v1/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: number, data: { title?: string; description?: string }): Promise<any> {
    return this.request(`/api/v1/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patchTask(id: number, data: Partial<{ title?: string; description?: string; is_completed?: boolean }>): Promise<any> {
    return this.request(`/api/v1/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.request(`/api/v1/tasks/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instances
export const taskApi = new TaskApi();
export { ApiError };