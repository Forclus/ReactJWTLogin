import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import config from "../config";

const useAxios = () => {
    const { authTokens, setUser, setAuthTokens, logoutUser } = useContext(AuthContext);

    const baseURL = config.apiUrl;

    const axiosInstance = axios.create({
        baseURL,
        headers: {
            Authorization: `Bearer ${authTokens?.jwToken}`
        }
    });

    axiosInstance.interceptors.request.use(
        async req => {
            const user = jwtDecode(authTokens.jwToken);
            const isExpired = Date.now() > user.exp;

            if (!isExpired) return req;
            let response;

            try {
                response = await axios.post(
                    `${baseURL}/oauth/jwtrefresh`,
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${authTokens.jwToken}`
                        }
                    }
                );

                localStorage.setItem("authTokens", JSON.stringify(response.data));
                setAuthTokens(response.data);
                setUser(jwtDecode(response.data.jwToken));

                req.headers.Authorization = `Bearer ${jwtDecode(response.data.jwToken)}`;

                return req;
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    // Not expired token or maybe modified token or simply incorrect token
                    return logoutUser();
                } else {
                    console.log('Error:', error.message);
                }
            }
        }
    );

    axiosInstance.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                logoutUser()
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
}

export default useAxios;
