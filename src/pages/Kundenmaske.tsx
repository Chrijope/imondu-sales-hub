import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, User, Phone, Mail, MapPin, Building2, Calendar, Clock,
  FileText, MessageSquare, TrendingUp, ChevronRight, Star, Plus, Edit,
} from "lucide-react";

interface KundenActivity {
  id: string;
  type: "call" | "email" | "meeting" | "note" | "deal";
  title: string;
  date: string;
  details?: string;
}

interface Kunde {
  id: string;
  name: string;
  email: string;
  phone: string;
  adresse: string;
  typ: "B2C" | "B2B";
  status: "Neu" | "Aktiv" | "Gewonnen" | "Bestand";
  erstelltAm: string;
  letzterKontakt: string;
  inserate?: number;
  umsatz?: number;
  notizen?: string;
  imonduId: string;
  activities: KundenActivity[];
}

const DEMO_KUNDEN: Kunde[] = [
  {
    id: "1", name: "Familie Schneider", email: "schneider@email.de", phone: "+49 89 123456",
    adresse: "Maximilianstr. 22, 80539 München", typ: "B2C", status: "Aktiv",
    erstelltAm: "15.01.2025", letzterKontakt: "18.02.2026", inserate: 3,
    imonduId: "IM-200000001",
    notizen: "Interesse an MFH München-Ost. Budget ca. 800k. Besichtigung geplant.",
    activities: [
      { id: "a1", type: "call", title: "Erstgespräch geführt", date: "18.02.2026", details: "45 Min – sehr interessiert an 3-Zi-Wohnung" },
      { id: "a2", type: "email", title: "Exposé zugesandt", date: "17.02.2026", details: "MFH München Bogenhausen" },
      { id: "a3", type: "meeting", title: "Besichtigung MFH", date: "15.02.2026", details: "Vor Ort – positive Rückmeldung" },
      { id: "a4", type: "note", title: "Finanzierung klären", date: "14.02.2026", details: "Bank-Termin nächste Woche" },
      { id: "a5", type: "deal", title: "Angebot erstellt", date: "12.02.2026", details: "785.000 € – Verhandlung läuft" },
    ],
  },
  {
    id: "2", name: "Architektur Bauer GmbH", email: "info@bauer-architekten.de", phone: "+49 89 987654",
    adresse: "Leopoldstr. 77, 80802 München", typ: "B2B", status: "Gewonnen",
    erstelltAm: "03.11.2024", letzterKontakt: "20.02.2026", umsatz: 15000,
    imonduId: "IM-200000002",
    notizen: "Premium-Partner seit Nov 2024. Fokus auf Neubau-Projekte.",
    activities: [
      { id: "b1", type: "deal", title: "Premium-Mitgliedschaft verlängert", date: "20.02.2026" },
      { id: "b2", type: "call", title: "Quartalsgespräch", date: "15.02.2026", details: "Zufrieden – möchte weitere Leads" },
      { id: "b3", type: "meeting", title: "Jahresreview 2025", date: "10.01.2026" },
    ],
  },
  {
    id: "3", name: "Peter Klein", email: "p.klein@web.de", phone: "+49 171 5551234",
    adresse: "Sendlinger Str. 14, 80331 München", typ: "B2C", status: "Neu",
    erstelltAm: "10.02.2026", letzterKontakt: "12.02.2026", inserate: 1,
    imonduId: "IM-200000003",
    activities: [
      { id: "c1", type: "call", title: "Erstkontakt – Rückruf nötig", date: "12.02.2026" },
    ],
  },
];

const activityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  deal: TrendingUp,
};

const activityColors: Record<string, string> = {
  call: "bg-info/10 text-info",
  email: "bg-primary/10 text-primary",
  meeting: "bg-success/10 text-success",
  note: "bg-muted text-muted-foreground",
  deal: "bg-warning/10 text-warning",
};

const statusColors: Record<string, string> = {
  Neu: "bg-info/10 text-info border-info/20",
  Aktiv: "bg-primary/10 text-primary border-primary/20",
  Gewonnen: "bg-success/10 text-success border-success/20",
  Bestand: "bg-muted text-muted-foreground border-border",
};

export default function Kundenmaske() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>("1");

  const filtered = DEMO_KUNDEN.filter((k) =>
    k.name.toLowerCase().includes(search.toLowerCase()) ||
    k.email.toLowerCase().includes(search.toLowerCase())
  );

  const selected = DEMO_KUNDEN.find((k) => k.id === selectedId);

  return (
    <CRMLayout>
      <div className="flex h-[calc(100vh-2rem)] gap-4 min-h-screen dashboard-mesh-bg p-4">
        {/* Left: Customer List */}
        <div className="w-80 shrink-0 glass-card-static rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Kunden</h2>
              <Badge variant="secondary" className="ml-auto text-[10px]">{DEMO_KUNDEN.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Suchen…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {filtered.map((k) => (
              <button
                key={k.id}
                onClick={() => setSelectedId(k.id)}
                className={`w-full text-left px-3 py-3 hover:bg-muted/30 transition-colors ${
                  selectedId === k.id ? "bg-muted/50 border-l-2 border-l-primary" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{k.name}</span>
                  <Badge variant="outline" className={`text-[9px] ml-auto ${statusColors[k.status]}`}>{k.status}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-[9px]">{k.typ}</Badge>
                  <span className="text-[11px] text-muted-foreground">{k.letzterKontakt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: 360° Detail */}
        {selected ? (
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Profile Header */}
            <div className="glass-card-static rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl gradient-brand flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">{selected.name} <span className="text-xs font-mono text-muted-foreground ml-2">{selected.imonduId}</span></h1>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {selected.email}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {selected.phone}</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                      <MapPin className="h-3.5 w-3.5" /> {selected.adresse}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusColors[selected.status]}>{selected.status}</Badge>
                  <Badge variant="secondary">{selected.typ}</Badge>
                  
                </div>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-4 gap-3">
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{selected.inserate ?? selected.umsatz?.toLocaleString("de-DE")}</p>
                <p className="text-xs text-muted-foreground">{selected.typ === "B2C" ? "Inserate" : "Umsatz (€)"}</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{selected.activities.length}</p>
                <p className="text-xs text-muted-foreground">Interaktionen</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{selected.erstelltAm}</p>
                <p className="text-xs text-muted-foreground">Erstellt am</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{selected.letzterKontakt}</p>
                <p className="text-xs text-muted-foreground">Letzter Kontakt</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="timeline" className="bg-card rounded-xl border border-border shadow-crm-sm overflow-hidden">
              <TabsList className="w-full justify-start border-b border-border rounded-none bg-muted/30 px-4 h-11">
                <TabsTrigger value="timeline" className="text-sm">Aktivitäten</TabsTrigger>
                <TabsTrigger value="notizen" className="text-sm">Notizen</TabsTrigger>
                <TabsTrigger value="dokumente" className="text-sm">Dokumente</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">Chronologie</h3>
                  <Button variant="outline" size="sm" className="gap-1 text-xs"><Plus className="h-3.5 w-3.5" /> Aktivität</Button>
                </div>
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />
                  {selected.activities.map((a) => {
                    const Icon = activityIcons[a.type] || FileText;
                    return (
                      <div key={a.id} className="relative flex items-start gap-3">
                        <div className={`absolute -left-6 h-6 w-6 rounded-full flex items-center justify-center ${activityColors[a.type]}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <div className="flex-1 ml-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{a.title}</span>
                            <span className="text-[11px] text-muted-foreground">{a.date}</span>
                          </div>
                          {a.details && <p className="text-xs text-muted-foreground mt-0.5">{a.details}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="notizen" className="p-4">
                <div className="bg-muted/30 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap">
                  {selected.notizen || "Keine Notizen vorhanden."}
                </div>
              </TabsContent>

              <TabsContent value="dokumente" className="p-4">
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  Noch keine Dokumente hinterlegt.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Wähle einen Kunden aus der Liste
          </div>
        )}
      </div>
    </CRMLayout>
  );
}
