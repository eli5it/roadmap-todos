import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./layouts/MainLayout.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import RegisterPage from "./pages/Register.tsx";
import LoginPage from "./pages/Login.tsx";
import TodosPage from "./pages/Todos.tsx";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route element={<AuthLayout />}>
              <Route path="" element={<TodosPage />} />
            </Route>
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
