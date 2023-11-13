import { use, useState } from "react";
import { fetchProducts } from "../api/client";


function ProductList({products, pagination, searchQuery, useElaticsearch, searchInformation, onUpdatedProducts}: any) {
  

  function handlePageChange(newPage: any) {
    async function fetchData() {
      const response = await fetchProducts(newPage, pagination.page_size, searchQuery, useElaticsearch);
      console.log("Metadata from ProductList:");
      console.log(response.data.metadata);
      onUpdatedProducts(response.data.products, response.data.pagination, searchQuery, useElaticsearch, response.data.metadata);
    }

    fetchData();
  }

  function handlePageSizeChange(event: any) {
    const newPageSize = parseInt(event.target.value);
    async function fetchData() {
      const response = await fetchProducts(1, newPageSize, searchQuery, useElaticsearch);
      onUpdatedProducts(response.data.products, response.data.pagination, searchQuery, useElaticsearch, response.data.metadata);
    }

    fetchData();
  }


  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <div className="flex justify-between mb-4">
          <div>
            <label htmlFor="page-size" className="mr-2">
              Page Size:
            </label>
            <select
              id="page-size"
              name="page-size"
              value={pagination.page_size}
              onChange={handlePageSizeChange}
              className="border border-gray-400 rounded-md px-2 py-1 text-gray-700"
            >
              <option value="12">12</option>
              <option value="48">48</option>
              <option value="192">192</option>
              <option value="768">768</option>
              <option value="3072">3072</option>
              <option value="12288">12288</option>
            </select>
          </div>
          <div>
            <p>
              Page {pagination.page} of {pagination.total_num_pages}
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: any) => (
            <li key={product.name} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-gray-900 text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-gray-700 text-base mb-2">{product.description}</p>
                <p className="text-gray-700 text-base mb-2">Price: {product.price}</p>
                <p className="text-gray-700 text-base mb-2">Category: {product.category}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-8">
          <button
            className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l ${
              pagination.page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </button>
          <button
            className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r ${
              pagination.page === pagination.total_num_pages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={pagination.page === pagination.total_num_pages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductList;