'use client'

import { Button } from "@/components/ui/button"
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

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Login to your account
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Enter your email below to login to your account
          </CardDescription>
          
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
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
              <Input id="password" type="password" required />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <div className="mt-2">
            Don't have account? 
            <Button variant="link" className="p-0 ml-1">
                <Link className="link" href={'/signup'}>Signup</Link>
            </Button>
          </div>
        </CardFooter>

      </Card>
    </div>
  )
}
