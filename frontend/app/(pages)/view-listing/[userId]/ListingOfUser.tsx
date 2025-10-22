'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import { fetchUser } from "@/lib/store/authSlice";
import { fetchListing } from "@/lib/store/listingSlice";
import { Loader } from "@/components/ui/loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Edit, Eye, Trash2 } from "lucide-react";

export default function ListingOfUser({userId}:{userId:string}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { listings, listingloading, currentPage, totalPages } = useSelector((state: RootState) => state.listings);


  const loadMore = () => {
    if (currentPage < totalPages) {
      dispatch(fetchListing({page:currentPage + 1, userId}));
    }
  }
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [listings]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    const init = async () => {
        await dispatch(fetchListing({page:currentPage, userId}));
    }

    init();
  }, [dispatch]);

  return (
    <>
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

              <div className="flex gap-4 mt-4">
                <Button
                    className="cursor-pointer"
                    onClick={() => router.push(`/listing/${listing._id}`)}
                >
                    <Eye />
                </Button>
                <Button
                    className="cursor-pointer"
                    onClick={() => router.push(`/listing/${listing._id}/edit`)}
                >
                    <Edit />
                </Button>
                <Button
                    className="cursor-pointer"
                    onClick={() => router.push(`/listing/${listing._id}`)}
                >
                    <Trash2 />
                </Button>
              </div>
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
