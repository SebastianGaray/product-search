import { useState, useEffect } from 'react';
import client from '../api/client';
import Layout from '../components/Layout';
export default function Products() {
  const [response, setResponse] = useState<Response | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await client.search("");
      setResponse(response);
    };
    fetchData();
  }, []);

  if (!response) {
    return <div>Loading...</div>;
  }
  return (
    <Layout>
        <div>{response.status}</div>
    </Layout>
  );
}
