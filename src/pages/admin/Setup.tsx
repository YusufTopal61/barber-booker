import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Lock, Mail, User, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const AdminSetup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 karakters zijn");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke("setup-admin", {
        body: {
          email,
          password,
          fullName,
        },
      });

      if (fnError) throw fnError;

      if (data?.error) {
        throw new Error(data.error);
      }

      setIsComplete(true);
      toast.success("Admin account succesvol aangemaakt!");
    } catch (err: any) {
      console.error("Setup error:", err);
      setError(err.message || "Er ging iets mis bij het aanmaken van het account");
    } finally {
      setIsLoading(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">Setup Compleet!</h1>
          <p className="text-muted-foreground mb-8">
            Je admin account is succesvol aangemaakt. Je kunt nu inloggen.
          </p>
          <Button onClick={() => navigate("/admin/login")} size="lg">
            Ga naar Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Scissors className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-3xl font-semibold">
              Barber<span className="text-primary">Shop</span>
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">Admin Setup</h1>
          <p className="text-muted-foreground">
            Maak het eerste admin account aan
          </p>
        </div>

        {/* Setup Form */}
        <div className="bg-card border border-border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Volledige naam
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jan de Kapper"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                E-mailadres
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@barbershop.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Wachtwoord
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Minimaal 8 karakters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Bevestig wachtwoord
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Bezig met aanmaken...
                </>
              ) : (
                "Account Aanmaken"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <a href="/" className="hover:text-primary transition-colors">
            ← Terug naar de website
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminSetup;
