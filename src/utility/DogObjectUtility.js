const getDogs = async (dogIds) => {
  const batchSize = 99;
  let requestOptions = null;
  let success = false;
  let er = null;
  let dogObjects = [];

  if (dogIds.length > batchSize) {
    const batchIds = [];
    for (let i = 0; i < dogIds.length; i += batchSize) {
      batchIds.push(dogIds.slice(i, i + batchSize));
    }

    for (const ids of batchIds) {
      try {
        requestOptions = {
          method: 'POST',
          headers: {
            'fetch-api-key': process.env.REACT_APP_FETCH_API_KEY,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(ids)
        };
      } catch (error) {
        console.error(error);
        er = "Error while fetching dog information. Please try again or contact support.";
      }

      if (requestOptions) {
        try {
          const res = await fetch(process.env.REACT_APP_FETCH_API_URL+"/dogs", requestOptions);
          const dogs = await res.json();
          dogObjects = dogObjects.concat(dogs);
          success = true;
        } catch (error) {
          console.error(error);
          er = "Error while fetching dog information. Please try again or contact support.";
        }
      }
    }
  } else {
    try {
      requestOptions = {
        method: 'POST',
        headers: {
          'fetch-api-key': process.env.REACT_APP_FETCH_API_KEY,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(dogIds)
      };
    } catch (error) {
      console.error(error);
      er = "Error while fetching dog information. Please try again or contact support.";
    }

    if (requestOptions) {
      try {
        const res = await fetch(process.env.REACT_APP_FETCH_API_URL+"/dogs", requestOptions);
        dogObjects = await res.json();
        success = true;
      } catch (error) {
        console.error(error);
        er = "Error while fetching dog information. Please try again or contact support.";
      }
    }
  }

  if (er) {
    throw new Error(er);
  }

  return { success, dogObjects };
};


const getDogCities = async (dogObjects) => {
    let requestOptions = null;
    let success = false;
    let er = null;

    let locations = [];
    let zips = [];
    let dogCities = {};
    // array for dog objects to be populated into

    dogObjects.forEach((dogObject) => {
        zips.push(dogObject.zip_code);
    });
  
    try {
      requestOptions = {
        method: 'POST',
        headers: {
          'fetch-api-key': process.env.REACT_APP_FETCH_API_KEY,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(zips)
      };
    } catch (error) {
      console.error(error);
      er = "Error while fetching dog information. Please try again or contact support.";
    }
    if (requestOptions) {
      try {
        const res = await fetch("https://frontend-take-home-service.fetch.com/locations", requestOptions);
        locations = await res.json();

        success = true;

      } catch (error) {
        console.error(error);
        er = "Error while fetching dog information. Please try again or contact support.";
      }
    }

    locations.forEach((location, i) => {
      dogCities[dogObjects[i].id] = `${location.city}, ${location.county} ${location.state} ${location.zip_code}`
    });
  
    if(er) {
      throw new Error(er);
    }

    return { success, dogCities }
  }

  const matchDog = async (dogObjects) => {
    let requestOptions = null;
    let success = false;
    let er = null;

    let dogIds = []
    let match = null;

    dogObjects.forEach((dogObject) => {
        dogIds.push(dogObject.id);
    });
  
    try {
      requestOptions = {
        method: 'POST',
        headers: {
          'fetch-api-key': process.env.REACT_APP_FETCH_API_KEY,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(dogIds)
      };
    } catch (error) {
      console.error(error);
      er = "Error while fetching dog information. Please try again or contact support.";
    }
    if (requestOptions) {
      try {
        const res = await fetch(process.env.REACT_APP_FETCH_API_URL+"/dogs/match", requestOptions);
        const data = await res.json();
        match = data.match;

        success = true;

      } catch (error) {
        console.error(error);
        er = "Error while fetching dog information. Please try again or contact support.";
      }
    }
  
    if(er) {
      throw new Error(er);
    }

    return { success, match }
  }

  export { getDogs, getDogCities, matchDog };