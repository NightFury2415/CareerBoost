import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, Briefcase, BookOpen, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CareerBoost
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/resume-builder">
              <Button variant="ghost" className="text-gray-300 hover:text-cyan-400">
                Resume Builder
              </Button>
            </Link>
            <Link href="/mock-interview">
              <Button variant="ghost" className="text-gray-300 hover:text-cyan-400">
                Mock Interview
              </Button>
            </Link>
            <Link href="/big-six-hack">
              <Button variant="ghost" className="text-gray-300 hover:text-cyan-400">
                Big Six Hack
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 px-6 pb-20 relative">
        <div className="max-w-7xl mx-auto">
          {/* Animated background elements */}
          <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-balance">
                Land Your Dream Tech Role
              </h1>
              <p className="text-xl text-gray-300 mb-8 text-balance">
                Master resume building, ace technical interviews, and get insider tips for Big Tech companies. All in
                one platform powered by AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/resume-builder" className="w-full sm:w-auto">
                  <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-6 text-lg rounded-lg flex items-center justify-center gap-2">
                    Build Resume <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/mock-interview" className="w-full sm:w-auto">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg rounded-lg flex items-center justify-center gap-2">
                    Start Mock Interview <Zap className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Complete Career Platform</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Resume Builder Card */}
            <Link href="/resume-builder" className="group">
              <div className="bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 rounded-2xl p-8 h-full transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-cyan-500/20">
                <Briefcase className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">Professional Resume</h3>
                <p className="text-gray-400 mb-4">
                  Create a stunning resume following industry standards. Includes multiple templates and real-time
                  preview.
                </p>
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Mock Interview Card */}
            <Link href="/mock-interview" className="group">
              <div className="bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-8 h-full transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-blue-500/20">
                <Zap className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">AI Mock Interviews</h3>
                <p className="text-gray-400 mb-4">
                  Practice with AI-powered interviews tailored to your experience level. Technical, behavioral, and
                  system design questions.
                </p>
                <div className="flex items-center gap-2 text-blue-400 font-semibold">
                  Practice Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Big Six Card */}
            <Link href="/big-six-hack" className="group">
              <div className="bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 rounded-2xl p-8 h-full transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-purple-500/20">
                <BookOpen className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">Big Six Strategy</h3>
                <p className="text-gray-400 mb-4">
                  Insider tips, curated LeetCode problems, and real interview questions from top tech companies.
                </p>
                <div className="flex items-center gap-2 text-purple-400 font-semibold">
                  Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Tech Career?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of engineers preparing for their dream roles at top tech companies.
          </p>
          <Link href="/resume-builder">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-6 px-8 text-lg rounded-lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
