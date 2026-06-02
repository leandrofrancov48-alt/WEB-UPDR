"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MatchCard } from "./MatchCard";

interface TournamentDashboardProps {
  tournament: any;
  groups: any[];
  matchesByFecha: Record<string, any[]>;
  knockoutMatchesByPhase: Record<string, any[]>;
  phasesLabels: Record<string, string>;
}

export default function TournamentDashboard({
  tournament,
  groups,
  matchesByFecha,
  knockoutMatchesByPhase,
  phasesLabels,
}: TournamentDashboardProps) {
  // Determine available tabs
  const tabs: { id: string; label: string }[] = [];

  // Group stage dates tabs
  if (matchesByFecha["Fecha 1"]?.length > 0) tabs.push({ id: "fecha-1", label: "Fecha 1" });
  if (matchesByFecha["Fecha 2"]?.length > 0) tabs.push({ id: "fecha-2", label: "Fecha 2" });
  if (matchesByFecha["Fecha 3"]?.length > 0) tabs.push({ id: "fecha-3", label: "Fecha 3" });

  // Groups list tab
  if (groups.length > 0) {
    tabs.push({ id: "grupos", label: "Grupos" });
  }

  // Knockout phases tabs
  Object.keys(knockoutMatchesByPhase).forEach((phase) => {
    if (knockoutMatchesByPhase[phase]?.length > 0) {
      tabs.push({ id: phase, label: phasesLabels[phase] || phase });
    }
  });

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "grupos");

  const renderActiveContent = () => {
    if (activeTab === "fecha-1") {
      return (
        <motion.div
          key="fecha-1"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {matchesByFecha["Fecha 1"].map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={match.predictions?.[0]}
            />
          ))}
        </motion.div>
      );
    }

    if (activeTab === "fecha-2") {
      return (
        <motion.div
          key="fecha-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {matchesByFecha["Fecha 2"].map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={match.predictions?.[0]}
            />
          ))}
        </motion.div>
      );
    }

    if (activeTab === "fecha-3") {
      return (
        <motion.div
          key="fecha-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {matchesByFecha["Fecha 3"].map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={match.predictions?.[0]}
            />
          ))}
        </motion.div>
      );
    }

    if (activeTab === "grupos") {
      return (
        <motion.div
          key="grupos"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {groups.map((group) => (
            <Link
              href={`/prode/grupo/${group.id}`}
              key={group.id}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:border-brand-yellow/50 overflow-hidden flex flex-col items-center text-center shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#050b1a]/80 to-transparent z-0"></div>
              
              <div className="relative z-10 w-full">
                <h2 className="text-3xl font-yellow text-white group-hover:text-brand-yellow transition-colors mb-4">{group.name}</h2>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4 h-6">
                  {group.teams.map((team: any) => (
                    <div key={team.id} className="w-8 h-6 relative" title={team.name}>
                      {team.flagUrl ? (
                        <img src={team.flagUrl} alt={team.name} className="w-full h-full object-cover rounded shadow border border-white/20" />
                      ) : (
                        <div className="w-full h-full bg-white/20 rounded border border-white/30 text-[8px] flex items-center justify-center uppercase overflow-hidden">
                          {team.name.substring(0, 3)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-xs font-bold text-white/50 bg-white/10 rounded-full px-3 py-1 inline-block">
                  {group._count?.matches ?? 0} Partidos
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      );
    }

    // Render for specific knockout phase
    const phaseMatches = knockoutMatchesByPhase[activeTab] || [];
    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {phaseMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            prediction={match.predictions?.[0]}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-white/10 pb-px scrollbar-none gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors duration-200 shrink-0 cursor-pointer ${
                isActive ? "text-brand-yellow" : "text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
              
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Grid Content */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {renderActiveContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}
