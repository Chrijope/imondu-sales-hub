import { useState, useMemo, useRef } from "react";
import CRMLayout from "@/components/CRMLayout";
import { LEXIKON_ENTRIES, LEXIKON_LETTERS } from "@/data/lexikon-data";
import { Search, BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function LetterSection({ letter, entries, defaultOpen }: {
  letter: string;
  entries: typeof LEXIKON_ENTRIES;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-card border border-border hover:shadow-crm-sm transition-all"
      >
        <span className="h-9 w-9 rounded-lg gradient-brand flex items-center justify-center text-primary-foreground font-bold text-lg">
          {letter}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {entries.length} {entries.length === 1 ? "Begriff" : "Begriffe"}
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="mt-2 space-y-1 pl-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-border/60 bg-card/60 overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/30 transition-colors"
              >
                <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                  #{entry.id}
                </Badge>
                <span className="text-sm font-medium text-foreground">{entry.term}</span>
                {expandedId === entry.id ? (
                  <ChevronDown className="h-3.5 w-3.5 ml-auto text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 ml-auto text-muted-foreground shrink-0" />
                )}
              </button>
              {expandedId === entry.id && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Lexikon() {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<typeof LEXIKON_ENTRIES[0] | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!search.trim() || search.length < 1) return [];
    const q = search.toLowerCase();
    return LEXIKON_ENTRIES
      .filter((e) => e.term.toLowerCase().includes(q))
      .slice(0, 8);
  }, [search]);

  const filtered = useMemo(() => {
    let entries = LEXIKON_ENTRIES;
    if (search.trim()) {
      const q = search.toLowerCase();
      entries = entries.filter(
        (e) => e.term.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      );
    }
    if (activeLetter) {
      entries = entries.filter((e) => e.letter === activeLetter);
    }
    return entries;
  }, [search, activeLetter]);

  const groupedByLetter = useMemo(() => {
    const groups: Record<string, typeof LEXIKON_ENTRIES> = {};
    for (const entry of filtered) {
      if (!groups[entry.letter]) groups[entry.letter] = [];
      groups[entry.letter].push(entry);
    }
    return groups;
  }, [filtered]);

  const letters = Object.keys(groupedByLetter).sort();

  return (
    <CRMLayout>
      <div className="min-h-screen dashboard-mesh-bg p-6 lg:p-8">
       <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Immobilien-Lexikon</h1>
              <p className="text-sm text-muted-foreground">
                303 Fachbegriffe von A bis Z – deine Wissensdatenbank für die Immobilienbranche
              </p>
            </div>
          </div>
        </div>

        {/* Search with autocomplete */}
        <div className="relative mb-4" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            placeholder="Begriff suchen…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); setSelectedEntry(null); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="pl-10"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
              {suggestions.map((s) => {
                const idx = s.term.toLowerCase().indexOf(search.toLowerCase());
                const before = s.term.slice(0, idx);
                const match = s.term.slice(idx, idx + search.length);
                const after = s.term.slice(idx + search.length);
                return (
                  <button
                    key={s.id}
                    onMouseDown={(e) => { e.preventDefault(); setSearch(s.term); setShowSuggestions(false); setActiveLetter(null); setSelectedEntry(s); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent/50 transition-colors flex items-center gap-2 border-b border-border/40 last:border-b-0"
                  >
                    <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-foreground">
                      {before}<span className="font-bold text-primary">{match}</span>{after}
                    </span>
                    <Badge variant="outline" className="ml-auto text-[9px] shrink-0">{s.letter}</Badge>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected entry detail */}
        {selectedEntry && (
          <div className="mb-6 rounded-xl border border-primary/30 bg-card p-5 shadow-crm-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg gradient-brand flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {selectedEntry.letter}
                </span>
                <h2 className="text-lg font-bold text-foreground">{selectedEntry.term}</h2>
              </div>
              <button
                onClick={() => { setSelectedEntry(null); setSearch(""); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕ Schließen
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{selectedEntry.description}</p>
          </div>
        )}

        {/* Letter filter */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <button
            onClick={() => setActiveLetter(null)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              !activeLetter
                ? "gradient-brand text-primary-foreground shadow-crm-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Alle
          </button>
          {LEXIKON_LETTERS.map((letter) => (
            <button
              key={letter}
              onClick={() => setActiveLetter(activeLetter === letter ? null : letter)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                activeLetter === letter
                  ? "gradient-brand text-primary-foreground shadow-crm-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground mb-4">
          {filtered.length} von 303 Begriffen
        </p>

        {/* Entries grouped by letter */}
        {letters.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Keine Begriffe gefunden für „{search}"</p>
          </div>
        ) : (
          letters.map((letter) => (
            <LetterSection
              key={letter}
              letter={letter}
              entries={groupedByLetter[letter]}
              defaultOpen={letters.length <= 3 || !!search.trim()}
            />
          ))
        )}
        </div>
      </div>
    </CRMLayout>
  );
}
