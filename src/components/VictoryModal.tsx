import React, { useEffect } from 'react';
import { Trophy, Sparkles, RotateCcw, Home, Award, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Team } from '../types/game';
import { determineWinner } from '../game/rules';
import { sound } from '../utils/sound';

interface VictoryModalProps {
  teamA: Team;
  teamB: Team;
  isOpen: boolean;
  onClose: () => void;
  onResetTournament: () => void;
  onGoHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  teamA,
  teamB,
  isOpen,
  onClose,
  onResetTournament,
  onGoHome
}) => {
  const outcome = determineWinner(teamA.score, teamB.score);

  useEffect(() => {
    if (isOpen) {
      sound.playVictoryFanfare();
      // Burst celebratory confetti
      const end = Date.now() + 2500;
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const winner = outcome === 'teamA' ? teamA : outcome === 'teamB' ? teamB : null;
  const runnerUp = outcome === 'teamA' ? teamB : outcome === 'teamB' ? teamA : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-center shadow-2xl relative">
        {/* Top Trophy Icon */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto -mt-16 sm:-mt-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 border-4 border-white p-4 shadow-[0_0_35px_rgba(251,191,36,0.6)] flex items-center justify-center">
          <Trophy className="w-14 h-14 sm:w-16 sm:h-16 text-slate-950 fill-current drop-shadow" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-amber-400/20 border border-amber-400/60 rounded-full text-amber-300 font-extrabold text-xs uppercase tracking-widest mt-4">
          <Sparkles className="w-4 h-4" /> English Game Arena Champion
        </div>

        {outcome === 'tie' ? (
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              IT'S A FRIENDLY TIE!
            </h2>
            <p className="text-base sm:text-lg font-bold text-amber-300 mt-1">
              Both teams showed incredible English skills and teamwork!
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight mt-2 drop-shadow">
              {winner?.name}
            </h2>
            <p className="text-xl sm:text-2xl font-black text-white mt-1">
              ARE THE TOURNAMENT CHAMPIONS! 🏆
            </p>
          </div>
        )}

        {/* Podium Scores Comparison */}
        <div className="grid grid-cols-2 gap-4 my-6">
          <div
            className={`p-5 rounded-2xl border-2 transition ${
              outcome === 'teamA'
                ? 'bg-gradient-to-b from-blue-900/80 to-sky-950 border-cyan-400 shadow-lg ring-2 ring-cyan-400/50'
                : 'bg-slate-900/80 border-slate-700'
            }`}
          >
            <div className="text-2xl mb-1">{teamA.avatar}</div>
            <div className="font-black text-lg text-cyan-300">{teamA.name}</div>
            <div className="font-mono text-4xl sm:text-5xl font-black text-white my-1 tabular-nums">
              {teamA.score}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {outcome === 'teamA' ? '🥇 1st Place Champion' : outcome === 'tie' ? '🤝 Equal Score' : '🥈 Great Effort!'}
            </div>
          </div>

          <div
            className={`p-5 rounded-2xl border-2 transition ${
              outcome === 'teamB'
                ? 'bg-gradient-to-b from-rose-900/80 to-amber-950 border-amber-400 shadow-lg ring-2 ring-amber-400/50'
                : 'bg-slate-900/80 border-slate-700'
            }`}
          >
            <div className="text-2xl mb-1">{teamB.avatar}</div>
            <div className="font-black text-lg text-amber-300">{teamB.name}</div>
            <div className="font-mono text-4xl sm:text-5xl font-black text-white my-1 tabular-nums">
              {teamB.score}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {outcome === 'teamB' ? '🥇 1st Place Champion' : outcome === 'tie' ? '🤝 Equal Score' : '🥈 Great Effort!'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm sm:text-base transition active:scale-95 border border-slate-700"
          >
            Continue Playing
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onGoHome();
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-sm sm:text-base transition active:scale-95 shadow-lg"
          >
            <Home className="w-4 h-4" /> Go to Lobby
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onResetTournament();
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-2xl text-sm sm:text-base shadow-xl transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> New Tournament
          </button>
        </div>
      </div>
    </div>
  );
};
