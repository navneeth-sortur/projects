import React from "react";
import { type WikipediaSearchResult } from "../types/wikipedia";

interface ResultItemProps {
  result: WikipediaSearchResult;
}

const ResultItem: React.FC<ResultItemProps> = ({ result }) => {
  const articleUrl = `https://en.wikipedia.org/?curid=${result.pageid}`;

  return (
    <div className="result-item">
      <a href={articleUrl} target="_blank" rel="noopener noreferrer">
        <h3>{result.title}</h3>
      </a>

      <p
        dangerouslySetInnerHTML={{
          __html: result.snippet
        }}
      />
    </div>
  );
};

export default ResultItem;
