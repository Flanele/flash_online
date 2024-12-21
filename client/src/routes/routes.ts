import FavoritePage from "../pages/FavoritePage";
import HomePage from "../pages/HomePage";
import { FAVORITE_ROUTE, HOME_ROUTE } from "../utils/consts";

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

export const authRoutes: iRoute[] = [
    {
        path: FAVORITE_ROUTE,
        Component: FavoritePage
    }
];