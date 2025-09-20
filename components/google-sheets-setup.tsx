"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Settings, ExternalLink, ChevronDown, ChevronRight, AlertCircle, Copy, Eye, EyeOff } from "lucide-react"
import { setupGoogleSheet } from "@/app/actions/expense-actions"
import { useToast } from "@/hooks/use-toast"

export function GoogleSheetsSetup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [showEnvVars, setShowEnvVars] = useState(false)
  const { toast } = useToast()

  const handleInitializeSheet = async () => {
    setIsInitializing(true)
    try {
      const result = await setupGoogleSheet()
      if (result.success) {
        toast({
          title: "Success! 🎉",
          description: result.message,
        })
      } else {
        toast({
          title: "Setup Required",
          description: result.error || "Please complete the Google Sheets setup first.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize Google Sheet. Please check your configuration.",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Environment variable copied to clipboard",
    })
  }

  const envVars = [
    {
      name: "GOOGLE_SHEETS_CLIENT_EMAIL",
      description: "Service account email from Google Cloud Console",
    },
    {
      name: "GOOGLE_SHEETS_PRIVATE_KEY",
      description: "Private key from service account JSON file",
    },
    {
      name: "GOOGLE_SHEETS_PROJECT_ID",
      description: "Project ID from Google Cloud Console",
    },
    {
      name: "GOOGLE_SHEETS_SPREADSHEET_ID",
      description: "ID from your Google Sheets URL",
    },
    {
      name: "NEXT_PUBLIC_GOOGLE_SHEETS_URL",
      description: "Full URL to your Google Sheet (optional)",
    },
  ]

  return (
    <Card className="mb-6 border-secondary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-secondary" />
            <CardTitle className="text-lg text-secondary">Google Sheets Setup</CardTitle>
            <Badge variant="outline" className="text-xs">
              Required
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleInitializeSheet}
            disabled={isInitializing}
            className="text-secondary hover:bg-secondary/10"
          >
            {isInitializing ? "Initializing..." : "Test Connection"}
          </Button>
        </div>
        <CardDescription>Connect your finance tracker to Google Sheets for data persistence</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            To use Google Sheets integration, you'll need to set up environment variables in your Vercel project
            settings.
          </AlertDescription>
        </Alert>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-transparent">
              <span>Setup Instructions</span>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 mt-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Create Google Cloud Project</p>
                  <p className="text-muted-foreground">Go to Google Cloud Console and create a new project</p>
                  <Button variant="link" size="sm" className="p-0 h-auto text-secondary" asChild>
                    <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open Google Cloud Console
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Enable Google Sheets API</p>
                  <p className="text-muted-foreground">
                    In APIs & Services → Library, search and enable "Google Sheets API"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Create Service Account</p>
                  <p className="text-muted-foreground">Go to APIs & Services → Credentials → Create Service Account</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Download JSON Key</p>
                  <p className="text-muted-foreground">Create and download a JSON key for your service account</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  5
                </div>
                <div>
                  <p className="font-medium">Create Google Sheet</p>
                  <p className="text-muted-foreground">
                    Create a new Google Sheet and share it with your service account email (Editor access)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  6
                </div>
                <div>
                  <p className="font-medium">Set Environment Variables</p>
                  <p className="text-muted-foreground">
                    Add the following environment variables to your Vercel project:
                  </p>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Environment Variables</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEnvVars(!showEnvVars)}
                        className="h-6 px-2 text-xs"
                      >
                        {showEnvVars ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {showEnvVars ? "Hide" : "Show"}
                      </Button>
                    </div>

                    {showEnvVars && (
                      <div className="space-y-2 p-3 bg-muted rounded-md">
                        {envVars.map((envVar) => (
                          <div key={envVar.name} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <code className="text-xs font-mono bg-background px-2 py-1 rounded">{envVar.name}</code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(envVar.name)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">{envVar.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
