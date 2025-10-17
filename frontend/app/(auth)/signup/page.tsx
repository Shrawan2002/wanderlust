'use client'

import { useState, useEffect } from "react"
import { Formik } from "formik"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { toFormikValidationSchema } from "zod-formik-adapter"
import { useSelector } from 'react-redux';
import { useAppDispatch } from "@/lib/hooks"
import { useRouter } from "next/navigation"
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
import {signupUser} from "@/lib/store/authSlice";

// ✅ 1. Zod schema with correct non-empty messages
const userSchema = z.object({
  username: z
    .string('Please Enter Valid Name')
    .min(3, "Full name must be at least 3 characters long"),
    
  email: z
    .string('Please enter your email address')
    .email("Please enter a valid email address"),
    
  password: z
    .string('Please enter a password')
    .min(8, "Password must be at least 8 characters long")
      // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      // .regex(/[0-9]/, "Password must contain at least one number")
      // .regex(/[!@#$%^&*]/, "Password must contain at least one special character"),
})

// ✅ 2. Type for form data
type UserData = z.infer<typeof userSchema>

export default function SignupPage() {
  const {loading, user, error} = useSelector((state:RootState)=>state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter();

  useEffect(()=>{
    if(user){
      router.push('/')
    }
  }, [])

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Register New Account
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Enter your basic details to create an account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Formik
            initialValues={{ username: "", email: "", password: "" }}
            validationSchema={toFormikValidationSchema(userSchema)}
            onSubmit={async (values, { setSubmitting, resetForm, setTouched, validateForm }) => {
              try {
                const resultAction = await dispatch(signupUser(values))
                console.log('singupt done: ', signupUser.fulfilled.match(resultAction))
                if(signupUser.fulfilled.match(resultAction)){
                  resetForm()
                  router.push('/')
                }
              } catch (err: any) {
                console.log(err.message)
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
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <p className="text-sm text-destructive font-bold text-center">
                    {error || 'something went wrong! please try again.'}
                  </p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username">Full Name</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter Full Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                    className={cn(
                      touched.username && errors.username
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    )}
                  />
                  {touched.username && errors.username && (
                    <p className="text-sm text-red-500">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {touched.password && errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={loading}
                >
                  {loading ? (
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

        <CardFooter className="flex flex-col gap-3 text-center">
          <div className="mt-1 text-gray-600 dark:text-gray-300">
            Already have an account?
            <Button variant="link" className="p-0 ml-1 text-indigo-600">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}