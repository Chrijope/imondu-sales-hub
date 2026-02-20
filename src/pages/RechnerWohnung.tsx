import CRMLayout from "@/components/CRMLayout";

export default function RechnerWohnung() {
  return (
    <CRMLayout>
      <div className="h-[calc(100vh-2rem)]">
        <iframe
          src="https://immowelten-consult.de/immobilien-check-wohnung/"
          className="w-full h-full border-0 rounded-xl"
          title="Entwicklungsrechner Wohnung"
          allow="fullscreen"
        />
      </div>
    </CRMLayout>
  );
}
