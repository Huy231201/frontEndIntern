import {createContext, useContext, useState} from "react"
import {loginApi} from "../api/auth"
import {useNavigate} from "react-router-dom"

interface AuthContextType {
    token: string | null;
    login: (account: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({children}: {children:React.ReactNode}) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    const login = async(account: string, password: string) => {
        try {
            const response = await loginApi(account, password);
            const token = response.data.token;

            if(!token) {
                console.log("Sai tài khoản hoặc mật khẩu")
            }

            setToken(token);
            localStorage.setItem("token", token)
            navigate("/dashboard")
        } catch (err) {
            throw err
        }
    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <AuthContext.Provider value={{token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
    return ctx;
}