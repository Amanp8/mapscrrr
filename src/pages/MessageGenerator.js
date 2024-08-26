import React, { useState } from 'react';
import axios from 'axios';

const MessageGenerator = () => {
  const [formData, setFormData] = useState({
    product: '',
    targetMarket: '',
    clientHelp: '',
    additionalDetails: '',
  });

  const [generateEmail, setGenerateEmail] = useState(false);
  const [generateWhatsApp, setGenerateWhatsApp] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [generatedWhatsAppMessage, setGeneratedWhatsAppMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'generateEmail') {
      setGenerateEmail(checked);
    } else if (name === 'generateWhatsApp') {
      setGenerateWhatsApp(checked);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCopySuccess('');

    const requests = [];

    if (generateEmail) {
      requests.push(
        axios.request({
          method: 'POST',
          url: 'https://chatgpt-42.p.rapidapi.com/conversationgpt4-2',
          headers: {
            'x-rapidapi-key': 'af7f81f0b1mshcbf78238bb52296p117ee7jsn8ccd8a5d2a06',
            'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
            'Content-Type': 'application/json'
          },
          data: {
            messages: [
              {
                role: 'user',
                content: `Create a highly engaging and persuasive cold email that focuses on generating interest and conversions for the following details:
                - Product: ${formData.product}
                - Target Market: ${formData.targetMarket}
                - Value Proposition: How we help the client: ${formData.clientHelp}
                - Additional Details: ${formData.additionalDetails}

                The email should be:
                - Personalized with a strong subject line.
                - Include a compelling introduction that grabs attention.
                - Clearly explain the benefits and unique selling points of our offering.
                - Include a call-to-action that encourages a response or next steps.
                - Written in a professional and friendly tone, avoiding jargon.
                - Keep it concise but impactful, focusing on delivering value to the target market.`,
              }
            ],
            system_prompt: '',
            temperature: 0.9,
            top_k: 5,
            top_p: 0.9,
            max_tokens: 256,
            web_access: false
          }
        })
      );
    }

    if (generateWhatsApp) {
      requests.push(
        axios.request({
          method: 'POST',
          url: 'https://chatgpt-42.p.rapidapi.com/conversationgpt4-2',
          headers: {
            'x-rapidapi-key': 'af7f81f0b1mshcbf78238bb52296p117ee7jsn8ccd8a5d2a06',
            'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
            'Content-Type': 'application/json'
          },
          data: {
            messages: [
              {
                role: 'user',
                content: `Create a concise and engaging cold message suitable for WhatsApp that focuses on generating interest and conversions for the following details:
                - Product: ${formData.product}
                - Target Market: ${formData.targetMarket}
                - Value Proposition: How we help the client: ${formData.clientHelp}
                - Additional Details: ${formData.additionalDetails}

                The message should be:
                - Short and to the point, ideal for WhatsApp.
                - Capture attention immediately.
                - Highlight key benefits and unique selling points.
                - Include a clear call-to-action.
                - Maintain a friendly and approachable tone.`,
              }
            ],
            system_prompt: '',
            temperature: 0.9,
            top_k: 5,
            top_p: 0.9,
            max_tokens: 256,
            web_access: false
          }
        })
      );
    }

    try {
      const responses = await Promise.all(requests);

      if (generateEmail && responses[0].data && responses[0].data.status) {
        setGeneratedEmail(responses[0].data.result);
      }

      if (generateWhatsApp && responses[1].data && responses[1].data.status) {
        setGeneratedWhatsAppMessage(responses[1].data.result);
      }
    } catch (error) {
      console.error('Error generating messages:', error);
      setError('Error generating messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message).then(() => {
      setCopySuccess('Message copied to clipboard!');
    }, (err) => {
      setCopySuccess('Failed to copy message.');
    });
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold mb-4">Message Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">What are you selling?</label>
          <input
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., Software Solution"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Target Market</label>
          <input
            type="text"
            name="targetMarket"
            value={formData.targetMarket}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., Small Businesses"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">How can you help the client?</label>
          <input
            type="text"
            name="clientHelp"
            value={formData.clientHelp}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., Save time and increase productivity"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Additional Details</label>
          <textarea
            name="additionalDetails"
            value={formData.additionalDetails}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., Any special offers or features"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="generateEmail"
            checked={generateEmail}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label className="text-gray-700">Generate Cold Email</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="generateWhatsApp"
            checked={generateWhatsApp}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label className="text-gray-700">Generate WhatsApp Message</label>
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Messages'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {copySuccess && <p className="text-green-500 mt-2">{copySuccess}</p>}

      {generatedEmail && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Generated Cold Email:</h2>
          <pre className="whitespace-pre-wrap">{generatedEmail}</pre>
          <button
            onClick={() => handleCopy(generatedEmail)}
            className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Copy Email
          </button>
        </div>
      )}

      {generatedWhatsAppMessage && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Generated WhatsApp Message:</h2>
          <pre className="whitespace-pre-wrap">{generatedWhatsAppMessage}</pre>
          <button
            onClick={() => handleCopy(generatedWhatsAppMessage)}
            className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Copy WhatsApp Message
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageGenerator;
