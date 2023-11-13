import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { fetchProducts } from "../api/client";

export default function SearchBar({products, pagination, searchQuery, useElasticsearch, searchInformation, onUpdatedProducts}: any) {
  
  // Function to handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    async function fetchData() {
      
      const response = await fetchProducts(1, pagination.page_size, searchQuery, useElasticsearch);
      console.log("Metadata from SearchBar:");
      console.log(response.data.metadata);
      onUpdatedProducts(response.data.products, response.data.pagination, searchQuery, useElasticsearch, response.data.metadata);
    }
    e.preventDefault();
    // Get the search query from the form input
    const searchQuery = e.currentTarget.search.value;
    const useElasticsearch = e.currentTarget.checkbox.checked;

    fetchData();
  };


  // Render the search form with checkbox
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center max-w-screen-sm mx-auto overflow-hidden shadow-lg"
    >
      {/* Display the search input */}
      <input
        className="w-full py-2 px-4 bg-white text-gray-700 leading-tight focus:outline-none rounded-l-full"
        type="text"
        name="search"
        placeholder="Search for products..."
      />
      <label className="l-4 text-white-900 flex items-center">
        <input
          type="checkbox"
          defaultChecked={useElasticsearch}
          name="checkbox"
          className="mr-2 leading-tight"
        />
        <span className="text-lg font-bold">Use Elasticsearch</span>
      </label>
      {/* Display the search button */}
      <button
        type="submit"
        className="bg-gray-800 text-white font-bold py-2 px-4 rounded-r-full"
      >
        Search
      </button>
    </form>
  );
}