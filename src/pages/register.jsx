import Login from "./login"
import { useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
export default function Rejister() {

    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleRegister(e) {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        
        try {
            const response = await axios.post("http://localhost:3000/users/register", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            });
            console.log(response.data);
            toast.success("Registration successful! Redirecting to login...");
            
            
            setTimeout(() => {
                navigate("/login");
            }, 1500); 
        } catch (error) {
            console.error("There was an error!", error);
            toast.error("Registration failed. Please try again.");
        }
    }





    return (

        <div className="min-h-screen w-full flex items-center justify-center bg-[#1e1e27] p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-2xl">
                <h2 className="text-3xl font-bold text-[#1e1e27] text-center mb-8">Create Account</h2>

                <form className="grid grid-cols-1 gap-4" onSubmit={handleRegister}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-[#1e1e27] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D10024] focus:border-transparent" 
                        />
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-[#1e1e27] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D10024] focus:border-transparent" 
                        />
                    </div>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-[#1e1e27] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D10024] focus:border-transparent" 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-[#1e1e27] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D10024] focus:border-transparent" 
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-[#1e1e27] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D10024] focus:border-transparent" 
                        />
                    </div>

                    <button type="submit" className="w-full bg-[#D10024] text-white font-bold py-3 rounded-lg hover:bg-[#a8001d] transition-all mt-2">
                        Register Now
                    </button>
                </form>

                <p className="text-gray-600 text-sm text-center mt-6">
                    Already have an account? <a href="/login" className="text-[#D10024] font-bold hover:underline">Login</a>
                </p>
            </div>
        </div>
    )
}
