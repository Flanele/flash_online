import search from '../assets/search.svg';
import { useDispatch } from 'react-redux';
import { setTermSearch } from '../store/slices/filterTermSlice';

const Search: React.FC = () => {
    const dispatch = useDispatch();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value; 
        dispatch(setTermSearch(searchTerm));
    };

    return (
        <div className="relative flex items-center ml-14">
            <input
                type="text"
                className="flex-1 rounded-full bg-light py-2 pl-4 pr-48 font-main border-2 border-transparent focus:outline-none focus:ring-0 focus:border-hover-btn tansition ease"
                placeholder="Search..."
                onChange={handleSearch} 
            />
            <img
                src={search}
                alt="search"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
            />
        </div>
    );
};

export default Search;