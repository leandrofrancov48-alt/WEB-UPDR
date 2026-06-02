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
        <GroupTabContent
          groups={groups}
          allMatches={tournament.matches}
        />
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

import { GroupStandings } from "./GroupStandings";

function GroupTabContent({ groups, allMatches }: { groups: any[]; allMatches: any[] }) {
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || "");
  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const selectedGroupMatches = allMatches.filter((m) => m.groupId === selectedGroupId);

  return (
    <motion.div
      key="grupos-interactive"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
    >
      {/* Horizontal Group Menu */}
      <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 justify-center">
        {groups.map((group) => {
          const isSelected = selectedGroupId === group.id;
          return (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`px-4 py-2 text-xs font-yellow rounded-xl transition-all duration-200 uppercase cursor-pointer ${
                isSelected
                  ? "bg-brand-yellow text-[#050b1a] font-bold shadow-lg shadow-brand-yellow/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {group.name.replace("Grupo ", "G ")}
            </button>
          );
        })}
      </div>

      {selectedGroup && (
        <div className="space-y-8">
          {/* Standing Table */}
          <div className="flex justify-center">
            <GroupStandings
              group={selectedGroup}
              teams={selectedGroup.teams}
              matches={selectedGroupMatches}
            />
          </div>

          {/* Group Matches */}
          <div>
            <h3 className="text-xl font-yellow text-brand-yellow uppercase mb-6 text-center">Partidos del {selectedGroup.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedGroupMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={match.predictions?.[0]}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
