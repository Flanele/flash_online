import { useSelector } from "react-redux";
import GameList from "../components/GameList";
import { useFetchFavoritesQuery } from "../store/services/favoriteApi";
import { RootState } from "../store/store";

const FavoritePage: React.FC = () => {
    const { data: favorites, error, isLoading } = useFetchFavoritesQuery();
    const menuOpen = useSelector((state: RootState) => state.menu.menuOpen);

    const favoriteGames = favorites?.map((item) => item.game);

    return <GameList games={favoriteGames} isLoading={isLoading} error={error} menuOpen={menuOpen} />;
};

export default FavoritePage;