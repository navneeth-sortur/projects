import React from "react";
import { type WikipediaSearchResult } from "../types/wikipedia";
import ResultItem from "./ResultItem";

interface ResultsListProps {
  results: WikipediaSearchResult[];
}

const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
  if (results.length === 0) {
    return <p className="empty">No results found.</p>;
  }

  return (
    <div className="results-list">
      {results.map(result => (
        <ResultItem key={result.pageid} result={result} />
      ))}
    </div>
  );
};

export default ResultsList;
