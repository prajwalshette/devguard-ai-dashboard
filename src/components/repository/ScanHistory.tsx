import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "../ui/badge";

interface Scan {
  id: string;
  commitHash: string;
  branch: string;
  timestamp: string;
  duration: string;
  status: "success" | "failed" | "running";
  findings: {
    high: number;
    medium: number;
    low: number;
  };
}

const mockScans: Scan[] = [
  {
    id: "1",
    commitHash: "a3f2c1d",
    branch: "main",
    timestamp: "2 hours ago",
    duration: "1m 24s",
    status: "success",
    findings: { high: 0, medium: 2, low: 1 },
  },
  {
    id: "2",
    commitHash: "b4e3d2c",
    branch: "feature/auth",
    timestamp: "5 hours ago",
    duration: "2m 10s",
    status: "success",
    findings: { high: 1, medium: 3, low: 2 },
  },
  {
    id: "3",
    commitHash: "c5f4e3d",
    branch: "main",
    timestamp: "1 day ago",
    duration: "1m 45s",
    status: "failed",
    findings: { high: 2, medium: 1, low: 0 },
  },
  {
    id: "4",
    commitHash: "d6g5f4e",
    branch: "fix/sql-injection",
    timestamp: "2 days ago",
    duration: "1m 12s",
    status: "success",
    findings: { high: 0, medium: 0, low: 1 },
  },
];

export function ScanHistory() {
  const getStatusIcon = (status: Scan["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-status-connected" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-severity-high" />;
      case "running":
        return <Clock className="h-4 w-4 text-primary animate-pulse" />;
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium text-foreground">Scan History</h2>
      </div>
      <div className="divide-y divide-border">
        {mockScans.map((scan) => (
          <div
            key={scan.id}
            className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {getStatusIcon(scan.status)}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-foreground">
                    {scan.commitHash}
                  </code>
                  <span className="text-xs text-muted-foreground">
                    on {scan.branch}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {scan.timestamp} · {scan.duration}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {scan.findings.high > 0 && (
                <Badge variant="high" className="text-xs">
                  {scan.findings.high}
                </Badge>
              )}
              {scan.findings.medium > 0 && (
                <Badge variant="medium" className="text-xs">
                  {scan.findings.medium}
                </Badge>
              )}
              {scan.findings.low > 0 && (
                <Badge variant="low" className="text-xs">
                  {scan.findings.low}
                </Badge>
              )}
              {scan.findings.high === 0 &&
                scan.findings.medium === 0 &&
                scan.findings.low === 0 && (
                  <span className="text-xs text-muted-foreground">Clean</span>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
