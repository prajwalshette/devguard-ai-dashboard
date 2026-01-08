import { useState } from "react";
import { ChevronRight, FileCode, AlertTriangle } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface Finding {
  id: string;
  line: number;
  severity: "high" | "medium" | "low";
  type: string;
  message: string;
}

interface FileWithFindings {
  path: string;
  findings: Finding[];
}

const mockFiles: FileWithFindings[] = [
  {
    path: "src/api/auth.ts",
    findings: [
      {
        id: "1",
        line: 42,
        severity: "high",
        type: "SQL Injection",
        message: "User input directly concatenated in SQL query",
      },
      {
        id: "2",
        line: 78,
        severity: "medium",
        type: "Weak Crypto",
        message: "MD5 hash used for password storage",
      },
    ],
  },
  {
    path: "src/utils/sanitize.ts",
    findings: [
      {
        id: "3",
        line: 15,
        severity: "medium",
        type: "XSS",
        message: "innerHTML used without sanitization",
      },
    ],
  },
  {
    path: "src/controllers/user.ts",
    findings: [
      {
        id: "4",
        line: 103,
        severity: "low",
        type: "Info Exposure",
        message: "Stack trace exposed in error response",
      },
      {
        id: "5",
        line: 156,
        severity: "low",
        type: "Logging",
        message: "Sensitive data logged without masking",
      },
    ],
  },
  {
    path: "src/middleware/cors.ts",
    findings: [
      {
        id: "6",
        line: 8,
        severity: "high",
        type: "CORS",
        message: "Wildcard origin allowed with credentials",
      },
    ],
  },
];

export function FileFindings() {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  const toggleFile = (path: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFiles(newExpanded);
  };

  const getSeverityCounts = (findings: Finding[]) => {
    return {
      high: findings.filter((f) => f.severity === "high").length,
      medium: findings.filter((f) => f.severity === "medium").length,
      low: findings.filter((f) => f.severity === "low").length,
    };
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium text-foreground">
          Per-File Findings
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {mockFiles.length} files with issues
        </p>
      </div>
      <div className="divide-y divide-border">
        {mockFiles.map((file) => {
          const isExpanded = expandedFiles.has(file.path);
          const counts = getSeverityCounts(file.findings);

          return (
            <div key={file.path}>
              <button
                onClick={() => toggleFile(file.path)}
                className="w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                  <FileCode className="h-4 w-4 text-muted-foreground shrink-0" />
                  <code className="text-xs font-mono text-foreground truncate">
                    {file.path}
                  </code>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {counts.high > 0 && (
                    <Badge variant="high" className="text-xs">
                      {counts.high}
                    </Badge>
                  )}
                  {counts.medium > 0 && (
                    <Badge variant="medium" className="text-xs">
                      {counts.medium}
                    </Badge>
                  )}
                  {counts.low > 0 && (
                    <Badge variant="low" className="text-xs">
                      {counts.low}
                    </Badge>
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border bg-muted/30">
                  {file.findings.map((finding) => (
                    <div
                      key={finding.id}
                      className="flex items-start gap-3 px-4 py-3 pl-12 border-b border-border last:border-b-0"
                    >
                      <AlertTriangle
                        className={cn(
                          "h-4 w-4 shrink-0 mt-0.5",
                          finding.severity === "high" && "text-severity-high",
                          finding.severity === "medium" && "text-severity-medium",
                          finding.severity === "low" && "text-severity-low"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium text-foreground">
                            {finding.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Line {finding.line}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {finding.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
