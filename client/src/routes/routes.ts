import HomePage from "../pages/HomePage";
import { HOME_ROUTE } from "../utils/consts";

interface iRoute {
    path: string,
    Component: React.FC
};

export const publicRoutes: iRoute[] = [
    {
        path: HOME_ROUTE,
        Component: HomePage 
    },
 
];