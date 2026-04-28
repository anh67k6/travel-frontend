import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/login",
    lazy: async () => {
      const { LoginPage } = await import("../components/LoginPage");
      return { Component: LoginPage };
    },
  },
  {
    path: "/register",
    lazy: async () => {
      const { RegisterPage } = await import("../components/RegisterPage");
      return { Component: RegisterPage };
    },
  },
  {
    path: "/",
    lazy: async () => {
      const { TripListPage } = await import("../components/TripListPage");
      return { Component: TripListPage };
    },
  },
  {
    path: "/trips/:tripId",
    lazy: async () => {
      const { TripDetailPage } = await import("../components/TripDetailPage");
      return { Component: TripDetailPage };
    },
  },
]);
