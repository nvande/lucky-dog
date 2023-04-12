const dogInfo = async (dogIds) => {
    let requestOptions = null;
    let success = false;
    let er = null;

    let dogObjects = [];
    // array for dog objects to be populated into
  
    const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzgzMDU2MTF9.Ky49nXH6qgHJQ0CBsZGYsP7_Is2am3u5j3RAdEl457s';
  
    try {
      requestOptions = {
        method: 'POST',
        headers: {
          'fetch-api-key': API_KEY,
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
        const res = await fetch("https://frontend-take-home-service.fetch.com/dogs", requestOptions);
        dogObjects = await res.json();

        success = true;

      } catch (error) {
        console.error(error);
        er = "Error while fetching dog information. Please try again or contact support.";
      }
    }
  
    if(er) {
      throw new Error(er);
    }
  
    return { success, dogObjects };
  }

  const getCityByZip = async (zip) => {
    const apiKey = 'AIzaSyDi7JA_hoSWzW2_gkZge2MZpfMT0vS2zAw'; // replace with your actual API key
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${apiKey}`);
    const data = await response.json();

    return data.status == "OK" ? // if bad request,
        data.results[0].formatted_address : `Zip: ${zip}`; // if not found just throw the zip back
  }

  export { dogInfo, getCityByZip };