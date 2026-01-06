import { useState } from "react";
import{ Link,useNavigate, useParams, useLocation  } from "react-router-dom"; 
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function login(e){
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/users/login", {
                email: email,
                password: password
            });
            console.log(response.data);
          
            // Check if response has the expected structure
            if (!response.data) {
                toast.error("Invalid response from server");
                return;
            }

            // Store token if available
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            
            // Handle user data - check different possible response structures
            const userData = response.data.user || response.data;
            localStorage.setItem("user", JSON.stringify(userData));
            
            toast.success("Login successful!");
            
            // Redirect based on user role
            if (userData.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("There was an error!", error);
            toast.error(
                error?.code === "ERR_NETWORK"
                    ? "Cannot reach the server. Please check if the API is running."
                    : "Login failed. Please check your credentials."
            );
        }
    }
    
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[url('public/loginBG.jpg')] bg-cover bg-center p-4">

            {/* Glassmorphism Card */}
            <div className="backdrop-blur-md bg-white/10 border border-white/20 w-full max-w-sm h-auto p-8 rounded-3xl shadow-2xl">

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Welcome </h2>
                    <p className="text-white/65 text-sm mt-2">Please enter your details</p>
                </div>

                <form className="space-y-6" onSubmit={login}>
                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            onChange={
                                (e) => setEmail(e.target.value)

                            }
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            onChange={
                                (e) => setPassword(e.target.value)
                            }
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        />
                    </div>

                    {/* Login Button */}
                    <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all active:scale-[0.98] mt-4">
                        Sign In
                    </button>

                    <button type="button" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all active:scale-[0.98] mt-4">
                        Sign In with Google
                    </button>

                    {/* Extra Links */}
                    <div className="text-center mt-6">
                        <a href="#" className="text-white/60 text-sm hover:text-white transition-colors">
                            Forgot password?
                        </a>
                    </div>

                    <p className="text-white/70 text-sm text-center mt-6">
                        Don't have an account?
                        <a href="/register" className="text-white font-bold hover:underline ml-1">Register here</a>
                    </p>
                </form>

            </div>
        </div>


    )


}