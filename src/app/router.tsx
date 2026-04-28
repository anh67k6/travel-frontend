import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/login",
    lazy: async () => {
      const { LoginPage } = await import("../pages/LoginPage");
      return { Component: LoginPage };
    },
  },
  {
    path: "/register",
    lazy: async () => {
      const { RegisterPage } = await import("../pages/RegisterPage");
      return { Component: RegisterPage };
    },
  },
  {
    path: "/",
    lazy: async () => {
      const { TripListPage } = await import("../pages/TripListPage");
      return { Component: TripListPage };
    },
  },
  {
    path: "/trips/:tripId",
    lazy: async () => {
      const { TripDetailPage } = await import("../pages/TripDetailPage");
      return { Component: TripDetailPage };
    },
  },
]);
