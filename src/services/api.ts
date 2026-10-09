import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('aau_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('aau_admin_token', data.token);
      localStorage.setItem('aau_user_data', JSON.stringify(data.user));
    }
    return data;
  },
  register: async (memberData: {
    name: string;
    email: string;
    password: string;
    department?: string;
    studentId?: string;
    phone?: string;
    bio?: string;
  }) => {
    const { data } = await apiClient.post('/auth/register', memberData);
    return data;
  },
  getMe: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
  getMembers: async (status?: string) => {
    const { data } = await apiClient.get('/auth/members', {
      params: status ? { status } : {},
    });
    return data;
  },
  verifyMember: async (id: string, payload: { status: string; verificationNotes?: string }) => {
    const { data } = await apiClient.patch(`/auth/members/${id}/verify`, payload);
    return data;
  },
  deleteMember: async (id: string) => {
    const { data } = await apiClient.delete(`/auth/members/${id}`);
    return data;
  },
  logout: () => {
    localStorage.removeItem('aau_admin_token');
    localStorage.removeItem('aau_user_data');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('aau_user_data');
    return userStr ? JSON.parse(userStr) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('aau_admin_token');
  },
};

// Site Content API (Homepage sections)
export const contentApi = {
  get: async () => {
    const { data } = await apiClient.get('/content');
    return data;
  },
  update: async (updatedContent: any) => {
    const { data } = await apiClient.put('/content', updatedContent);
    return data;
  },
};

// Projects API
export const projectsApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/projects');
    return data;
  },
  getOne: async (id: string) => {
    const { data } = await apiClient.get(`/projects/${id}`);
    return data;
  },
  create: async (projectData: any) => {
    const { data } = await apiClient.post('/projects', projectData);
    return data;
  },
  update: async (id: string, projectData: any) => {
    const { data } = await apiClient.put(`/projects/${id}`, projectData);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/projects/${id}`);
    return data;
  },
};

// Team Members API
export const teamApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/team');
    return data;
  },
  create: async (memberData: any) => {
    const { data } = await apiClient.post('/team', memberData);
    return data;
  },
  update: async (id: string, memberData: any) => {
    const { data } = await apiClient.put(`/team/${id}`, memberData);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/team/${id}`);
    return data;
  },
};

// News & Blogs API
export const newsApi = {
  getAllPublic: async (category?: string) => {
    const { data } = await apiClient.get('/news', {
      params: category ? { category } : {},
    });
    return data;
  },
  getAllAdmin: async () => {
    const { data } = await apiClient.get('/news/admin/all');
    return data;
  },
  getOne: async (idOrSlug: string) => {
    const { data } = await apiClient.get(`/news/${idOrSlug}`);
    return data;
  },
  create: async (articleData: any) => {
    const { data } = await apiClient.post('/news', articleData);
    return data;
  },
  update: async (id: string, articleData: any) => {
    const { data } = await apiClient.put(`/news/${id}`, articleData);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/news/${id}`);
    return data;
  },
};

// Contact Form API
export const contactApi = {
  send: async (messageData: { name: string; email: string; subject?: string; message: string }) => {
    const { data } = await apiClient.post('/contact', messageData);
    return data;
  },
  getAll: async () => {
    const { data } = await apiClient.get('/contact');
    return data;
  },
  updateStatus: async (id: string, payload: { status?: string; notes?: string }) => {
    const { data } = await apiClient.patch(`/contact/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/contact/${id}`);
    return data;
  },
};

// Upload API
export const uploadApi = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  uploadMultiple: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    const { data } = await apiClient.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

// Student Proposals API
export const proposalApi = {
  submit: async (proposalData: any) => {
    const { data } = await apiClient.post('/proposals', proposalData);
    return data;
  },
  getAllAdmin: async () => {
    const { data } = await apiClient.get('/proposals');
    return data;
  },
  getMyProposals: async (email?: string) => {
    const { data } = await apiClient.get('/proposals/my', {
      params: email ? { email } : {},
    });
    return data;
  },
  revise: async (id: string, revisionData: any) => {
    const { data } = await apiClient.patch(`/proposals/${id}/revise`, revisionData);
    return data;
  },
  updateStatus: async (id: string, payload: { status: string; adminFeedback?: string }) => {
    const { data } = await apiClient.patch(`/proposals/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/proposals/${id}`);
    return data;
  },
};
