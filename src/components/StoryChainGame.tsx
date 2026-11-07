import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  Award,
  CheckCircle,
  HelpCircle,
  Shuffle,
  RotateCcw,
  User,
  Package,
  MapPin,
  Zap,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STORY_PROMPTS, STORY_SENTENCE_STARTERS } from '../data/gameData';
import { TeamId, Team } from '../types/game';
import { sound } from '../utils/sound';

interface StoryChainGameProps {
  teamA: Team;
  teamB: Team;
  activeTurn: TeamId | null;
  onUpdateScore: (teamId: TeamId, delta: number) => void;
  onToggleTurn: () => void;
  onOpenTimer: () => void;
}

export const StoryChainGame: React.FC<StoryChainGameProps> = ({
  teamA,
  teamB,
  activeTurn,
  onUpdateScore,
  onToggleTurn,
  onOpenTimer
}) => {
  const [promptIndex, setPromptIndex] = useState(0);
  const prompt = STORY_PROMPTS[promptIndex];

  const [currentStep, setCurrentStep] = useState(1);
  const [activeCard, setActiveCard] = useState<'character' | 'item' | 'location' | 'twist'>('character');
  const [storyLog, setStoryLog] = useState<{ step: number; team: string; note: string }[]>([]);
  const [awardFeedback, setAwardFeedback] = useState<string | null>(null);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const nextPrompt = () => {
    sound.playTap();
    setPromptIndex((prev) => (prev + 1) % STORY_PROMPTS.length);
    setCurrentStep(1);
    setStoryLog([]);
    setAwardFeedback(null);
  };

  const prevPrompt = () => {
    sound.playTap();
    setPromptIndex((prev) => (prev - 1 + STORY_PROMPTS.length) % STORY_PROMPTS.length);
    setCurrentStep(1);
    setStoryLog([]);
    setAwardFeedback(null);
  };

  const handleStepSelect = (step: number) => {
    sound.playTap();
    setCurrentStep(step);
  };

  const awardJudging = (points: number, reason: string) => {
    sound.playCorrect();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });

    const targetTeam = activeTurn || 'teamA';
    onUpdateScore(targetTeam, points);

    const teamName = targetTeam === 'teamA' ? teamA.name : teamB.name;
    const currentStarter = STORY_SENTENCE_STARTERS.find((s) => s.step === currentStep)?.starter || '';

    setStoryLog((prev) => [
      ...prev,
      {
        step: currentStep,
        team: teamName,
        note: `${reason} (+${points} pts)`
      }
    ]);

    setAwardFeedback(`Awesome! ${teamName} earned +${points} pts for ${reason}!`);
    setTimeout(() => setAwardFeedback(null), 3500);

    // Advance to next step and switch turn automatically for fair play
    if (currentStep < STORY_SENTENCE_STARTERS.length) {
      setCurrentStep((prev) => prev + 1);
    }
    onToggleTurn();
  };

  const currentStarterObj = STORY_SENTENCE_STARTERS.find((s) => s.step === currentStep) || STORY_SENTENCE_STARTERS[0];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 flex flex-col justify-between select-none">
      {/* Top Scenario Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border-2 border-purple-500/40 rounded-3xl p-3 sm:p-4 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={prevPrompt}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white active:scale-95 transition"
            aria-label="Previous Story"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-black text-purple-400 uppercase tracking-widest">
              Story {promptIndex + 1} of {STORY_PROMPTS.length} · Collaborative Speaking
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {prompt.scenario}
            </h2>
          </div>
          <button
            onClick={nextPrompt}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white active:scale-95 transition"
            aria-label="Next Story"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playTap();
              setShowRulesModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 font-bold rounded-2xl text-xs sm:text-sm border border-purple-400/50 active:scale-95 transition"
          >
            <HelpCircle className="w-4 h-4 text-purple-300" /> How to Play
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onOpenTimer();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-2xl text-xs sm:text-sm border border-slate-700 active:scale-95 transition"
          >
            <Clock className="w-4 h-4" /> Speaker Timer
          </button>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black px-4 py-2 rounded-2xl text-sm sm:text-base shadow-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Speaker: <span className="text-amber-300">{activeTurn === 'teamA' ? teamA.name : teamB.name}</span></span>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              setCurrentStep(1);
              setStoryLog([]);
            }}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition"
            title="Reset Story"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Story Board: Scenario Image + Cue Cards + Sentence Starter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-4 items-start">
        {/* Left: Picture Card & Story Cue Cards */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          {/* Main Visual Picture */}
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-4 border-purple-400 shadow-2xl bg-slate-950">
            <img
              src={prompt.imagePath}
              alt={prompt.scenario}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 text-white">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Setting & Context</span>
              <p className="text-sm sm:text-base font-bold drop-shadow">{prompt.scenario}</p>
            </div>
          </div>

          {/* 4 Interactive Story Cue Cards */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            <button
              onClick={() => {
                sound.playTap();
                setActiveCard('character');
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                activeCard === 'character'
                  ? 'bg-purple-950/80 border-purple-400 text-white ring-2 ring-purple-400/50'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-black text-purple-400 uppercase tracking-wider mb-1">
                <User className="w-3.5 h-3.5" /> Character
              </div>
              <p className="text-xs sm:text-sm font-semibold line-clamp-2">{prompt.character}</p>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setActiveCard('item');
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                activeCard === 'item'
                  ? 'bg-amber-950/80 border-amber-400 text-white ring-2 ring-amber-400/50'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                <Package className="w-3.5 h-3.5" /> Magic Item
              </div>
              <p className="text-xs sm:text-sm font-semibold line-clamp-2">{prompt.item}</p>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setActiveCard('location');
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                activeCard === 'location'
                  ? 'bg-cyan-950/80 border-cyan-400 text-white ring-2 ring-cyan-400/50'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-black text-cyan-400 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" /> Secret Spot
              </div>
              <p className="text-xs sm:text-sm font-semibold line-clamp-2">{prompt.location}</p>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setActiveCard('twist');
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                activeCard === 'twist'
                  ? 'bg-rose-950/80 border-rose-400 text-white ring-2 ring-rose-400/50'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-400 uppercase tracking-wider mb-1">
                <Zap className="w-3.5 h-3.5" /> Plot Twist
              </div>
              <p className="text-xs sm:text-sm font-semibold line-clamp-2">{prompt.twist}</p>
            </button>
          </div>
        </div>

        {/* Right: Sentence Starters & Speaking Stage */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Step Progress Ladder */}
          <div className="bg-slate-900/90 border-2 border-slate-700 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-black text-amber-400 uppercase tracking-wider">
                STORY PROGRESS (STEP {currentStep} OF 7)
              </span>
              <span className="text-slate-400 font-bold">
                Tap steps to advance
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {STORY_SENTENCE_STARTERS.map((s) => (
                <button
                  key={s.step}
                  onClick={() => handleStepSelect(s.step)}
                  className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
                    currentStep === s.step
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md scale-105'
                      : s.step < currentStep
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Step {s.step}
                </button>
              ))}
            </div>
          </div>

          {/* Active Speaking Sentence Prompt */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-3 border-purple-400/80 rounded-3xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-purple-300 uppercase tracking-widest">
                START YOUR SENTENCE WITH:
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40">
                Turn: {activeTurn === 'teamA' ? teamA.name : teamB.name}
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border-2 border-slate-700 my-2 shadow-inner">
              <h3 className="text-xl sm:text-2xl font-black text-amber-300 font-sans tracking-wide">
                "{currentStarterObj.starter}"
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 font-medium">
                💡 Speaking Goal: {currentStarterObj.tip}
              </p>
            </div>

            {/* Teacher Judging Controls */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Teacher Judging: Award points to {activeTurn === 'teamA' ? teamA.name : teamB.name}:
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => awardJudging(10, 'Creative Sentence')}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl active:scale-95 transition shadow text-center"
                >
                  <div>Creative Idea!</div>
                  <div className="text-[11px] font-mono text-indigo-200">+10 pts</div>
                </button>

                <button
                  onClick={() => awardJudging(20, 'Great Grammar')}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl active:scale-95 transition shadow text-center"
                >
                  <div>Great Grammar!</div>
                  <div className="text-[11px] font-mono text-emerald-200">+20 pts</div>
                </button>

                <button
                  onClick={() => awardJudging(30, 'Fluent Pronunciation')}
                  className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl active:scale-95 transition shadow text-center"
                >
                  <div>Super Fluent!</div>
                  <div className="text-[11px] font-mono text-slate-900">+30 pts</div>
                </button>
              </div>

              {awardFeedback && (
                <div className="mt-3 p-2 bg-emerald-500/20 border border-emerald-400 rounded-xl text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{awardFeedback}</span>
                </div>
              )}
            </div>
          </div>

          {/* Story Contributions Log */}
          {storyLog.length > 0 && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Completed Story Beats:
              </span>
              <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {storyLog.map((log, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-300">
                    <span>
                      <span className="font-black text-amber-400">Step {log.step}</span> ({log.team})
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">{log.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How to Play Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-3 border-purple-400 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              aria-label="Close Rules"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">How to Play: Story Chain Adventure</h3>
                <p className="text-xs text-purple-300 font-bold">Panduan Cara Bermain & Penilaian untuk Guru & Siswa</p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5 text-xs sm:text-sm text-slate-200">
              <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
                <div className="font-black text-amber-300 text-sm mb-1">🎯 1. TUJUAN PERMAINAN (Objective)</div>
                <p className="leading-relaxed text-slate-300">
                  Melatih keberanian berbicara (speaking fluency), daya imajinasi, dan perbendaharaan kata (vocabulary) bahasa Inggris siswa kelas 4–6 dengan membuat sebuah cerita petualangan bersama secara estafet / berantai antar Tim A dan Tim B.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
                <div className="font-black text-cyan-300 text-sm mb-1">🃏 2. KARTU PETUNJUK (Story Cue Cards)</div>
                <p className="leading-relaxed text-slate-300 mb-2">
                  Guru dan siswa melihat gambar skenario utama dan 4 kartu petunjuk di sebelah kiri:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-purple-950/50 rounded-xl border border-purple-800">
                    <span className="font-bold text-purple-300">🎭 Character:</span> Tokoh utama cerita
                  </div>
                  <div className="p-2 bg-amber-950/50 rounded-xl border border-amber-800">
                    <span className="font-bold text-amber-300">🎒 Magic Item:</span> Benda ajaib yang dibawa
                  </div>
                  <div className="p-2 bg-cyan-950/50 rounded-xl border border-cyan-800">
                    <span className="font-bold text-cyan-300">📍 Secret Spot:</span> Lokasi misterius
                  </div>
                  <div className="p-2 bg-rose-950/50 rounded-xl border border-rose-800">
                    <span className="font-bold text-rose-300">⚡ Plot Twist:</span> Kejutan seru di cerita
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
                <div className="font-black text-emerald-300 text-sm mb-1">🔄 3. ALUR BERMAIN BERANTAI (7 Steps Ladder)</div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                  <li><strong className="text-white">Lihat Step & Starter:</strong> Layar menampilkan kalimat pembuka, misalnya <em>"Once upon a time, there was..."</em></li>
                  <li><strong className="text-white">Giliran Tim Berbicara:</strong> Satu siswa dari tim yang sedang aktif (misal <em>Team Tigers</em>) maju atau berdiri dan menyambung kalimat tersebut menjadi 1 kalimat lengkap dalam bahasa Inggris.</li>
                  <li><strong className="text-white">Batas Waktu:</strong> Gunakan <em>Speaker Timer</em> (misal 30 detik) agar siswa berpikir cepat ("Think Fast, Speak Smart!").</li>
                  <li><strong className="text-white">Penilaian Guru:</strong> Guru langsung menekan salah satu tombol apresiasi nilai:
                    <ul className="list-disc list-inside ml-4 mt-1 text-xs text-amber-200">
                      <li><strong>+10 pts (Creative Idea):</strong> Ide ceritanya unik dan seru.</li>
                      <li><strong>+20 pts (Great Grammar):</strong> Struktur kalimat dan kosakata tepat.</li>
                      <li><strong>+30 pts (Super Fluent):</strong> Pengucapan jelas, percaya diri, dan lancar.</li>
                    </ul>
                  </li>
                  <li><strong className="text-white">Estafet ke Tim Lawan:</strong> Setelah nilai diberikan, giliran otomatis berpindah ke tim lawan (misal <em>Team Eagles</em>) untuk menyambung Step berikutnya (<em>"Every day, they used to..."</em>).</li>
                </ol>
              </div>

              <div className="p-3.5 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 rounded-2xl border border-purple-500/50">
                <div className="font-black text-amber-300 text-sm mb-1">💡 TIPS UNTUK GURU & MC</div>
                <p className="leading-relaxed text-slate-300">
                  Semangati siswa agar tidak takut salah tata bahasa (grammar). Fokus utama adalah melatih keberanian siswa berbicara dalam bahasa Inggris di depan teman-temannya dengan penuh percaya diri dan menyenangkan!
                </p>
              </div>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={() => setShowRulesModal(false)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-base rounded-2xl shadow-xl active:scale-95 transition"
              >
                SIAP BERMAIN! (GOT IT!)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
