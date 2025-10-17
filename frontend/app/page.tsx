'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import { fetchUser } from "@/lib/store/authSlice";
import { fetchListing } from "@/lib/store/listingSlice";
import { Loader } from "@/components/ui/loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    const init = async () => {
      if (token) {
        await dispatch(fetchUser());
      } else {
        dispatch({ type: "auth/markInitialized" });
      }
      setCheckingAuth(false);
      await dispatch(fetchListing({page:1}));
    }

    init();
  }, [dispatch]);

  const { user, loading, initialized } = useSelector((state: RootState) => state.auth);
  const { listings, listingloading, currentPage, totalPages } = useSelector((state: RootState) => state.listings);


  const loadMore = () => {
    if (currentPage < totalPages) {
      dispatch(fetchListing({page:currentPage + 1}));
    }
  }
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [listings]);

  if (checkingAuth || (loading && !initialized) || listingloading) {
    return <Loader message="Loading..." />;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.length === 0 && (
          <p className="text-center text-muted-foreground col-span-full">No listings available</p>
        )}

        {listings.map((listing) => (
          <Card
            key={listing._id}
            className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            {/* Image */}
            <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
              <Image
                src={listing.image?.url || "/default-image.png"}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <CardContent className="p-4">
              <CardTitle className="text-lg font-semibold line-clamp-1">{listing.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                {listing.location}, {listing.country}
              </CardDescription>
              <p className="mt-2 font-medium text-foreground">${listing.price.toLocaleString()}</p>

              <Button
                className="mt-4 w-full"
                onClick={() => router.push(`/listing/${listing._id}`)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
        {currentPage < totalPages && (
          <div className="text-center mt-6" ref={bottomRef}>
            <Button onClick={loadMore} disabled={listingloading}>
              {listingloading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
      
    </>
  );
}
