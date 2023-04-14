import { useState, useEffect } from 'react';
import { Container, Row, Col, InputGroup, Form, Dropdown, DropdownButton } from 'react-bootstrap';
 
import { useDebouncedCallback } from "use-debounce";
import { getLocationInfo, getZips, states } from "../../utility/LocationUtility";

import { IoOptions } from 'react-icons/io5'
import { FaFilter } from 'react-icons/fa';

function LocationSearchComponent({setZips, selectedStates, handleSelect}) {
    const [searchValue, setSearchValue] = useState('');
    const [distance, setDistance] = useState('');

    const [dropdownItems, setDropdownItems] = useState(states);

    const debouncedSearch = useDebouncedCallback(async (value, range) => {
        if(searchValue != '') {
            const locObject = await getLocationInfo(value, selectedStates, range);
            const zipObject = await getZips(locObject, selectedStates);
            setZips(zipObject.zips);
        }
    }, 500);

    useEffect(() => {
		debouncedSearch(searchValue, distance);
	}, [selectedStates]);

    const handleSearchChange = (event) => {
        const { value } = event.target;
        if(value.length) {
            setSearchValue(value);
        } else {
            setSearchValue("");
        }
        debouncedSearch(value, distance);
    };
    
    const handleDistanceChange = (event) => {
        const { value } = event.target;
        if (value.length && !isNaN(Number(value))) {
            setDistance(Number(value) ?? distance);
        } else {
            setDistance("");
        }
        debouncedSearch(searchValue, Number(value));
    };

    const handleSearch = (event) => {
        const { value } = event.target;
        const filteredStates = states.filter(
          (state) =>
            state.code.toLowerCase().includes(value.toLowerCase()) ||
            state.name.toLowerCase().includes(value.toLowerCase())
        );
        setDropdownItems(filteredStates);
    };

    const dropdownOptions = dropdownItems.map((state) => (
        <Dropdown.Item
            key={state.code}
            eventKey={state}
            onClick={() => handleSelect(state.code)}
            className={selectedStates.includes(state.code) ? "selected" : ""}
        >
          {state.name} ({state.code})
        </Dropdown.Item>
    ));

    const dropdownIcon = (sel) => {
        return (
            sel.length ?
            sel.length > 1 ? sel.length : sel[0] :
            <IoOptions/> 
        );
    };
    
    return (
        <Container fluid>
            <Row className="filter-group flex-column-reverse flex-lg-row-reverse mt-5">
                <Col sm={12} lg={6} xl={5} xxl={4}>
                    <InputGroup className="mb-3 sticky-top float-xs-start">
                        <Form.Control
                            type="text"
                            className="text-end"
                            value={distance}
                            onChange={handleDistanceChange}
                            placeholder="Max Range"
                        />
                        <InputGroup.Text className="ldbutton text-white fs-6" >miles</InputGroup.Text>
                    </InputGroup>
                </Col>
                <Col sm={12} lg={6} xl={7} xxl={8}>
                    <InputGroup className="mb-3 sticky-top float-xs-end">
                        <DropdownButton
                            id="state-dropdown"
                            className="ldbutton text-white"
                            title={dropdownIcon(selectedStates)}
                        >
                            <div className="state-menu">
                                <Form.Control 
                                    type="text"
                                    placeholder="Search"
                                    onChange={handleSearch}
                                    className="state-search"
                                />
                                {dropdownOptions}

                            </div>
                        </DropdownButton>
                        <Form.Control
                            placeholder="Filter by Zip, Address, Country, State..."
                            aria-label="Filter"
                            aria-describedby="basic-addon1"
                            className='w-80'
                            value={searchValue}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>
                </Col>
                {!!selectedStates.length && 
                    <div className='selected-states py-2'>
                        <FaFilter className='inline-icon pe-1'/>
                        {selectedStates.join(", ")}
                    </div>
                }
            </Row>
        </Container>
    );
}

export default LocationSearchComponent;