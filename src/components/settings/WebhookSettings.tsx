import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, ExternalLink } from "lucide-react";

interface Webhook {
  id: string;
  url: string;
  enabled: boolean;
  events: string[];
}

export const WebhookSettings = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "1",
      url: "https://api.example.com/webhooks/devguard",
      enabled: true,
      events: ["high_severity", "scan_complete"],
    },
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");

  const addWebhook = () => {
    if (!newWebhookUrl.trim()) return;
    
    try {
      new URL(newWebhookUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid webhook URL.",
        variant: "destructive",
      });
      return;
    }

    const webhook: Webhook = {
      id: Date.now().toString(),
      url: newWebhookUrl,
      enabled: true,
      events: ["high_severity", "scan_complete"],
    };
    
    setWebhooks((prev) => [...prev, webhook]);
    setNewWebhookUrl("");
    toast({
      title: "Webhook added",
      description: "Your webhook has been configured.",
    });
  };

  const removeWebhook = (id: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
    toast({
      title: "Webhook removed",
      description: "The webhook has been deleted.",
    });
  };

  const toggleWebhook = (id: string) => {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const testWebhook = (url: string) => {
    toast({
      title: "Test sent",
      description: "A test payload has been sent to your webhook.",
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">Webhook Configuration</CardTitle>
        <CardDescription>
          Configure webhooks to receive real-time security alerts in your systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Add new webhook</Label>
          <div className="flex gap-2">
            <Input
              placeholder="https://your-server.com/webhook"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addWebhook} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {webhooks.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4">
            <h3 className="text-sm font-medium text-foreground">Active webhooks</h3>
            
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="p-4 rounded-lg border border-border bg-muted/30 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <code className="text-sm text-foreground break-all font-mono">
                      {webhook.url}
                    </code>
                    <div className="flex gap-2 mt-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Switch
                    checked={webhook.enabled}
                    onCheckedChange={() => toggleWebhook(webhook.id)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testWebhook(webhook.url)}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Test
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWebhook(webhook.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-border pt-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Webhook payload</h4>
            <pre className="text-xs text-muted-foreground font-mono overflow-x-auto">
{`{
  "event": "high_severity",
  "repository": "org/repo",
  "pr_number": 123,
  "findings": [...],
  "timestamp": "2026-01-08T12:00:00Z"
}`}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
