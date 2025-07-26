import "./App.css";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dasboard from "./pages/Dasboard";
import Link from "./pages/Link";
import Redirect from "./pages/Redirect";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UrlProvider from "./context";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/auth",
        element: (
          <PublicRoute>
            <Auth />
          </PublicRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dasboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/link/:id",
        element: (
          <ProtectedRoute>
            <Link />
          </ProtectedRoute>
        ),
      },
      {
        path: "/:id",
        element: <Redirect />,
      },
    ],
  },
]);

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;
