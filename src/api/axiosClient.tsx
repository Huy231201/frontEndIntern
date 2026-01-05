import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://api-dev.gotrust.vn/edupay/v1",
    headers: {
        "accept": "text/plain",
        "x-api-version": "1.0"
    }
});


axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

axiosClient.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;
        const url = err.config?.url;

        if (
            status === 401 &&
            !url.includes("/accounts/login")
        ) {
            localStorage.removeItem("token");

            if(window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(err);
    }
)

export default axiosClient;