import {useState, useCallback} from 'react';
import {Search} from 'lucide-react';
import {debounce} from '../utils/utils'

export const SearchBar = ({onSearch, loading}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce pour éviter trop de requêtes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(
        debounce((term) => {
            onSearch(term);
        }, 300),
        []
    );

    const handleSearch = (e) => {
        e.preventDefault()
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto mb-8">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Rechercher une carte..."
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"/>
            {loading && (
                <div className="absolute right-3 top-3">
                    <div
                        className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
            )}
        </div>
    );
};