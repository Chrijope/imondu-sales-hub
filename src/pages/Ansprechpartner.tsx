import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { User, Phone, MessageCircle, Mail, Plus, Trash2, Pencil, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

import profil1 from "@/assets/entwickler/profil-1.jpg";
import profil2 from "@/assets/entwickler/profil-2.jpg";
import profil3 from "@/assets/entwickler/profil-3.jpg";
import profil4 from "@/assets/entwickler/profil-4.jpg";
import profil5 from "@/assets/entwickler/profil-5.jpg";
import profil6 from "@/assets/entwickler/profil-6.jpg";
import profil7 from "@/assets/entwickler/profil-7.jpg";

interface Contact {
  id: string;
  name: string;
  title: string;
  tasks: string;
  email: string;
  phone: string;
  image: string;
  showChat: boolean;
}

interface Section {
  id: string;
  heading: string;
  contacts: Contact[];
}

const INITIAL_SECTIONS: Section[] = [
  {
    id: "s1", heading: "Geschäftsführung",
    contacts: [
      { id: "c1", name: "Marinko Marjanovic", title: "CEO & Founder", tasks: "Geschäftsführung, Strategie, Unternehmensentwicklung", email: "marinko@imondu.de", phone: "+49 170 1000001", image: profil1, showChat: true },
      { id: "c2", name: "Dominic Harrison", title: "Geschäftsführer", tasks: "Marketing, Brand, Reichweite", email: "dominic@imondu.de", phone: "+49 170 1000002", image: profil2, showChat: true },
    ],
  },
  {
    id: "s2", heading: "Vertrieb & Partnermanagement",
    contacts: [
      { id: "c3", name: "Manuel Schilling", title: "Geschäftsführer", tasks: "Vertrieb, Partnermanagement, Wachstum", email: "manuel@imondu.de", phone: "+49 170 1000003", image: profil3, showChat: true },
      { id: "c4", name: "Christian Peetz", title: "Vertriebsleiter", tasks: "Partnerbetreuung, Vertriebssteuerung", email: "christian@imondu.de", phone: "+49 170 1000004", image: profil4, showChat: true },
    ],
  },
  {
    id: "s3", heading: "Buchhaltung",
    contacts: [
      { id: "c5", name: "Karin Martini", title: "Finance & Controlling", tasks: "Abrechnung, Zahlungswesen", email: "buchhaltung@imondu.de", phone: "+49 170 1000005", image: profil5, showChat: true },
    ],
  },
  {
    id: "s4", heading: "Marketing",
    contacts: [
      { id: "c6", name: "Oliver Gjorgijev", title: "Head of Marketing", tasks: "Kampagnen, Social Media, Branding", email: "marketing@imondu.de", phone: "+49 170 1000006", image: profil6, showChat: true },
    ],
  },
  {
    id: "s5", heading: "Backoffice & Support",
    contacts: [
      { id: "c7", name: "Laura Meier", title: "Backoffice Managerin", tasks: "CRM-Support, Plattform-Hilfe, Administration", email: "support@imondu.de", phone: "+49 170 1000007", image: profil7, showChat: true },
    ],
  },
];

function ContactCard({ contact, canEdit, onEdit, onDelete }: { contact: Contact; canEdit: boolean; onEdit: () => void; onDelete: () => void }) {
  const { toast } = useToast();

  return (
    <div className="glass-card rounded-xl flex overflow-hidden transition-shadow relative group">
      <div className="flex-1 p-5 space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{contact.name}</h3>
        <p className="text-sm font-bold text-foreground">{contact.title}</p>
        <p className="text-sm text-muted-foreground">{contact.tasks}</p>
        <div className="space-y-1 pt-1">
          {contact.email && (
            <p className="text-sm text-foreground flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a>
            </p>
          )}
          {contact.phone && (
            <p className="text-sm text-foreground flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">{contact.phone}</a>
            </p>
          )}
        </div>
        <div className="pt-2 flex items-center gap-2">
          {contact.showChat && (
            <Button variant="outline" size="sm" className="gap-1.5 text-xs"
              onClick={() => toast({ title: "Chat eröffnet", description: `Chat mit ${contact.name} wurde gestartet.` })}>
              <MessageCircle className="h-3.5 w-3.5" /> Chat eröffnen
            </Button>
          )}
          {canEdit && (
            <>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onEdit}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" /></Button>
            </>
          )}
        </div>
      </div>
      <div className="w-[140px] bg-muted flex items-center justify-center border-l border-border overflow-hidden">
        <img src={contact.image} alt={contact.name} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

export default function Ansprechpartner() {
  const { currentRoleId } = useUserRole();
  const { toast } = useToast();
  const canEdit = currentRoleId === "admin";
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"contact" | "section">("contact");
  const [editSectionId, setEditSectionId] = useState<string | null>(null);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: "", title: "", tasks: "", email: "", phone: "", showChat: true, sectionHeading: "", image: "" });

  const openAddSection = () => {
    setDialogMode("section");
    setForm({ ...form, sectionHeading: "" });
    setEditSectionId(null);
    setShowDialog(true);
  };

  const openAddContact = (sectionId: string) => {
    setDialogMode("contact");
    setEditSectionId(sectionId);
    setEditContact(null);
    setForm({ name: "", title: "", tasks: "", email: "", phone: "", showChat: true, sectionHeading: "", image: "" });
    setShowDialog(true);
  };

  const openEditContact = (sectionId: string, contact: Contact) => {
    setDialogMode("contact");
    setEditSectionId(sectionId);
    setEditContact(contact);
    setForm({ name: contact.name, title: contact.title, tasks: contact.tasks, email: contact.email, phone: contact.phone, showChat: contact.showChat, sectionHeading: "", image: contact.image });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (dialogMode === "section") {
      if (!form.sectionHeading.trim()) return;
      setSections(prev => [...prev, { id: `s-${Date.now()}`, heading: form.sectionHeading.trim(), contacts: [] }]);
      toast({ title: "Abschnitt erstellt" });
    } else {
      if (!form.name.trim()) return;
      const newContact: Contact = {
        id: editContact?.id || `c-${Date.now()}`,
        name: form.name.trim(), title: form.title.trim(), tasks: form.tasks.trim(),
        email: form.email.trim(), phone: form.phone.trim(),
        image: form.image || editContact?.image || profil7, showChat: form.showChat,
      };
      setSections(prev => prev.map(s => {
        if (s.id !== editSectionId) return s;
        if (editContact) return { ...s, contacts: s.contacts.map(c => c.id === editContact.id ? newContact : c) };
        return { ...s, contacts: [...s.contacts, newContact] };
      }));
      toast({ title: editContact ? "Kontakt aktualisiert" : "Kontakt hinzugefügt" });
    }
    setShowDialog(false);
  };

  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    toast({ title: "Abschnitt gelöscht" });
  };

  const deleteContact = (sectionId: string, contactId: string) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, contacts: s.contacts.filter(c => c.id !== contactId) } : s));
    toast({ title: "Kontakt gelöscht" });
  };

  return (
    <CRMLayout>
      <div className="p-6 space-y-10 min-h-screen dashboard-mesh-bg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-10 bg-accent rounded-full" />
            <h1 className="text-3xl font-bold text-foreground">Ansprechpartner</h1>
          </div>
          {canEdit && (
            <Button onClick={openAddSection} className="gap-1.5 gradient-brand text-primary-foreground">
              <Plus className="h-4 w-4" /> Abschnitt hinzufügen
            </Button>
          )}
        </div>

        {sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 bg-accent rounded-full" />
                <h2 className="text-2xl font-bold text-foreground">{section.heading}</h2>
              </div>
              {canEdit && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openAddContact(section.id)} className="gap-1 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Kontakt
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => deleteSection(section.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {section.contacts.map((c) => (
                <ContactCard
                  key={c.id}
                  contact={c}
                  canEdit={canEdit}
                  onEdit={() => openEditContact(section.id, c)}
                  onDelete={() => deleteContact(section.id, c.id)}
                />
              ))}
            </div>
          </div>
        ))}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === "section" ? "Neuer Abschnitt" : (editContact ? "Kontakt bearbeiten" : "Neuer Kontakt")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              {dialogMode === "section" ? (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Bezeichnung</label>
                  <Input value={form.sectionHeading} onChange={e => setForm({ ...form, sectionHeading: e.target.value })} placeholder="z.B. IT-Abteilung" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Name *</label>
                      <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                    <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titel</label>
                      <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                  </div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Aufgaben</label>
                    <Input value={form.tasks} onChange={e => setForm({ ...form, tasks: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-medium text-muted-foreground mb-1 block">E-Mail</label>
                      <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                    <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Telefon</label>
                      <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Profilbild</label>
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0">
                        {form.image ? (
                          <img src={form.image} alt="Vorschau" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => setForm(prev => ({ ...prev, image: reader.result as string }));
                          reader.readAsDataURL(file);
                        }} />
                        <span className="text-xs text-primary hover:underline">Bild auswählen…</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={form.showChat} onCheckedChange={v => setForm({ ...form, showChat: v })} />
                    <span className="text-sm text-muted-foreground">Chat eröffnen Button anzeigen</span>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Abbrechen</Button>
              <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Speichern</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CRMLayout>
  );
}
