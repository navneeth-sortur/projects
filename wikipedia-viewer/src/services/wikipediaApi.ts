import { type WikipediaSearchResponse } from "../types/wikipedia";

const BASE_URL = "https://en.wikipedia.org/w/api.php";

export async function searchWikipedia(
  searchTerm: string
): Promise<WikipediaSearchResponse["query"]["search"]> {
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: searchTerm,
    format: "json",
    origin: "*"
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  const data: WikipediaSearchResponse = await response.json();

  return data.query.search;
}
