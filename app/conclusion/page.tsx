"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share2, CheckCircle, Clock, Target, Lightbulb, BookOpen, Bot } from "lucide-react"

interface Message {
    id: string
    role: string
    content: string
}

// Dummy conclusion data for demonstration
const DUMMY_CONCLUSION = `**Executive Summary**

Based on our comprehensive business consultation, we've identified key opportunities for growth in your small to medium-sized business. The discussion covered marketing strategy optimization, financial management improvements, and operational efficiency enhancements. Your business shows strong potential for scaling with the right strategic implementations.

**Key Insights**

1. **Digital Marketing Gap**: Your current marketing efforts lack a cohesive digital strategy, missing opportunities in social media engagement and content marketing that could increase customer acquisition by 40-60%.

2. **Cash Flow Optimization**: Implementing better invoicing systems and payment terms could improve cash flow by 25-30%, providing more working capital for growth initiatives.

3. **Operational Efficiency**: Automating routine tasks and implementing project management tools could save 15-20 hours per week, allowing focus on strategic business development.

4. **Customer Retention Strategy**: Developing a structured customer feedback system and loyalty program could increase customer lifetime value by 35%.

**Action Items**

1. **Immediate (Next 2 weeks)**: Set up Google Analytics and social media business accounts. Implement automated invoicing system with clear payment terms.

2. **Short-term (1-2 months)**: Launch content marketing strategy with weekly blog posts and social media engagement. Introduce project management software for team coordination.

3. **Medium-term (3-6 months)**: Develop customer loyalty program and feedback collection system. Optimize pricing strategy based on market analysis.

4. **Long-term (6-12 months)**: Expand digital marketing to include paid advertising campaigns. Consider hiring dedicated marketing personnel or outsourcing to specialists.

**Next Steps**

1. **Week 1**: Research and select appropriate software tools for invoicing and project management. Budget allocation: $200-500/month.

2. **Week 2-3**: Create content calendar and establish social media posting schedule. Assign team member or allocate 5-10 hours weekly.

3. **Month 2**: Launch pilot customer feedback program with top 20% of customers. Analyze results and refine approach.

4. **Month 3**: Review progress metrics and adjust strategies based on performance data. Plan for next quarter initiatives.

**Resources**

1. **Software Tools**: QuickBooks for invoicing, Asana for project management, Hootsuite for social media scheduling, Google Analytics for website tracking.

2. **Educational Resources**: "Digital Marketing for Small Business" course on Coursera, "Cash Flow Management" webinar series, local Small Business Development Center workshops.

3. **Professional Services**: Consider consulting with a digital marketing specialist for strategy development, accounting firm for financial optimization review.

4. **Industry Networks**: Join local business associations, attend monthly networking events, participate in industry-specific online communities for ongoing learning and connections.`

// Dummy chat messages for session summary
const DUMMY_MESSAGES: Message[] = [
    {
        id: "1",
        role: "user",
        content:
            "I need help improving my small business marketing strategy. We're a local bakery that's been struggling to attract new customers.",
    },
    {
        id: "2",
        role: "assistant",
        content:
            "I'd be happy to help you develop a marketing strategy for your bakery! Let's start by understanding your current situation. What marketing methods are you currently using, and what's your typical customer demographic?",
    },
    {
        id: "3",
        role: "user",
        content:
            "We mainly rely on word-of-mouth and have a basic Facebook page that we rarely update. Our customers are mostly local families and office workers who come for breakfast and lunch.",
    },
    {
        id: "4",
        role: "assistant",
        content:
            "That's a great foundation to build on! Word-of-mouth is powerful for local businesses. Here are some strategies to expand your reach: 1) Optimize your social media presence with regular posts showcasing daily specials, behind-the-scenes content, and customer features. 2) Partner with local businesses for cross-promotion. 3) Implement a simple loyalty program. 4) Consider local SEO to appear in 'bakery near me' searches. Which of these resonates most with your current capacity?",
    },
    {
        id: "5",
        role: "user",
        content:
            "The social media and loyalty program ideas sound doable. How should I structure a loyalty program that won't be too complicated to manage?",
    },
    {
        id: "6",
        role: "assistant",
        content:
            "Perfect choice! For a bakery, I recommend a simple punch card system or digital app. Here's a structure: 'Buy 9 items, get the 10th free' or 'Spend $50, get $5 off next purchase.' You could also do tiered rewards: Bronze (spend $100) gets 5% off, Silver ($250) gets 10% off, Gold ($500) gets 15% off plus early access to new items. For management, start with physical punch cards or simple apps like FiveStars or LoyaltyLion. Would you like me to help you plan the social media strategy as well?",
    },
    {
        id: "7",
        role: "user",
        content:
            "Yes, please help with social media. I'm not sure what to post or how often. Also, what about managing cash flow during slower seasons?",
    },
    {
        id: "8",
        role: "assistant",
        content:
            "Great questions! For social media: Post 3-4 times per week with a mix of content: Monday (weekly specials), Wednesday (behind-the-scenes baking process), Friday (customer spotlights or finished products), and Saturday (weekend treats). Use local hashtags and engage with community posts. For cash flow during slow seasons: 1) Build relationships with local businesses for catering contracts, 2) Offer seasonal items and pre-orders for holidays, 3) Create a small emergency fund during busy periods, 4) Consider diversifying with baking classes or cake decorating workshops. Would you like specific help with any of these areas?",
    },
]

export default function ConclusionPage() {
    const [conclusion, setConclusion] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState<Message[]>([])
    const [useDummyData, setUseDummyData] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const storedMessages = sessionStorage.getItem("chatMessages")

        if (!storedMessages) {
            // Use dummy data if no stored messages
            setUseDummyData(true)
            setMessages(DUMMY_MESSAGES)
            setConclusion(DUMMY_CONCLUSION)
            setLoading(false)
            return
        }

        const parsedMessages = JSON.parse(storedMessages)
        setMessages(parsedMessages)
        generateConclusion(parsedMessages)
    }, [router])

    const generateConclusion = async (chatMessages: Message[]) => {
        try {
            const response = await fetch("/api/conclusion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: chatMessages }),
            })

            const data = await response.json()
            if (data.conclusion) {
                setConclusion(data.conclusion)
            }
        } catch (error) {
            console.error("Error generating conclusion:", error)
            // Fallback to dummy data on error
            setUseDummyData(true)
            setConclusion(DUMMY_CONCLUSION)
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        const element = document.createElement("a")
        const file = new Blob([conclusion], { type: "text/plain" })
        element.href = URL.createObjectURL(file)
        element.download = "business-consultation-conclusion.txt"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Business Consultation Conclusion",
                    text: conclusion.substring(0, 200) + "...",
                })
            } catch (error) {
                console.log("Error sharing:", error)
            }
        } else {
            navigator.clipboard.writeText(conclusion)
            alert("Conclusion copied to clipboard!")
        }
    }

    const formatConclusion = (text: string) => {
        const sections = text.split(/(?=\*\*|\d+\.|#{1,3})/g).filter((section) => section.trim())

        return sections.map((section, index) => {
            const trimmed = section.trim()

            if (trimmed.startsWith("**") && trimmed.includes("**")) {
                const title = trimmed.replace(/\*\*/g, "")
                const icon = getIconForSection(title)
                return (
                    <div key={index} className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                {icon}
                            </div>
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                        </div>
                    </div>
                )
            }

            if (trimmed.match(/^\d+\./)) {
                return (
                    <div key={index} className="mb-3 flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-slate-200 leading-relaxed">{trimmed}</p>
                    </div>
                )
            }

            return (
                <p key={index} className="text-slate-200 leading-relaxed mb-4">
                    {trimmed}
                </p>
            )
        })
    }

    const getIconForSection = (title: string) => {
        const lowerTitle = title.toLowerCase()
        if (lowerTitle.includes("summary") || lowerTitle.includes("executive")) {
            return <Target className="w-4 h-4 text-white" />
        }
        if (lowerTitle.includes("insight") || lowerTitle.includes("finding")) {
            return <Lightbulb className="w-4 h-4 text-white" />
        }
        if (lowerTitle.includes("action") || lowerTitle.includes("step")) {
            return <CheckCircle className="w-4 h-4 text-white" />
        }
        if (lowerTitle.includes("next") || lowerTitle.includes("timeline")) {
            return <Clock className="w-4 h-4 text-white" />
        }
        if (lowerTitle.includes("resource") || lowerTitle.includes("tool")) {
            return <BookOpen className="w-4 h-4 text-white" />
        }
        return <Target className="w-4 h-4 text-white" />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => router.push("/")}
                            variant="ghost"
                            className="text-white hover:bg-white/10 rounded-xl"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Chat
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                                    Business Consultation Conclusion
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    {useDummyData ? "Demo Results - Sample Business Analysis" : "Your personalized action plan"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={handleShare} variant="ghost" className="text-white hover:bg-white/10 rounded-xl">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                        <Button
                            onClick={handleDownload}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center mb-8">
                    <Badge
                        className={`${useDummyData ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gradient-to-r from-emerald-500 to-cyan-500"} text-white border-0 px-4 py-2 text-sm font-medium`}
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {useDummyData ? "Demo Analysis Complete" : "Consultation Complete"}
                    </Badge>
                </div>

                {/* Demo Notice */}
                {useDummyData && (
                    <Card className="bg-blue-500/10 backdrop-blur-sm border-blue-400/20 shadow-2xl mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 text-blue-200">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Lightbulb className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Demo Mode</h3>
                                    <p className="text-sm text-blue-300">
                                        This is sample conclusion data for a bakery business consultation. Start a real chat to generate
                                        personalized results.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Conclusion Content */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Target className="w-4 h-4 text-white" />
                            </div>
                            {useDummyData ? "Sample Business Action Plan" : "Your Business Action Plan"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center gap-3 text-white">
                                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Generating your personalized conclusion...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="prose prose-invert max-w-none">{formatConclusion(conclusion)}</div>
                        )}
                    </CardContent>
                </Card>

                {/* Session Summary */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl mt-6">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">
                            {useDummyData ? "Demo Session Summary" : "Session Summary"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="text-2xl font-bold text-emerald-400">{messages.length}</div>
                                <div className="text-slate-400 text-sm">Total Messages</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="text-2xl font-bold text-purple-400">
                                    {messages.filter((m) => m.role === "assistant").length}
                                </div>
                                <div className="text-slate-400 text-sm">AI Responses</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="text-2xl font-bold text-cyan-400">
                                    {Math.ceil(messages.reduce((acc, m) => acc + m.content.length, 0) / 1000)}k
                                </div>
                                <div className="text-slate-400 text-sm">Characters Analyzed</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sample Business Insights (only shown in demo mode) */}
                {useDummyData && (
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl mt-6">
                        <CardHeader>
                            <CardTitle className="text-white text-lg flex items-center gap-3">
                                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <Target className="w-3 h-3 text-white" />
                                </div>
                                Key Business Metrics Analyzed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Marketing Effectiveness</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="w-3/5 h-full bg-gradient-to-r from-yellow-400 to-orange-400"></div>
                                            </div>
                                            <span className="text-yellow-400 text-sm">60%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Cash Flow Health</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="w-4/5 h-full bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
                                            </div>
                                            <span className="text-emerald-400 text-sm">80%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Operational Efficiency</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="w-2/3 h-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                                            </div>
                                            <span className="text-purple-400 text-sm">65%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Growth Potential</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="w-5/6 h-full bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                                            </div>
                                            <span className="text-blue-400 text-sm">85%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-slate-500 text-xs">
                        {useDummyData
                            ? "This is a demonstration of the conclusion feature • Start a real conversation to get personalized results"
                            : "This conclusion was generated based on your consultation session • Keep this for your business records"}
                    </p>
                </div>
            </div>
        </div>
    )
}
