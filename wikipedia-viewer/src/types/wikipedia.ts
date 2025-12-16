export interface WikipediaSearchResult {
  pageid: number;
  title: string;
  snippet: string;
}

export interface WikipediaSearchResponse {
  query: {
    search: WikipediaSearchResult[];
  };
}
