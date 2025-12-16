import { useState } from "react";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";
import { searchWikipedia } from "./services/wikipediaApi";
import { type WikipediaSearchResult } from "./types/wikipedia";

function App() {
  const [results, setResults] = useState<WikipediaSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (term: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await searchWikipedia(term);
      setResults(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRandom = () => {
    window.open("https://en.wikipedia.org/wiki/Special:Random", "_blank");
  };

  return (
    <div className="app">
      <h1>Wikipedia Viewer</h1>

      <SearchBar onSearch={handleSearch} onRandom={handleRandom} />

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ResultsList results={results} />
    </div>
  );
}

export default App;
