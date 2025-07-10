import { BACKEND_URL } from "./const"

export const loadPosts = (setPosts) => {
    
}


export const handleAuthentication = async (e, loginMode, setLoggedInUser, username, password, fullName) => {
    const url = `${BACKEND_URL}/${loginMode ? "login" : "register"}`;

    const body = loginMode ? {username, password} : {username, password, name: fullName}

    
}