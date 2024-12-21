import { useSelector } from "react-redux";
import GameList from "../components/GameList";
import { RootState } from "../store/store";
import { useFetchGamesQuery } from "../store/services/api";

const HomePage: React.FC = () => {
    const selectedGenre = useSelector((state: RootState) => state.filterGenre.genreId);
    const searchTerm = useSelector((state: RootState) => state.filterTerm.searchTerm);
    const menuOpen = useSelector((state: RootState) => state.menu.menuOpen);

    const { data: games, error, isLoading } = useFetchGamesQuery({
        genreId: selectedGenre || null,
        searchTerm: searchTerm || null,
    });

    return <GameList games={games} isLoading={isLoading} error={error} menuOpen={menuOpen} />;
};

export default HomePage;