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
  Search, Download, UserPlus, Loader2, Building2, Briefcase, MapPin, Phone, Mail, Globe, Home, Users, CheckCircle2,
} from "lucide-react";
import { GEWERK_OPTIONS, Lead, Objekttyp, Gewerk } from "@/data/crm-data";
import { addScoutedLeads } from "@/utils/scouted-leads";
import { useToast } from "@/hooks/use-toast";

// ── B2C data pool for generation ──
const B2C_FIRST = ["Markus","Claudia","Hans-Peter","Ingrid","Stefan","Monika","Ralf","Andrea","Jürgen","Petra","Wolfgang","Susanne","Dieter","Brigitte","Bernd","Karin","Uwe","Helga","Günter","Renate","Frank","Sabine","Manfred","Gabriele","Werner","Ursula","Horst","Elke","Heinrich","Christa","Gerhard","Erika","Hartmut","Anja","Norbert","Silke","Volker","Birgit","Reinhard","Martina"];
const B2C_LAST = ["Braun","Richter","Schulz","Neumann","Krüger","Fischer","Zimmermann","Weber","Hoffmann","Koch","Bauer","Schröder","Lange","Meyer","Wagner","Becker","Schmitt","Wolf","Peters","Möller","Berger","Hartmann","Kaiser","Vogt","Jäger","Seidel","Brandt","Haas","Schreiber","Kraft"];
const B2C_STREETS = ["Friedrichstr.","Leopoldstr.","Alsterchaussee","Königsallee","Schlossstr.","Zeil","Unter den Linden","Maximilianstr.","Goethestr.","Schillerweg","Beethovenallee","Mozartstr.","Bachgasse","Kantstr.","Lessingplatz","Hauptstr.","Bahnhofstr.","Gartenweg","Lindenallee","Parkstr."];
const B2C_CITIES = ["10117 Berlin","80802 München","20149 Hamburg","40212 Düsseldorf","70173 Stuttgart","60313 Frankfurt","50667 Köln","90402 Nürnberg","01069 Dresden","04109 Leipzig","30159 Hannover","28195 Bremen","45127 Essen","44137 Dortmund","76133 Karlsruhe"];
const B2C_TYPEN = ["Einfamilienhaus","Wohnung","Mehrfamilienhaus","Gewerbeobjekt","Grundstück"];
const B2C_QUELLEN = ["ImmoScout24","Immowelt","eBay Kleinanzeigen"];

function generateB2C(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const first = B2C_FIRST[i % B2C_FIRST.length];
    const last = B2C_LAST[i % B2C_LAST.length];
    const street = B2C_STREETS[i % B2C_STREETS.length];
    const city = B2C_CITIES[i % B2C_CITIES.length];
    const nr = 1 + ((i * 7 + 3) % 120);
    const typ = B2C_TYPEN[i % B2C_TYPEN.length];
    const bj = 1955 + (i * 3) % 65;
    const fl = typ === "Grundstück" ? 0 : 50 + ((i * 13) % 400);
    const preis = (100 + ((i * 37) % 1400)) * 1000;
    return {
      id: `s${i + 1}`,
      name: `${first} ${last}`,
      phone: `+49 ${150 + (i % 30)} ${1000000 + i * 1234}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${["web.de","gmail.com","gmx.de","t-online.de","outlook.de"][i % 5]}`,
      address: `${street} ${nr}, ${city}`,
      objekttyp: typ,
      baujahr: bj,
      wohnflaeche: fl,
      preis: `${preis.toLocaleString("de-DE")} €`,
      quelle: B2C_QUELLEN[i % B2C_QUELLEN.length],
    };
  });
}

// ── B2B data pool for generation ──
const B2B_FIRMEN_PREFIX = ["Planwerk","EnergieCheck","Dachprofi","Fenster König","Projekthaus","Elektro","SHK Profi","Malermeister","Baukonzept","Architektur","Sanierung Plus","Heizung","Licht & Raum","Holzbau","Solar","Wärme","Klima","Fassaden","Boden","Putz & Stuck"];
const B2B_FIRMEN_SUFFIX = ["GmbH","AG","& Co. KG","OHG","e.K.","& Söhne","Partner","Solutions","Gruppe","Technik"];
const B2B_GEWERKE: string[] = ["Architekt","Energieberater","Dachdecker","Fensterbauer","Projektentwickler","Elektriker","SHK","Maler","Zimmerer","Bauträger","Immobilienmakler"];
const B2B_KONTAKT_FIRST = ["Lisa","Thomas","Werner","Sabrina","Michael","Karl","Jens","Erich","Anna","Markus","Petra","Stefan","Claudia","Frank","Monika","Dieter","Karin","Uwe","Renate","Bernd"];
const B2B_KONTAKT_LAST = ["Berger","Hartmann","Müller","König","Gruber","Schuster","Petersen","Braun","Lehmann","Vogel","Schmid","Baumann","Richter","Sommer","Winter","Kraus","Roth","Beck","Engel","Scholz"];
const B2B_REGIONS = ["Berlin","Bayern","Hamburg","NRW","Baden-Württemberg","Hessen","Sachsen","Niedersachsen","Schleswig-Holstein","Brandenburg","Thüringen","Rheinland-Pfalz"];

function generateB2B(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const prefix = B2B_FIRMEN_PREFIX[i % B2B_FIRMEN_PREFIX.length];
    const suffix = B2B_FIRMEN_SUFFIX[i % B2B_FIRMEN_SUFFIX.length];
    const first = B2B_KONTAKT_FIRST[i % B2B_KONTAKT_FIRST.length];
    const last = B2B_KONTAKT_LAST[i % B2B_KONTAKT_LAST.length];
    const gw = B2B_GEWERKE[i % B2B_GEWERKE.length];
    const reg = B2B_REGIONS[i % B2B_REGIONS.length];
    const domain = prefix.toLowerCase().replace(/[^a-z]/g, "");
    return {
      id: `b${i + 1}`,
      firma: `${prefix} ${suffix}`,
      gewerk: gw,
      kontakt: `${first} ${last}`,
      phone: `+49 ${30 + (i % 70)} ${1000000 + i * 987}`,
      email: `${last.toLowerCase()}@${domain}.de`,
      website: `www.${domain}.de`,
      region: reg,
      quelle: "Google",
    };
  });
}

const REGIONS = [
  "Alle Regionen", "Berlin", "Bayern", "Hamburg", "NRW", "Baden-Württemberg",
  "Hessen", "Sachsen", "Niedersachsen", "Schleswig-Holstein", "Brandenburg",
];

const ASSIGNEES = ["Christian Peetz", "Manuel Schilling", "Lisa Weber"];

export default function LeadScouring() {
  const { toast } = useToast();
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
  // Store the generated lists so they don't regenerate on assign
  const [scoutedB2CList, setScoutedB2CList] = useState<ReturnType<typeof generateB2C>>([]);
  const [scoutedB2BList, setScoutedB2BList] = useState<ReturnType<typeof generateB2B>>([]);

  const requestedAmount = Number(amount) || 10;

  const filteredB2C = useMemo(() => {
    let list = scoutedB2CList.filter((r) => !assigned.has(r.id));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
    }
    return list;
  }, [scoutedB2CList, search, assigned]);

  const filteredB2B = useMemo(() => {
    let list = scoutedB2BList.filter((r) => !assigned.has(r.id));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
    }
    return list;
  }, [scoutedB2BList, search, assigned]);
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
      // Generate lists once at scour time
      if (tab === "b2c") {
        setScoutedB2CList(generateB2C(requestedAmount));
      } else {
        // Generate a larger pool for B2B to allow for region/gewerk filtering
        const pool = generateB2B(requestedAmount * 3);
        let filtered = pool;
        if (region !== "Alle Regionen") filtered = filtered.filter((r) => r.region === region);
        if (gewerk !== "Alle") filtered = filtered.filter((r) => r.gewerk === gewerk);
        setScoutedB2BList(filtered.slice(0, requestedAmount));
      }
      setScouring(false);
      setScoured(true);
    }, 2000);
  };

  const handleAssign = () => {
    const today = new Date().toISOString().slice(0, 10);
    const newLeads: Lead[] = [];

    selectedIds.forEach((id) => {
      if (tab === "b2c") {
        const r = filteredB2C.find((x) => x.id === id);
        if (!r) return;
        const nameParts = r.name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");
        newLeads.push({
          id: `scouted-b2c-${id}-${Date.now()}`,
          type: "b2c",
          status: "b2c_new",
          priority: "medium",
          assignee,
          source: r.quelle,
          createdAt: today,
          updatedAt: today,
          value: 10,
          notes: `Gescourter Lead von ${r.quelle}`,
          firstName,
          lastName,
          phone: r.phone,
          email: r.email,
          address: r.address,
          objektAdresse: r.address,
          objekttyp: r.objekttyp as Objekttyp,
          baujahr: r.baujahr || undefined,
          wohnflaeche: r.wohnflaeche || undefined,
        });
      } else {
        const r = filteredB2B.find((x) => x.id === id);
        if (!r) return;
        newLeads.push({
          id: `scouted-b2b-${id}-${Date.now()}`,
          type: "b2b",
          status: "b2b_new",
          priority: "medium",
          assignee,
          source: r.quelle,
          createdAt: today,
          updatedAt: today,
          value: 1250,
          notes: `Gescourter Lead von ${r.quelle}`,
          companyName: r.firma,
          gewerk: r.gewerk as Gewerk,
          contactPerson: r.kontakt,
          phone: r.phone,
          email: r.email,
          website: r.website,
          region: r.region,
          partnerStatus: "Interessent",
        });
      }
    });

    addScoutedLeads(newLeads);

    setAssigned((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(id));
      return next;
    });

    toast({
      title: `${selectedIds.size} Leads zugeteilt`,
      description: `Die Leads wurden ${assignee} als neue ${tab === "b2c" ? "B2C" : "B2B"}-Leads zugewiesen.`,
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    let csv: string;
                    if (tab === "b2c") {
                      csv = ["Name,Telefon,E-Mail,Adresse,Objekttyp,Baujahr,Fläche,Preis", ...filteredB2C.map(r => `"${r.name}","${r.phone}","${r.email}","${r.address}","${r.objekttyp}",${r.baujahr || ""},${r.wohnflaeche || ""},"${r.preis}"`)].join("\n");
                    } else {
                      csv = ["Firma,Gewerk,Kontaktperson,Telefon,E-Mail,Website,Region", ...filteredB2B.map(r => `"${r.firma}","${r.gewerk}","${r.kontakt}","${r.phone}","${r.email}","${r.website}","${r.region}"`)].join("\n");
                    }
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url; a.download = `scouring-${tab}-leads.csv`; a.click();
                    URL.revokeObjectURL(url);
                    toast({ title: "Export ✓", description: `${filtered.length} Leads als CSV exportiert.` });
                  }}
                  className="gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
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
                    {filtered.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                        >
                          <td className="p-3">
                            <Checkbox
                              checked={selectedIds.has(r.id)}
                              onCheckedChange={() => toggleSelect(r.id)}
                            />
                          </td>
                          {tab === "b2c" ? (() => {
                            const b = r as ReturnType<typeof generateB2C>[0];
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
                                  <Badge variant="secondary" className="text-xs">Neu</Badge>
                                </td>
                              </>
                            );
                          })() : (() => {
                            const b = r as ReturnType<typeof generateB2B>[0];
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
                                  <Badge variant="secondary" className="text-xs">Neu</Badge>
                                </td>
                              </>
                            );
                          })()}
                        </tr>
                      ))}
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
