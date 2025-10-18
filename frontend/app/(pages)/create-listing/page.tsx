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

const listingSchema = z.object({
    title: z
        .string({ message: "Please enter a valid title" })
        .min(3, { message: "Listing name must be at least 3 characters long" }),

    description: z
        .string({ message: "Please enter a valid description" })
        .min(10, { message: "Description must be at least 10 characters long" }),

    image: z
        .custom<File | null>((file) => file instanceof File, {
            message: "Image is required",
        }),

    price: z
    .string('Enter Price')
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
        message: "Price must be a number",
    }),

    country: z.string({ message: "Please enter country" }),
    location: z.string({ message: "Please enter location" }),
});

export type ListingFormData = z.infer<typeof listingSchema>;

const initialValues = { title: "", description: "", image: null, price: "", country: "", location: "" };
export default function ListingPage() {
    const { listingloading, listingerror } = useSelector((state: RootState) => state.listings);
    const dispatch = useAppDispatch();
    const router = useRouter();
    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full px-4 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Register your New Listing
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                        Enter your basic details to create Listing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={toFormikValidationSchema(listingSchema)}
                        onSubmit={async (values) => {
                            console.log(values);
                            // 🔥 Dispatch with formData
                            const payload = {
                                ...values,
                                price: Number(values.price)
                            }
                            const res = await dispatch(createListing(payload));
                            router.push("/");
                            console.log(res);
                        }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        }) => (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {listingerror && (
                                    <p className="text-sm text-destructive font-bold text-center">
                                        {listingerror || 'something went wrong! please try again.'}
                                    </p>
                                )}
                                <div className="flex flex-wrap  ">
                                    <div className="w-full md:w-1/2 ">
                                        <Label htmlFor="title" className="mb-2">Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            type="text"
                                            placeholder="Enter your title"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.title}
                                            className={cn(
                                                touched.title && errors.title
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : ""
                                            )}
                                        />
                                        {touched.title && errors.title && (
                                            <p className="text-sm text-red-500">{errors.title}</p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/2 pl-4">
                                        <Label htmlFor="price" className="mb-2">Price</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="text"
                                            placeholder="Enter your price"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.price}
                                            className={cn(
                                                touched.title && errors.price
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : ""
                                            )}
                                        />
                                        {touched.price && errors.price && (
                                            <p className="text-sm text-red-500">{errors.price}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 ">
                                    <Label htmlFor="description" className="mb-2"> Enter your Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Enter your description"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.description}
                                        className={cn(
                                            touched.description && errors.description
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : ""
                                        )}
                                    />
                                    {touched.description && errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Field name="image">
                                        {({ field, form, meta }:FieldProps) => (
                                            <ImageUploader
                                                value={field.value}
                                                onChange={(file: Blob) => form.setFieldValue("image", file)}
                                                error={meta.error}
                                                touched={meta.touched}
                                            />
                                        )}
                                    </Field>

                                </div>
                                <div className="flex flex-wrap">
                                    <div className="w-full md:w-1/2">
                                        <Label htmlFor="country" className="mb-2">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            type="text"
                                            placeholder="Enter your country"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.country}
                                            className={cn(
                                                touched.country && errors.country
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : ""
                                            )}
                                        />
                                        {touched.country && errors.country && (
                                            <p className="text-sm text-red-500">{errors.country}</p>
                                        )}

                                    </div>
                                    <div className="w-full md:w-1/2 pl-4">
                                        <Label htmlFor="location" className="mb-2">Location</Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            type="text"
                                            placeholder="Enter your location"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.location}
                                            className={cn(
                                                touched.location && errors.location
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : ""
                                            )}
                                        />
                                        {touched.location && errors.location && (
                                            <p className="text-sm text-red-500">{errors.location}</p>
                                        )}
                                    </div>
                                </div>
                                <Button type="submit" className="w-40  p-6" disabled={listingloading}>
                                    {listingloading ? (
                                        // Example loading spinner
                                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mx-auto"></div>
                                    ) : (
                                        'Submit'
                                    )}
                                </Button>
                            </form>

                        )}
                    </Formik>
                </CardContent>
            </Card>

        </div>
    )
}