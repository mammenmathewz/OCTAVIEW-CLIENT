import React, { useState } from "react";
import { Menu, X, Key, LogOut } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../service/redux/authSlice";
import { useToast } from "../../@/hooks/use-toast";
import { selectUserId } from "../../service/redux/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateApi, fetchSettingsData } from "../../service/Api/settingsApi";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("api");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userId = useSelector(selectUserId);
  const queryClient = useQueryClient();

  const { data: apiKey, isLoading: isApiKeyLoading } = useQuery({
    queryKey: ["apiKey"],
    queryFn: () => fetchSettingsData(userId),
    enabled: !!userId, // Only fetch if userId is available
  });

  const mutation = useMutation({
    mutationFn: () => generateApi(userId),
    onSuccess: (data) => {
      toast({ description: "API Key regenerated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["apiKey"] });
    },
    onError: () => {
      toast({
        description: "Failed to regenerate API Key.",
        variant: "destructive",
      });
    },
  });

  const sidebarLinks = [
    { title: "API Settings", href: "#api", icon: Key },
    { title: "Logout", href: "#logout", icon: LogOut },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>, section: string) => {
    e.preventDefault();
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const SidebarContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Settings</h2>
        <div className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.href}
                variant={activeSection === link.href.slice(1) ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={(e) => handleNavClick(e, link.href.slice(1))}
              >
                <Icon className="mr-2 h-4 w-4" />
                {link.title}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "api":
        return (
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Manage your API keys </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="apiKey"
                    type={isPasswordVisible ? "text" : "password"}
                    value={isApiKeyLoading ? "Loading..." : apiKey.apiKey || ""}
                    readOnly
                    className="font-mono"
                    onClick={() => {
                      if (!isApiKeyLoading && apiKey) {
                        navigator.clipboard.writeText(apiKey.apiKey);
                        toast({ description: "Copied to clipboard" });
                      }
                    }}
                  />
                  <Button onClick={toggleVisibility} className="text-xs">
                    {isPasswordVisible ? "Hide" : "Show"}
                  </Button>
                  <Button onClick={() => mutation.mutate()}>
                    Regenerate
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Reference Id</Label>
                <div className="flex space-x-2">
                  <Input id="webhookUrl" type="text" value={userId || ""} readOnly />
                  <Button
                    onClick={() => {
                      if (userId) {
                        navigator.clipboard.writeText(userId);
                        toast({ description: "Copied to clipboard" });
                      }
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "logout":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Logout</CardTitle>
              <CardDescription>End your current session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to log out? This will end your current session.
                </p>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  Confirm Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-40"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-background border-r transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed inset-y-0 z-30 w-64 border-r bg-background">
        <SidebarContent />
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="md:pl-64">
        <main className="p-6 pt-16 lg:p-12">
          <div className="mx-auto max-w-3xl">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
