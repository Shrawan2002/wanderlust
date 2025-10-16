
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"
export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}
