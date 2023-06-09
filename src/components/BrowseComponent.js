import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Row, Col, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { FaHeart, FaDog, FaGlobe, FaFlag } from 'react-icons/fa';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import Cookies from 'universal-cookie';
import StrictModeDroppable from './dnd/StrictModeDroppable.js';
import useBreakpoint from '../utility/UseBreakpoint.js';
import { search, getBreeds } from '../utility/SearchUtility.js';
import { getDogs, getDogCities, matchDog } from '../utility/DogObjectUtility.js';
import LocationSearchComponent from './location/LocationSearchComponent.js';
import BreedDropdownComponent from './dogs/BreedDropdownComponent.js';
import DogComponent from './dogs/DogComponent.js';
import TooltipBit from './bits/TooltipBit.js';
import MatchButtonComponent from './dogs/MatchButtonComponent.js';
import MatchComponent from './dogs/MatchComponent.js';
import DogsLoadingBit from './bits/DogsLoadingBit.js';
import FocusComponent from './dogs/FocusComponent.js';

const PER_PAGE = process.env.REACT_APP_PAGE_SIZE;

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
	const [numAlreadyFav, setNumAlreadyFav] = useState(0);

	const [matchedDog, setMatchedDog] = useState(null);
	const [focusedDog, setFocusedDog] = useState(null);
	
	const [draggingR, setDraggingR] = useState(false);
	const [draggingL, setDraggingL] = useState(false);

	const [dogLoading, setDogLoading] = useState(true);
	const [loadingBreeds, setLoadingBreeds] = useState(false);
	const [matchLoading, setMatchLoading] = useState(false);
	const [error, setError] = useState(null);
	const [redirect, setRedirect] = useState(null);

	const [lastSearch, setLastSearch] = useState(null);

	const size = useBreakpoint();
	const cookies = new Cookies();

	const yourName = cookies.get('name');

	useEffect(() => {
		if(!cookies.get('user')) {
			setRedirect(process.env.REACT_APP_LOGIN_URL);
		} else {
			fetchBreeds();
			const storedFavs = JSON.parse(window.localStorage.getItem('favDogs'));
			if (storedFavs && storedFavs !== 'undefined') {
				setFavDogObjects(storedFavs);
				fetchCities(storedFavs);
			} else {
				setFavDogObjects([]);
			}
		}
	}, []);

	useEffect(() => {
		if(resultIds.length) {
			fetchDogObjects(resultIds);
		}
	}, [resultIds]);

	useEffect(() => {
		fetchCities(dogObjects);
	}, [dogObjects])

	useEffect(() => {
		fetchCities(favDogObjects);
	}, [favDogObjects])

	useEffect(() => {
		fetchResults();
	}, [page, selectedBreeds, selectedStates, zips, sortAsc]);

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
		if (newDogs.length ) {
			let newCities = {};
			try {
				const response = await getDogCities(newDogs);
				if(response.success) {
					newCities = response.dogCities;
				} else {
					setError(response.er ?? "Error while dog cities");
				}
			} catch (error) {
				setError(error);
			}
			setDogCities({...newCities, ...dogCities});
		}
	};

	const fetchBreeds = async() => {
		setLoadingBreeds(true);
        try {
            await getBreeds().then((response) => {
			  if(response.success) {
    		  	setBreeds(response.breeds);
			  } else {
				setError(response.er ?? "Error while fetching breeds");
			  }
			});
        } catch (error) {
            setError(error);
        } finally {
            setLoadingBreeds(false);
        }
	};

	const fetchResults = async() => {
		setDogLoading(true);
        try {
            await search(page, selectedBreeds, zips, sortAsc).then((response) => {
			  if(response.success) {
				if(response.data && response.data.total) {
					setTotal(response.data.total);
					setResultIds(response.data.resultIds);
				} else {
					setDogLoading(false); // we are done loading early because we found no dogs
				}
			  } else {
				setError(response.er ?? "Error while fetching results");
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
			  if(response.success && response.dogObjects) {

				// don't show the dog object if we've already got it in our favorites
				// this can happen if we return to a page where we already took a fav
				const dogs = response.dogObjects.filter(item1 => !favDogObjects.some(item2 => item2.id === item1.id));
				setNumAlreadyFav( response.dogObjects.length - dogs.length );

    		  	setDogObjects(dogs);
			  } else {
				setError(response.er ?? "Error while fetching dogs");
			  }
			});
        } catch (error) {
            setError(error);
        } finally {
            setDogLoading(false);
        }		
	}

	const findMatch = async() => {
		setMatchLoading(true);
		try {
            await matchDog(favDogObjects).then((response) => {
			  if(response.success) {
				setMatchedDog(favDogObjects.find((dog) => dog.id === response.match));
			  }
			});
        } catch (error) {
            setError(error);
        } finally {
            setMatchLoading(false);
        }
	}

	const addToFavs = (index) => {
		const dogs = [...dogObjects];
		const [removed] = dogs.splice(index, 1);
	
		// remove action
		setDogObjects(dogs);
	
		// duplicate check
		// this shouldn't happen but will
		// cause errors if it does so prevent it
		if (favDogObjects.some((dog) => dog.id === removed.id)) {
			return;
		}
		setNumAlreadyFav(numAlreadyFav + 1);
	
		// add dog to the new list
		const newFavDogObjects = [...favDogObjects];
		newFavDogObjects.push(removed);

		window.localStorage.setItem('favDogs', JSON.stringify(newFavDogObjects));
		setFavDogObjects(newFavDogObjects);
	}

	const removeFromFavs = (index) => {
		const favs = [...favDogObjects];
		const [removed] = favs.splice(index, 1);
	
		// remove action
		window.localStorage.setItem('favDogs', JSON.stringify(favs));
		setFavDogObjects(favs);
	
		// duplicate check
		// this shouldn't happen but will
		// cause errors if it does so prevent it
		if (dogObjects.some((dog) => dog.id === removed.id)) {
		  return;
		}
		if (resultIds.includes(removed.id)) {
			setNumAlreadyFav(numAlreadyFav - 1);
		
			// add dog to the correct location in the new list
			const newDogObjects = [...dogObjects];
			newDogObjects.push(removed);
			setDogObjects(newDogObjects);
		}
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

		  setNumAlreadyFav(numAlreadyFav + 1);
	  
		  // add dog to the correct location in the new list
		  const newFavDogObjects = [...favDogObjects];
		  if (result.destination.index === 0) {
			newFavDogObjects.unshift(removed);
		  } else if (result.destination.index === favDogObjects.length) {
			newFavDogObjects.push(removed);
		  } else {
			newFavDogObjects.splice(result.destination.index, 0, removed);
		  }

		  window.localStorage.setItem('favDogs', newFavDogObjects);
		  setFavDogObjects(newFavDogObjects);
		} else if (sourceDroppableId === 'favDrop' && destinationDroppableId === 'dogDrop') {
		  const favs = [...favDogObjects];
		  const [removed] = favs.splice(result.source.index, 1);
	  
		  // remove action
		  window.localStorage.setItem('favDogs', favs);
		  setFavDogObjects(favs);
	  
		  // duplicate check
		  if (dogObjects.some((dog) => dog.id === removed.id)) {
			return;
		  }

		  if (resultIds.includes(removed.id)) {
			setNumAlreadyFav(numAlreadyFav - 1);
		
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
		  }
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

	const clearMatch = () => {
		setMatchedDog(null);
	}

	const clearFocus = () => {
		setFocusedDog(null);
	}

	const onClickMatch = () => {
		if(favDogObjects && favDogObjects.length) {
			findMatch();
		}
	}

	if(redirect) {
    	return (
    		<Navigate to={redirect}/>
    	);
    }

	return (
	<>
		{ error && 
			<Alert variant="danger" onClose={() => setError(false)} dismissible>
				<Alert.Heading>Error:</Alert.Heading>
				<p>
					{error.toString()}
				</p>
			</Alert>
        }
		<DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
			<div className="filter-wrapper sticky-top">
				<LocationSearchComponent
					setZips={setZips}
					selectedStates={selectedStates}
					handleSelect={handleStateSelect}
					size={size}
					setError={setError}
					lastSearch={lastSearch}
					setLastSearch={setLastSearch}
				/>
				<div className="breed-button-wrapper">
					<ButtonGroup className="text-center breed-button-group">
						<BreedDropdownComponent
							breeds={breeds}
							selectedBreeds={selectedBreeds}
							handleBreedSelect={handleBreedSelect}
							loadingBreeds={loadingBreeds}
							size={size}
						/>
						{selectedBreeds && selectedBreeds.length !== 1 &&
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
						{(zips && !zips.length) && !!lastSearch && !dogLoading &&
							<p className='text-muted fw-light'>
								<FaGlobe className='inline-icon me-1'/> Showing dogs in all areas.
							</p>
						}
						{(zips && zips.length !== 0) && !!lastSearch && lastSearch!=="" && !dogLoading &&
							<p className='text-muted fw-light'>
								<FaFlag className='inline-icon me-1'/> Showing dogs for search: "{lastSearch}"
							</p>
						}
						{dogLoading && 
							<DogsLoadingBit/>
						}
						{dogObjects && !dogLoading &&
							<StrictModeDroppable droppableId="dogDrop" direction="vertical">
								{(provided, _snapshot) => (
									<Row
									className="justify-content-center"
									ref={provided.innerRef}
									{...provided.droppableProps}
									>
										{dogObjects.map((dogObject, index) => (
											<Draggable key={dogObject.id} draggableId={dogObject.id} index={index}>
											{(provided, _snapshot) => (
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
														focusFunc={() => setFocusedDog(dogObject)}
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
						{dogObjects && !dogLoading && (dogObjects.length === 0) && !!resultIds.length &&
							<>
								<h4 className='mt-5'>There's nothing here!</h4>
								{numAlreadyFav > 0 &&
									<h6> {`${numAlreadyFav} dog${numAlreadyFav > 1 ? 's' : ''} on this page ${numAlreadyFav > 1 ? 'are' : 'is'} already in your favorites.`} </h6>
								}
								{page < Math.floor(total/PER_PAGE) &&
								<p className={'text-center'}>
									You can keep browsing for dogs on the next page.
								</p>
								}
								<h1 className='standout-text text-center'><FaDog/><FaHeart className='inline-icon'/></h1>
							</>
						}
						{dogObjects && !dogLoading && (dogObjects.length === 0) && !resultIds.length &&
							<>
								<h4 className='mt-5'>No results!</h4>
								{numAlreadyFav > 0 &&
									<h6> {`${numAlreadyFav} dog${numAlreadyFav > 1 ? 's' : ''} on this page ${numAlreadyFav > 1 ? 'are' : 'is'} already in your favorites.`} </h6>
								}
								<p className={'text-center'}>
									You can either refine your search or change your filters to find more dogs.
								</p>
								<h1 className='standout-text text-center'><FaDog/><FaHeart className='inline-icon'/></h1>
							</>
						}
					</div>
				</Col>
				<Col xs={5} sm={3} md={2}>
					<div className={`sticky-top right-side-container${draggingL ? ' dragging' : ''}`}>
						<h6 className="right-side-title ms-2"><FaHeart className='inline-icon' /> { size==='xs' ? 'Fav. Dogs' : 'Favorite Dogs:'} </h6>
						<TooltipBit tip="... to over here." order={6}/>
						{favDogObjects && favDogObjects.length < 1 &&
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
													focusFunc={() => setFocusedDog(dogObject)}
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
	  { !!total && 
		<div className='sticky-bottom page-container'>
				<ButtonGroup className="text-center mt-3 page-buttons">
					<Button className="ldbutton" onClick={handlePrev} disabled={page === 0}>Prev</Button>
					<Button className="ldbutton" variant='secondary' disabled> {PER_PAGE*page} - {PER_PAGE*page + (dogObjects ? dogObjects.length : 0)} of {total} </Button>
					<Button className="ldbutton" onClick={handleNext} disabled={page === Math.ceil(total/PER_PAGE) - 1}>Next</Button>
				</ButtonGroup>
				<p className={'text-center page-count'}>
					<span>{`Page ${page + 1} of ${Math.ceil(total/PER_PAGE)}`}</span>
				</p>
		</div>
	  }
	  <MatchButtonComponent show={favDogObjects && !!favDogObjects.length} onClick={onClickMatch} loading={matchLoading}/>
	  <FocusComponent focusedDog={focusedDog} city={focusedDog ? dogCities[focusedDog.id] : '' } clearFocus={clearFocus}/>
	  <MatchComponent matchedDog={matchedDog} yourName={yourName} city={matchedDog ? dogCities[matchedDog.id] : '' } clearMatch={clearMatch}/>
	</>
	)
	
}

export default BrowseComponent;
