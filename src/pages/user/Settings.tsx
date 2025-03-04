import React, { useState } from "react";
import { Menu, X, Key, LogOut, CreditCard } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../service/redux/authSlice";
import { useToast } from "../../@/hooks/use-toast";
import { selectUserId } from "../../service/redux/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateApi, fetchSettingsData, purchaseTokens } from "../../service/Api/settingsApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Progress } from "../../components/ui/progress";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("api");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userId = useSelector(selectUserId);
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetchSettingsData(userId),
    enabled: !!userId, // Only fetch if userId is available
  });

  const tokenPurchaseMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!userId) throw new Error("User ID is required");
      return await purchaseTokens(userId, amount);
    },
    onSuccess: (checkoutUrl, purchaseAmount) => {
      // queryClient.invalidateQueries({ queryKey: ["settings"] });
      setIsPurchaseDialogOpen(false)
      if (checkoutUrl) {
        console.log("🔄 Redirecting to checkout:", checkoutUrl);
        window.location.href = checkoutUrl;
      }
    },
    onError: () => {
      toast({
        description: "Failed to complete token purchase.",
        variant: "destructive",
      });
    },
  });

  const apiKeyMutation = useMutation({
    mutationFn: () => generateApi(userId),
    onSuccess: (data) => {
      toast({ description: "API Key regenerated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
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
    { title: "Tokens", href: "#tokens", icon: CreditCard },
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

  const handlePurchaseTokens = () => {
    tokenPurchaseMutation.mutate(Number(purchaseAmount));
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
                    value={isSettingsLoading ? "Loading..." : settingsData?.apiKey || ""}
                    readOnly
                    className="font-mono"
                    onClick={() => {
                      if (!isSettingsLoading && settingsData?.apiKey) {
                        navigator.clipboard.writeText(settingsData.apiKey);
                        toast({ description: "Copied to clipboard" });
                      }
                    }}
                  />
                  <Button onClick={toggleVisibility} className="text-xs">
                    {isPasswordVisible ? "Hide" : "Show"}
                  </Button>
                  <Button onClick={() => apiKeyMutation.mutate()}>
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

      case "tokens":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Token Management</CardTitle>
              <CardDescription>View and purchase API tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Remaining Tokens</Label>
                  <span className="font-semibold text-lg">
                    {isSettingsLoading ? "Loading..." : `${settingsData?.token || 0} tokens`}
                  </span>
                </div>
                <Progress 
                  value={isSettingsLoading ? 0 :  Math.min((settingsData?.token || 0) / 2000 * 100, 100)} 
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Usage level: {isSettingsLoading ? "Calculating..." : 
                    (settingsData?.token || 0) > 1000 ? "Good" : 
                    (settingsData?.token || 0) > 500 ? "Moderate" : "Low"}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Purchase Tokens</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex space-x-2">
                    <Select defaultValue={purchaseAmount} onValueChange={setPurchaseAmount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">1,000 tokens ($50)</SelectItem>
                        <SelectItem value="125">3,000 tokens ($125)</SelectItem>
                        <SelectItem value="200">5,000 tokens ($200)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setIsPurchaseDialogOpen(true)}>
                      Purchase
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-muted-foreground">
                Tokens are consumed each time you make an API request. They don't expire, so you can use them at your own pace.
              </p>
            </CardFooter>
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

      {/* Purchase Confirmation Dialog */}
      <AlertDialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to purchase {Number(purchaseAmount).toLocaleString()} tokens for $
              {purchaseAmount === "1000" ? "10" : 
                purchaseAmount === "5000" ? "45" : 
                purchaseAmount === "10000" ? "80" : "350"}.
              This action will be charged to your account's payment method.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePurchaseTokens}>
              Confirm Purchase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;