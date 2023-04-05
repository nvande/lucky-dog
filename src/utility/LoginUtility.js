const login = async (name, email) => {
    const fullName = [name.first, name.middle, name.last].join(' ');
    let requestOptions = null;
    let success = false;
    let er = null;

    function getCookie(key) {
        var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
        return b ? b.pop() : "";
    }

    try {
        requestOptions = {
            method: 'POST',
            headers: {
                'fetch-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzgzMDU2MTF9.Ky49nXH6qgHJQ0CBsZGYsP7_Is2am3u5j3RAdEl457s',
                'Content-Type': 'application/json',
             },
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
            .then((data) => {
                data.headers.forEach(function(value, name) {
                    console.log(name + ": " + value);
                });

                console.log(getCookie('fetch-access-token'));

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

export default login;