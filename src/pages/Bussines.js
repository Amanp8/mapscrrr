import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const countryCoordinates = {
  US: { lat: 37.7749, lng: -122.4194 },
  IN: { lat: 20.5937, lng: 78.9629 },
  UK: { lat: 51.5074, lng: -0.1278 },
  // Add more countries here...
};

const Business = () => {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNearbyBusinesses = async () => {
    setLoading(true);
    setError(null);

    const { lat, lng } = countryCoordinates[selectedCountry] || { lat: 37.7749, lng: -122.4194 }; // Default coordinates

    const options = {
      method: 'GET',
      url: 'https://local-business-data.p.rapidapi.com/search-nearby',
      params: {
        query: query,
        lat: lat.toString(),
        lng: lng.toString(),
        limit: '20',
        language: 'en',
        extract_emails_and_contacts: 'false'
      },
      headers: {
        'x-rapidapi-key': 'af7f81f0b1mshcbf78238bb52296p117ee7jsn8ccd8a5d2a06',
        'x-rapidapi-host': 'local-business-data.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setBusinesses(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch businesses. Please try again.');
      setLoading(false);
      setBusinesses([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchNearbyBusinesses();
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(businesses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Businesses');

    // Create and download the Excel file
    XLSX.writeFile(workbook, 'businesses.xlsx');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Find Nearby Businesses</h1>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex:-Gym In Noida?"
          className="p-3 border rounded-md shadow-sm w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="US">United States</option>
          <option value="IN">India</option>
          <option value="UK">United Kingdom</option>
          {/* Add more options here */}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-6 rounded-md shadow hover:bg-blue-700 transition w-full md:w-auto"
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
          <p className="ml-4 text-blue-500">Loading...</p>
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && businesses.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4 border">Name</th>
                  <th className="p-4 border">Address</th>
                  <th className="p-4 border">Phone</th>
                </tr>
              </thead>
              <tbody>
                {businesses.slice(0, 4).map((business, index) => (
                  <tr key={index} className="border-t hover:bg-gray-100 transition">
                    <td className="p-4 border">{business.name || 'N/A'}</td>
                    <td className="p-4 border">{business.address || 'N/A'}</td>
                    <td className="p-4 border">{business.phone || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {businesses.length > 4 && (
            <div className="text-center my-4">
              <p className="text-gray-700 mb-2">Only the first 4 results are displayed. Download the full data for more details.</p>
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white py-3 px-6 rounded-md shadow hover:bg-green-700 transition"
              >
                Download as Excel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Business;
