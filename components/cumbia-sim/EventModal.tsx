"use client";

import React, { useState } from 'react';
import { CareerEvent, DilemmaOption, Outcome } from '@/lib/cumbia-sim/types';
import { Sparkles, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface EventModalProps {
  event: CareerEvent;
  onResolve: (outcome: Outcome) => void;
}

export function EventModal({ event, onResolve }: EventModalProps) {
  const [selectedOption, setSelectedOption] = useState<DilemmaOption | null>(null);
  const [outcome, setOutcome] = useState<{ isSuccess: boolean; data: Outcome } | null>(null);

  const handleSelectOption = (option: DilemmaOption) => {
    setSelectedOption(option);
    const roll = Math.random() * 100;
    const isSuccess = roll <= option.successRate;
    const result = isSuccess ? option.positiveOutcome : option.negativeOutcome;
    setOutcome({ isSuccess, data: result });
  };

  const handleFinish = () => {
    if (outcome) {
      onResolve(outcome.data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="max-w-2xl w-full bg-[#0a1128] border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow decorativo */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none"></div>

        {!outcome ? (
          <>
            {/* Header del Dilema */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40 px-3 py-1 rounded-full">
                  ⚡ Dilema de la Noche
                </span>
                <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">
                  {event.category}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black font-yellow text-white tracking-wide">
                {event.title}
              </h2>
              <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Opciones */}
            <div className="space-y-3 pt-2">
              {(event.options || event.dilemma || []).map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left p-4 md:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-yellow/50 transition-all group flex flex-col justify-between space-y-1.5"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm md:text-base font-bold text-white group-hover:text-brand-yellow transition-colors">
                      {opt.label}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {opt.successRate}% éxito
                    </span>
                  </div>
                  <p className="text-xs text-white/50">
                    {opt.description}
                  </p>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Pantalla de Resultado del Dilema */
          <div className="space-y-6 text-center animate-fadeIn py-2">
            <div className="flex justify-center">
              <div className={`p-4 rounded-3xl border ${
                outcome.isSuccess 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' 
                  : 'bg-red-500/15 border-red-500/40 text-red-400'
              }`}>
                {outcome.isSuccess ? (
                  <CheckCircle2 className="w-12 h-12 animate-bounce" />
                ) : (
                  <AlertTriangle className="w-12 h-12 animate-pulse" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className={`text-xs font-black uppercase tracking-widest ${
                outcome.isSuccess ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {outcome.isSuccess ? '¡Salió bien!' : 'Consecuencia Inesperada'}
              </span>
              <p className="text-base md:text-lg font-bold text-white max-w-md mx-auto leading-relaxed">
                {outcome.data.description}
              </p>
            </div>

            {/* Impacto en Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono max-w-md mx-auto">
              {outcome.data.talentChange !== undefined && outcome.data.talentChange !== 0 && (
                <div className="bg-black/30 border border-white/5 p-2 rounded-xl text-brand-yellow font-bold">
                  Talento: {outcome.data.talentChange > 0 ? `+${outcome.data.talentChange}` : outcome.data.talentChange}
                </div>
              )}
              {outcome.data.charismaChange !== undefined && outcome.data.charismaChange !== 0 && (
                <div className="bg-black/30 border border-white/5 p-2 rounded-xl text-purple-400 font-bold">
                  Carisma: {outcome.data.charismaChange > 0 ? `+${outcome.data.charismaChange}` : outcome.data.charismaChange}
                </div>
              )}
              {outcome.data.staminaChange !== undefined && outcome.data.staminaChange !== 0 && (
                <div className="bg-black/30 border border-white/5 p-2 rounded-xl text-emerald-400 font-bold">
                  Aguante: {outcome.data.staminaChange > 0 ? `+${outcome.data.staminaChange}` : outcome.data.staminaChange}
                </div>
              )}
              {outcome.data.disciplineChange !== undefined && outcome.data.disciplineChange !== 0 && (
                <div className="bg-black/30 border border-white/5 p-2 rounded-xl text-blue-400 font-bold">
                  Disciplina: {outcome.data.disciplineChange > 0 ? `+${outcome.data.disciplineChange}` : outcome.data.disciplineChange}
                </div>
              )}
              {outcome.data.bardoChange !== undefined && outcome.data.bardoChange !== 0 && (
                <div className="bg-black/30 border border-white/5 p-2 rounded-xl text-red-400 font-bold">
                  Bardo: {outcome.data.bardoChange > 0 ? `+${outcome.data.bardoChange}` : outcome.data.bardoChange}
                </div>
              )}
              {outcome.data.moneyChange !== undefined && outcome.data.moneyChange !== 0 && (
                <div className="bg-black/30 border border-white/5 p-2 rounded-xl text-emerald-300 font-bold">
                  Plata: {outcome.data.moneyChange > 0 ? `+$${outcome.data.moneyChange.toLocaleString('es-AR')}` : `-$${Math.abs(outcome.data.moneyChange).toLocaleString('es-AR')}`}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3.5 bg-brand-yellow hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 mt-4"
            >
              Continuar Carrera ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
