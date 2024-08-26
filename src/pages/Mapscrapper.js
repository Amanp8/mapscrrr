import React, { useState } from 'react';
import axios from 'axios';

const Mapscrapper = () => {
  const [country, setCountry] = useState('ind');
  const [query, setQuery] = useState('restaurant');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // State to track loading
  const [error, setError] = useState(null);

  const fetchBusinessData = async () => {
    setLoading(true); // Start loading
    const options = {
      method: 'GET',
      url: 'https://maps-data.p.rapidapi.com/searchmaps.php',
      params: {
        query: query,
        limit: '20',
        country: country,
        lang: 'en',
        lat: '51.5072',
        lng: '0.12',
        offset: '0',
        zoom: '13'
      },
      headers: {
        'x-rapidapi-key': 'db089fc727msh1d0c5d09bf0753ap1b3c2cjsn2fd0c203c10e',
        'x-rapidapi-host': 'maps-data.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      if (response.data && response.data.data) {
        setData(response.data.data);
        setError(null);
      } else {
        setError('No data found.');
        setData([]);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch data.');
      setData([]);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBusinessData();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Business Information</h1>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="mb-4 md:mb-0">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Select Country:</label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="us">United States</option>
              <option value="in">Ind</option>
              <option value="ca">Canada</option>
              <option value="uk">United Kingdom</option>
              <option value="au">Australia</option>
            </select>
          </div>
          <div className="mb-4 md:mb-0">
            <label htmlFor="query" className="block text-sm font-medium text-gray-700">Search Query:</label>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., restaurant"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </div>
      </form>

      {loading && <p className="text-center text-indigo-600">Loading...</p>} {/* Loading indicator */}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Rating</th>
                <th className="py-2 px-4 border-b">Website</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{item.name || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{item.phone_number || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{item.full_address || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{item.rating || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    <a
                      href={item.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {item.website || 'N/A'}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Mapscrapper;
