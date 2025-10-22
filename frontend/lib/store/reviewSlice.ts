import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../service/api";

import { Review } from "@/app/(pages)/listing/[id]/PageDetails";
interface reviewSchema {
    review: Review,
    reviewLoading: boolean,
    reviewError: string|null,
}

const initialValue:reviewSchema = {
    review: {
        comment: "",
        rating: 0,
        listingId: ""
    },
    reviewError: null,
    reviewLoading: false,
}

export const createReview = createAsyncThunk(
    'createReview',
    async(data:Review, thunkAPI) => {
        try {
            const res = await api.post('/listings/reviews', data);
            return res.data;
        } catch (error:any) {
            return thunkAPI.rejectWithValue(error.message ||'Something went wrong during review creation.')
        } 
    }
)

const reviewSlice = createSlice({
    name: 'review',
    initialState: initialValue,
    reducers:{},
    extraReducers: (builder)=>{
        builder
        .addCase(createReview.pending, (state)=>{
            state.reviewLoading = true;
            state.reviewError = null;
        })
        .addCase(createReview.fulfilled, (state, action)=>{
            state.reviewLoading = false;
            state.reviewError = null;
            state.review = action.payload.review;
        })
        .addCase(createReview.rejected, (state, action)=>{
            state.reviewLoading = false;
            state.reviewError = action.payload as string;
        })
    }
})

export default reviewSlice.reducer;