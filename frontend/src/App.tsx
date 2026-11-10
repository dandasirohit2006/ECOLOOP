import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DemoSwitcher } from './components/DemoSwitcher';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { MaterialDetailPage } from './pages/MaterialDetailPage';
import { ListWastePage } from './pages/ListWastePage';
import { RequestMaterialPage } from './pages/RequestMaterialPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { SellerRequestsPage } from './pages/SellerRequestsPage';
import { MessagingPage } from './pages/MessagingPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ImpactDashboardPage } from './pages/ImpactDashboardPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/materials/:id" element={<MaterialDetailPage />} />
                <Route path="/impact" element={<ImpactDashboardPage />} />

                {/* Protected Routes */}
                <Route
                  path="/list-waste"
                  element={
                    <ProtectedRoute>
                      <ListWastePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/request/:id"
                  element={
                    <ProtectedRoute>
                      <RequestMaterialPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/dashboard"
                  element={
                    <ProtectedRoute>
                      <SellerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/requests"
                  element={
                    <ProtectedRoute>
                      <SellerRequestsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <MessagingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout/:id"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <DemoSwitcher />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
