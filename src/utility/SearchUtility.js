const search = async (page, breeds, zips, asc=true) => {
  let requestOptions = null;
  let success = false;
  let er = null;

  let data = [];
  // array for search results data to be populated into
  // will look like:
  // next (api url for next page)
  // prev (api url for prev page)
  // resultIds (array of dogs, ids only)
  // total (int number of total dogs for this search)

  let url = "/dogs/search";
  if (breeds.length > 0) {
    url += "?breeds="+breeds.join('&breeds=');
    if(breeds.length > 1) {
      url += "&sort=breed:"+(asc ? "asc" : "desc");
    }
  } else {
    url += "?sort=breed:"+(asc ? "asc" : "desc");
  }
  url += `&size=${process.env.REACT_APP_PAGE_SIZE}`
  url += `&from=${page*process.env.REACT_APP_PAGE_SIZE}`

  if (zips && zips.length > 0) {
    url += "&zipCodes="+zips.join('&zipCodes=');
  }

  try {
    requestOptions = {
      method: 'GET',
      headers: {
        'fetch-api-key': process.env.REACT_APP_FETCH_API_KEY,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    };
  } catch (error) {
    console.error(error);
    er = "Error while searching for dogs. Please try again or contact support.";
  }
  if (requestOptions) {
    try {
      const res = await fetch(process.env.REACT_APP_FETCH_API_URL + url, requestOptions);
      data = await res.json();
      success = res.ok;

    } catch (error) {
      console.error(error);
      er = "Error while searching for dogs. Please try again or contact support.";
    }
  }

  if(er) {
    throw new Error(er);
  }

  return { success, data, er };
}

  
const getBreeds = async () => {
    let requestOptions = null;
    let success = false;
    let er = null;

    let breeds = [];
  
    try {
      requestOptions = {
        method: 'GET',
        headers: {
          'fetch-api-key': process.env.REACT_APP_FETCH_API_KEY,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      };
    } catch (error) {
      console.error(error);
      er = "Error while getting dog breed info. Please try again or contact support.";
    }
    if (requestOptions) {
      try {
        const res = await fetch(process.env.REACT_APP_FETCH_API_URL+"/dogs/breeds", requestOptions);
        breeds = await res.json();
        success = res.ok;

      } catch (error) {
        console.error(error);
        er = "Error while getting dog breed info. Please try again or contact support.";
      }
    }
  
    if(er) {
      throw new Error(er);
    }
  
    return { success, breeds, er };
  }
  
  export { search, getBreeds };