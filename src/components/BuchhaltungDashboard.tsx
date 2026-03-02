import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Euro, Receipt, TrendingUp, Users, ArrowRight, Filter,
  FileText, BarChart3, CheckCircle2, Clock, AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell,
} from "recharts";

// ── Sample data ──
const PARTNERS = [
  { id: "all", name: "Alle Partner" },
  { id: "u3", name: "Lisa Weber" },
  { id: "u4", name: "Anna Klein" },
  { id: "u8", name: "Sandra Hoffmann" },
  { id: "u9", name: "Peter Neumann" },
];

const MONTHLY_REVENUE = [
  { month: "Sep", b2c: 4200, b2b: 8500 },
  { month: "Okt", b2c: 5100, b2b: 7200 },
  { month: "Nov", b2c: 3800, b2b: 9100 },
  { month: "Dez", b2c: 6200, b2b: 11000 },
  { month: "Jan", b2c: 7500, b2b: 9800 },
  { month: "Feb", b2c: 8100, b2b: 12400 },
];

const OPEN_INVOICES = [
  { id: "INV-2026-041", partner: "Lisa Weber", betrag: 2450, faellig: "15.03.2026", status: "offen" as const },
  { id: "INV-2026-038", partner: "Anna Klein", betrag: 1820, faellig: "10.03.2026", status: "offen" as const },
  { id: "INV-2026-035", partner: "Sandra Hoffmann", betrag: 980, faellig: "05.03.2026", status: "ueberfaellig" as const },
  { id: "INV-2026-032", partner: "Peter Neumann", betrag: 3200, faellig: "28.02.2026", status: "ueberfaellig" as const },
  { id: "INV-2026-029", partner: "Lisa Weber", betrag: 1650, faellig: "20.02.2026", status: "bezahlt" as const },
  { id: "INV-2026-025", partner: "Anna Klein", betrag: 2100, faellig: "15.02.2026", status: "bezahlt" as const },
];

const PIE_DATA = [
  { name: "B2C Provisionen", value: 34800, color: "hsl(var(--primary))" },
  { name: "B2B Provisionen", value: 58000, color: "hsl(var(--accent-foreground))" },
  { name: "Boni", value: 7500, color: "hsl(var(--success))" },
];

const STATUS_MAP = {
  offen: { label: "Offen", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  ueberfaellig: { label: "Überfällig", className: "bg-destructive/10 text-destructive" },
  bezahlt: { label: "Bezahlt", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

export default function BuchhaltungDashboard() {
  const [filterPartner, setFilterPartner] = useState("all");
  const [filterZeitraum, setFilterZeitraum] = useState("aktuell");

  const filteredInvoices = filterPartner === "all"
    ? OPEN_INVOICES
    : OPEN_INVOICES.filter((inv) => inv.partner === PARTNERS.find((p) => p.id === filterPartner)?.name);

  const totalOffen = filteredInvoices.filter((i) => i.status === "offen").reduce((s, i) => s + i.betrag, 0);
  const totalUeberfaellig = filteredInvoices.filter((i) => i.status === "ueberfaellig").reduce((s, i) => s + i.betrag, 0);
  const totalBezahlt = filteredInvoices.filter((i) => i.status === "bezahlt").reduce((s, i) => s + i.betrag, 0);
  const gesamtProvision = PIE_DATA.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Buchhaltung</h1>
          <p className="text-muted-foreground text-sm">Provisionen, Abrechnungen & offene Posten</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterPartner} onValueChange={setFilterPartner}>
            <SelectTrigger className="w-[180px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PARTNERS.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterZeitraum} onValueChange={setFilterZeitraum}>
            <SelectTrigger className="w-[150px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aktuell">Aktueller Monat</SelectItem>
              <SelectItem value="quartal">Quartal</SelectItem>
              <SelectItem value="jahr">Gesamtes Jahr</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Euro className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Gesamtprovision</p>
                <p className="text-xl font-bold text-foreground">{gesamtProvision.toLocaleString("de-DE")} €</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10"><Clock className="h-5 w-5 text-amber-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Offene Posten</p>
                <p className="text-xl font-bold text-foreground">{totalOffen.toLocaleString("de-DE")} €</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Überfällig</p>
                <p className="text-xl font-bold text-foreground">{totalUeberfaellig.toLocaleString("de-DE")} €</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Bezahlt (Monat)</p>
                <p className="text-xl font-bold text-foreground">{totalBezahlt.toLocaleString("de-DE")} €</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Provisionseinnahmen pro Monat</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_REVENUE} barGap={4}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString("de-DE")} €`} />
                <Bar dataKey="b2c" name="B2C" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="b2b" name="B2B" fill="hsl(var(--accent-foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Verteilung</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                  {PIE_DATA.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v.toLocaleString("de-DE")} €`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1 mt-2 w-full">
              {PIE_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{d.value.toLocaleString("de-DE")} €</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Open Invoices Table */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">Offene & aktuelle Abrechnungen</CardTitle>
          <Link to="/abrechnungen">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              Alle Abrechnungen <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Rechnungs-Nr.</TableHead>
                <TableHead className="text-xs">Partner</TableHead>
                <TableHead className="text-xs text-right">Betrag</TableHead>
                <TableHead className="text-xs">Fällig</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((inv) => {
                const st = STATUS_MAP[inv.status];
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="text-xs font-mono">{inv.id}</TableCell>
                    <TableCell className="text-xs">{inv.partner}</TableCell>
                    <TableCell className="text-xs text-right font-medium">{inv.betrag.toLocaleString("de-DE")} €</TableCell>
                    <TableCell className="text-xs">{inv.faellig}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${st.className}`}>{st.label}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Partner Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Partner-Provisionsübersicht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Lisa Weber", b2c: 8200, b2b: 14500, bonus: 2500, stufe: "Projektleiter" },
            { name: "Anna Klein", b2c: 6400, b2b: 11200, bonus: 0, stufe: "Projektleiter" },
            { name: "Sandra Hoffmann", b2c: 3100, b2b: 5800, bonus: 0, stufe: "Senior Projektleiter" },
            { name: "Peter Neumann", b2c: 1200, b2b: 3400, bonus: 0, stufe: "Projektleiter" },
          ].map((p) => {
            const total = p.b2c + p.b2b + p.bonus;
            return (
              <div key={p.name} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                    <Badge variant="outline" className="text-[10px]">{p.stufe}</Badge>
                  </div>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>B2C: {p.b2c.toLocaleString("de-DE")} €</span>
                    <span>B2B: {p.b2b.toLocaleString("de-DE")} €</span>
                    {p.bonus > 0 && <span className="text-emerald-600">Bonus: {p.bonus.toLocaleString("de-DE")} €</span>}
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground">{total.toLocaleString("de-DE")} €</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link to="/abrechnungen">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Receipt className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Abrechnungen</p>
                <p className="text-xs text-muted-foreground">Alle Gutschriften verwalten</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/auswertungen">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Auswertungen</p>
                <p className="text-xs text-muted-foreground">Reports & Analysen</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/wettbewerb">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Wettbewerb</p>
                <p className="text-xs text-muted-foreground">Challenges & Boni</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
