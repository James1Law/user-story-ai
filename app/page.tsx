"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Copy, CheckCircle, Sparkles, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AgileStoryGenerator() {
  const [prompt, setPrompt] = useState("")
  const [story, setStory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const generateStory = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a description",
        description: "Tell me what feature you'd like a user story for.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setStory("")
    setCopied(false)

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate story")
      }

      setStory(data.story)
      toast({
        title: "✨ Story Generated!",
        description: "Your user story is ready to copy.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate user story"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(story)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "User story copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      generateStory()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wand2 className="w-8 h-8 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Law's Story Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Describe your feature and watch AI craft the perfect user story
          </p>
        </div>

        {/* Input Section - Front and Center */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="space-y-4">
              <label htmlFor="feature-input" className="block text-lg font-semibold text-gray-700 text-center">
                What feature would you like a user story for?
              </label>
              <div className="flex flex-col gap-4 sm:gap-6">
                <Textarea
                  id="feature-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., Operators need to add port calls to a vessel's itinerary"
                  className="flex-1 text-lg min-h-[80px] max-h-48 py-4 px-4 border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400 resize-none shadow-sm"
                  disabled={isLoading}
                  rows={3}
                />
                <div className="flex justify-center">
                  <Button
                    onClick={generateStory}
                    disabled={isLoading || !prompt.trim()}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Story
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Press Enter or click the button to generate your story
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Loading Animation */}
        {isLoading && (
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-blue-200"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-blue-500 border-t-transparent animate-spin animate-reverse"></div>
                  </div>
                  <Sparkles className="w-6 h-6 text-purple-500 absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">AI is crafting your story...</h3>
                <p className="text-gray-600">Analyzing requirements and structuring the perfect user story</p>
                <div className="flex justify-center items-center gap-1 mt-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {story && !isLoading && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Your User Story
                </h2>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Story
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 shadow-inner">
                <pre className="text-green-400 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-auto max-h-96">
                  {story}
                </pre>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Ready to use in Jira, Azure DevOps, or your favorite project management tool
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!story && !isLoading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <Wand2 className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready when you are!</h3>
            <p className="text-gray-500">Enter a feature description above to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
