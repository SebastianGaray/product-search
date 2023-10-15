import { useRouter } from "next/navigation";
import { FormEvent } from "react";

interface Response {
  status: string;
}

export default function SearchBar() {
  // Use the `useRouter` hook to get the router object
  const router = useRouter();

  // Function to handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Get the search query from the form input
    const searchQuery = e.currentTarget.search.value;
    // Navigate to the items page with the search query as a parameter
    router.push(`/products?search=${searchQuery}`);
  };

  // Render the search form
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center max-w-screen-sm mx-auto rounded-full overflow-hidden shadow-lg"
    >
      {/* Display the search input */}
      <input
        className="w-full py-2 px-4 bg-white text-gray-700 leading-tight focus:outline-none"
        type="text"
        name="search"
        placeholder="..."
      />
      {/* Display the search button */}
      <button
        type="submit"
        className="bg-gray-800 text-white font-bold py-2 px-4 rounded"
      >
        Search
      </button>
    </form>
  );
}