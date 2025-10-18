'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { listingById } from '@/lib/store/listingSlice';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PageDetailsProps {
    id: string;
}

interface Review {
    name: string;
    comment: string;
    date: string;
    rating: number;
}

const PageDetails: React.FC<PageDetailsProps> = ({ id }) => {
    const dispatch = useAppDispatch();
    const { listingDetail, listingloading, listingerror } = useSelector(
        (state: RootState) => state.listings
    );

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewName, setReviewName] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [rating, setRating] = useState(0);

    useEffect(() => {
        dispatch(listingById(id));
    }, [dispatch, id]);

    const newReview: Review = {
        comment: reviewComment,
        rating, // add this
        date: new Date().toLocaleDateString(),
    };

    if (listingloading) {
        return (
            <div className="container max-w-6xl mx-auto py-10 space-y-6">
                <Skeleton className="w-full h-96 rounded-xl" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (listingerror) {
        return (
            <div className="container max-w-6xl mx-auto py-10">
                <Alert variant="destructive" className="rounded-xl">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Error loading listing</AlertTitle>
                    <AlertDescription>
                        {listingerror || "Something went wrong. Please try again later."}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!listingDetail) return null;

    const imageUrl = listingDetail.image?.url || "/default-image.png";

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewComment) return;

        const newReview: Review = {
            name: reviewName,
            comment: reviewComment,
            date: new Date().toLocaleDateString(),
            rating  
        };
        setReviews([newReview, ...reviews]);
        setReviewName('');
        setReviewComment('');
    };

    return (
        <div className="container mx-auto max-w-6xl px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left content */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Listing Card */}
                    <Card className="overflow-hidden shadow-lg border border-muted rounded-2xl">
                        <div className="relative w-full h-96 rounded-t-xl overflow-hidden">
                            <Image
                                src={imageUrl}
                                alt={listingDetail.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <CardHeader className="space-y-2 p-6">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <CardTitle className="text-3xl font-semibold text-primary tracking-tight">
                                    {listingDetail.title}
                                </CardTitle>
                                <Badge
                                    variant="secondary"
                                    className="text-base px-4 py-2 bg-primary/10 text-primary rounded-full"
                                >
                                    ${listingDetail.price} / night
                                </Badge>
                            </div>
                            <CardDescription className="text-muted-foreground text-sm">
                                📍 {listingDetail.location}, {listingDetail.country}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 px-6 pb-6">
                            <p className="text-base leading-relaxed text-muted-foreground">
                                {listingDetail.description}
                            </p>
                            <div className="flex justify-end">
                                <Button size="lg" className="w-40 rounded-full">
                                    Book Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Review Form */}
                    <Card className="shadow-lg border border-muted rounded-2xl p-6 space-y-4">
                        <CardTitle>Leave a Review</CardTitle>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            {/* Star Rating */}
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                            } hover:text-yellow-500 transition-colors`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            {/* Review Textarea */}
                            <Textarea
                                placeholder="Your Review"
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                            />

                            <Button
                                type="submit"
                                className="bg-pink-500 text-white w-full rounded-full py-3"
                            >
                                Submit Review
                            </Button>
                        </form>
                    </Card>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.length === 0 && (
                            <p className="text-gray-500 text-center py-6">
                            No reviews yet. Be the first to review!
                            </p>
                        )}

                        {reviews.map((rev, idx) => (
                            <Card key={idx} className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-start space-x-4">
                                {/* Reviewer avatar */}
                                <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                                    {rev.name ? rev.name.charAt(0) : 'U'}
                                </div>
                                </div>

                                {/* Review content */}
                                <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-800">{rev.name || 'Anonymous'}</h4>
                                    <span className="text-gray-400 text-sm">{rev.date}</span>
                                </div>

                                {/* Star rating */}
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`text-xl ${star <= rev.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </span>
                                    ))}
                                </div>

                                {/* Comment */}
                                <p className="text-gray-700 mt-2">{rev.comment}</p>
                                </div>
                            </div>
                            </Card>
                        ))}
                        </div>

                </div>

                {/* Right sticky reservation card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <Card className="shadow-lg border border-muted rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <span className="text-pink-500">🏷️</span>
                                Prices include all fees
                            </div>
                            <div className="text-2xl font-semibold">
                                <span className="line-through text-gray-400 mr-2">₹10,288</span>
                                <span>₹6,303</span> for 2 nights
                            </div>
                            <div className="grid grid-cols-2 border border-gray-300 rounded-md overflow-hidden text-sm text-gray-700">
                                <div className="p-3 border-r border-gray-300">
                                    <div className="font-semibold">CHECK-IN</div>
                                    <div>10/31/2025</div>
                                </div>
                                <div className="p-3">
                                    <div className="font-semibold">CHECKOUT</div>
                                    <div>11/2/2025</div>
                                </div>
                            </div>
                            <div className="relative">
                                <select className="w-full border border-gray-300 rounded-md p-3 text-gray-700">
                                    <option>1 guest</option>
                                    <option>2 guests</option>
                                    <option>3 guests</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                            </div>
                            <Button className="w-full bg-pink-500 text-white hover:bg-pink-600 rounded-full py-3">
                                Reserve
                            </Button>
                            <p className="text-center text-sm text-gray-500">
                                You won't be charged yet
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageDetails;
