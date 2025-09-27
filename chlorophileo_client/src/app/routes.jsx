import { Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import PrivateRoute from "../auth/PrivateRoute";
import Home from "../pages/home/Home";
import Register from "../pages/register/Register";
import NotFound from "../pages/not_found/NotFound";
import UserHome from "../components/user/UserHome";
import PlantDetails from "../pages/details/PlantDetails";
import Statistics from "../pages/stats/Statistics";

export const routes = [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    {
        path: "/",
        element: <PrivateRoute>
            <Home />
        </PrivateRoute>,
        children: [
            {
                path: '',
                element: <UserHome />
            },
            {
                path: 'details/:id',
                element: <PlantDetails />
            },
            {
                path: '/stats',
                element: <Statistics />
            }
        ]
    },
    { path: "/not-found", element: <NotFound /> },
    { path: "*", element: <Navigate to="/not-found" replace={false} /> }
]
