import { useState, useMemo } from "react";
import CRMLayout from "@/components/CRMLayout";
import { SAMPLE_LEADS, B2C_PIPELINE_STAGES, B2B_PIPELINE_STAGES } from "@/data/crm-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, Building2, Briefcase, Phone, Mail, Filter } from "lucide-react";

const ALL_STAGES = [...B2C_PIPELINE_STAGES, ...B2B_PIPELINE_STAGES];
const stageLabel = (id: string) => ALL_STAGES.find(s => s.id === id)?.name ?? id;
const stageColor = (id: string) => ALL_STAGES.find(s => s.id === id)?.color ?? "hsl(220 10% 46%)";

type TypeFilter = "alle" | "b2c" | "b2b";

export default function Kontakte() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("alle");

  const filtered = useMemo(() => {
    let list = SAMPLE_LEADS;
    if (typeFilter !== "alle") list = list.filter(l => l.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l => {
        const name = l.type === "b2c"
          ? `${l.firstName} ${l.lastName}`
          : `${l.companyName} ${l.contactPerson}`;
        return (
          name.toLowerCase().includes(q) ||
          (l.email ?? "").toLowerCase().includes(q) ||
          (l.phone ?? "").includes(q) ||
          (l.address ?? "").toLowerCase().includes(q) ||
          (l.region ?? "").toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [search, typeFilter]);

  return (
    <CRMLayout>
      <div className="p-6 lg:p-8 space-y-5 animate-fade-in min-h-screen dashboard-mesh-bg">
        {/* Header */}
        <div>
          <div className="w-10 h-1 rounded-full gradient-brand mb-1" />
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Kontakte</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Alle B2C- und B2B-Kontakte auf einen Blick · {SAMPLE_LEADS.length} Kontakte gesamt
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Name, Firma, E-Mail, Telefon suchen…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {(["alle", "b2c", "b2b"] as TypeFilter[]).map(f => (
              <Button
                key={f}
                variant={typeFilter === f ? "default" : "outline"}
                size="sm"
                className={typeFilter === f ? "gradient-brand border-0 text-white shadow-crm-sm" : "border-border hover:border-primary/30"}
                onClick={() => setTypeFilter(f)}
              >
                {f === "alle" ? "Alle" : f === "b2c" ? "B2C" : "B2B"}
              </Button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} Ergebnisse</span>
        </div>

        {/* Table */}
        <div className="glass-card-static rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Typ</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Name / Firma</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Kontaktperson</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Telefon</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">E-Mail</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Erstellt</th>
                  <th className="text-right py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wide"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => {
                  const isB2C = lead.type === "b2c";
                  const displayName = isB2C
                    ? `${lead.firstName} ${lead.lastName}`
                    : lead.companyName ?? "–";
                  const contactPerson = isB2C
                    ? "–"
                    : lead.contactPerson ?? "–";
                  const subtitle = isB2C
                    ? (lead.objekttyp ?? "")
                    : (lead.gewerk ?? "");

                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-border/40 hover:bg-secondary/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/lead/${lead.id}`)}
                    >
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-bold ${isB2C ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}
                        >
                          {isB2C ? <Building2 className="h-3 w-3 mr-1" /> : <Briefcase className="h-3 w-3 mr-1" />}
                          {isB2C ? "B2C" : "B2B"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground">{displayName}</p>
                        {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{contactPerson}</td>
                      <td className="py-3 px-4">
                        {lead.phone ? (
                          <span className="text-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {lead.phone}
                          </span>
                        ) : "–"}
                      </td>
                      <td className="py-3 px-4">
                        {lead.email ? (
                          <span className="text-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[160px]">{lead.email}</span>
                          </span>
                        ) : "–"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-semibold border border-warning text-warning"
                        >
                          {stageLabel(lead.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(lead.createdAt).toLocaleDateString("de-DE")}
                      </td>
                      <td className="py-3 px-4" />
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      Keine Kontakte gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
