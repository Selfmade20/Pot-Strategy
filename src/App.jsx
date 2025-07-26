import "./App.css";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dasboard from "./pages/Dasboard";
import Link from "./pages/Link";
import Redirect from "./pages/Redirect";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UrlProvider from "./context";

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
        element: <Auth />,
      },
      {
        path: "/dashboard",
        element: <Dasboard />,
      },
      {
        path: "/link/:id",
        element: <Link />,
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
