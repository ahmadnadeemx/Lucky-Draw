import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "./App";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/login" element={<Login />} />
    </Route>
  )
);

export default routes;
