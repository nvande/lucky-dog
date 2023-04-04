const useLogin = ({name, email}) => {

    let user = {
        name: name,
        email: email
    }

    return {
        isAuthenticated: true,
        loading: false,
        logout: () => {},
        user,
    };
}

export default useLogin;