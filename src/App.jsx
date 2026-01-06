import { Route, Router, Routes } from "react-router-dom"
import Home from "./pages/home.jsx"
import Login from "./pages/login.jsx"
import Admin from "./pages/admin.jsx"
import Register from "./pages/register.jsx"
import Search from "./pages/search.jsx"
import { Toaster } from "react-hot-toast"


export default function App() {
  return (
    <>

    <div>
      <Toaster  position="top-center" />
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />



      </Routes>





    </div>




    </>
    
    
  )
}
