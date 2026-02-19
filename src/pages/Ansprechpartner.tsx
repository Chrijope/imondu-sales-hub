import CRMLayout from "@/components/CRMLayout";
import { User } from "lucide-react";

interface Contact {
  name: string;
  title: string;
  tasks: string;
  email: string;
}

interface Section {
  heading: string;
  contacts: Contact[];
}

const sections: Section[] = [
  {
    heading: "Geschäftsführung",
    contacts: [
      { name: "Marinko Marjanovic", title: "CEO & Founder", tasks: "Geschäftsführung, Strategie, Unternehmensentwicklung", email: "marinko@imondu.de" },
      { name: "Dominic Harrison", title: "Geschäftsführer", tasks: "Marketing, Brand, Reichweite", email: "dominic@imondu.de" },
    ],
  },
  {
    heading: "Vertrieb & Partnermanagement",
    contacts: [
      { name: "Manuel Schilling", title: "Geschäftsführer", tasks: "Vertrieb, Partnermanagement, Wachstum", email: "manuel@imondu.de" },
      { name: "Christian Peetz", title: "Vertriebsleiter", tasks: "Partnerbetreuung, Vertriebssteuerung", email: "christian@imondu.de" },
    ],
  },
  {
    heading: "Buchhaltung",
    contacts: [
      { name: "Karin Martini", title: "Finance & Controlling", tasks: "Abrechnung, Zahlungswesen", email: "buchhaltung@imondu.de" },
    ],
  },
  {
    heading: "Marketing",
    contacts: [
      { name: "Oliver Gjorgijev", title: "Head of Marketing", tasks: "Kampagnen, Social Media, Branding", email: "marketing@imondu.de" },
    ],
  },
  {
    heading: "Backoffice & Support",
    contacts: [
      { name: "Support Team", title: "Backoffice & Support", tasks: "CRM-Support, Plattform-Hilfe, Administration", email: "support@imondu.de" },
    ],
  },
];

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex overflow-hidden">
      <div className="flex-1 p-5 space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{contact.name}</h3>
        <p className="text-sm font-bold text-foreground">{contact.title}</p>
        <p className="text-sm text-muted-foreground">{contact.tasks}</p>
        <p className="text-sm text-foreground mt-2">
          <span className="font-semibold">E-Mail:</span>{" "}
          <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
            {contact.email}
          </a>
        </p>
      </div>
      <div className="w-[120px] bg-muted flex items-center justify-center border-l border-border">
        <div className="h-16 w-16 rounded-full bg-muted-foreground/10 flex items-center justify-center">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
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
