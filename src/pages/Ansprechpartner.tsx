import { useState } from "react";
import CRMLayout from "@/components/CRMLayout";
import { User, Phone, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import profil1 from "@/assets/entwickler/profil-1.jpg";
import profil2 from "@/assets/entwickler/profil-2.jpg";
import profil3 from "@/assets/entwickler/profil-3.jpg";
import profil4 from "@/assets/entwickler/profil-4.jpg";
import profil5 from "@/assets/entwickler/profil-5.jpg";
import profil6 from "@/assets/entwickler/profil-6.jpg";
import profil7 from "@/assets/entwickler/profil-7.jpg";
import profil8 from "@/assets/entwickler/profil-8.jpg";

interface Contact {
  name: string;
  title: string;
  tasks: string;
  email: string;
  phone: string;
  image: string;
}

interface Section {
  heading: string;
  contacts: Contact[];
}

const sections: Section[] = [
  {
    heading: "Geschäftsführung",
    contacts: [
      { name: "Marinko Marjanovic", title: "CEO & Founder", tasks: "Geschäftsführung, Strategie, Unternehmensentwicklung", email: "marinko@imondu.de", phone: "+49 170 1000001", image: profil1 },
      { name: "Dominic Harrison", title: "Geschäftsführer", tasks: "Marketing, Brand, Reichweite", email: "dominic@imondu.de", phone: "+49 170 1000002", image: profil2 },
    ],
  },
  {
    heading: "Vertrieb & Partnermanagement",
    contacts: [
      { name: "Manuel Schilling", title: "Geschäftsführer", tasks: "Vertrieb, Partnermanagement, Wachstum", email: "manuel@imondu.de", phone: "+49 170 1000003", image: profil3 },
      { name: "Christian Peetz", title: "Vertriebsleiter", tasks: "Partnerbetreuung, Vertriebssteuerung", email: "christian@imondu.de", phone: "+49 170 1000004", image: profil4 },
    ],
  },
  {
    heading: "Buchhaltung",
    contacts: [
      { name: "Karin Martini", title: "Finance & Controlling", tasks: "Abrechnung, Zahlungswesen", email: "buchhaltung@imondu.de", phone: "+49 170 1000005", image: profil5 },
    ],
  },
  {
    heading: "Marketing",
    contacts: [
      { name: "Oliver Gjorgijev", title: "Head of Marketing", tasks: "Kampagnen, Social Media, Branding", email: "marketing@imondu.de", phone: "+49 170 1000006", image: profil6 },
    ],
  },
  {
    heading: "Backoffice & Support",
    contacts: [
      { name: "Laura Meier", title: "Backoffice Managerin", tasks: "CRM-Support, Plattform-Hilfe, Administration", email: "support@imondu.de", phone: "+49 170 1000007", image: profil7 },
    ],
  },
];

function ContactCard({ contact }: { contact: Contact }) {
  const { toast } = useToast();

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex-1 p-5 space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{contact.name}</h3>
        <p className="text-sm font-bold text-foreground">{contact.title}</p>
        <p className="text-sm text-muted-foreground">{contact.tasks}</p>

        <div className="space-y-1 pt-1">
          <p className="text-sm text-foreground flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
              {contact.email}
            </a>
          </p>
          <p className="text-sm text-foreground flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
              {contact.phone}
            </a>
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => toast({ title: "Chat eröffnet", description: `Chat mit ${contact.name} wurde gestartet.` })}
          >
            <MessageCircle className="h-3.5 w-3.5" /> Chat eröffnen
          </Button>
        </div>
      </div>
      <div className="w-[140px] bg-muted flex items-center justify-center border-l border-border overflow-hidden">
        <img
          src={contact.image}
          alt={contact.name}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default function Ansprechpartner() {
  return (
    <CRMLayout>
      <div className="p-6 space-y-10">
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 bg-accent rounded-full" />
          <h1 className="text-3xl font-bold text-foreground">Ansprechpartner</h1>
        </div>

        {sections.map((section) => (
          <div key={section.heading} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-accent rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">{section.heading}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {section.contacts.map((c) => (
                <ContactCard key={c.name} contact={c} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </CRMLayout>
  );
}
