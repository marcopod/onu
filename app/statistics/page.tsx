import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function StatisticsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Harassment Database</h1>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative w-40">
              <div className="flex items-end justify-center">
                <div className="w-16 h-24 bg-pink-300 rounded-t-lg"></div>
                <div className="w-16 h-32 bg-pink-400 rounded-t-lg mx-2"></div>
                <div className="w-16 h-16 bg-pink-200 rounded-t-lg"></div>
              </div>
              <div className="absolute top-0 right-0">
                <div className="flex items-center">
                  <Shield className="h-12 w-12 text-green-700" />
                  <div className="bg-white rounded-full p-1 -ml-2">
                    <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-green-800 mb-6">Have you experienced harassment?</h2>
            <RadioGroup defaultValue="no" className="flex justify-center gap-8">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" className="text-pink-500 border-pink-300" />
                <Label htmlFor="yes" className="text-lg">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" className="text-pink-500 border-pink-300" />
                <Label htmlFor="no" className="text-lg">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button className="w-full bg-green-500 hover:bg-green-600 rounded-full py-6">Next</Button>
        </div>
      </main>
    </div>
  )
}
