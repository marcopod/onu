import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Bell, Shield, LogOut, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-8">
            <Link href="/" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Profile</h1>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-16 w-16 border-2 border-green-500">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback className="bg-green-100 text-green-800">JD</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-lg">Jane Doe</h2>
              <p className="text-gray-500 text-sm">jane.doe@example.com</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-medium text-green-800">Account</h3>
              <div className="space-y-2">
                <Link
                  href="/profile/edit"
                  className="flex items-center justify-between p-3 border border-green-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-green-500" />
                    <span>Edit Profile</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                <Link
                  href="/profile/reports"
                  className="flex items-center justify-between p-3 border border-green-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>My Reports</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-green-800">Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-green-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-green-500" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch id="push-notifications" />
                </div>
                <div className="flex items-center justify-between p-3 border border-green-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-green-500" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch id="email-notifications" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-green-800">Privacy & Security</h3>
              <div className="space-y-2">
                <Link
                  href="/profile/privacy"
                  className="flex items-center justify-between p-3 border border-green-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>Privacy Settings</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-red-200 text-red-500 rounded-xl py-4 mt-8 flex items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
