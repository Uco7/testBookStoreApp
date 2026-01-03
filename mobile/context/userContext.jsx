import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from 'axios'
let APPURl="http://192.168.144.202:5000"


export const UserContext=createContext();
export  function UserProvider({children}){
  const [user,setUser]=useState(null);
  const [authToken,setAuthToken]=useState(false);
   async function login(email,password){
  
    try {
        const res=await axios.post(`${APPURl}/login`,{email,password})
    console.log("loggged user data",res.data)
    const  userToken=await AsyncStorage.setItem("token",res.data.token);
    console.log("asnystorage data||token=",userToken)
     await fetchUser();
    //  return (true)
      
    } catch (error) {
      console.log("login error:", error.response?.data || err.message);
      // return (false)
      
    }
    }
    async function register(email,password) {
      try {
        const newUser=await axios.post(`${APPURl}/register`,{email,password})
        console.log("registered user data",newUser)

        
      } catch (error) {
        throw new Error(error.message||"Registration failed")
        
      }
      
    }
    async function fetchUser() {
      try {
        const token=await AsyncStorage.getItem("token");
        if(!token){
          throw new Error("No auth token found");
         
        }
        console.log("fetched token from asyncstorage",token)
        const response=await axios.get(`${APPURl}/user`,({
          headers:{
            Authorization:`Bearer ${token}`
          }
        }))
        if(response.data){
          console.log("fetched user data",response.data)
          setUser(response.data)
          
        }
        
      } catch (error) {
        console.log("fetch user error:", error.message);
      // console.log("Fetch user error:", error.response?.status, error.response?.data || error.message);
        
      }finally{
        setAuthToken(true)
      }
      }
    async function logOut() {
      try {
        await AsyncStorage.removeItem("token");
        setUser(null);
        setAuthToken(false);
        
      } catch (error) {
        console.log("logout error",error)
        
      }
      
    }
    useEffect(() => {
      fetchUser();
    }, []);
    return(
      <UserContext.Provider value={{user,authToken,login,register,logOut}}>
        {children}
      </UserContext.Provider>
    ) 
  
  }
  



