import CRMLayout from "@/components/CRMLayout";

export default function Analysetool() {
  return (
    <CRMLayout>
      <div className="h-[calc(100vh-2rem)]">
        <iframe
          src="https://imondu-potenzial-radar.lovable.app"
          className="w-full h-full border-0 rounded-xl"
          title="Imondu Analysetool"
          allow="fullscreen"
        />
      </div>
    </CRMLayout>
  );
}
