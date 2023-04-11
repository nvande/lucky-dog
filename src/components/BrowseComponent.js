import { useState, useEffect } from 'react';
import { Button, ButtonGroup, Row, DropdownButton, Dropdown, Card, Container, Col } from 'react-bootstrap';

import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import StrictModeDroppable from './dnd/StrictModeDroppable.js';

import { search, getBreeds } from '../utility/SearchUtility.js';
import { dogInfo, getCityByZip } from '../utility/DogObjectUtility.js';
import DogComponent from './dogs/DogComponent.js';
import BreedDropdownComponent from './dogs/BreedDropdownComponent.js';

function BrowseComponent() {
	const [breeds, setBreeds] = useState([]);
	const [selectedBreeds, setSelectedBreeds] = useState([]);

	const [sortAsc, setSortAsc] = useState(true);

	const [resultIds, setResultIds] = useState([]);
	const [dogObjects, setDogObjects] = useState([]);
	const [dogCities, setDogCities] = useState({});
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(0);

	const [favDogObjects, setFavDogObjects] = useState([]);
	const [favDogCities, setFavDogCities] = useState({});

	const [nextUrl, setNextUrl] = useState(null);
	const [prevUrl, setPrevUrl] = useState(null);
	
	const [dragging, setDragging] = useState(false);
	const [loading, setLoading] = useState(true);
	const [dogLoading, setDogLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchBreeds();
		fetchResults();
	}, []);

	useEffect(() => {
		fetchDogObjects(resultIds).then(() => {
			fetchCities();
		})
	}, [resultIds]);

	useEffect(() => {
		fetchResults();
		setPage(0);
	}, [selectedBreeds, sortAsc]);

	const fetchCities = async () => {
		const newCities = {};
		for (const dogObject of dogObjects) {
		  console.log(dogObject.zip_code)
		  const city = await getCityByZip(dogObject.zip_code);
		  console.log(city);
		  newCities[dogObject.id] = city;
		}
		
		console.log(newCities);

		setDogCities(newCities);
		console.log(dogCities);
	};

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

				// don't show the dog object if we've already got it in our favorites
				// this can happen if we return to a page where we already took a fav
				const dogs = response.dogObjects.filter(item1 => !favDogObjects.some(item2 => item2.id === item1.id));
    		  	setDogObjects(dogs);
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

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
  
		return result;
	};

	const onDragStart = () => {
		setDragging(true);
	}

	const onDragEnd = (result) => {
		setDragging(false);
	  
		// dropped outside the list
		if (!result.destination) {
		  return;
		}
	  
		const sourceDroppableId = result.source.droppableId;
		const destinationDroppableId = result.destination.droppableId;
	  
		if (sourceDroppableId === 'dogDrop' && destinationDroppableId === 'favDrop') {
		  const dogs = [...dogObjects];
		  const [removed] = dogs.splice(result.source.index, 1);
	  
		  // remove action
		  setDogObjects(dogs);
	  
		  // add action
		  // but quit out if it's a duplicate (happens if page changed)
		  if (favDogObjects.some((dog) => dog.id === removed.id)) {
			console.log('dupe!');
			return;
		  }
	  
		  // add dog to the correct location in the new list
		  const newFavDogObjects = [...favDogObjects];
		  if (result.destination.index === 0) {
			newFavDogObjects.unshift(removed);
		  } else if (result.destination.index === favDogObjects.length) {
			newFavDogObjects.push(removed);
		  } else {
			newFavDogObjects.splice(result.destination.index, 0, removed);
		  }
		  setFavDogObjects(newFavDogObjects);
		} else if (sourceDroppableId === 'favDrop' && destinationDroppableId === 'dogDrop') {
		  const favs = [...favDogObjects];
		  const [removed] = favs.splice(result.source.index, 1);
	  
		  // remove action
		  setFavDogObjects(favs);
	  
		  // add action
		  if (dogObjects.some((dog) => dog.id === removed.id)) {
			console.log('dupe.');
			return;
		  }
	  
		  // add dog to the correct location in the new list
		  const newDogObjects = [...dogObjects];
		  if (result.destination.index === 0) {
			newDogObjects.unshift(removed);
		  } else if (result.destination.index === dogObjects.length) {
			newDogObjects.push(removed);
		  } else {
			newDogObjects.splice(result.destination.index, 0, removed);
		  }
		  setDogObjects(newDogObjects);
		} else {
		  // while not serving a functional purpose,
		  // allowing users to reorder their search
		  // or their favorite dogs
		  // just feels 'right', even if this
		  // doesn't persist when the page is left
		  const items = reorder(
			sourceDroppableId === 'dogDrop' ? dogObjects : favDogObjects,
			result.source.index,
			result.destination.index
		  );
	  
		  if (sourceDroppableId === 'dogDrop') {
			setDogObjects(items);
		  } else if (sourceDroppableId === 'favDrop') {
			setFavDogObjects(items);
		  }
		}
	  };
	  

	if (loading) {
	    return <div>Loading...</div>
	}

	return (
	<>
		<DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
			<div className="sticky-top sticky-bottom mb-4">
				<ButtonGroup className="text-center mt-1 me-2 mb-4">
					<BreedDropdownComponent
						breeds={breeds}
						selectedBreeds={selectedBreeds}
						handleBreedSelect={handleBreedSelect}
					/>
					{selectedBreeds.length != 1 && 
						<Button variant='secondary' onClick={toggleOrder} className='breed-sort'>
							Sort: Breed { sortAsc ? "↓" : "↑"}
						</Button>
					}
				</ButtonGroup>
			</div>
			<Container fluid>
				<Row>
				<Col xs={8} sm={9} md={10} className="scrolling-column">
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
						<StrictModeDroppable droppableId="dogDrop" direction="vertical">
							{(provided, snapshot) => (
								<Row
								className="justify-content-center"
								ref={provided.innerRef}
								{...provided.droppableProps}
								>
									{dogObjects.map((dogObject, index) => (
										<Draggable key={dogObject.id} draggableId={dogObject.id} index={index}>
										{(provided, snapshot) => (
											<Col
												xs={12} md={6} lg={3}
												className='dogObject'
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<DogComponent dogObject={dogObject} city={dogCities[dogObject.id]} size="large" />
											</Col>
										)}
										</Draggable>
									))}
									{provided.placeholder}
								</Row>
							)}
						</StrictModeDroppable>
					}
				</Col>
				<Col xs={4} sm={3} md={2}>
					<div className="sticky-top sticky-bottom right-side-container">
						<h6 className="right-side-title ms-2"> Favorite Dogs: </h6>
						{favDogObjects.length < 1 &&
							<div className='mt-4 ms-1 me-3'>
								<h5>
									No favorite dogs yet.
								</h5>
								<p>
									Drag dogs you might want to adopt over here to start building your list of favorites.
								</p>
							</div>
						}
						<div className='right-side-scroller'>
							<StrictModeDroppable droppableId="favDrop" direction="vertical">
								{(provided, snapshot) => (
									<div
									className='right-side-droppable'
									ref={provided.innerRef}
									{...provided.droppableProps}
									>
									{favDogObjects.map((dogObject, index) => (
										<Draggable key={dogObject.id} draggableId={dogObject.id} index={index}>
										{(provided, snapshot) => (
											<div
												className='dogObject'
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<DogComponent dogObject={dogObject} city={dogCities[dogObject.id]} size="small" />
											</div>
										)}
										</Draggable>
									))}
									{provided.placeholder}
									</div>
								)}
								</StrictModeDroppable>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
	  </DragDropContext>


      {/* Sticky footer */}
      <div className='sticky-bottom'>
        <Container fluid>
		<ButtonGroup className="text-center mt-3">
				<Button onClick={handlePrev} disabled={!prevUrl || page == 0}>Prev</Button>
				<Button variant='secondary' disabled> {25*page} - {25*page + dogObjects.length} of {total} </Button>
				<Button onClick={handleNext} disabled={!nextUrl || page == Math.ceil(total/25) - 1}>Next</Button>
			</ButtonGroup>
			<p className={'text-center'}>
				{`Page ${page + 1} of ${Math.ceil(total/25)}`}
			</p>
        </Container>
      </div>
	  </>
    
	)
	
}

export default BrowseComponent;
