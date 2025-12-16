import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  onRandom: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onRandom }) => {
  const [term, setTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    onSearch(term);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search Wikipedia..."
        value={term}
        onChange={e => setTerm(e.target.value)}
      />

      <button type="submit">Search</button>
      <button type="button" onClick={onRandom}>
        Random
      </button>
    </form>
  );
};

export default SearchBar;
