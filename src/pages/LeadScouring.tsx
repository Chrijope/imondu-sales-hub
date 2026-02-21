import { useState, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Download, UserPlus, Loader2, Building2, Briefcase, MapPin, Phone, Mail, Globe, Home, Users,
} from "lucide-react";
import { GEWERK_OPTIONS } from "@/data/crm-data";

// ── Mock B2C scouring results ──
const MOCK_B2C_RESULTS = [
  { id: "s1", name: "Markus Braun", phone: "+49 170 9998877", email: "m.braun@web.de", address: "Friedrichstr. 45, 10117 Berlin", objekttyp: "Einfamilienhaus", baujahr: 1982, wohnflaeche: 135, preis: "389.000 €", quelle: "ImmoScout24" },
  { id: "s2", name: "Claudia Richter", phone: "+49 151 2223344", email: "c.richter@gmail.com", address: "Leopoldstr. 120, 80802 München", objekttyp: "Wohnung", baujahr: 1995, wohnflaeche: 78, preis: "295.000 €", quelle: "ImmoScout24" },
  { id: "s3", name: "Hans-Peter Schulz", phone: "+49 172 5556677", email: "hp.schulz@t-online.de", address: "Alsterchaussee 10, 20149 Hamburg", objekttyp: "Mehrfamilienhaus", baujahr: 1968, wohnflaeche: 420, preis: "1.250.000 €", quelle: "ImmoScout24" },
  { id: "s4", name: "Ingrid Neumann", phone: "+49 160 8889900", email: "i.neumann@outlook.de", address: "Königsallee 55, 40212 Düsseldorf", objekttyp: "Einfamilienhaus", baujahr: 1975, wohnflaeche: 165, preis: "445.000 €", quelle: "ImmoScout24" },
  { id: "s5", name: "Stefan Krüger", phone: "+49 176 1112233", email: "s.krueger@email.de", address: "Schlossstr. 8, 70173 Stuttgart", objekttyp: "Wohnung", baujahr: 2010, wohnflaeche: 92, preis: "320.000 €", quelle: "ImmoScout24" },
  { id: "s6", name: "Monika Fischer", phone: "+49 157 4445566", email: "m.fischer@gmx.de", address: "Zeil 100, 60313 Frankfurt", objekttyp: "Gewerbeobjekt", baujahr: 1990, wohnflaeche: 200, preis: "750.000 €", quelle: "ImmoScout24" },
  { id: "s7", name: "Ralf Zimmermann", phone: "+49 163 7778899", email: "r.zimmermann@web.de", address: "Unter den Linden 20, 10117 Berlin", objekttyp: "Grundstück", baujahr: 0, wohnflaeche: 0, preis: "180.000 €", quelle: "ImmoScout24" },
  { id: "s8", name: "Andrea Weber", phone: "+49 171 3334455", email: "a.weber@email.de", address: "Maximilianstr. 35, 80539 München", objekttyp: "Wohnung", baujahr: 2003, wohnflaeche: 68, preis: "275.000 €", quelle: "ImmoScout24" },
];

// ── Mock B2B scouring results ──
const MOCK_B2B_RESULTS = [
  { id: "b1", firma: "Planwerk Architekten", gewerk: "Architekt", kontakt: "Dr. Lisa Berger", phone: "+49 30 1234567", email: "berger@planwerk.de", website: "www.planwerk.de", region: "Berlin", quelle: "Google" },
  { id: "b2", firma: "EnergieEffizient GmbH", gewerk: "Energieberater", kontakt: "Thomas Hartmann", phone: "+49 89 9876543", email: "hartmann@energieeffizient.de", website: "www.energieeffizient.de", region: "Bayern", quelle: "Google" },
  { id: "b3", firma: "Dachprofi Müller", gewerk: "Dachdecker", kontakt: "Werner Müller", phone: "+49 40 5554433", email: "mueller@dachprofi.de", website: "www.dachprofi.de", region: "Hamburg", quelle: "Google" },
  { id: "b4", firma: "Fenster König GmbH", gewerk: "Fensterbauer", kontakt: "Sabrina König", phone: "+49 221 7778899", email: "koenig@fenster-koenig.de", website: "www.fenster-koenig.de", region: "NRW", quelle: "Google" },
  { id: "b5", firma: "Projekthaus Bayern", gewerk: "Projektentwickler", kontakt: "Michael Gruber", phone: "+49 89 3332211", email: "gruber@projekthaus.de", website: "www.projekthaus.de", region: "Bayern", quelle: "Google" },
  { id: "b6", firma: "Elektro Schuster", gewerk: "Elektriker", kontakt: "Karl Schuster", phone: "+49 711 6665544", email: "schuster@elektro-schuster.de", website: "www.elektro-schuster.de", region: "Baden-Württemberg", quelle: "Google" },
  { id: "b7", firma: "SHK Profi Nord", gewerk: "SHK", kontakt: "Jens Petersen", phone: "+49 431 1122334", email: "petersen@shk-nord.de", website: "www.shk-nord.de", region: "Schleswig-Holstein", quelle: "Google" },
  { id: "b8", firma: "Malermeister Braun", gewerk: "Maler", kontakt: "Erich Braun", phone: "+49 351 4455667", email: "braun@malermeister.de", website: "www.malermeister-braun.de", region: "Sachsen", quelle: "Google" },
];

const REGIONS = [
  "Alle Regionen", "Berlin", "Bayern", "Hamburg", "NRW", "Baden-Württemberg",
  "Hessen", "Sachsen", "Niedersachsen", "Schleswig-Holstein", "Brandenburg",
];

const ASSIGNEES = ["Max Müller", "Lisa Weber", "Jan Fischer"];

export default function LeadScouring() {
  const [tab, setTab] = useState<"b2c" | "b2b">("b2c");
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState("10");
  const [region, setRegion] = useState("Alle Regionen");
  const [gewerk, setGewerk] = useState("Alle");
  const [scouring, setScouring] = useState(false);
  const [scoured, setScoured] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [assignee, setAssignee] = useState(ASSIGNEES[0]);
  const [assigned, setAssigned] = useState<Set<string>>(new Set());

  const b2cResults = MOCK_B2C_RESULTS;
  const b2bResults = MOCK_B2B_RESULTS;

  const filteredB2C = useMemo(() => {
    let list = b2cResults;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
    }
    return list.slice(0, Number(amount) || 50);
  }, [b2cResults, search, amount]);

  const filteredB2B = useMemo(() => {
    let list = b2bResults;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
    }
    if (region !== "Alle Regionen") {
      list = list.filter((r) => r.region === region);
    }
    if (gewerk !== "Alle") {
      list = list.filter((r) => r.gewerk === gewerk);
    }
    return list.slice(0, Number(amount) || 50);
  }, [b2bResults, search, region, gewerk, amount]);
  const filtered = tab === "b2c" ? filteredB2C : filteredB2B;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((r) => r.id)));
    }
  };

  const handleScour = () => {
    setScouring(true);
    setScoured(false);
    setSelectedIds(new Set());
    setAssigned(new Set());
    setTimeout(() => {
      setScouring(false);
      setScoured(true);
    }, 2000);
  };

  const handleAssign = () => {
    setAssigned((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedIds(new Set());
  };

  return (
    <CRMLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lead Scouring</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Externe Leads automatisch recherchieren und dem Team zuteilen
            </p>
          </div>
        </div>

        {/* Tab Switch */}
        <div className="flex gap-2">
          <Button
            variant={tab === "b2c" ? "default" : "outline"}
            onClick={() => { setTab("b2c"); setScoured(false); setSelectedIds(new Set()); }}
            className="gap-2"
          >
            <Building2 className="h-4 w-4" /> B2C – Eigentümer
          </Button>
          <Button
            variant={tab === "b2b" ? "default" : "outline"}
            onClick={() => { setTab("b2b"); setScoured(false); setSelectedIds(new Set()); }}
            className="gap-2"
          >
            <Briefcase className="h-4 w-4" /> B2B – Gewerke
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            {tab === "b2b" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Gewerk</label>
                  <Select value={gewerk} onValueChange={setGewerk}>
                    <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alle">Alle Gewerke</SelectItem>
                      {GEWERK_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Region</label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {tab === "b2c" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Quelle</label>
                <Select defaultValue="immoscout">
                  <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immoscout">ImmoScout24</SelectItem>
                    <SelectItem value="immowelt">Immowelt</SelectItem>
                    <SelectItem value="ebay">eBay Kleinanzeigen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Anzahl Leads</label>
              <Select value={amount} onValueChange={setAmount}>
                <SelectTrigger className="w-[120px] h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["5", "10", "25", "50", "100"].map((n) => <SelectItem key={n} value={n}>{n} Leads</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleScour} disabled={scouring} className="gap-2 h-9">
              {scouring ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {scouring ? "Suche läuft…" : "Leads scouren"}
            </Button>
          </div>
        </div>

        {/* Results */}
        {scoured && (
          <div className="space-y-4">
            {/* Actions bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Ergebnisse durchsuchen…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 w-[240px] text-sm"
                  />
                </div>
                <Badge variant="secondary">{filtered.length} Ergebnisse</Badge>
              </div>
              <div className="flex items-center gap-2">
                {selectedIds.size > 0 && (
                  <>
                    <Badge variant="outline">{selectedIds.size} ausgewählt</Badge>
                    <Select value={assignee} onValueChange={setAssignee}>
                      <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ASSIGNEES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleAssign} className="gap-2">
                      <UserPlus className="h-4 w-4" /> Zuteilen
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="p-3 w-10">
                        <Checkbox
                          checked={selectedIds.size === filtered.length && filtered.length > 0}
                          onCheckedChange={toggleAll}
                        />
                      </th>
                      {tab === "b2c" ? (
                        <>
                          <th className="p-3 text-left font-medium text-muted-foreground">Name</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Kontakt</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Adresse</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Objekttyp</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Baujahr</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Fläche</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Preis</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                        </>
                      ) : (
                        <>
                          <th className="p-3 text-left font-medium text-muted-foreground">Firma</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Gewerk</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Kontaktperson</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Kontakt</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Website</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Region</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => {
                      const isAssigned = assigned.has(r.id);
                      return (
                        <tr
                          key={r.id}
                          className={`border-b border-border last:border-0 transition-colors ${
                            isAssigned ? "bg-primary/5" : "hover:bg-muted/30"
                          }`}
                        >
                          <td className="p-3">
                            <Checkbox
                              checked={selectedIds.has(r.id)}
                              disabled={isAssigned}
                              onCheckedChange={() => toggleSelect(r.id)}
                            />
                          </td>
                          {tab === "b2c" ? (() => {
                            const b = r as typeof MOCK_B2C_RESULTS[0];
                            return (
                              <>
                                <td className="p-3 font-medium text-foreground">{b.name}</td>
                                <td className="p-3">
                                  <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{b.phone}</span>
                                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{b.email}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{b.address}</td>
                                <td className="p-3"><Badge variant="outline" className="text-xs">{b.objekttyp}</Badge></td>
                                <td className="p-3 text-muted-foreground">{b.baujahr || "–"}</td>
                                <td className="p-3 text-muted-foreground">{b.wohnflaeche ? `${b.wohnflaeche} m²` : "–"}</td>
                                <td className="p-3 font-medium">{b.preis}</td>
                                <td className="p-3">
                                  {isAssigned ? (
                                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Zugeteilt</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">Neu</Badge>
                                  )}
                                </td>
                              </>
                            );
                          })() : (() => {
                            const b = r as typeof MOCK_B2B_RESULTS[0];
                            return (
                              <>
                                <td className="p-3 font-medium text-foreground">{b.firma}</td>
                                <td className="p-3"><Badge variant="outline" className="text-xs">{b.gewerk}</Badge></td>
                                <td className="p-3 text-muted-foreground">{b.kontakt}</td>
                                <td className="p-3">
                                  <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{b.phone}</span>
                                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{b.email}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-muted-foreground flex items-center gap-1"><Globe className="h-3 w-3" />{b.website}</td>
                                <td className="p-3 text-muted-foreground">{b.region}</td>
                                <td className="p-3">
                                  {isAssigned ? (
                                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Zugeteilt</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">Neu</Badge>
                                  )}
                                </td>
                              </>
                            );
                          })()}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!scoured && !scouring && (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {tab === "b2c" ? "Eigentümer-Leads scouren" : "Gewerke-Leads scouren"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {tab === "b2c"
                ? "Finden Sie Immobilieneigentümer, die ihre Objekte auf ImmoScout24, Immowelt oder eBay Kleinanzeigen inseriert haben."
                : "Recherchieren Sie Architekten, Energieberater, Dachdecker und weitere Gewerke in Ihrer Region über Google."}
            </p>
          </div>
        )}

        {scouring && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Leads werden gesucht…</h3>
            <p className="text-sm text-muted-foreground">
              {tab === "b2c" ? "ImmoScout24 wird durchsucht" : "Google wird durchsucht"}. Bitte warten.
            </p>
          </div>
        )}
      </div>
    </CRMLayout>
  );
}
