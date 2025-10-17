import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";

// Typed version of useDispatch for thunks
export const useAppDispatch = () => useDispatch<AppDispatch>();