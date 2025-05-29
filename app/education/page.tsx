import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EducationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Types of Harassment</h1>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-pink-200 rounded-full p-6">
              <div className="relative h-16 w-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-green-800"></div>
                <div className="absolute h-0.5 w-full bg-green-800 rotate-45"></div>
              </div>
            </div>
          </div>

          <ul className="space-y-4 mb-6">
            <li className="flex items-start gap-2">
              <span className="h-2 w-2 rounded-full bg-green-800 mt-2.5"></span>
              <div>
                <h3 className="font-bold text-green-800">Physical</h3>
                <p className="text-gray-700">
                  Unwanted touching, physical intimidation, or assault. This includes any form of physical contact
                  without consent.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-2 w-2 rounded-full bg-green-800 mt-2.5"></span>
              <div>
                <h3 className="font-bold text-green-800">Verbal</h3>
                <p className="text-gray-700">
                  Offensive comments, slurs, threats, or inappropriate jokes that create a hostile environment.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-2 w-2 rounded-full bg-green-800 mt-2.5"></span>
              <div>
                <h3 className="font-bold text-green-800">Social</h3>
                <p className="text-gray-700">
                  Exclusion, spreading rumors, or manipulating social relationships to harm someone's reputation or
                  isolate them.
                </p>
              </div>
            </li>
          </ul>

          <Button className="w-full bg-green-500 hover:bg-green-600 rounded-full py-6">Learn More</Button>
        </div>
      </main>
    </div>
  )
}
