'use client'

import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { Loader } from "@/components/ui/loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { ArrowBigDown, ArrowRight, Reply } from "lucide-react"

export default function ProfilePage() {
  const { user, loading, initialized } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" })
  const [updating, setUpdating] = useState(false)

  if (loading || !initialized) return <Loader message="Loading your profile..." />

  if (!user) {
    router.push("/login")
    return null
  }

  const handlePasswordChange = async () => {
    if (!passwords.old || !passwords.new || !passwords.confirm) return alert("Fill all fields")
    if (passwords.new !== passwords.confirm) return alert("Passwords do not match")

    try {
      setUpdating(true)
      // call your backend API here
      await new Promise(res => setTimeout(res, 1500)) // mock delay
      alert("Password changed successfully!")
      setPasswords({ old: "", new: "", confirm: "" })
    } catch (err) {
      alert("Something went wrong.")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <motion.div
      className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8 bg-gray-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-3xl shadow-lg border border-border/50 bg-background/70 backdrop-blur-md rounded-2xl p-6 md:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 border-b pb-6">
          <Avatar className="h-24 w-24 ring-2 ring-primary/30">
            <AvatarImage src="/default-avatar.png" alt="User Avatar" />
            <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-foreground">{user.username}</h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-foreground">Basic Information</CardTitle>

            <div>
              <Label className="text-sm text-muted-foreground">Full Name</Label>
              <Input value={user.username} readOnly className="bg-muted/20 border-border/40 mt-1" />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <Input value={user.email} readOnly className="bg-muted/20 border-border/40 mt-1" />
            </div>
          </div>

          {/* Change Password Section */}
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-foreground">Change Password</CardTitle>

            <div>
              <Label className="text-sm text-muted-foreground">New Password</Label>
              <Input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="Enter new password"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Confirm Password</Label>
              <Input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Confirm new password"
                className="mt-1"
              />
            </div>

            <Button
              className="w-full"
              onClick={handlePasswordChange}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Password"}
            </Button>
          </div>
            <div className="flex flex-col">
              <div className="my-2">
                <Link
                  href="/create-listing "
                  className="px-4 py-2 flex text-sm text-blue-900 hover:text-blue-700"
                >
                  Create Listing
                  <ArrowRight className="ml-1" size={16} />
                </Link>
              </div>
              <div className="my-2">
                <Link
                  href={`/view-listing/${user._id}`}
                  className="px-4 py-2 flex text-sm text-blue-900 hover:text-blue-700"
                >
                  View Listing
                  <ArrowRight className="ml-1" size={16} />
                </Link>
              </div>
            </div>
        </div>
      </Card>
    </motion.div>
  )
}
