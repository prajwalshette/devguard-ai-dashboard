import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export const ScanFrequencySettings = () => {
  const [settings, setSettings] = useState({
    scanTrigger: "on_pr",
    scheduledScans: false,
    scheduleFrequency: "daily",
    scanOnPush: true,
    scanDependencies: true,
    deepScan: false,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your scan frequency preferences have been updated.",
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">Scan Frequency</CardTitle>
        <CardDescription>
          Configure when and how DevGuard AI scans your repositories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Scan triggers</h3>
          
          <RadioGroup
            value={settings.scanTrigger}
            onValueChange={(value) => setSettings((prev) => ({ ...prev, scanTrigger: value }))}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <RadioGroupItem value="on_pr" id="on_pr" className="mt-0.5" />
              <Label htmlFor="on_pr" className="flex-1 cursor-pointer">
                <span className="font-medium">On pull request</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Scan code when a pull request is opened or updated
                </p>
              </Label>
            </div>
            
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <RadioGroupItem value="on_push" id="on_push" className="mt-0.5" />
              <Label htmlFor="on_push" className="flex-1 cursor-pointer">
                <span className="font-medium">On every push</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Scan code on every push to any branch
                </p>
              </Label>
            </div>
            
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <RadioGroupItem value="manual" id="manual" className="mt-0.5" />
              <Label htmlFor="manual" className="flex-1 cursor-pointer">
                <span className="font-medium">Manual only</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Only scan when manually triggered
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <h3 className="text-sm font-medium text-foreground">Scheduled scans</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="scheduled" className="flex flex-col gap-1">
              <span>Enable scheduled scans</span>
              <span className="text-xs text-muted-foreground font-normal">
                Run periodic scans on all connected repositories
              </span>
            </Label>
            <Switch
              id="scheduled"
              checked={settings.scheduledScans}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, scheduledScans: checked }))
              }
            />
          </div>

          {settings.scheduledScans && (
            <RadioGroup
              value={settings.scheduleFrequency}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, scheduleFrequency: value }))
              }
              className="ml-4 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="cursor-pointer">Daily at 2:00 AM UTC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="cursor-pointer">Weekly on Mondays</Label>
              </div>
            </RadioGroup>
          )}
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <h3 className="text-sm font-medium text-foreground">Scan options</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="dependencies" className="flex flex-col gap-1">
              <span>Scan dependencies</span>
              <span className="text-xs text-muted-foreground font-normal">
                Check for vulnerabilities in npm/pip/gem packages
              </span>
            </Label>
            <Switch
              id="dependencies"
              checked={settings.scanDependencies}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, scanDependencies: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="deep-scan" className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span>Deep scan mode</span>
                <Badge variant="pro" className="text-[10px]">Pro</Badge>
              </div>
              <span className="text-xs text-muted-foreground font-normal">
                Extended analysis including data flow and taint tracking
              </span>
            </Label>
            <Switch
              id="deep-scan"
              checked={settings.deepScan}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, deepScan: checked }))
              }
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
