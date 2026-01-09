import { useState } from "react";
import{ Link,useNavigate,  } from "react-router-dom"; 
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function login(e){
        e.preventDefault();
        
        // Validate empty fields
        if (!email.trim() || !password.trim()) {
            toast.error("Please enter both email and password");
            return;
        }
        
        try {
            const response = await axios.post("http://localhost:3000/users/login", {
                email: email,
                password: password
            });
            console.log(response.data);

            if (!response.data) {
                toast.error("Invalid response from server");
                return;
            }

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            const userData = response.data.user || response.data;
            localStorage.setItem("user", JSON.stringify(userData));
            
            toast.success("Login successful!");

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
      <div className="min-h-screen w-full flex items-center justify-center bg-[#1e1e27] p-4">
        <div className="bg-white w-full max-w-sm h-auto p-8 rounded-lg shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1e1e27] tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Please enter your details
            </p>
          </div>

          <form className="space-y-6" onSubmit={login}>
            <div className="flex flex-col gap-2">
              <label className="text-[#1e1e27] text-sm ml-1 font-medium">Email Address</label>
              <input
                type="email"
                placeholder="email@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-[#1e1e27] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D10024] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#1e1e27] text-sm ml-1 font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-[#1e1e27] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D10024] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#D10024] text-white font-bold py-3 rounded-lg hover:bg-[#a8001d] transition-all mt-2"
            >
              Sign In
            </button>

            <p className="text-gray-600 text-sm text-center mt-6">
              Don't have an account?
              <a
                href="/register"
                className="text-[#D10024] font-bold hover:underline ml-1"
              >
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    );


}