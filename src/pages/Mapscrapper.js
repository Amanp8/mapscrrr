import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const GooglePlacesSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
        params: {
          query: keyword,
          location: location,
          key: 'YOUR_GOOGLE_API_KEY'
        }
      });

      setResults(response.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const exportToExcel = () => {
    const formattedResults = results.map(place => ({
      Name: place.name,
      Address: place.formatted_address,
      Rating: place.rating || 'N/A',
      PhoneNumber: place.formatted_phone_number || 'N/A', // Note: Not always available
      Email: 'N/A', // Placeholder, as Google Places API doesn't provide email
      MobileNumber: 'N/A' // Placeholder, as Google Places API doesn't provide mobile number
    }));

    const ws = XLSX.utils.json_to_sheet(formattedResults);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    XLSX.writeFile(wb, 'results.xlsx');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location (latitude,longitude)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={exportToExcel}>Export to Excel</button>

      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Rating</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Mobile Number</th>
            </tr>
          </thead>
          <tbody>
            {results.map((place, index) => (
              <tr key={index}>
                <td>{place.name}</td>
                <td>{place.formatted_address}</td>
                <td>{place.rating || 'N/A'}</td>
                <td>{place.formatted_phone_number || 'N/A'}</td>
                <td>N/A</td>
                <td>N/A</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GooglePlacesSearch;
