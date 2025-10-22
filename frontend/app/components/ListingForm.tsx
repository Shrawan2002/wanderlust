'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Formik, FieldProps } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import { createListing, listingById, updateListing } from "@/lib/store/listingSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const listingSchema = z.object({
  title: z.string({ message: "Please enter a valid title" }).min(3),
  description: z.string({ message: "Please enter a valid description" }).min(10),
  image: z.custom<File | null>((file) => file instanceof File || file === null, { message: "Image is required" }),
  price: z
  .string({ message: "Please enter price" })
  .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  country: z.string({ message: "Please enter country" }),
  location: z.string({ message: "Please enter location" }),
});

export type ListingFormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  isEdit?: string; // optional listing ID for edit
}

export default function ListingForm({ isEdit }: ListingFormProps) {
  const { listingloading, listingerror, listingDetail } = useSelector((state: RootState) => state.listings);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<ListingFormData>({
    title: "",
    description: "",
    image: null,
    price: '',
    country: "",
    location: "",
  });

  // Fetch listing if edit mode
  useEffect(() => {
    if (isEdit) {
      const init = async () => {
        const res = await dispatch(listingById(isEdit));
        console.log(res.payload);
        if (res.payload?.listing) {
            let data = res.payload.listing;
        console.log(data)
          setInitialValues({
            title: data.title || "",
            description: data.description || "",
            image: null,
            price: data.price.toString() || 0,
            country: data.country || "",
            location: data.location || "",
          });
        }
      };
      init();
    }
  }, [dispatch, isEdit]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full px-4 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {isEdit ? "Edit your Listing" : "Register your New Listing"}
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {isEdit ? "Update your listing details" : "Enter your details to create a new listing"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Only render Formik once initialValues are ready */}
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(listingSchema)}
            onSubmit={async (values) => {
            //   const payload = { ...values, price: Number(values.price) };
              if(isEdit){
                const res = await dispatch(updateListing({id:isEdit, data:values}));
                if (updateListing.fulfilled.match(res)) {
                    router.push(`/view-listing/${user?._id}`);
                }
              }else{
                const res = await dispatch(createListing(values));
                if (createListing.fulfilled.match(res)) {
                    router.push(`/view-listing/${user?._id}`);
                }
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                {listingerror && (
                  <p className="text-sm text-destructive font-bold text-center">{listingerror}</p>
                )}

                {/* Title and Price */}
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter your title"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.title}
                      className={cn(touched.title && errors.title ? "border-red-500" : "")}
                    />
                    {touched.title && errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                  </div>
                  <div className="w-full md:w-1/2 pl-4">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      placeholder="Enter your price"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.price}
                      className={cn(touched.price && errors.price ? "border-red-500" : "")}
                    />
                    {touched.price && errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter your description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                    className={cn(touched.description && errors.description ? "border-red-500" : "")}
                  />
                  {touched.description && errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <Field name="image">
                    {({ field, form, meta }: FieldProps) => (
                      <ImageUploader
                        value={field.value}
                        onChange={(file: File) => form.setFieldValue("image", file)}
                        error={meta.error}
                        touched={meta.touched}
                        url={isEdit?listingDetail?.image?.url:''}
                      />
                    )}
                  </Field>
                </div>

                {/* Country and Location */}
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="Enter your country"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.country}
                      className={cn(touched.country && errors.country ? "border-red-500" : "")}
                    />
                    {touched.country && errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                  </div>
                  <div className="w-full md:w-1/2 pl-4">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Enter your location"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.location}
                      className={cn(touched.location && errors.location ? "border-red-500" : "")}
                    />
                    {touched.location && errors.location && (
                      <p className="text-sm text-red-500">{errors.location}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-40 p-6" disabled={listingloading}>
                  {listingloading ? (
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mx-auto"></div>
                  ) : isEdit ? "Update" : "Submit"}
                </Button>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
