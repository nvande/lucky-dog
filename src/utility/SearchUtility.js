const PAGE_SIZE = 24;

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

  const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzgzMDU2MTF9.Ky49nXH6qgHJQ0CBsZGYsP7_Is2am3u5j3RAdEl457s';

  let url = "/dogs/search";
  if (breeds.length > 0) {
    url += "?breeds="+breeds.join('&breeds=');
    if(breeds.length > 1) {
      url += "&sort=breed:"+(asc ? "asc" : "desc");
    }
  } else {
    url += "?sort=breed:"+(asc ? "asc" : "desc");
  }
  url += `&size=${PAGE_SIZE}`
  url += `&from=${page*PAGE_SIZE}`

  if (zips && zips.length > 0) {
    url += "&zipCodes="+zips.join('&zipCodes=');
  }

  try {
    requestOptions = {
      method: 'GET',
      headers: {
        'fetch-api-key': API_KEY,
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
      const res = await fetch("https://frontend-take-home-service.fetch.com" + url, requestOptions);
      data = await res.json();
      success = true;

    } catch (error) {
      console.error(error);
      er = "Error while searching for dogs. Please try again or contact support.";
    }
  }

  if(er) {
    throw new Error(er);
  }

  return { success, data };
}

  
  const getBreeds = async () => {
    let requestOptions = null;
    let success = false;
    let er = null;

    let breeds = [];
  
    const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzgzMDU2MTF9.Ky49nXH6qgHJQ0CBsZGYsP7_Is2am3u5j3RAdEl457s';
  
    try {
      requestOptions = {
        method: 'GET',
        headers: {
          'fetch-api-key': API_KEY,
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
        const res = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", requestOptions);
        breeds = await res.json();
        success = true;

      } catch (error) {
        console.error(error);
        er = "Error while getting dog breed info. Please try again or contact support.";
      }
    }
  
    if(er) {
      throw new Error(er);
    }
  
    return { success, breeds };
  }
  
  export { search, getBreeds };