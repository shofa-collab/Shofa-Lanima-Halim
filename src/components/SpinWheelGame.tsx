import React, { useState, useRef, useEffect } from 'react';
import {
  Disc3,
  Sparkles,
  Trophy,
  Play,
  RotateCcw,
  CheckCircle,
  Clock,
  Volume2,
  X,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WHEEL_CHALLENGES } from '../data/gameData';
import { WheelChallenge, TeamId, Team } from '../types/game';
import { sound } from '../utils/sound';

interface SpinWheelGameProps {
  teamA: Team;
  teamB: Team;
  activeTurn: TeamId | null;
  onUpdateScore: (teamId: TeamId, delta: number) => void;
  onOpenTimer: () => void;
}

export const SpinWheelGame: React.FC<SpinWheelGameProps> = ({
  teamA,
  teamB,
  activeTurn,
  onUpdateScore,
  onOpenTimer
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<WheelChallenge | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [challengeTimer, setChallengeTimer] = useState<number>(20);
  const [timerRunning, setTimerRunning] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const velocityRef = useRef<number>(0);
  const lastSectorRef = useRef<number>(-1);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const numSectors = WHEEL_CHALLENGES.length;
  const sectorAngle = (2 * Math.PI) / numSectors;

  // Draw the wheel onto canvas
  useEffect(() => {
    drawWheel(rotation);
  }, [rotation]);

  const drawWheel = (currentAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 16;

    ctx.clearRect(0, 0, width, height);

    // Save context for rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentAngle);

    // Draw wedges
    WHEEL_CHALLENGES.forEach((challenge, i) => {
      const startAngle = i * sectorAngle;
      const endAngle = startAngle + sectorAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = challenge.color;
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Wedge text
      ctx.save();
      ctx.rotate(startAngle + sectorAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px Outfit, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 4;
      ctx.fillText(challenge.title, radius - 24, 5);

      // Points badge
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#FEF08A'; // light yellow
      ctx.fillText(`+${challenge.points}pts`, radius - 24, 22);
      ctx.restore();
    });

    // Outer rim border
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#FBBF24'; // amber-400
    ctx.stroke();

    // Rim decorative dots
    const numDots = 24;
    for (let d = 0; d < numDots; d++) {
      const dotAngle = (d * 2 * Math.PI) / numDots;
      const dotX = (radius - 1) * Math.cos(dotAngle);
      const dotY = (radius - 1) * Math.sin(dotAngle);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }

    ctx.restore();

    // Center Hub (fixed, does not rotate)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, 2 * Math.PI);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FBBF24';
    ctx.stroke();

    ctx.fillStyle = '#FBBF24';
    ctx.font = '900 13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN!', 0, 0);
    ctx.restore();
  };

  const spin = () => {
    if (isSpinning) return;
    sound.playTap();
    setIsSpinning(true);
    setShowModal(false);

    // Initial random velocity between 0.35 and 0.55 radians per frame (equivalent to ~5 to 8 full rotations)
    velocityRef.current = 0.38 + Math.random() * 0.22;

    let currentRot = rotation;

    const tick = () => {
      velocityRef.current *= 0.985; // deceleration
      currentRot += velocityRef.current;

      // Check sectors for tick sound
      // The pointer is at the top (angle -Math.PI / 2 or 3*Math.PI/2)
      // Normalized angle relative to pointer
      const normalizedAngle = (2 * Math.PI - (currentRot % (2 * Math.PI)) + 3 * Math.PI / 2) % (2 * Math.PI);
      const currentSector = Math.floor(normalizedAngle / sectorAngle);

      if (currentSector !== lastSectorRef.current) {
        sound.playWheelTick();
        lastSectorRef.current = currentSector;
      }

      setRotation(currentRot);

      if (velocityRef.current > 0.002) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        // Stopped!
        setIsSpinning(false);
        const winningIndex = (currentSector + numSectors) % numSectors;
        const prize = WHEEL_CHALLENGES[winningIndex];
        setSelectedChallenge(prize);
        setChallengeTimer(prize.timeLimit);
        setTimerRunning(false);

        sound.playWheelWin();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 }
        });

        setTimeout(() => {
          setShowModal(true);
        }, 600);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  };

  // Timer in modal
  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setChallengeTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setTimerRunning(false);
            sound.playTimerAlarm();
            return 0;
          }
          if (prev <= 5) {
            sound.playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning]);

  const handleAward = (teamId: TeamId) => {
    if (!selectedChallenge) return;
    sound.playCorrect();
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });
    onUpdateScore(teamId, selectedChallenge.points);
    setShowModal(false);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 flex flex-col justify-between select-none">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border-2 border-amber-500/40 rounded-3xl p-3 sm:p-4 shadow-xl">
        <div>
          <div className="text-xs font-black text-amber-400 uppercase tracking-widest">
            Game 3 · Interactive Wheel
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Spin the Challenge Wheel!
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playTap();
              onOpenTimer();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-2xl text-xs sm:text-sm border border-slate-700 active:scale-95 transition"
          >
            <Clock className="w-4 h-4" /> Global Timer
          </button>
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-4 py-2 rounded-2xl text-sm sm:text-base shadow-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Active: <span className="text-white drop-shadow">{activeTurn === 'teamA' ? teamA.name : teamB.name}</span></span>
          </div>
        </div>
      </div>

      {/* Main Wheel Stage */}
      <div className="my-4 flex flex-col lg:flex-row items-center justify-center gap-8 py-2">
        {/* Interactive Rotating Canvas Wheel */}
        <div className="relative flex flex-col items-center">
          {/* Top Pointer Needle */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[34px] border-t-amber-400 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]" />

          {/* Canvas */}
          <div className="p-3 rounded-full bg-slate-950 border-4 border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.8)] cursor-pointer" onClick={spin}>
            <canvas
              ref={canvasRef}
              width={480}
              height={480}
              className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] max-w-full rounded-full transition-transform"
            />
          </div>

          {/* Giant Spin Button */}
          <button
            onClick={spin}
            disabled={isSpinning}
            className={`mt-5 px-10 py-4 rounded-3xl font-black text-xl sm:text-2xl tracking-wider shadow-2xl transition-all duration-200 active:scale-95 flex items-center gap-3 ${
              isSpinning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:to-red-400 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-pulse-subtle'
            }`}
          >
            <Disc3 className={`w-7 h-7 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL!'}
          </button>
        </div>

        {/* Legend / Challenge Directory */}
        <div className="w-full lg:w-96 bg-slate-900/90 border-2 border-slate-700 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-lg text-white">ARENA CHALLENGES</h3>
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            {WHEEL_CHALLENGES.map((ch) => (
              <div
                key={ch.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
                  <span className="font-bold text-white">{ch.title}</span>
                </div>
                <span className="font-mono text-amber-300 font-extrabold">+{ch.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Pop-up Modal when wheel lands */}
      {showModal && selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="w-full max-w-xl rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-4 relative animate-in zoom-in-95 duration-200"
            style={{ backgroundColor: '#0F172A', borderColor: selectedChallenge.color }}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              aria-label="Close Challenge"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2"
                style={{ backgroundColor: selectedChallenge.color, color: '#FFFFFF' }}
              >
                {selectedChallenge.title} · +{selectedChallenge.points} POINTS
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Team Challenge!
              </h3>
              <p className="text-sm font-semibold text-slate-300 mt-1">
                {selectedChallenge.instruction}
              </p>
            </div>

            {/* Target Display Box */}
            <div className="my-5 p-5 sm:p-6 rounded-2xl bg-slate-950 border-2 border-slate-700 text-center shadow-inner">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide font-sans leading-relaxed">
                {selectedChallenge.target}
              </div>
            </div>

            {/* Challenge Mini-Timer */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3 flex items-center justify-between my-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-slate-300">Countdown:</span>
                <span
                  className={`font-mono text-2xl font-black tabular-nums ${
                    challengeTimer <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-300'
                  }`}
                >
                  {challengeTimer}s
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setTimerRunning((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 ${
                    timerRunning
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-emerald-500 text-slate-950 font-black'
                  }`}
                >
                  {timerRunning ? 'PAUSE' : 'START TIMER'}
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setChallengeTimer(selectedChallenge.timeLimit);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  RESET
                </button>
              </div>
            </div>

            {/* Teacher Award Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-2 text-center uppercase tracking-wider">
                Teacher Decision: Award Points?
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAward('teamA')}
                  className="py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg active:scale-95 transition"
                >
                  Award {teamA.name} (+{selectedChallenge.points})
                </button>

                <button
                  onClick={() => handleAward('teamB')}
                  className="py-3 px-4 bg-gradient-to-r from-amber-600 to-rose-500 hover:from-amber-500 hover:to-rose-400 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg active:scale-95 transition"
                >
                  Award {teamB.name} (+{selectedChallenge.points})
                </button>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-2 py-2 text-xs font-bold text-slate-400 hover:text-white transition"
              >
                Pass / No Points
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
