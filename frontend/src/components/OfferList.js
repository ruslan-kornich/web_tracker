import React, { useEffect, useState } from 'react';

const OfferList = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/offers`)
      .then(response => response.json())
      .then(data => setOffers(data))
      .catch(error => console.error('Error fetching offers:', error));
  }, []);

  return (
    <div>
      <h1>Offers</h1>
      <ul>
        {offers.map(offer => (
          <li key={offer.id}>{offer.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default OfferList;
