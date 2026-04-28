import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { AuthProvider } from "@/context/AuthContext";
import "./styles.css";
function LoadingFallback() {
  return <p>Loading...</p>;
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} fallbackElement={<LoadingFallback />} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
