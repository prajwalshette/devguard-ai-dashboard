import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailOnHighSeverity: true,
    emailOnMediumSeverity: false,
    emailOnLowSeverity: false,
    emailDigest: "daily",
    slackNotifications: true,
    prComments: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">Notification Preferences</CardTitle>
        <CardDescription>
          Choose how and when you want to be notified about security findings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Email Alerts</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="high-severity" className="flex flex-col gap-1">
              <span>High severity vulnerabilities</span>
              <span className="text-xs text-muted-foreground font-normal">
                Get notified immediately for critical issues
              </span>
            </Label>
            <Switch
              id="high-severity"
              checked={settings.emailOnHighSeverity}
              onCheckedChange={() => handleToggle("emailOnHighSeverity")}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="medium-severity" className="flex flex-col gap-1">
              <span>Medium severity vulnerabilities</span>
              <span className="text-xs text-muted-foreground font-normal">
                Get notified for moderate security issues
              </span>
            </Label>
            <Switch
              id="medium-severity"
              checked={settings.emailOnMediumSeverity}
              onCheckedChange={() => handleToggle("emailOnMediumSeverity")}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="low-severity" className="flex flex-col gap-1">
              <span>Low severity vulnerabilities</span>
              <span className="text-xs text-muted-foreground font-normal">
                Get notified for minor security issues
              </span>
            </Label>
            <Switch
              id="low-severity"
              checked={settings.emailOnLowSeverity}
              onCheckedChange={() => handleToggle("emailOnLowSeverity")}
            />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <h3 className="text-sm font-medium text-foreground">Email Digest</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="digest-frequency" className="flex flex-col gap-1">
              <span>Summary frequency</span>
              <span className="text-xs text-muted-foreground font-normal">
                Receive a summary of all findings
              </span>
            </Label>
            <Select
              value={settings.emailDigest}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, emailDigest: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <h3 className="text-sm font-medium text-foreground">Integrations</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="slack" className="flex flex-col gap-1">
              <span>Slack notifications</span>
              <span className="text-xs text-muted-foreground font-normal">
                Send alerts to your Slack workspace
              </span>
            </Label>
            <Switch
              id="slack"
              checked={settings.slackNotifications}
              onCheckedChange={() => handleToggle("slackNotifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="pr-comments" className="flex flex-col gap-1">
              <span>PR comments</span>
              <span className="text-xs text-muted-foreground font-normal">
                Add comments directly on pull requests
              </span>
            </Label>
            <Switch
              id="pr-comments"
              checked={settings.prComments}
              onCheckedChange={() => handleToggle("prComments")}
            />
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave}>Save preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
};
