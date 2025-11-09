import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Root from "./Root";
import Register from "./Register";
import Signin from "./Signin";
import Menu from "./Menu";
import Order from "./Order";
import Contactus from "./Contactus";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/signin", element: <Signin /> },
      { path: "/products", element: <Menu /> },
      { path: "/order", element: <Order /> },
      { path: "/contactus", element: <Contactus /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
