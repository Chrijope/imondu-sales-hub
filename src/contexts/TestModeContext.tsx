import { createContext, useContext, useState, ReactNode } from "react";

interface TestModeContextType {
  isTestMode: boolean;
  toggleTestMode: () => void;
}

const TestModeContext = createContext<TestModeContextType | null>(null);

export const TEST_PROFILE = {
  name: "Max Mustermann",
  initials: "MM",
  email: "max.mustermann@test-imondu.de",
  phone: "+49 170 0000000",
  subtitle: "Testaccount",
};

export function TestModeProvider({ children }: { children: ReactNode }) {
  const [isTestMode, setIsTestMode] = useState(false);
  return (
    <TestModeContext.Provider value={{ isTestMode, toggleTestMode: () => setIsTestMode((p) => !p) }}>
      {children}
    </TestModeContext.Provider>
  );
}

export function useTestMode() {
  const ctx = useContext(TestModeContext);
  if (!ctx) throw new Error("useTestMode must be used within TestModeProvider");
  return ctx;
}
