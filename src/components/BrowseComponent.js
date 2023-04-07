import { useState, useEffect } from 'react';
import { Button, ButtonGroup, Row, DropdownButton, Dropdown, Card, Container, Col } from 'react-bootstrap';

import { search, getBreeds } from '../utility/SearchUtility.js';
import { dogInfo, getCityByZip } from '../utility/DogObjectUtility.js';

function BrowseComponent() {
	const [breeds, setBreeds] = useState([]);
	const [selectedBreeds, setSelectedBreeds] = useState([]);

	const [sortAsc, setSortAsc] = useState(true);

	const [resultIds, setResultIds] = useState([]);
	const [dogObjects, setDogObjects] = useState([]);
	const [dogCities, setDogCities] = useState({});
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(0);

	const [nextUrl, setNextUrl] = useState(null);
	const [prevUrl, setPrevUrl] = useState(null);
	
	const [loading, setLoading] = useState(true);
	const [dogLoading, setDogLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchBreeds();
		fetchResults();
	}, []);

	useEffect(() => {
		fetchDogObjects(resultIds);
	}, [resultIds]);

	useEffect(() => {
		fetchResults();
		setPage(0);
	}, [selectedBreeds, sortAsc]);

	useEffect(() => {
		// Call getCityByZip for each dog object and update state with the result
		const fetchCities = async () => {
		  const newCities = {};
		  for (const dogObject of dogObjects) {
			const city = await getCityByZip(dogObject.zip_code);
			newCities[dogObject.id] = city;
		  }
		  
		  setDogCities(newCities);
		};
		fetchCities();
	}, [dogObjects]);

	const fetchBreeds = async() => {
		setLoading(true);

        try {
            await getBreeds().then((response) => {
			  if(response.success) {
    		  	setBreeds(response.breeds);
			  }
			});
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
	};

	const fetchResults = async(url) => {
        try {
            await search(url, selectedBreeds, sortAsc).then((response) => {
			  if(response.success) {
				setNextUrl(response.data.next);
				setPrevUrl(response.data.prev);
				setTotal(response.data.total);
    		  	setResultIds(response.data.resultIds);
			  }
			});
        } catch (error) {
            setError(error);
        }
	}

	const fetchDogObjects = async(dogIds) => {
		setDogLoading(true);

		try {
            await dogInfo(dogIds).then((response) => {
			  if(response.success) {
    		  	setDogObjects(response.dogObjects);
			  }
			});
        } catch (error) {
            setError(error);
        } finally {
            setDogLoading(false);
        }		
	}

	const toggleOrder = () => {
		setSortAsc(!sortAsc);
	}

	const handleNext = async() => {
		fetchResults(nextUrl);
		setPage(page+1)
	}
	const handlePrev = async() => {
		fetchResults(prevUrl);
		setPage(page-1);
	}

	const handleBreedSelect = (breed) => {
		if (selectedBreeds.includes(breed)) {
		  setSelectedBreeds(selectedBreeds.filter((selectedBreed) => selectedBreed !== breed));
		} else {
		  setSelectedBreeds([...selectedBreeds, breed]);
		}
	};

	if (loading) {
	    return <div>Loading...</div>
	}

	return (
		<Row>
			<DropdownButton id="breed-dropdown" title={selectedBreeds.length ? selectedBreeds.join(", ") : "Select Breeds"} >
				<div className="breed-menu">
					{breeds.map((breed) => (
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
			{selectedBreeds.length != 1 && 
				<Button variant='secondary' onClick={toggleOrder}>
					Sort by breed { sortAsc ? "ascending" : "descending"}
				</Button>
			}
			{dogLoading && 
				<p className={'text-center'}>
					Loading dogs...
				</p>
			}
			{!resultIds &&
				<p className={'text-center'}>
					No results.
				</p>
			}
			{dogObjects && 
				<Container className='mt-5'>
					<Row xs={1} md={2} lg={5}>
						{dogObjects.map((dogObject) => (
						<Col key={dogObject.id} className='dogObject'>
							<Card className='mb-4'>
								<Card.Body>
									<Card.Img variant="top" src={dogObject.img} />
									<Card.ImgOverlay>
										<Card.Text>{dogCities[dogObject.id] ?? `Zip Code: ${dogObject.zip_code}`}</Card.Text>
									</Card.ImgOverlay>
									<Card.Title>{dogObject.name}</Card.Title>
									<Card.Subtitle className="mb-2 text-muted">Age {dogObject.age}</Card.Subtitle>
									<Card.Text>{dogObject.breed}</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						))}
					</Row>
				</Container>
			}
			<ButtonGroup className="text-center mt-3">
				<Button onClick={handlePrev} disabled={!prevUrl || page == 0}>Prev</Button>
				<Button variant='secondary' disabled> {25*page} - {25*page + dogObjects.length} of {total} </Button>
				<Button onClick={handleNext} disabled={!nextUrl || page == Math.ceil(total/25) - 1}>Next</Button>
			</ButtonGroup>
			<p className={'text-center'}>
				{`Page ${page + 1} of ${Math.ceil(total/25)}`}
			</p>
		</Row>
	)
	
}

export default BrowseComponent;
