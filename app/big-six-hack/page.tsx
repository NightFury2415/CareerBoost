"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trophy, Zap, Code } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BigSixHack() {
  const companies = {
    google: {
      name: "Google",
      color: "from-blue-400 to-blue-600",
      icon: "G",
      description: "Focuses on problem-solving and algorithms",
      tips: {
        "Technical Focus": [
          "Master tree and graph algorithms extensively",
          "Strong emphasis on optimization and Big O analysis",
          "Practice system design for scale (billions of users)",
          "Know distributed systems and consensus algorithms",
          "SQL and NoSQL database design is critical",
          "Test edge cases thoroughly in your solutions",
        ],
        "Behavioral Traits": [
          "Demonstrate 'Googleyness' - intellectual humility and curiosity",
          "Discuss how you've simplified complex problems",
          "Share examples of learning from failure",
          "Show passion for technology and innovation",
          "Highlight collaborative achievements",
          "Explain how you stay updated with tech trends",
        ],
        Preparation: [
          "Solve 50-60 LeetCode problems (Medium difficulty preferred)",
          "Focus on backtracking, DP, and graph problems",
          "Study Google's engineering culture and products",
          "Practice explaining your thought process clearly",
          "Research recent Google tech talks and papers",
          "Know their interview format: usually 4-5 rounds",
        ],
      },
      leetcodeTopics: [
        "Arrays & Strings",
        "Trees & Graphs",
        "Dynamic Programming",
        "Hash Tables",
        "Recursion & Backtracking",
      ],
    },
    amazon: {
      name: "Amazon",
      color: "from-orange-400 to-orange-600",
      icon: "A",
      description: "Emphasizes scalability and system design",
      tips: {
        "Technical Focus": [
          "Arrays, strings, and linked lists are heavily tested",
          "System design focusing on e-commerce scale",
          "AWS knowledge is a huge plus",
          "Practice designing high-throughput systems",
          "Database sharding and replication important",
          "Performance and scalability is paramount",
        ],
        "Leadership Principles": [
          "Customer Obsession - discuss customer-centric decisions",
          "Ownership - take responsibility for outcomes",
          "Invent and Simplify - show creative problem-solving",
          "Learn and Be Curious - demonstrate growth mindset",
          "Bias for Action - decisive and quick to execute",
          "Dive Deep - analytical and detail-oriented approach",
        ],
        Preparation: [
          "Solve 40-50 LeetCode problems focusing on arrays/strings",
          "Study Amazon's leadership principles deeply",
          "Prepare stories using STAR method for each principle",
          "Understand Amazon's business model and products",
          "System design: design Amazon Prime, recommendations",
          "Interview format: 4-5 technical rounds + bar raiser",
        ],
      },
      leetcodeTopics: ["Arrays", "Strings", "Linked Lists", "Trees", "System Design"],
    },
    meta: {
      name: "Meta",
      color: "from-blue-500 to-purple-600",
      icon: "M",
      description: "Values product intuition and user impact",
      tips: {
        "Technical Focus": [
          "Focus on dynamic programming and recursion",
          "Graph algorithms (matching, connectivity)",
          "Build intuition about data structures",
          "Front-end candidates need strong JS/React knowledge",
          "Real-time systems design (feeds, messaging)",
          "Binary search and greedy algorithms important",
        ],
        "Product Intuition": [
          "Understand Meta's product ecosystem deeply",
          "Discuss how features impact user engagement",
          "Show awareness of competitive landscape",
          "Demonstrate interest in emerging tech (AI, VR/AR)",
          "Discuss trade-offs in product decisions",
          "Share insights about building for billions of users",
        ],
        Preparation: [
          "Solve 45-50 LeetCode problems, varied difficulties",
          "Deep dive into Meta's products and strategy",
          "Practice discussing product decisions and tradeoffs",
          "System design: Instagram feed, Messenger, Stories",
          "Research Meta's research projects and papers",
          "Interview format: 2-3 coding + 1-2 system design",
        ],
      },
      leetcodeTopics: ["Dynamic Programming", "Graphs", "Strings", "Trees", "Binary Search"],
    },
    apple: {
      name: "Apple",
      color: "from-gray-400 to-gray-600",
      icon: "A",
      description: "Prioritizes simplicity and craftsmanship",
      tips: {
        "Technical Focus": [
          "Bit manipulation and memory-efficient solutions",
          "Low-level systems knowledge is valuable",
          "Performance optimization critical",
          "iOS/macOS development for platform-specific roles",
          "Privacy and security considerations paramount",
          "Clean, elegant code is highly valued",
        ],
        "Craftsmanship Philosophy": [
          "Show attention to detail in your solutions",
          "Discuss how you balance performance and readability",
          "Demonstrate commitment to quality and testing",
          "Share examples of refactoring for elegance",
          "Explain your design decisions thoughtfully",
          "Value simplicity and avoid over-engineering",
        ],
        Preparation: [
          "Solve 35-45 LeetCode problems with focus on optimization",
          "Study Apple's product philosophy and design",
          "Practice writing clean, well-structured code",
          "System design: Apple ecosystem integration",
          "Focus on single-threaded and concurrency problems",
          "Interview format: Usually 4-5 technical rounds",
        ],
      },
      leetcodeTopics: ["Bit Manipulation", "Arrays", "Strings", "Sorting", "Memory Efficiency"],
    },
    microsoft: {
      name: "Microsoft",
      color: "from-blue-400 to-green-600",
      icon: "M",
      description: "Emphasizes versatility and enterprise scale",
      tips: {
        "Technical Focus": [
          "Full-stack understanding across cloud to edge",
          "Azure cloud services knowledge helpful",
          "Windows/enterprise software domain knowledge",
          "Practice mixed difficulty problems",
          "Design systems for enterprise use cases",
          "Understand security and compliance requirements",
        ],
        "Growth Mindset": [
          "Discuss how you've learned new technologies",
          "Show adaptability across different domains",
          "Share examples of taking on challenging projects",
          "Demonstrate collaboration with diverse teams",
          "Explain how you mentor and help colleagues grow",
          "Share learnings from failures and pivots",
        ],
        Preparation: [
          "Solve 40-50 LeetCode problems, all difficulty levels",
          "Study Microsoft's cloud strategy and products",
          "Understand Azure services and capabilities",
          "System design: OneDrive, Teams infrastructure",
          "Research Microsoft's research initiatives",
          "Interview format: 2-3 coding + system design",
        ],
      },
      leetcodeTopics: ["Arrays", "Trees", "Graphs", "DP", "Cloud Architecture"],
    },
    netflix: {
      name: "Netflix",
      color: "from-red-500 to-red-700",
      icon: "N",
      description: "Values data-driven decisions and impact",
      tips: {
        "Technical Focus": [
          "Large-scale streaming system design",
          "Data processing and analytics at scale",
          "Recommendation algorithms and ML basics",
          "Distributed systems for fault tolerance",
          "Caching and optimization for performance",
          "Database design for massive datasets",
        ],
        "Data-Driven Approach": [
          "Discuss decisions backed by metrics and data",
          "Show understanding of Netflix's business model",
          "Demonstrate interest in content strategy",
          "Understand the user experience globally",
          "Share examples of analyzing trade-offs with data",
          "Explain how you measure success",
        ],
        Preparation: [
          "Solve 45-55 LeetCode problems, focus on systems",
          "Deep dive into Netflix's tech stack and architecture",
          "Study distributed systems and streaming protocols",
          "System design: Netflix streaming, recommendation engine",
          "Research Netflix Tech Blog extensively",
          "Interview format: Usually 2-3 coding rounds",
        ],
      },
      leetcodeTopics: ["System Design", "Distributed Systems", "Caching", "Streams", "Databases"],
    },
  }

  const globalTips = {
    "LeetCode Strategy": [
      "Start with easy problems to build confidence",
      "Move to medium problems for core concepts",
      "Practice hard problems 2-3 weeks before interviews",
      "Time yourself - aim for 25-30 min for medium problems",
      "Solve 3-5 problems per day consistently",
      "Review and learn from top solutions after solving",
      "Focus on understanding patterns, not memorizing",
      "Practice writing clean, readable code",
    ],
    "System Design Tips": [
      "Start with requirements gathering and clarification",
      "Draw architecture diagrams clearly",
      "Discuss trade-offs: consistency vs availability",
      "Consider scalability from day one",
      "Know about caching strategies (LRU, Redis)",
      "Understand load balancing and sharding",
      "Discuss monitoring, logging, and alerting",
      "Consider fault tolerance and disaster recovery",
    ],
    "Behavioral Excellence": [
      "Prepare 10-15 stories covering different scenarios",
      "Use STAR method (Situation, Task, Action, Result)",
      "Include metrics and impact in your stories",
      "Practice explaining failures as learning moments",
      "Show collaboration and team contributions",
      "Discuss technical trade-offs thoughtfully",
      "Ask thoughtful questions about the company",
      "Follow up after interviews with thank you notes",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold">Big Six Hack Guide</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Company-Specific Tabs */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-purple-400" />
            Target Companies - Tailored Strategies
          </h2>

          <Tabs defaultValue="google" className="w-full">
            <TabsList className="grid w-full grid-cols-6 gap-2 bg-slate-800 p-2 h-auto">
              {Object.entries(companies).map(([key, company]: any) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
                >
                  {company.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(companies).map(([key, company]: any) => (
              <TabsContent key={key} value={key} className="mt-8">
                {/* Company Header */}
                <div className={`bg-gradient-to-r ${company.color} rounded-lg p-8 mb-8`}>
                  <h3 className="text-4xl font-bold mb-2">{company.name}</h3>
                  <p className="text-lg text-gray-100">{company.description}</p>
                </div>

                {/* Company-Specific Tips */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {Object.entries(company.tips).map(([category, tips]: any) => (
                    <Card key={category} className="bg-slate-800/50 border-slate-700 p-6">
                      <h4 className="text-xl font-bold mb-4 text-purple-400">{category}</h4>
                      <ul className="space-y-3">
                        {tips.map((tip: string, idx: number) => (
                          <li key={idx} className="flex gap-3">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                              ✓
                            </div>
                            <span className="text-sm text-gray-300">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>

                {/* LeetCode Topics */}
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" />
                    Key LeetCode Topics
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {company.leetcodeTopics.map((topic: string, idx: number) => (
                      <div
                        key={idx}
                        className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full text-sm font-semibold text-cyan-300 border border-slate-500"
                      >
                        {topic}
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Global Tips */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            Universal Interview Preparation
          </h2>

          <Tabs defaultValue="LeetCode Strategy" className="w-full">
            <TabsList className="grid w-full md:grid-cols-3 bg-slate-800 p-2 gap-2">
              {Object.keys(globalTips).map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
                >
                  {category.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(globalTips).map(([category, tips]: any) => (
              <TabsContent key={category} value={category} className="mt-8">
                <Card className="bg-slate-800/50 border-slate-700 p-8">
                  <h3 className="text-2xl font-bold mb-6">{category}</h3>
                  <ul className="space-y-4">
                    {tips.map((tip: string, idx: number) => (
                      <li key={idx} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <p className="text-gray-300 pt-0.5 text-lg">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Quick Stats */}
        <section className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Target Companies", value: "6" },
            { label: "LeetCode Problems", value: "250+" },
            { label: "Interview Rounds", value: "4-5" },
            { label: "Success Stories", value: "78%" },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 p-6 text-center">
              <p className="text-gray-400 mb-2">{stat.label}</p>
              <p className="text-4xl font-bold text-purple-400">{stat.value}</p>
            </Card>
          ))}
        </section>

        {/* CTA */}
        <div className="text-center py-12 border-t border-slate-800">
          <h3 className="text-3xl font-bold mb-4">Ready to Practice?</h3>
          <Link href="/mock-interview">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 px-8 text-lg">
              Start Mock Interview Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
