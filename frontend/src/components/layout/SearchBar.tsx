import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiSearchLine } from "react-icons/ri";

function SearchBar() {
  const [query, setQuery] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("SEARCH QUERY:", query);

    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className='SearchBar'>
      <input className='SearchBarInput'
        id='search'
        type="text"
        placeholder="Search posts and users"
        value={query}
        onChange={handleChange}
      />
      <button type="submit" className='btn'><RiSearchLine /></button>
    </form>
  );
}

export default SearchBar;