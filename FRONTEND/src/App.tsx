import { Routes, useNavigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import { useEffect, useState } from "react"


function App() {
const navigate = useNavigate()
const [currentUser , setcurrentUser]=useState(()=>{ 
  const stored = localStorage.getItem('currentUser')
  return stored ? JSON.parse(stored) : null
})
useEffect(()=>{
  if(currentUser){
    localStorage.setItem('currentUser',JSON.stringify(currentUser))
  }else{
    localStorage.removeItem('currentUser')
  }
},[currentUser])
const handleAuthSubmit = data => {
  const user ={
    email:data.email,
    name:data.name || 'User',
    avatar:''
  }
  setcurrentUser(user)
  navigate('/',{replace:true})
}
const handleLogout = ()=>{
  localStorage.removeItem('token')
  setcurrentUser(null)
  navigate('\login',{replace:true})
}
  return (
<Routes>
<Route path='/' element={}/>
</Routes>
  )
}

export default App
