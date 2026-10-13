import axiosClient from './axiosClient';

export const authApi = {
  login: (data) => axiosClient.post('/api/auth/login', data),
  register: (data) => axiosClient.post('/api/auth/register', data),
  getMe: () => axiosClient.get('/api/auth/me'),
};

export const userApi = {
  getById: (id) => axiosClient.get(`/api/users/${id}`),
  updateProfile: (data) => axiosClient.put('/api/users/profile', data),
  changePassword: (data) => axiosClient.put('/api/users/change-password', data),
};

export const projectApi = {
  searchProjects: (params) => axiosClient.get('/api/projects', { params }),
  getById: (id) => axiosClient.get(`/api/projects/${id}`),
  getMyProjects: () => axiosClient.get('/api/projects/client/me'),
  createProject: (data) => axiosClient.post('/api/projects', data),
  updateProject: (id, data) => axiosClient.put(`/api/projects/${id}`, data),
  updateStatus: (id, status) => axiosClient.patch(`/api/projects/${id}/status`, { status }),
};

export const proposalApi = {
  submitProposal: (data) => axiosClient.post('/api/proposals', data),
  getForProject: (projectId) => axiosClient.get(`/api/proposals/project/${projectId}`),
  getMyStudentProposals: () => axiosClient.get('/api/proposals/student/me'),
  acceptProposal: (id) => axiosClient.post(`/api/proposals/${id}/accept`),
  rejectProposal: (id) => axiosClient.post(`/api/proposals/${id}/reject`),
};

export const profileApi = {
  searchFreelancers: (params) => axiosClient.get('/api/profiles/freelancers', { params }),
  getByUserId: (userId) => axiosClient.get(`/api/profiles/user/${userId}`),
  getMyProfile: () => axiosClient.get('/api/profiles/me'),
  updateMyProfile: (data) => axiosClient.put('/api/profiles/me', data),
  addPortfolio: (data) => axiosClient.post('/api/profiles/portfolio', data),
  deletePortfolio: (id) => axiosClient.delete(`/api/profiles/portfolio/${id}`),
};

export const serviceApi = {
  searchServices: (params) => axiosClient.get('/api/services', { params }),
  getById: (id) => axiosClient.get(`/api/services/${id}`),
  getByStudent: (studentId) => axiosClient.get(`/api/services/student/${studentId}`),
  createService: (data) => axiosClient.post('/api/services', data),
  updateService: (id, data) => axiosClient.put(`/api/services/${id}`, data),
  deleteService: (id) => axiosClient.delete(`/api/services/${id}`),
};

export const contractApi = {
  getMyContracts: () => axiosClient.get('/api/contracts'),
  getById: (id) => axiosClient.get(`/api/contracts/${id}`),
  updateStatus: (id, status) => axiosClient.patch(`/api/contracts/${id}/status`, { status }),
  addMilestone: (contractId, data) => axiosClient.post(`/api/contracts/${contractId}/milestones`, data),
  updateMilestoneStatus: (milestoneId, status) => axiosClient.patch(`/api/contracts/milestones/${milestoneId}/status`, { status }),
};

export const reviewApi = {
  createReview: (data) => axiosClient.post('/api/reviews', data),
  getForUser: (userId) => axiosClient.get(`/api/reviews/user/${userId}`),
  getForContract: (contractId) => axiosClient.get(`/api/reviews/contract/${contractId}`),
};

export const messageApi = {
  getConversations: () => axiosClient.get('/api/messages/conversations'),
  getMessages: (otherUserId) => axiosClient.get(`/api/messages/user/${otherUserId}`),
  sendMessage: (data) => axiosClient.post('/api/messages', data),
  getUnreadCount: () => axiosClient.get('/api/messages/unread-count'),
};

export const notificationApi = {
  getAll: () => axiosClient.get('/api/notifications'),
  getUnreadCount: () => axiosClient.get('/api/notifications/unread-count'),
  markAsRead: (id) => axiosClient.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => axiosClient.patch('/api/notifications/read-all'),
};

export const recommendationApi = {
  getForProject: (projectId) => axiosClient.get(`/api/recommendations/project/${projectId}`),
};

export const aiApi = {
  chat: (data) => axiosClient.post('/api/ai/chat', data),
};
