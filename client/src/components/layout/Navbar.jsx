import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl  px-2 py-3 flex mx-auto justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-[#fe424d]">
          Wanderlust
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 mx-auto mr-1">
          <Link
            to="/listings"
            className="text-gray-700 hover:text-[#fe424d] transition"
          >
            Airbnb you home
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-[#fe424d] transition"
          >
            Signup
          </Link>
          <Link
            to="/login"
            className="text-gray-700 hover:text-[#fe424d] transition"
          >
            Login
          </Link>
          <Link
            to="/logout"
            className="text-gray-700 hover:text-[#fe424d] transition"
          >

          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-3 bg-white border-t py-3">
          <Link
            to="/createListing"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-[#fe424d] transition"
          >
            Airbnb you home
          </Link>
          <Link
            to="/signup"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-[#fe424d] transition"
          >
            Signup
          </Link>
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-[#fe424d] transition"
          >
            LOgin
          </Link>
          <Link
            to="/logout"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-[#fe424d] transition"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
