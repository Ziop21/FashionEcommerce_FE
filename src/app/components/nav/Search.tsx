'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface SearchBarProps {
  className?: string; 
}

const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push('/filter?search=' + encodeURIComponent(searchTerm));
  };
    // router.push('/search?search=' + searchTerm);
    // event.preventDefault();
    // console.log('Search Term:', searchTerm);
  // };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 rounded-lg"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 ml-2 rounded-lg">
        Search
      </button>
    </form>
  );
};

export default SearchBar;