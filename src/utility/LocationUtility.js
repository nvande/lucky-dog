const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzgzMDU2MTF9.Ky49nXH6qgHJQ0CBsZGYsP7_Is2am3u5j3RAdEl457s';
const SEARCH_URL = 'https://frontend-take-home-service.fetch.com/locations/search';

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
    const apiKey = 'f1ef2dd3025b442b9fd435fa6598115d';
    const searchQuery = searchString + ` ${selectedStates.join(', ')}`; // add the states onto the string for better results
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
    const response = await fetch(url);
    const locationData = await response.json();

    // Extract city and state from location data
    const city = locationData.results[0].components.city;
    const states = [locationData.results[0].components.state_code];

    // Compute geoBoundingBox based on location data and range
    const lat = locationData.results[0].geometry.lat;
    const lon = locationData.results[0].geometry.lng;
    const earthRadius = 3959; // in miles
    const latDelta = range / earthRadius * (180 / Math.PI);
    const lonDelta = range / (earthRadius * Math.cos(lat * Math.PI / 180)) * (180 / Math.PI);

    let geoBoundingBox = null;
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
    }

    return { city, states, geoBoundingBox };
}

const getZips = async (locObject, states) => {
    let requestOptions = null;
    let success = false;
    let er = null;

    let zips = [];
    let locations = [];

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
          'fetch-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(removeNullProperties({...locObject, ...{size: 100}})),
      };
    } catch (error) {
      console.error(error);
      er = "Error while fetching dog information. Please try again or contact support.";
    }
    if (requestOptions) {
      try {
        let res = await fetch(SEARCH_URL, requestOptions);
        let data = await res.json();
        locations = data.results;
        let from = locations.length;

        locations.forEach((location) => {
            zips.push(location.zip_code);
        });

        const total = data.total;
        while( from < total ) {
            const size = Math.min(100, total-from);

            const sizeObj = {size, from}
            requestOptions.body = JSON.stringify(removeNullProperties({...locObject, ...sizeObj}));

            res = await fetch(SEARCH_URL, requestOptions);
            data = await res.json();
            locations = data.results;
            from += locations.length;

            locations.forEach((location) => {
                zips.push(parseInt(location.zip_code));
            });
        }

        // sadly, search breaks if we search for more than 130 zips
        // therefore, if we have a huge list of >130 zips from a big
        // search area, we just remove random zip codes
        // until we have less than 130 zips
        const MAX_ZIPS = 130;
        if (zips.length > MAX_ZIPS) {
            const numToRemove = zips.length - MAX_ZIPS;
            for (let i = 0; i < numToRemove; i++) {
                const indexToRemove = Math.floor(Math.random() * zips.length);
                zips.splice(indexToRemove, 1);
            }
        }

        success = true;

      } catch (error) {
        console.error(error);
        er = "Error while fetching dog information. Please try again or contact support.";
      }
    }

    if(er) {
      throw new Error(er);
    }

    return { success, zips }
}

export { getLocationInfo, getZips, states }