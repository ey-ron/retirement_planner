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
  
  // Track whether the user has entered their information
  const [hasEnteredInfo, setHasEnteredInfo] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("retirement_info_entered") === "true";
    }
    return false;
  });

  const [simulationData, setSimulationData] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("retirement_simulation_data");
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_SIMULATION, ...parsed };
        }
      } catch (e) {
        console.warn("Could not load simulation cache:", e);
      }
    }
    return {
      ...DEFAULT_SIMULATION,
      birthDate: user?.user_metadata?.birth_date || DEFAULT_SIMULATION.birthDate
    };
  });

  const handleUpdateParam = (key, value) => {
    setSimulationData(prev => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem("retirement_simulation_data", JSON.stringify(updated));
      } catch (e) {
        // ignore storage errors
      }
      return updated;
    });
  };

  const handleUpdateFullPlan = (fullPlan) => {
    setSimulationData(prev => {
      const updated = {
        ...prev,
        birthDate: fullPlan.birthDate,
        monthlyExpense: fullPlan.monthlyExpense,
        retireAge: fullPlan.retireAge,
        lifeExpectancy: fullPlan.lifeExpectancy,
        currentNestEgg: fullPlan.currentNestEgg,
        monthlyInvestment: fullPlan.monthlyInvestment,
        cagr: fullPlan.cagr,
        inflation: fullPlan.inflation
      };
      try {
        localStorage.setItem("retirement_simulation_data", JSON.stringify(updated));
        localStorage.setItem("retirement_info_entered", "true");
      } catch (e) {
        // ignore
      }
      return updated;
    });
    setHasEnteredInfo(true);
  };

  const handleResetInfo = () => {
    setHasEnteredInfo(false);
    try {
      localStorage.removeItem("retirement_info_entered");
    } catch (e) {}
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