'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Formik, FieldProps } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as z from "zod"
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks"
import { createListing } from "@/lib/store/listingSlice";
import { useRouter } from "next/navigation";
import ListingForm from "@/app/components/ListingForm";

export default function ListingPage() {
    return (
        <ListingForm isEdit="" />
    )
}