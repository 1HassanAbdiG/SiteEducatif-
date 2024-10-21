import React, { useState } from 'react';

const AnimalImageSearch = () => {
  const [animal, setAnimal] = useState(''); // User-input animal

  const handleSearch = () => {
    if (animal) {
      // Open a new tab with Google Images search for the entered animal
      const searchURL = `https://www.google.com/search?hl=en&tbm=isch&q=${encodeURIComponent(animal)}`;
      window.open(searchURL, '_blank'); // Open in a new tab
      setAnimal(''); // Clear the input after search
    }
  };

  return (
    <div>
      <h2>Search for Animal Images</h2>
      <input
        type="text"
        value={animal}
        onChange={(e) => setAnimal(e.target.value)}
        placeholder="Type an animal (e.g., cat, dog)"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default AnimalImageSearch;
