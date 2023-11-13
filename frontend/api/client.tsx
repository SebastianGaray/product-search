import axios from "axios";

export function fetchProducts(page: number, pageSize: number, searchQuery?: string, useElasticsearch?: boolean) {
  let params = {};
  console.log("Fetching products:");
  console.log(useElasticsearch);
  console.log(searchQuery);
  if (searchQuery) {
    let searchType;
    if (useElasticsearch) {
      searchType = "elasticsearch";
    } else {
      searchType = "mongo";
    }
    params = { page, page_size: pageSize, search: searchQuery, search_type: searchType }
  } else {
    params = { page, page_size: pageSize }
  }
  return axios.get("http://localhost:5000/api/products", {
    params,
  });
}