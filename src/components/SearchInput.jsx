import React from 'react';

const SearchInput = ({ value, onChange, placeholder = "Rechercher..." }) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
                placeholder={placeholder}
            />
        </div>
    );
};

export default SearchInput;