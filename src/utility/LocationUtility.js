const states = [
    { name: "Alabama", code: "AL" },
    { name: "Alaska", code: "AK" },
    { name: "Arizona", code: "AZ" },
    { name: "Arkansas", code: "AR" },
    { name: "California", code: "CA" },
    { name: "Colorado", code: "CO" },
    { name: "Connecticut", code: "CT" },
    { name: "Delaware", code: "DE" },
    { name: "Florida", code: "FL" },
    { name: "Georgia", code: "GA" },
    { name: "Hawaii", code: "HI" },
    { name: "Idaho", code: "ID" },
    { name: "Illinois", code: "IL" },
    { name: "Indiana", code: "IN" },
    { name: "Iowa", code: "IA" },
    { name: "Kansas", code: "KS" },
    { name: "Kentucky", code: "KY" },
    { name: "Louisiana", code: "LA" },
    { name: "Maine", code: "ME" },
    { name: "Maryland", code: "MD" },
    { name: "Massachusetts", code: "MA" },
    { name: "Michigan", code: "MI" },
    { name: "Minnesota", code: "MN" },
    { name: "Mississippi", code: "MS" },
    { name: "Missouri", code: "MO" },
    { name: "Montana", code: "MT" },
    { name: "Nebraska", code: "NE" },
    { name: "Nevada", code: "NV" },
    { name: "New Hampshire", code: "NH" },
    { name: "New Jersey", code: "NJ" },
    { name: "New Mexico", code: "NM" },
    { name: "New York", code: "NY" },
    { name: "North Carolina", code: "NC" },
    { name: "North Dakota", code: "ND" },
    { name: "Ohio", code: "OH" },
    { name: "Oklahoma", code: "OK" },
    { name: "Oregon", code: "OR" },
    { name: "Pennsylvania", code: "PA" },
    { name: "Rhode Island", code: "RI" },
    { name: "South Carolina", code: "SC" },
    { name: "South Dakota", code: "SD" },
    { name: "Tennessee", code: "TN" },
    { name: "Texas", code: "TX" },
    { name: "Utah", code: "UT" },
    { name: "Vermont", code: "VT" },
    { name: "Virginia", code: "VA" },
    { name: "Washington", code: "WA" },
    { name: "West Virginia", code: "WV" },
    { name: "Wisconsin", code: "WI" },
    { name: "Wyoming", code: "WY" }
];

function removeNullProperties(obj) {
    for (let prop in obj) {
      if (obj[prop] === null || obj[prop] === undefined) {
        delete obj[prop];
      }
    }
    return obj;
}

const getLocationInfo = async (searchString, selectedStates, range) => {
    const apiKey = process.env.REACT_APP_GEO_API_KEY;
    const searchQuery = searchString + ` ${selectedStates.join(', ')}`; // add the states onto the string for better results
    const url = process.env.REACT_APP_GEO_API_URL+`/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
    let locationData = null;
    let er = null;
    let success = false;

    try {
      const response = await fetch(url);
      success = response.ok;

      if(response.status === 402) {
        er = "Geo API rate limit exceeded. Location features will be disabled until tomorrow."
      }

      locationData = await response.json();
    } catch (error) {
      console.error(error);
      er = "Error while fetching location information. Please try again or contact support.";
    }

    let city = searchString;
    let states = selectedStates;
    let geoBoundingBox = null;
    if (locationData) {
      if(locationData.results.length) {
        // Extract city and state from location data
        city = locationData.results[0].components.city;
        states = [locationData.results[0].components.state_code];

        // Compute geoBoundingBox based on location data and range
        const lat = locationData.results[0].geometry.lat;
        const lon = locationData.results[0].geometry.lng;
        const earthRadius = 3959; // in miles
        const latDelta = range / earthRadius * (180 / Math.PI);
        const lonDelta = range / (earthRadius * Math.cos(lat * Math.PI / 180)) * (180 / Math.PI);

        if(range) {
            geoBoundingBox = {
                bottom_left: {
                lat: lat - latDelta,
                lon: lon - lonDelta
                },
                top_right: {
                lat: lat + latDelta,
                lon: lon + lonDelta
                }
            };
        } else {
          er = "Error, no locations found. Please refine your search or contact support if this persists."
        }
      }
    } else {
      er = "Error reading location data. Please try again or contact support."
    }

    return { success, city, states, geoBoundingBox, er };
}

const getZips = async (locObject, states) => {
    let requestOptions = null;
    let success = false;
    let er = null;

    let zips = [];
    let locations = [];

    const batchSize = 5000; // things get weird if we get more than 5000 zips from location API
    const MAX_ZIPS = 130; // things also break if we send more than 130 zips to the search API

    // if we have a geoBoundingBox,
    // we don't care about the
    // city or state on the locObject,
    // already accounted for that
    // when building the box
    if (locObject.geoBoundingBox) {
        locObject.city = null;
        locObject.states = null;
    }

    // but we still apply states filter
    if (states.length) {
        locObject.states = states;
    }

    try {
      requestOptions = {
        method: 'POST',
        headers: {
          'fetch-api-key': process.env.REACT_APP_FETCH_API_KEY,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(removeNullProperties({...locObject, ...{size: batchSize}})),
      };
    } catch (error) {
      console.error(error);
      er = "Error while fetching dog information. Please try again or contact support.";
    }
    if (requestOptions) {
      try {
        let res = await fetch(process.env.REACT_APP_FETCH_API_URL+"/locations/search", requestOptions);
        if(res.ok) {
          success = true;
          let data = await res.json();
          locations = data.results;
          let from = locations.length;

          locations.forEach((location) => {
              zips.push(location.zip_code);
          });

          const total = data.total;
          while( from < total ) {
              const size = Math.min(batchSize, total-from);

              const sizeObj = {size, from}
              requestOptions.body = JSON.stringify(removeNullProperties({...locObject, ...sizeObj}));

              res = await fetch(process.env.REACT_APP_FETCH_API_URL+"/locations/search", requestOptions);
              data = await res.json();
              success = res.ok;
              locations = data.results;
              from += locations.length;

              locations.forEach((location) => {
                  zips.push(parseInt(location.zip_code));
              });
          } 

          // sadly, search breaks if we search for more than 130 zips
          // therefore, if we have a huge list of too many zips from a big
          // search area, we just remove random zip codes
          // until we have less than the specified amount
          if (zips.length > MAX_ZIPS) {
              const numToRemove = zips.length - MAX_ZIPS;
              for (let i = 0; i < numToRemove; i++) {
                  const indexToRemove = Math.floor(Math.random() * zips.length);
                  zips.splice(indexToRemove, 1);
              }
          }
        } else {
          er = "Error fetching dog information. Please try logging out and back in."
        }

      } catch (error) {
        console.error(error);
        er = "Error while fetching dog information. Please try again or contact support.";
      }
    }

    if(er) {
      throw new Error(er);
    }

    return { success, zips, er }
}

export { getLocationInfo, getZips, states }