import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import ClientDashboard from './pages/ClientDashboard';
import BrowseProjectsPage from './pages/BrowseProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import CreateProjectPage from './pages/CreateProjectPage';
import BrowseFreelancersPage from './pages/BrowseFreelancersPage';
import StudentProfilePage from './pages/StudentProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ManageServicesPage from './pages/ManageServicesPage';
import ManageProposalsPage from './pages/ManageProposalsPage';
import ContractsProgressPage from './pages/ContractsProgressPage';
import MessagesPage from './pages/MessagesPage';
import AiAssistantPage from './pages/AiAssistantPage';
import RecommendationsPage from './pages/RecommendationsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <SocketProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/projects" element={<BrowseProjectsPage />} />
                  <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                  <Route path="/freelancers" element={<BrowseFreelancersPage />} />
                  <Route path="/profile/:userId" element={<StudentProfilePage />} />
                  <Route path="/ai-assistant" element={<AiAssistantPage />} />
                  <Route path="/recommendations/:projectId" element={<RecommendationsPage />} />

                  {/* Student Protected routes */}
                  <Route path="/student/dashboard" element={
                    <RoleRoute allowedRoles={['ROLE_STUDENT']}>
                      <StudentDashboard />
                    </RoleRoute>
                  } />
                  <Route path="/student/proposals" element={
                    <RoleRoute allowedRoles={['ROLE_STUDENT']}>
                      <ManageProposalsPage />
                    </RoleRoute>
                  } />
                  <Route path="/student/services" element={
                    <RoleRoute allowedRoles={['ROLE_STUDENT']}>
                      <ManageServicesPage />
                    </RoleRoute>
                  } />
                  <Route path="/profile/edit" element={
                    <RoleRoute allowedRoles={['ROLE_STUDENT']}>
                      <EditProfilePage />
                    </RoleRoute>
                  } />

                  {/* Client Protected routes */}
                  <Route path="/client/dashboard" element={
                    <RoleRoute allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}>
                      <ClientDashboard />
                    </RoleRoute>
                  } />
                  <Route path="/projects/create" element={
                    <RoleRoute allowedRoles={['ROLE_CLIENT', 'ROLE_ADMIN']}>
                      <CreateProjectPage />
                    </RoleRoute>
                  } />

                  {/* Common Protected routes */}
                  <Route path="/contracts" element={
                    <ProtectedRoute>
                      <ContractsProgressPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <MessagesPage />
                    </ProtectedRoute>
                  } />

                  {/* Fallback 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </SocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
