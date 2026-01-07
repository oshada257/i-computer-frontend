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
            
            // Redirect to login page after successful registration
            setTimeout(() => {
                navigate("/login");
            }, 1500); // Wait 1.5 seconds to show success message
        } catch (error) {
            console.error("There was an error!", error);
            toast.error("Registration failed. Please try again.");
        }
    }





    return (

        <div className="min-h-screen w-full flex items-center justify-center bg-[url('/public/registerBg.jpg')] bg-cover bg-center p-4">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 w-full max-w-md p-8 rounded-3xl shadow-2xl">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Register</h2>

                <form className="grid grid-cols-1 gap-4" onSubmit={handleRegister}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        />
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        />
                    </div>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all mt-2">
                        Register Now
                    </button>
                </form>

                <p className="text-white/70 text-sm text-center mt-6">
                    Already have an account? <a href="/login" className="text-white font-bold hover:underline">Login</a>
                </p>
            </div>
        </div>
    )
}
