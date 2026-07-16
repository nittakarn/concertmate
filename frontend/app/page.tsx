"use client";
import { useState, useEffect, useCallback } from "react";
import type { Concert, WizardState, RecommendResponse, AppScreen } from "@/lib/types";
import { fetchConcerts, fetchRecommendation } from "@/lib/api";
import Header from "@/components/Header";
import HomeScreen from "@/components/HomeScreen";
import ConcertModal from "@/components/ConcertModal";
import WizardFlow from "@/components/WizardFlow";
import LoadingScreen from "@/components/LoadingScreen";
import Dashboard from "@/components/Dashboard";

export default function Page() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [screen, setScreen] = useState<AppScreen>("home");
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRound, setSelectedRound] = useState<string>("");
  const [wizardState, setWizardState] = useState<WizardState | null>(null);
  const [wizardMode, setWizardMode] = useState<"plan" | "have-ticket">("plan");
  const [recommendation, setRecommendation] = useState<RecommendResponse | null>(null);

  useEffect(() => {
    fetchConcerts().then(setConcerts).catch(console.error);
  }, []);

  const resetToHome = useCallback(() => {
    setScreen("home");
    setShowModal(false);
    setSelectedConcert(null);
    setSelectedRound("");
    setWizardState(null);
    setRecommendation(null);
  }, []);

  const handleSelectConcert = (concert: Concert) => {
    setSelectedConcert(concert);
    setShowModal(true);
  };

  const handleStartWizard = (roundKey: string, mode: "plan" | "have-ticket" = "plan") => {
    setSelectedRound(roundKey);
    setWizardMode(mode);
    setShowModal(false);
    setScreen("wizard");
  };

  const handleFinishWizard = async (state: WizardState) => {
    if (!selectedConcert) return;
    setWizardState(state);
    setScreen("loading");

    try {
      const result = await fetchRecommendation({
        concertId: selectedConcert.id,
        budget: state.budget,
        preselectedZone: state.preselectedZone,
        hotelPriorities: state.hotelPriorities,
        needHotel: state.needHotel,
        hotelNights: state.hotelNights,
        transportCost: state.transportCost,
        merchCost: state.merchCost,
        foodCost: state.foodCost,
        otherCost: state.otherCost,
      });
      await new Promise((r) => setTimeout(r, 1500));
      setRecommendation(result);
      setScreen("dashboard");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง");
      setScreen("wizard");
    }
  };

  const activeRoundKey = selectedRound || selectedConcert?.rounds[0]?.key || "";

  return (
    <>
      <Header onReset={resetToHome} isHome={screen === "home"} />
      <main className="max-w-6xl mx-auto px-4 py-8 relative min-h-[80vh]">
        <div className="absolute top-10 left-10 w-96 h-96 bg-rose-200/30 rounded-full filter blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 rounded-full filter blur-[120px] -z-10"></div>

        {screen === "home" && (
          <HomeScreen concerts={concerts} onSelectConcert={handleSelectConcert} />
        )}

        {screen === "wizard" && selectedConcert && (
          <WizardFlow
            concert={selectedConcert}
            roundKey={selectedRound}
            mode={wizardMode}
            onBack={() => setScreen("home")}
            onFinish={handleFinishWizard}
          />
        )}

        {screen === "loading" && <LoadingScreen />}

        {screen === "dashboard" && selectedConcert && wizardState && recommendation && (
          <Dashboard
            concert={selectedConcert}
            roundKey={activeRoundKey}
            recommendation={recommendation}
            wizardState={wizardState}
          />
        )}
      </main>

      {showModal && selectedConcert && (
        <ConcertModal
          concert={selectedConcert}
          onClose={() => setShowModal(false)}
          onStart={handleStartWizard}
        />
      )}
    </>
  );
}
