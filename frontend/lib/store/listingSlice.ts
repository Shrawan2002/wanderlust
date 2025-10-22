import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/api";
import { ListingFormData } from "@/app/components/ListingForm";
import { userType } from "./authSlice";

export interface FetchReviewSchema {
    comment: string,
    _id:string,
    author: userType,
    rating: number,
    formattedDate:string
}
export interface Listing {
    image: {
        filename: string,
        url: string,
    }|null,
    geometry: {
        coordinates: []
    },
    _id: string,
    title: string,
    description: string,
    price: string,
    reviews: FetchReviewSchema[],
    location: string,
    country: string,
    review: [],
    owner: string
}

interface ListingStateSchmea {
    listingloading: boolean,
    listings: Listing[],
    listingerror: string | null,
    currentPage: number,
    totalPages: number,
    listingDetail:Listing|null
}

const initialValue: ListingStateSchmea = {
    listingloading: false,
    listings: [],
    listingerror: null,
    currentPage: 1,
    totalPages: 1,
    listingDetail:null
}

export const fetchListing = createAsyncThunk(
    'fetchlisting',
    async (data: { page: number; search?: string, userId?:string }, thunkAPI) => {
        try {
            // Only append `search` if it's non-empty
            const query = `page=${data.page}` + (data.search ? `&search=${encodeURIComponent(data.search)}` : '') + (data.userId ? `&userId=${encodeURIComponent(data.userId)}` : '');
            const res = await api.get(`listings?${query}`);
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const createListing = createAsyncThunk(
    "create/listing",
    async (data: ListingFormData, thunkAPI) => {
        try {
            const res = await api.post("/listings", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: error.message }
            );
        }
    }
);
export const updateListing = createAsyncThunk(
    "create/listing",
    async ({id, data}:{id:string,data: ListingFormData}, thunkAPI) => {
        try {
            const res = await api.put(`/listings/${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: error.message }
            );
        }
    }
);
export const listingById = createAsyncThunk(
    'listingById',
    async(id:string, thunkAPI) => {
        try {
            const res = await api.get(`/listings/${id}`);
            return res.data;
        } catch (error:any) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: error.message }
            );
        }
    }
)


const extractError = (action: any) =>
    action.payload?.message || action.error?.message || "Something went wrong.";


const listingSlice = createSlice({
    name: 'listings',
    initialState: initialValue,
    reducers: {
        resetListings: (state) => {
            state.listings = [];
            state.currentPage = 1;
            state.totalPages = 1;
            state.listingerror = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListing.pending, (state) => {
                state.listingloading = true;
                state.listingerror = null;
            })
            .addCase(fetchListing.fulfilled, (state, action) => {
                state.listingloading = false;
                if (action.payload.currentPage === 1) {
                    // New search or first page — replace listings
                    state.listings = action.payload.listings;
                } else {
                    // Load more — append to existing listings
                    state.listings = [...state.listings, ...action.payload.listings];
                }
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.listingerror = null
            })
            .addCase(fetchListing.rejected, (state, action) => {
                state.listingloading = false;
                state.listingerror = extractError(action);
            })

            .addCase(createListing.pending, (state) => {
                state.listingloading = true;
                state.listingerror = null;
            })
            .addCase(createListing.fulfilled, (state, action) => {
                state.listingloading = false;
                state.listingerror = null
            })
            .addCase(createListing.rejected, (state, action) => {
                state.listingloading = false;
                state.listingerror = extractError(action);
            })
            .addCase(listingById.pending, (state) => {
                state.listingloading = true;
                state.listingerror = null;
            })
            .addCase(listingById.fulfilled, (state, action) => {
                state.listingloading = false;
                state.listingerror = null;
                state.listingDetail = action.payload.listing;
            })
            .addCase(listingById.rejected, (state, action) => {
                state.listingloading = false;
                state.listingerror = extractError(action);
            })

    }
});

export default listingSlice.reducer;