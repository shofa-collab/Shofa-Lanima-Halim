import React from 'react';
import {
  Sparkles,
  Shuffle,
  Disc3,
  BookOpen,
  ArrowRight,
  Trophy,
  Star,
  Zap,
  Users
} from 'lucide-react';
import { GameMode, Team } from '../types/game';
import { sound } from '../utils/sound';

interface LobbyViewProps {
  onSelectGame: (mode: GameMode) => void;
  onOpenVictory: () => void;
  teamA: Team;
  teamB: Team;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  onSelectGame,
  onOpenVictory,
  teamA,
  teamB
}) => {
  const games = [
    {
      id: 'scramble' as GameMode,
      title: 'Word Scramble',
      subtitle: 'Unscramble letters into English words!',
      badge: 'Game 1 · Vocabulary',
      icon: Shuffle,
      bgGradient: 'from-emerald-600 via-teal-600 to-green-700',
      borderAccent: 'border-emerald-400',
      pointsTag: '20–25 pts',
      description: 'Drag and tap large letter tiles to solve vocabulary words with helpful definition and sentence clues!'
    },
    {
      id: 'wheel' as GameMode,
      title: 'Spin the Challenge Wheel',
      subtitle: 'Speaking, spelling & acting challenges!',
      badge: 'Game 2 · Fun Challenges',
      icon: Disc3,
      bgGradient: 'from-amber-600 via-orange-600 to-red-700',
      borderAccent: 'border-amber-400',
      pointsTag: '20–50 pts',
      description: 'Spin the big game-show wheel to land on Tongue Twisters, Charades, Spell-Outs, Opposites, and Lucky Gold Bonuses!'
    },
    {
      id: 'story' as GameMode,
      title: 'Story Chain Adventure',
      subtitle: 'Team sentence-by-sentence storytelling!',
      badge: 'Game 3 · Speaking Fluency',
      icon: BookOpen,
      bgGradient: 'from-purple-600 via-fuchsia-600 to-pink-700',
      borderAccent: 'border-purple-300',
      pointsTag: 'Up to 30 pts/turn',
      description: 'Use scenic picture cards, magic items, and sentence starters to build an imaginative collaborative story!'
    }
  ];

  return (
    <div className="flex-1 w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto select-none">
      {/* Hero Welcome Header */}
      <div className="text-center my-1 sm:my-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-400/20 border border-amber-400/60 rounded-full text-amber-300 font-extrabold text-xs uppercase tracking-widest mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          English Fun Learning · Grades 4–6
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-lg">
          ENGLISH GAME ARENA
        </h1>
        <p className="mt-1 text-lg sm:text-xl font-black text-amber-400 tracking-wide">
          "THINK FAST, SPEAK SMART!"
        </p>
        <p className="mt-0.5 text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto">
          Welcome students and teachers! Choose a game below to compete in teams, test your English skills, and claim the championship trophy!
        </p>
      </div>

      {/* 3 Large Interactive Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-2 sm:my-3">
        {games.map((g) => {
          const Icon = g.icon;
          return (
            <div
              key={g.id}
              onClick={() => {
                sound.playTap();
                onSelectGame(g.id);
              }}
              className={`group relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br ${g.bgGradient} border-3 ${g.borderAccent} shadow-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs font-black text-white uppercase tracking-wider">
                    {g.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow">
                    <Star className="w-3.5 h-3.5 fill-current" /> {g.pointsTag}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform">
                    <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-amber-200 transition-colors">
                      {g.title}
                    </h2>
                    <p className="text-sm font-bold text-white/80 mt-0.5">
                      {g.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-white/90 mt-4 leading-relaxed font-medium bg-black/20 p-3 rounded-2xl backdrop-blur-sm">
                  {g.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between">
                <span className="text-xs font-bold text-white/75 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-300" /> Touch screen friendly
                </span>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 font-black rounded-2xl text-sm sm:text-base shadow-lg group-hover:bg-amber-300 transition-colors"
                  tabIndex={-1}
                >
                  START GAME <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arena Tournament Status & Quick Actions */}
      <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-4 sm:p-5 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tournament Standing</div>
            <div className="text-base sm:text-lg font-black text-white flex items-center gap-3">
              <span className="text-cyan-400">{teamA.name}: {teamA.score} pts</span>
              <span className="text-slate-500">vs</span>
              <span className="text-amber-400">{teamB.name}: {teamB.score} pts</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              sound.playTap();
              onOpenVictory();
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl active:scale-95 transition"
          >
            <Trophy className="w-5 h-5 fill-current" /> DECLARE CHAMPION & RESULTS
          </button>
        </div>
      </div>
    </div>
  );
};
