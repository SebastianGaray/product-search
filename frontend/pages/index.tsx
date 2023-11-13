import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { fetchProducts } from '../api/client';
import ProductList from '../components/ListProducts';
import SearchBar from '../components/SearchBar';
import SearchInformation from '../components/SearchInformation';

export default function HomePage(){

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 12,
    total_num_products: 0,
    total_num_pages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [useElasticsearch, setUseElasticsearch] = useState(false);
  const [searchInformation, setSearchInformation] = useState({
    time_taken: 0,
    total_hits: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetchProducts(pagination.page, pagination.page_size, searchQuery, useElasticsearch);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
      setSearchInformation(response.data.metadata);
    }

    fetchData();
  }, []);

  const updateProducts = (newProducts: any, newPagination: any, newSearchQuery: any, newUseElasticsearch: boolean, newSearchInformation: any) => {
    setProducts(newProducts);
    setPagination(newPagination);
    setSearchQuery(newSearchQuery);
    setUseElasticsearch(newUseElasticsearch);
    console.log("searchInformation from update products:");
    console.log(newSearchInformation);
    setSearchInformation(newSearchInformation);
  };
  
  return (
    <Layout>
    <SearchBar products={products} pagination={pagination} searchQuery={searchQuery} useElasticsearch={useElasticsearch} searchInformation={searchInformation} onUpdatedProducts={updateProducts} />
    <SearchInformation searchInformation={searchInformation} />
    <ProductList products={products} pagination={pagination} searchQuery={searchQuery} useElasticsearch={useElasticsearch} searchInformation={searchInformation} onUpdatedProducts={updateProducts} />
    </Layout>
  );
};
