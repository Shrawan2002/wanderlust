'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from 'react-redux'; // ✅ Import useSelector
import { RootState } from "@/lib/store"; // ✅ Import RootState type
import {useAppDispatch} from "@/lib/hooks"
import {fetchUser} from "@/lib/store/authSlice"
import { Loader } from "@/components/ui/loader";
import Navbar from "../components/Navbar";
export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {

const dispatch = useAppDispatch();
    const [checkingAuth, setCheckingAuth] = useState(true);
    useEffect(()=>{
    const token = localStorage.getItem('accessToken');
    if(token){
        fetchprofile();
    }else{
        dispatch({ type: "auth/markInitialized" });
    }
    setCheckingAuth(false)
    }, [])
    const fetchprofile = async()=>{
    await dispatch(fetchUser())
    }
    const {user, loading, error, initialized} = useSelector((state: RootState) => state.auth); 
    if (checkingAuth || (loading && !initialized)) {
    return <Loader message="Checking authentication..." />;
    }
    
  return (
    <div >
        <Navbar />  
      {children}
    </div>
  );
}
