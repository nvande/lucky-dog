const login = async (name, email) => {
    const fullName = [name.first, name.middle, name.last].join(' ');
    let requestOptions = null;
    let success = false;
    let er = null;

    try {
        requestOptions = {
            method: 'POST',
            headers: {
                'fetch-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzgzMDU2MTF9.Ky49nXH6qgHJQ0CBsZGYsP7_Is2am3u5j3RAdEl457s',
                'Content-Type': 'application/json',
             },
            credentials: 'include',
            body: JSON.stringify({
                name: fullName,
                email: email
            })
        };
    } catch (error) {
        console.error(error);
        er = "Error while preparing the form data. Please try again or contact support.";
    }
    if (requestOptions) {
        await fetch("https://frontend-take-home-service.fetch.com/auth/login", requestOptions)
            .then(res => res)
            .then(() => {
                success = true;
            })
            .catch(error => {
                console.error(error);
                er = "Error while logging you in. Please try again or contact support.";
            });
    }

    if(er) {
        throw new Error(er);
    }

    return success;
}

const logout = async () => {
    let requestOptions = null;
    let success = false;
    let er = null;

    const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzgzMDU2MTF9.Ky49nXH6qgHJQ0CBsZGYsP7_Is2am3u5j3RAdEl457s';

    fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
        headers: {
            'Content-Type': 'application/json',
            'fetch-api-key': API_KEY,
        },
        method: 'POST',
        credentials: 'include'
    })
    .then(response => response.json())
    .catch(error => console.error(error));

    try {
        requestOptions = {
            method: 'POST',
            headers: {
                'fetch-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzgzMDU2MTF9.Ky49nXH6qgHJQ0CBsZGYsP7_Is2am3u5j3RAdEl457s',
                'Content-Type': 'application/json',
             },
            credentials: 'include'
        };
    } catch (error) {
        console.error(error);
        er = "Error while preparing the form data. Please try again or contact support.";
    }
    if (requestOptions) {
        await fetch("https://frontend-take-home-service.fetch.com/auth/logout", requestOptions)
            .then(res => res)
            .then((data) => {

                success = true;
            })
            .catch(error => {
                console.error(error);
                er = "Error while logging you in. Please try again or contact support.";
            });
    }

    if(er) {
        throw new Error(er);
    }

    return success;
}

export { login, logout };