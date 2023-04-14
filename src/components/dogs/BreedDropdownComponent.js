import React, { useState } from "react";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";

import TooltipBit from "../bits/TooltipBit";

const BreedDropdownComponent = ({ breeds, selectedBreeds, handleBreedSelect, loadingBreeds, size }) => {
  const [search, setSearch] = useState("");

  const filteredBreeds = breeds.filter((breed) =>
    breed.toLowerCase().includes(search.toLowerCase())
  );

  let limit = 68;
  switch (size) {
    case 'md':
      limit = 64
    case 'sm':
      limit = 56;
    case 'xs':
      limit = 48;
  }
  const small = ( size == 'xs' || size == 'sm') || selectedBreeds.join(',').length > limit;

  let title = (selectedBreeds.length) ? selectedBreeds.join(", ") : "Select Breeds";
  if( small && selectedBreeds.length ) {
    title = `${selectedBreeds.length} Breeds Selected `
  }

  return (
    <DropdownButton
      id="breed-dropdown"
      title={<TooltipBit tip="Filter by dog breed (optional)" order={3}>{title}</TooltipBit>}
    >
      {!loadingBreeds &&
        <div className="breed-menu">
          <Form.Control
            type="text"
            placeholder="Search for a Breed"
            className="breed-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredBreeds.map((breed) => (
            <Dropdown.Item
              key={breed}
              className={selectedBreeds.includes(breed) ? "selected" : ""}
              onClick={() => handleBreedSelect(breed)}
            >
              {breed}
            </Dropdown.Item>
          ))}
        </div>
      }
    </DropdownButton>
  );
};

export default BreedDropdownComponent;
