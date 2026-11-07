import React, { useState } from 'react';
import {
  Trophy,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Clock,
  Home,
  CheckCircle,
  Edit2,
  Sparkles
} from 'lucide-react';
import { Team, TeamId, GameMode } from '../types/game';
import { sound } from '../utils/sound';

interface ScoreHeaderProps {
  teamA: Team;
  teamB: Team;
  activeTurn: TeamId | null;
  currentMode: GameMode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onUpdateScore: (teamId: TeamId, delta: number) => void;
  onUpdateTeamName: (teamId: TeamId, newName: string) => void;
  onToggleTurn: () => void;
  onGoHome: () => void;
  onOpenTimer: () => void;
  onOpenVictory: () => void;
  onResetScores: () => void;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  teamA,
  teamB,
  activeTurn,
  currentMode,
  soundEnabled,
  onToggleSound,
  onUpdateScore,
  onUpdateTeamName,
  onToggleTurn,
  onGoHome,
  onOpenTimer,
  onOpenVictory,
  onResetScores
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamId | null>(null);
  const [editName, setEditName] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const toggleFullscreen = () => {
    sound.playTap();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const startEditTeam = (team: Team) => {
    sound.playTap();
    setEditingTeam(team.id);
    setEditName(team.name);
  };

  const saveEditTeam = () => {
    sound.playTap();
    if (editingTeam && editName.trim()) {
      onUpdateTeamName(editingTeam, editName.trim());
    }
    setEditingTeam(null);
  };

  const scoreDiff = teamA.score - teamB.score;
  const leadText =
    scoreDiff > 0
      ? `${teamA.name} leads by ${scoreDiff}`
      : scoreDiff < 0
      ? `${teamB.name} leads by ${Math.abs(scoreDiff)}`
      : 'Scores are Tied!';

  const getModeTitle = () => {
    switch (currentMode) {
      case 'scramble':
        return '🧩 WORD SCRAMBLE CHALLENGE';
      case 'wheel':
        return '🎡 SPIN THE CHALLENGE WHEEL';
      case 'story':
        return '📖 STORY CHAIN ADVENTURE';
      default:
        return '🌟 GAME ARENA LOBBY';
    }
  };

  return (
    <header className="w-full bg-slate-900 border-b-4 border-amber-400 text-white shadow-xl sticky top-0 z-40 select-none">
      {/* Top Utility Control Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950/80 text-xs text-slate-300 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-amber-400 tracking-wider text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> THINK FAST, SPEAK SMART!
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline font-medium text-slate-400">
            English Fun Learning · Grades 4–6
          </span>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex items-center gap-2">
          {currentMode !== 'lobby' && (
            <button
              onClick={() => {
                sound.playTap();
                onGoHome();
              }}
              className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs transition active:scale-95"
            >
              <Home className="w-3.5 h-3.5" /> LOBBY
            </button>
          )}

          <button
            onClick={() => {
              sound.playTap();
              onToggleTurn();
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs border border-slate-700 active:scale-95 transition"
            title="Switch Active Team Turn"
          >
            Turn: <span className="text-amber-400">{activeTurn === 'teamA' ? teamA.name : teamB.name}</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onOpenTimer();
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-lg text-xs border border-slate-700 active:scale-95 transition"
          >
            <Clock className="w-3.5 h-3.5" /> TIMER
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onOpenVictory();
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-600/90 hover:bg-amber-500 text-white font-bold rounded-lg text-xs active:scale-95 transition"
          >
            <Trophy className="w-3.5 h-3.5" /> RESULTS
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setShowResetConfirm(true);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold rounded-lg text-xs border border-rose-800 active:scale-95 transition"
            title="Reset All Scores"
          >
            <RotateCcw className="w-3.5 h-3.5" /> RESET
          </button>

          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition"
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Main Scoreboard: Team A vs Team B Display */}
      <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center px-3 sm:px-6 py-2.5">
        {/* TEAM A CARD */}
        <div
          className={`col-span-4 rounded-2xl p-2.5 sm:p-3 transition-all duration-300 border-2 ${
            activeTurn === 'teamA'
              ? 'bg-gradient-to-r from-blue-900/90 to-sky-950 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] ring-2 ring-cyan-400/50'
              : 'bg-slate-800/80 border-slate-700/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl">{teamA.avatar}</span>
              {editingTeam === 'teamA' ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEditTeam()}
                    className="bg-slate-900 text-white font-bold text-sm px-2 py-0.5 rounded border border-cyan-400 w-28"
                    autoFocus
                  />
                  <button onClick={saveEditTeam} className="text-emerald-400 hover:text-emerald-300">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 group cursor-pointer" onClick={() => startEditTeam(teamA)}>
                  <span className="font-black text-sm sm:text-base text-cyan-300 tracking-wide truncate max-w-[120px] sm:max-w-[160px]">
                    {teamA.name}
                  </span>
                  <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-cyan-300 opacity-60" />
                </div>
              )}
            </div>

            {activeTurn === 'teamA' && (
              <span className="bg-cyan-500 text-slate-950 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                TURN
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight tabular-nums drop-shadow-md">
              {teamA.score}
            </div>

            {/* Quick teacher points for Team A */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => onUpdateScore('teamA', 10)}
                className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs sm:text-sm rounded-lg active:scale-95 transition shadow"
                title="Add 10 points to Team A"
              >
                +10
              </button>
              <button
                onClick={() => onUpdateScore('teamA', 25)}
                className="px-2 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-lg active:scale-95 transition shadow"
                title="Add 25 points to Team A"
              >
                +25
              </button>
              <button
                onClick={() => onUpdateScore('teamA', -10)}
                className="px-1.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs rounded-lg active:scale-95 transition"
                title="Subtract 10 points"
              >
                -10
              </button>
            </div>
          </div>
        </div>

        {/* CENTER ARENA STATUS */}
        <div className="col-span-4 flex flex-col items-center justify-center text-center">
          <div className="font-black text-base sm:text-lg lg:text-xl text-amber-400 tracking-wide drop-shadow truncate max-w-full">
            {getModeTitle()}
          </div>
          <div className="inline-block mt-0.5 px-3 py-0.5 bg-slate-800/90 border border-slate-700 rounded-full text-[11px] sm:text-xs font-bold text-amber-300">
            {leadText}
          </div>
        </div>

        {/* TEAM B CARD */}
        <div
          className={`col-span-4 rounded-2xl p-2.5 sm:p-3 transition-all duration-300 border-2 ${
            activeTurn === 'teamB'
              ? 'bg-gradient-to-l from-rose-900/90 to-amber-950 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] ring-2 ring-amber-400/50'
              : 'bg-slate-800/80 border-slate-700/80'
          }`}
        >
          <div className="flex items-center justify-between">
            {activeTurn === 'teamB' && (
              <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                TURN
              </span>
            )}

            <div className="flex items-center gap-1.5 ml-auto">
              {editingTeam === 'teamB' ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEditTeam()}
                    className="bg-slate-900 text-white font-bold text-sm px-2 py-0.5 rounded border border-amber-400 w-28"
                    autoFocus
                  />
                  <button onClick={saveEditTeam} className="text-emerald-400 hover:text-emerald-300">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 group cursor-pointer" onClick={() => startEditTeam(teamB)}>
                  <span className="font-black text-sm sm:text-base text-amber-300 tracking-wide truncate max-w-[120px] sm:max-w-[160px]">
                    {teamB.name}
                  </span>
                  <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-amber-300 opacity-60" />
                </div>
              )}
              <span className="text-xl sm:text-2xl">{teamB.avatar}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            {/* Quick teacher points for Team B */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => onUpdateScore('teamB', -10)}
                className="px-1.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs rounded-lg active:scale-95 transition"
                title="Subtract 10 points"
              >
                -10
              </button>
              <button
                onClick={() => onUpdateScore('teamB', 25)}
                className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-lg active:scale-95 transition shadow"
                title="Add 25 points to Team B"
              >
                +25
              </button>
              <button
                onClick={() => onUpdateScore('teamB', 10)}
                className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs sm:text-sm rounded-lg active:scale-95 transition shadow"
                title="Add 10 points to Team B"
              >
                +10
              </button>
            </div>

            <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight tabular-nums drop-shadow-md">
              {teamB.score}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Scores */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center">
            <h3 className="text-2xl font-black text-white mb-2">Reset All Scores?</h3>
            <p className="text-slate-300 text-sm mb-6">
              This will set both Team A and Team B scores back to 0 for a new tournament. Are you sure?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  sound.playTap();
                  setShowResetConfirm(false);
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  onResetScores();
                  setShowResetConfirm(false);
                }}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-lg transition"
              >
                Yes, Reset Scores
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
