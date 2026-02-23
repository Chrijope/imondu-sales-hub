import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import imonduLogo from "@/assets/imondu-logo-full.png";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Fehler", description: "Bitte E-Mail und Passwort eingeben." });
      return;
    }
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Willkommen!", description: "Du wurdest erfolgreich angemeldet." });
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 dashboard-mesh-bg" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <img src={imonduLogo} alt="IMONDU" className="h-12" />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-display font-bold text-foreground leading-tight">
              Die Nr. 1 Plattform für<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Immobilienentwicklung
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Verbinden Sie Eigentümer und Entwickler – intelligent, direkt und transparent.
            </p>
            
            <div className="flex gap-8 pt-4">
              {[
                { value: "2.500+", label: "Eigentümer" },
                { value: "850+", label: "Entwickler" },
                { value: "98%", label: "Zufriedenheit" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} IMONDU GmbH · Alle Rechte vorbehalten
          </p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={imonduLogo} alt="IMONDU" className="h-10" />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-display font-bold text-foreground">Willkommen zurück</h2>
            <p className="text-sm text-muted-foreground mt-1">Melde dich in deinem Account an.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">Passwort</Label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Passwort vergessen?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 gradient-brand border-0 text-primary-foreground font-semibold gap-2"
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {loading ? "Anmeldung..." : "Anmelden"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Noch keinen Zugang? Wende dich an deinen Administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
