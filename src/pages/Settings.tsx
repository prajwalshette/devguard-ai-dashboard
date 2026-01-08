import { useState } from "react";
import { TopNavigation } from "@/components/TopNavigation";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { WebhookSettings } from "@/components/settings/WebhookSettings";
import { ScanFrequencySettings } from "@/components/settings/ScanFrequencySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Webhook, Clock } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation isConnected={true} plan="pro" />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your DevGuard AI preferences
          </p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="notifications" className="data-[state=active]:bg-background">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="data-[state=active]:bg-background">
              <Webhook className="w-4 h-4 mr-2" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="scanning" className="data-[state=active]:bg-background">
              <Clock className="w-4 h-4 mr-2" />
              Scan Frequency
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="webhooks">
            <WebhookSettings />
          </TabsContent>

          <TabsContent value="scanning">
            <ScanFrequencySettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
