'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Formik } from "formik"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { toFormikValidationSchema } from "zod-formik-adapter"
import { useSelector } from 'react-redux';
import { useAppDispatch } from "@/lib/hooks"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { cn } from "@/lib/utils"

import {RootState} from "@/lib/store"
// ✅ Assuming you have a loginUser thunk exported from authSlice
import { loginUser } from "@/lib/store/authSlice"; 

// 1. Zod schema for Login (email and password only)
const loginSchema = z.object({
  email: z
    .string('Please enter your email address')
    .email("Please enter a valid email address"),
    
  password: z
    .string('Please enter a password')
    .min(1, "Password is required"), // Minimal validation for login
})

// 2. Type for form data
type LoginData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  // Get state from Redux
  const {loading, user, error} = useSelector((state:RootState)=>state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter();

  // Redirect if the user is already logged in
  useEffect(()=>{
    if(user){
      router.push('/')
    }
  }, [user, router])

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Login to your account
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Formik
            // Initial values for login are just email and password
            initialValues={{ email: "", password: "" }}
            validationSchema={toFormikValidationSchema(loginSchema)}
            onSubmit={async (values, { setSubmitting, setTouched, validateForm }) => {
              
              setServerError(null) // Clear previous errors
              
              // Manually trigger touched state for validation display
              setTouched({ email: true, password: true });
              const errors = await validateForm(); 
              if (Object.keys(errors).length) {
                setSubmitting(false);
                return;
              }

              try {
                // ✅ Await the dispatch call to get the final resolved action object
                const resultAction = await dispatch(loginUser(values))
                
                // Use the match function to check if the action was fulfilled
                if(loginUser.fulfilled.match(resultAction)){
                  // No need to reset form on successful login, just navigate
                  router.push('/')
                } 
                // Rejected case is handled by Redux updating the `error` state, 
                // which is displayed below.

              } catch (err: any) {
                // This catch only runs for synchronous errors, 
                // async errors are caught by Redux Thunk and placed in state.auth.error
                setServerError('An unexpected client error occurred.')
              } finally {
                setSubmitting(false)
              }
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
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Global Error Display (From Redux State or local state) */}
                {(serverError || error) && (
                  <p className="text-sm text-red-500 font-bold text-center">
                    {serverError || error || 'Something went wrong! Please try again.'}
                  </p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className={cn(
                      touched.email && errors.email
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    )}
                  />
                  {touched.email && errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    name="password"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    className={cn(
                      touched.password && errors.password
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    )}
                  />
                  {touched.password && errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                
                {/* Submit button is inside the form, but outside the field divs */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading} // Disable while loading
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mx-auto"></div>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            )}
          </Formik>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="mt-2 text-gray-600 dark:text-gray-300">
            Don't have account? 
            <Button variant="link" className="p-0 ml-1 text-indigo-600">
                <Link href={'/signup'}>Signup</Link>
            </Button>
          </div>
        </CardFooter>

      </Card>
    </div>
  )
}