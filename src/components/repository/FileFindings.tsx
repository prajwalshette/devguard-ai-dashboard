import { useState } from "react";
import { ChevronRight, FileCode, AlertTriangle } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { VulnerabilityModal, VulnerabilityDetails } from "./VulnerabilityModal";

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

// Mock detailed vulnerability data
const mockVulnerabilityDetails: Record<string, Omit<VulnerabilityDetails, "id" | "line" | "severity" | "type" | "message" | "filePath">> = {
  "1": {
    codeSnippet: {
      startLine: 40,
      lines: [
        "async function getUserById(id: string) {",
        "  const query = `SELECT * FROM users WHERE id = '${id}'`;",
        "  return await db.execute(query);",
        "}",
      ],
      highlightLine: 42,
    },
    remediation: {
      description: "Use parameterized queries or prepared statements to prevent SQL injection attacks. Never concatenate user input directly into SQL queries.",
      fixedCode: `async function getUserById(id: string) {
  const query = "SELECT * FROM users WHERE id = $1";
  return await db.execute(query, [id]);
}`,
      references: [
        { title: "OWASP SQL Injection Prevention", url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" },
        { title: "CWE-89: SQL Injection", url: "https://cwe.mitre.org/data/definitions/89.html" },
      ],
    },
  },
  "2": {
    codeSnippet: {
      startLine: 76,
      lines: [
        "function hashPassword(password: string): string {",
        "  const crypto = require('crypto');",
        "  return crypto.createHash('md5').update(password).digest('hex');",
        "}",
      ],
      highlightLine: 78,
    },
    remediation: {
      description: "MD5 is cryptographically broken and should never be used for password hashing. Use bcrypt, scrypt, or Argon2 instead.",
      fixedCode: `import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}`,
      references: [
        { title: "OWASP Password Storage", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" },
      ],
    },
  },
  "3": {
    codeSnippet: {
      startLine: 13,
      lines: [
        "function renderUserContent(content: string) {",
        "  const container = document.getElementById('content');",
        "  container.innerHTML = content;",
        "}",
      ],
      highlightLine: 15,
    },
    remediation: {
      description: "Using innerHTML with unsanitized input can lead to XSS attacks. Use textContent for plain text or sanitize HTML with a library like DOMPurify.",
      fixedCode: `import DOMPurify from 'dompurify';

function renderUserContent(content: string) {
  const container = document.getElementById('content');
  container.innerHTML = DOMPurify.sanitize(content);
}`,
      references: [
        { title: "OWASP XSS Prevention", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" },
      ],
    },
  },
  "4": {
    codeSnippet: {
      startLine: 101,
      lines: [
        "app.use((err, req, res, next) => {",
        "  console.error(err);",
        "  res.status(500).json({ error: err.message, stack: err.stack });",
        "});",
      ],
      highlightLine: 103,
    },
    remediation: {
      description: "Exposing stack traces in production reveals internal implementation details that attackers can use. Log errors server-side but return generic messages to clients.",
      fixedCode: `app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    error: "An internal error occurred" 
  });
});`,
      references: [
        { title: "OWASP Error Handling", url: "https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html" },
      ],
    },
  },
  "5": {
    codeSnippet: {
      startLine: 154,
      lines: [
        "async function updateUser(userId: string, data: UserData) {",
        "  console.log('Updating user:', userId, 'with data:', data);",
        "  return await userService.update(userId, data);",
        "}",
      ],
      highlightLine: 156,
    },
    remediation: {
      description: "Logging sensitive data like passwords, tokens, or personal information can expose it in log files. Mask or redact sensitive fields before logging.",
      fixedCode: `async function updateUser(userId: string, data: UserData) {
  const safeData = { ...data, password: '[REDACTED]' };
  console.log('Updating user:', userId, 'with data:', safeData);
  return await userService.update(userId, data);
}`,
      references: [
        { title: "OWASP Logging Guide", url: "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html" },
      ],
    },
  },
  "6": {
    codeSnippet: {
      startLine: 6,
      lines: [
        "app.use(cors({",
        "  origin: '*',",
        "  credentials: true,",
        "}));",
      ],
      highlightLine: 8,
    },
    remediation: {
      description: "Using wildcard origin with credentials enabled is insecure. Specify allowed origins explicitly when credentials are required.",
      fixedCode: `const allowedOrigins = [
  'https://app.example.com',
  'https://admin.example.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));`,
      references: [
        { title: "MDN CORS", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" },
        { title: "OWASP CORS", url: "https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny" },
      ],
    },
  },
};

export function FileFindings() {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [selectedVulnerability, setSelectedVulnerability] = useState<VulnerabilityDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleFile = (path: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFiles(newExpanded);
  };

  const handleFindingClick = (finding: Finding, filePath: string) => {
    const details = mockVulnerabilityDetails[finding.id];
    if (details) {
      setSelectedVulnerability({
        id: finding.id,
        line: finding.line,
        severity: finding.severity,
        type: finding.type,
        message: finding.message,
        filePath,
        ...details,
      });
      setModalOpen(true);
    }
  };

  const getSeverityCounts = (findings: Finding[]) => {
    return {
      high: findings.filter((f) => f.severity === "high").length,
      medium: findings.filter((f) => f.severity === "medium").length,
      low: findings.filter((f) => f.severity === "low").length,
    };
  };

  return (
    <>
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
                      <button
                        key={finding.id}
                        onClick={() => handleFindingClick(finding, file.path)}
                        className="w-full flex items-start gap-3 px-4 py-3 pl-12 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors text-left"
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
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <VulnerabilityModal
        vulnerability={selectedVulnerability}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
