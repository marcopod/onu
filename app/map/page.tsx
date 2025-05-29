import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Filter, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function MapPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link href="/" className="text-green-800">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-green-800 ml-4">Report Map</h1>
            </div>
            <Button variant="ghost" size="icon" className="text-green-800">
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded-full">All</Badge>
            <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200 px-3 py-1 rounded-full">Physical</Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full">Verbal</Badge>
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-1 rounded-full">Social</Badge>
            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1 rounded-full">Other</Badge>
          </div>

          <div className="relative h-[400px] bg-gray-100 rounded-xl mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500">Map View</span>
            </div>

            {/* Map Pins */}
            <div className="absolute top-1/4 left-1/3">
              <MapPin className="h-6 w-6 text-pink-500" />
            </div>
            <div className="absolute top-1/2 left-2/3">
              <MapPin className="h-6 w-6 text-blue-500" />
            </div>
            <div className="absolute bottom-1/4 right-1/4">
              <MapPin className="h-6 w-6 text-purple-500" />
            </div>
            <div className="absolute top-1/3 right-1/4">
              <MapPin className="h-6 w-6 text-green-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium text-green-800">Recent Reports</h2>
            <div className="space-y-2">
              <div className="border border-green-100 rounded-lg p-3 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                <div>
                  <p className="text-sm font-medium">Physical harassment</p>
                  <p className="text-xs text-gray-500">Downtown area - 2 hours ago</p>
                </div>
              </div>
              <div className="border border-green-100 rounded-lg p-3 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm font-medium">Verbal harassment</p>
                  <p className="text-xs text-gray-500">Central Park - 5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
