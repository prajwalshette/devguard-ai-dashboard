import { useParams, Link } from "react-router-dom";
import { ArrowLeft, GitBranch, ExternalLink, RefreshCw } from "lucide-react";
import { TopNavigation } from "@/components/TopNavigation";
import { ScanHistory } from "@/components/repository/ScanHistory";
import { VulnerabilityTrends } from "@/components/repository/VulnerabilityTrends";
import { FileFindings } from "@/components/repository/FileFindings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock repository data - in real app, fetch based on id
const mockRepo = {
  id: "1",
  name: "web-app",
  owner: "acme-corp",
  lastScan: "2 hours ago",
  totalScans: 47,
  vulnerabilities: {
    high: 1,
    medium: 3,
    low: 5,
  },
};

export default function RepositoryDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation isConnected={true} plan="pro" />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Back link and header */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to repositories
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GitBranch className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-mono font-medium text-foreground">
                  <span className="text-muted-foreground">{mockRepo.owner}/</span>
                  {mockRepo.name}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Last scanned {mockRepo.lastScan} · {mockRepo.totalScans} total scans
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                Scan Now
              </Button>
              <Button variant="github" size="sm" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                View on GitHub
              </Button>
            </div>
          </div>

          {/* Summary badges */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs text-muted-foreground mr-1">Current issues:</span>
            {mockRepo.vulnerabilities.high > 0 && (
              <Badge variant="high">{mockRepo.vulnerabilities.high} High</Badge>
            )}
            {mockRepo.vulnerabilities.medium > 0 && (
              <Badge variant="medium">{mockRepo.vulnerabilities.medium} Med</Badge>
            )}
            {mockRepo.vulnerabilities.low > 0 && (
              <Badge variant="low">{mockRepo.vulnerabilities.low} Low</Badge>
            )}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <VulnerabilityTrends />
          <ScanHistory />
        </div>

        <div className="mt-6">
          <FileFindings />
        </div>
      </main>
    </div>
  );
}
