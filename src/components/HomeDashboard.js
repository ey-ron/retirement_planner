import React, { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import MobileShell from "./MobileShell";

const DEFAULT_SIMULATION = {
  birthDate: "1995-01-01",
  monthlyExpense: 3000,
  retireAge: 50,
  lifeExpectancy: 85,
  currentNestEgg: 20000,
  monthlyInvestment: 800,
  cagr: 8.0,
  inflation: 3.5
};

export default function HomeDashboard({ user }) {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  
  // Track whether the user has entered their information in the current session
  // Never load from browser storage so returning visitors always start with the 6-step wizard
  const [hasEnteredInfo, setHasEnteredInfo] = useState(false);

  const [simulationData, setSimulationData] = useState(() => ({
    ...DEFAULT_SIMULATION,
    birthDate: user?.user_metadata?.birth_date || DEFAULT_SIMULATION.birthDate
  }));

  // Clean up any stale simulation keys from previous sessions in browser storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("retirement_info_entered");
        localStorage.removeItem("retirement_simulation_data");
      } catch (e) {}
    }
  }, []);

  const handleUpdateParam = (key, value) => {
    setSimulationData(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateFullPlan = (fullPlan) => {
    const updatedPlan = {
      birthDate: fullPlan.birthDate,
      monthlyExpense: fullPlan.monthlyExpense,
      retireAge: fullPlan.retireAge,
      lifeExpectancy: fullPlan.lifeExpectancy,
      currentNestEgg: fullPlan.currentNestEgg,
      monthlyInvestment: fullPlan.monthlyInvestment,
      cagr: fullPlan.cagr,
      inflation: fullPlan.inflation
    };

    setSimulationData(prev => ({
      ...prev,
      ...updatedPlan
    }));
    setHasEnteredInfo(true);

    // If user is registered/logged in, save plan to Supabase table
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("retirement_pro_email");
      const isPro = localStorage.getItem("retirement_is_pro") === "true";
      if (isPro && email) {
        try {
          localStorage.setItem("retirement_saved_plan", JSON.stringify(updatedPlan));
          fetch("/api/auth/save-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, planData: updatedPlan })
          }).catch(err => console.warn("Auto save plan sync:", err));
        } catch (e) {}
      }
    }
  };

  const handleResetInfo = () => {
    setHasEnteredInfo(false);
    setSimulationData({
      ...DEFAULT_SIMULATION,
      birthDate: user?.user_metadata?.birth_date || DEFAULT_SIMULATION.birthDate
    });
  };

  return (
    <div className="w-full h-full h-[100dvh] max-h-[100dvh] relative bg-[#F2F2F7] overflow-hidden flex flex-col">
      {/* Supernova Splash Screen */}
      {isSplashVisible && (
        <SplashScreen onComplete={() => setIsSplashVisible(false)} />
      )}

      {/* Main Mobile Experience */}
      <MobileShell
        user={user}
        simulationData={simulationData}
        hasEnteredInfo={hasEnteredInfo}
        onUpdateParam={handleUpdateParam}
        onUpdateFullPlan={handleUpdateFullPlan}
        onResetInfo={handleResetInfo}
      />
    </div>
  );
}