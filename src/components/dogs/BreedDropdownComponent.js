import React, { useState } from "react";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";

const BreedDropdownComponent = ({ breeds, selectedBreeds, handleBreedSelect }) => {
  const [search, setSearch] = useState("");

  const filteredBreeds = breeds.filter((breed) =>
    breed.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownButton
      id="breed-dropdown"
      title={selectedBreeds.length ? selectedBreeds.join(", ") : "Select Breeds"}
    >
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
    </DropdownButton>
  );
};

export default BreedDropdownComponent;
