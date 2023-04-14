import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { FaHeart, FaDog, FaGlobe } from 'react-icons/fa';

import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import Cookies from 'universal-cookie';
import StrictModeDroppable from './dnd/StrictModeDroppable.js';
import useBreakpoint from '../utility/UseBreakpoint.js';

import { search, getBreeds } from '../utility/SearchUtility.js';
import { getDogs, getDogCities } from '../utility/DogObjectUtility.js';

import LocationSearchComponent from './location/LocationSearchComponent.js';
import BreedDropdownComponent from './dogs/BreedDropdownComponent.js';
import DogComponent from './dogs/DogComponent.js';
import SpinnerBit from './bits/SpinnerBit.js';
import TooltipBit from './bits/TooltipBit.js';

function BrowseComponent() {
	const [breeds, setBreeds] = useState([]);
	const [selectedBreeds, setSelectedBreeds] = useState([]);
	const [selectedStates, setSelectedStates] = useState([]);

	const [zips, setZips] = useState([]);

	const [sortAsc, setSortAsc] = useState(true);

	const [resultIds, setResultIds] = useState([]);
	const [dogObjects, setDogObjects] = useState([]);
	const [dogCities, setDogCities] = useState({});
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(0);

	const [favDogObjects, setFavDogObjects] = useState([]);
	
	const [draggingR, setDraggingR] = useState(false);
	const [draggingL, setDraggingL] = useState(false);
	const [loading, setLoading] = useState(true);
	const [dogLoading, setDogLoading] = useState(false);
	const [error, setError] = useState(null);
	const [redirect, setRedirect] = useState(null);

	const [didSearch, setDidSearch] = useState(false);

	const size = useBreakpoint();
	const cookies = new Cookies();

	useEffect(() => {
		if(!cookies.get('user')) {
			setRedirect('/login');
		} else {
			fetchBreeds();
		}
	}, []);

	useEffect(() => {
		fetchDogObjects(resultIds);
	}, [resultIds]);

	useEffect(() => {
		fetchCities(dogObjects);
	}, [dogObjects])

	useEffect(() => {
		setDidSearch(true);
		fetchResults();
	}, [page, selectedBreeds, zips, sortAsc]);

	useEffect(() => {
		setPage(0);
	}, [selectedBreeds, zips]);

	const fetchCities = async (dogObjects) => {
		const newDogs = [];
		dogObjects.forEach((dogObject) => {
			// only fetch if we don't already have a city for this dog
			// prevents unneccesary requests on page returns
			if(!dogCities[dogObject.id]) {
				newDogs.push(dogObject);
			}
		});
		let newCities = {};
		const data = await getDogCities(newDogs);
		if(data.success) {
			newCities = data.dogCities;
		}
		setDogCities({...newCities, ...dogCities});
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
            await search(page, selectedBreeds, zips, sortAsc).then((response) => {
			  if(response.success) {
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
            await getDogs(dogIds).then((response) => {
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

	const addToFavs = (index) => {
		const dogs = [...dogObjects];
		const [removed] = dogs.splice(index, 1);
	
		// remove action
		setDogObjects(dogs);
	
		// duplicate check
		if (favDogObjects.some((dog) => dog.id === removed.id)) {
			return;
		}
	
		// add dog to the new list
		const newFavDogObjects = [...favDogObjects];
		newFavDogObjects.push(removed);

		setFavDogObjects(newFavDogObjects);
	}

	const removeFromFavs = (index) => {
		const favs = [...favDogObjects];
		const [removed] = favs.splice(index, 1);
	
		// remove action
		setFavDogObjects(favs);
	
		// duplicate check
		if (dogObjects.some((dog) => dog.id === removed.id)) {
		  return;
		}
	
		// add dog to the correct location in the new list
		const newDogObjects = [...dogObjects];
		newDogObjects.push(removed);

		setDogObjects(newDogObjects);
	}

	const toggleOrder = () => {
		setSortAsc(!sortAsc);
	}

	const handleNext = async() => {
		setPage(page+1)
	}
	const handlePrev = async() => {
		setPage(page-1);
	}

	const handleBreedSelect = (breed) => {
		if (selectedBreeds.includes(breed)) {
		  setSelectedBreeds(selectedBreeds.filter((selectedBreed) => selectedBreed !== breed));
		} else {
		  setSelectedBreeds([...selectedBreeds, breed]);
		}
	};

	const handleStateSelect = (state) => {
		if (selectedStates.includes(state)) {
		  setSelectedStates(selectedStates.filter((selectedState) => selectedState !== state));
		} else {
			setSelectedStates([...selectedStates, state]);
		}
	};

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
  
		return result;
	};

	const onDragStart = (result) => {
		const sourceDroppableId = result.source.droppableId;
		if (sourceDroppableId === 'dogDrop') {
			setDraggingL(true);
		} else if (sourceDroppableId === 'favDrop') {
			setDraggingR(true);
		}
	}

	const onDragEnd = (result) => {
		setDraggingL(false);
		setDraggingR(false);
	  
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
	  
		  // duplicate check
		  if (favDogObjects.some((dog) => dog.id === removed.id)) {
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
	  
		  // duplicate check
		  if (dogObjects.some((dog) => dog.id === removed.id)) {
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

	if(redirect) {
    	return (
    		<Navigate to={redirect}/>
    	);
    }
	  
	if (loading) {
	    return (
			<div className='mt-5 mb-5'>
				<SpinnerBit className={'fs-1'}/>
			</div>
		);
	}

	return (
	<>
		<DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
			<div className="filter-wrapper sticky-top">
				<LocationSearchComponent
					setZips={setZips}
					selectedStates={selectedStates}
					handleSelect={handleStateSelect}
				/>
				<div className="breed-button-wrapper">
					<ButtonGroup className="text-center breed-button-group">
						<BreedDropdownComponent
							breeds={breeds}
							selectedBreeds={selectedBreeds}
							handleBreedSelect={handleBreedSelect}
							size={size}
						/>
						{selectedBreeds.length != 1 &&
							<Button variant='secondary' onClick={toggleOrder} className='breed-sort'>
							<TooltipBit tip="Sort by breed, alphabetically ascending or descending" order={4}/>
								<span>{selectedBreeds.join(',').length < 64 ? `Sort: Breed ` : ''}</span> { sortAsc ? "↓" : "↑"}
							</Button>
						}
					</ButtonGroup>
				</div>
			</div>
		<Container fluid>
			<Row>
				<Col xs={7} sm={9} md={10} className='scrolling-column'>
					<div className={`d-block left-side-scroller${draggingR ? ' dragging' : ''}`}>
						<TooltipBit tip="Drag dogs you like from over here..." order={5}/>
						{dogLoading && 
							<p className={'text-center'}>
								<SpinnerBit className={'fs-1 mt-5'}/>
							</p>
						}
						{!resultIds &&
							<p className={'text-center'}>
								No results.
							</p>
						}
						{resultIds && !dogObjects.length && !dogLoading &&
							<>
								<h3 className='mt-5'>There's nothing here!</h3>
								<p className={'text-center'}>
									You can either refine your search or keep browsing for dogs on the next page.
								</p>
								<h1 className='standout-text text-center'><FaDog/><FaHeart className='inline-icon'/></h1>
							</>
						}
						{!zips.length && !!didSearch &&
							<p className='text-muted'>
								<FaGlobe className='inline-icon me-1'/> Showing dogs in all areas.
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
													xs={12} sm={6} md={4} lg={3}
													className='dogObject'
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
												>
													<DogComponent
														dogObject={dogObject}
														city={dogCities[dogObject.id]}
														size="large"
														addFunc={() => addToFavs(index)}
													/>
												</Col>
											)}
											</Draggable>
										))}
										{provided.placeholder}
									</Row>
								)}
							</StrictModeDroppable>
						}
					</div>
				</Col>
				<Col xs={5} sm={3} md={2}>
					<div className={`sticky-top right-side-container${draggingL ? ' dragging' : ''}`}>
						<h6 className="right-side-title ms-2"><FaHeart className='inline-icon' /> Favorite Dogs: </h6>
						<TooltipBit tip="... to over here." order={6}/>
						{favDogObjects.length < 1 &&
							<div className='mt-4 ms-1 me-3 right-side-empty'>
								<h6>
									No favorite dogs yet.
								</h6>
								<p>
									Drag dogs you might want to adopt over here to start building your list of favorites.
								</p>
							</div>
						}
						<div className={`right-side-scroller`}>
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
												<DogComponent
													dogObject={dogObject}
													city={dogCities[dogObject.id]}
													size="small"
													removeFunc={() => removeFromFavs(index)}
												/>
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
      <div className='sticky-bottom'>
        <Container fluid>
			<ButtonGroup className="text-center mt-3">
				<Button className="ldbutton" onClick={handlePrev} disabled={page == 0}>Prev</Button>
				<Button className="ldbutton" variant='secondary' disabled> {12*page} - {12*page + dogObjects.length} of {total} </Button>
				<Button className="ldbutton" onClick={handleNext} disabled={page == Math.ceil(total/12) - 1}>Next</Button>
			</ButtonGroup>
			<p className={'text-center page-count'}>
				<span>{`Page ${page + 1} of ${Math.ceil(total/12)}`}</span>
			</p>
        </Container>
      </div>
	</>
	)
	
}

export default BrowseComponent;
