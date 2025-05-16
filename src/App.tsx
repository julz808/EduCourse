import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Diagnostic from "./pages/Diagnostic";
import Drill from "./pages/Drill";
import PracticeTests from "./pages/MockTests"; // We'll keep the file name but change the component name
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import CourseDetail from "./pages/CourseDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./context/UserContext";
import { TestTypeProvider } from "./context/TestTypeContext";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <UserProvider>
              <TestTypeProvider>
                <ProductProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/course/:slug" element={<CourseDetail />} />
                      <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Layout />}>
                          <Route index element={<Dashboard />} />
                          <Route path="diagnostic" element={<Diagnostic />} />
                          <Route path="drill" element={<Drill />} />
                          <Route path="practice-tests" element={<PracticeTests />} />
                          <Route path="insights" element={<Insights />} />
                        </Route>
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </ProductProvider>
              </TestTypeProvider>
            </UserProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
