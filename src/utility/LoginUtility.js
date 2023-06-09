const login = async (name, email) => {
    const fullName = [name.first, name.middle, name.last].join(' ');
    let requestOptions = null;
    let success = false;
    let er = null;

    try {
        requestOptions = {
            method: 'POST',
            headers: {
                'fetch-api-key': process.env.REACT_APP_FETCH_API_KEY,
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
        er = "Error while logging you in. Please try again or contact support.";
    }
    if (requestOptions) {
        try {
            const res = await fetch(process.env.REACT_APP_FETCH_API_URL+"/auth/login", requestOptions);
            success = res.ok;
        } catch (error) {
            console.error(error);
            er = "Error while logging you in. Please try again or contact support.";
        }
    }

    if(er) {
        throw new Error(er);
    }

    return { success, er };
}

const logout = async () => {
    let requestOptions = null;
    let success = false;
    let er = null;

    try {
        requestOptions = {
            method: 'POST',
            headers: {
                'fetch-api-key': process.env.REACT_APP_FETCH_API_KEY,
                'Content-Type': 'application/json',
             },
            credentials: 'include'
        };
    } catch (error) {
        console.error(error);
        er = "Error while logging you out. Please try again or contact support.";
    }
    if (requestOptions) {
        try {
            const res = await fetch(process.env.REACT_APP_FETCH_API_URL+"/auth/logout", requestOptions);
            success = res.ok;
        } catch (error) {
            console.error(error);
            er = "Error while logging you out. Please try again or contact support.";
        }
    }

    if(er) {
        throw new Error(er);
    }

    return { success, er };
}

export { login, logout };