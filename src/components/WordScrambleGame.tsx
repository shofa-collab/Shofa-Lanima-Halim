import React, { useState, useEffect } from 'react';
import {
  Shuffle,
  Lightbulb,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SCRAMBLE_WORDS } from '../data/gameData';
import { TeamId, Team } from '../types/game';
import { shuffleWord, checkWordScramble } from '../game/rules';
import { sound } from '../utils/sound';

interface WordScrambleGameProps {
  teamA: Team;
  teamB: Team;
  activeTurn: TeamId | null;
  onUpdateScore: (teamId: TeamId, delta: number) => void;
  onOpenTimer: () => void;
}

interface LetterTileItem {
  id: string; // unique id for each instance of letter
  char: string;
}

export const WordScrambleGame: React.FC<WordScrambleGameProps> = ({
  teamA,
  teamB,
  activeTurn,
  onUpdateScore,
  onOpenTimer
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const currentItem = SCRAMBLE_WORDS[wordIndex];

  // Bank of available letters
  const [bankLetters, setBankLetters] = useState<LetterTileItem[]>([]);
  // Placed slots (array of length = currentItem.word.length, either LetterTileItem or null)
  const [placedSlots, setPlacedSlots] = useState<(LetterTileItem | null)[]>([]);

  const [isSolved, setIsSolved] = useState(false);
  const [showError, setShowError] = useState(false);
  const [awardSuccessMsg, setAwardSuccessMsg] = useState<string | null>(null);

  // Initialize word whenever wordIndex changes
  useEffect(() => {
    initWord(wordIndex);
  }, [wordIndex]);

  const initWord = (idx: number) => {
    const item = SCRAMBLE_WORDS[idx];
    const letters = shuffleWord(item.word);
    const tileItems: LetterTileItem[] = letters.map((char, i) => ({
      id: `${item.id}_${char}_${i}_${Date.now()}`,
      char
    }));

    setBankLetters(tileItems);
    setPlacedSlots(new Array(item.word.length).fill(null));
    setIsSolved(false);
    setShowError(false);
    setAwardSuccessMsg(null);
  };

  // Tap a bank letter: places it in the first open slot
  const handleBankTileTap = (tile: LetterTileItem) => {
    if (isSolved) return;
    sound.playTileFlip();
    const firstEmptyIdx = placedSlots.findIndex((s) => s === null);
    if (firstEmptyIdx === -1) return; // all slots filled

    // Remove from bank
    setBankLetters((prev) => prev.filter((item) => item.id !== tile.id));
    // Place into slots
    setPlacedSlots((prev) => {
      const next = [...prev];
      next[firstEmptyIdx] = tile;
      return next;
    });
    setShowError(false);
  };

  // Tap a placed slot: returns it to the bank
  const handleSlotTap = (slotIdx: number) => {
    if (isSolved) return;
    const tile = placedSlots[slotIdx];
    if (!tile) return;

    sound.playTap();
    // Remove from slot
    setPlacedSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
    // Add back to bank
    setBankLetters((prev) => [...prev, tile]);
    setShowError(false);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, tile: LetterTileItem, source: 'bank' | 'slot', sourceIdx?: number) => {
    if (isSolved) return;
    e.dataTransfer.setData('text/plain', JSON.stringify({ tile, source, sourceIdx }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (e: React.DragEvent, targetSlotIdx: number) => {
    e.preventDefault();
    if (isSolved) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { tile, source, sourceIdx } = data as { tile: LetterTileItem; source: 'bank' | 'slot'; sourceIdx?: number };

      sound.playTileFlip();
      const existingInTarget = placedSlots[targetSlotIdx];

      if (source === 'bank') {
        // Remove from bank
        setBankLetters((prev) => {
          let updated = prev.filter((item) => item.id !== tile.id);
          if (existingInTarget) {
            updated = [...updated, existingInTarget];
          }
          return updated;
        });

        // Set target slot
        setPlacedSlots((prev) => {
          const next = [...prev];
          next[targetSlotIdx] = tile;
          return next;
        });
      } else if (source === 'slot' && sourceIdx !== undefined && sourceIdx !== targetSlotIdx) {
        // Swap slots
        setPlacedSlots((prev) => {
          const next = [...prev];
          next[sourceIdx] = existingInTarget;
          next[targetSlotIdx] = tile;
          return next;
        });
      }
      setShowError(false);
    } catch {
      // ignore drag parse error
    }
  };

  // Check the answer
  const handleCheckWord = () => {
    const letters = placedSlots.map((s) => (s ? s.char : ''));
    const isCorrect = checkWordScramble(letters, currentItem.word);

    if (isCorrect) {
      sound.playCorrect();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setIsSolved(true);
      setShowError(false);

      // Auto award to active turn team if set
      if (activeTurn) {
        onUpdateScore(activeTurn, currentItem.points);
        const name = activeTurn === 'teamA' ? teamA.name : teamB.name;
        setAwardSuccessMsg(`Brilliant! +${currentItem.points} pts awarded to ${name}!`);
      }
    } else {
      sound.playWrong();
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
    }
  };

  // Provide a hint (reveals next unsolved correct letter)
  const handleGiveHint = () => {
    if (isSolved) return;
    sound.playTap();

    const targetArr = currentItem.word.toUpperCase().split('');
    let hintIdx = -1;

    for (let i = 0; i < targetArr.length; i++) {
      if (!placedSlots[i] || placedSlots[i]?.char !== targetArr[i]) {
        hintIdx = i;
        break;
      }
    }

    if (hintIdx === -1) return;

    const neededChar = targetArr[hintIdx];
    // Find neededChar in bank, or if none, swap from incorrect slot
    let foundTile: LetterTileItem | undefined = bankLetters.find((t) => t.char === neededChar);

    if (foundTile) {
      const displaced = placedSlots[hintIdx];
      setBankLetters((prev) => {
        let updated = prev.filter((t) => t.id !== foundTile!.id);
        if (displaced) updated = [...updated, displaced];
        return updated;
      });
      setPlacedSlots((prev) => {
        const next = [...prev];
        next[hintIdx] = foundTile!;
        return next;
      });
    } else {
      // Find in an incorrect slot
      const otherSlotIdx = placedSlots.findIndex(
        (s, idx) => idx !== hintIdx && s?.char === neededChar && targetArr[idx] !== neededChar
      );
      if (otherSlotIdx !== -1) {
        const tileFromSlot = placedSlots[otherSlotIdx]!;
        const displaced = placedSlots[hintIdx];
        setPlacedSlots((prev) => {
          const next = [...prev];
          next[hintIdx] = tileFromSlot;
          next[otherSlotIdx] = displaced;
          return next;
        });
      }
    }
  };

  const handleClearAll = () => {
    sound.playTap();
    initWord(wordIndex);
  };

  const handleShuffleBank = () => {
    sound.playTap();
    setBankLetters((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const nextWord = () => {
    sound.playTap();
    setWordIndex((prev) => (prev + 1) % SCRAMBLE_WORDS.length);
  };

  const prevWord = () => {
    sound.playTap();
    setWordIndex((prev) => (prev - 1 + SCRAMBLE_WORDS.length) % SCRAMBLE_WORDS.length);
  };

  const handleAwardManually = (teamId: TeamId) => {
    sound.playCorrect();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    onUpdateScore(teamId, currentItem.points);
    setIsSolved(true);
    const teamName = teamId === 'teamA' ? teamA.name : teamB.name;
    setAwardSuccessMsg(`Awesome! +${currentItem.points} points awarded to ${teamName}!`);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 flex flex-col justify-between select-none">
      {/* Top Navigation & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border-2 border-emerald-500/40 rounded-3xl p-3 sm:p-4 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={prevWord}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white active:scale-95 transition"
            aria-label="Previous Word"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-black text-emerald-400 uppercase tracking-widest">
              Word {wordIndex + 1} of {SCRAMBLE_WORDS.length} · {currentItem.category}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Letter Scramble
            </h2>
          </div>
          <button
            onClick={nextWord}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white active:scale-95 transition"
            aria-label="Next Word"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playTap();
              onOpenTimer();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-2xl text-xs sm:text-sm border border-slate-700 active:scale-95 transition"
          >
            <Clock className="w-4 h-4" /> Start Timer
          </button>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black px-4 py-2 rounded-2xl text-sm sm:text-base shadow-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Value: <span className="text-lg font-mono">{currentItem.points} pts</span></span>
          </div>

          <button
            onClick={handleClearAll}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition"
            title="Reset Letters"
            aria-label="Reset Letters"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Word Clues Card */}
      <div className="my-3 p-4 bg-slate-900/80 border-2 border-slate-700 rounded-3xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/40">
                CLUE
              </span>
              <p className="text-sm sm:text-base font-semibold text-white">
                {currentItem.definitionClue}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 italic pl-1">
              Example: "{currentItem.sentenceClue}"
            </p>
          </div>

          <button
            onClick={handleGiveHint}
            disabled={isSolved}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-2xl border border-amber-400/40 text-xs active:scale-95 transition disabled:opacity-50"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" /> Need a Hint?
          </button>
        </div>
      </div>

      {/* Interactive Answer Slots Deck */}
      <div className="my-4 p-5 sm:p-7 bg-slate-950/80 border-3 border-amber-400/80 rounded-3xl shadow-2xl flex flex-col items-center">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Tap or drag letters here to build the word ({currentItem.word.length} letters):
        </div>

        {/* Answer Slots Row */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3.5 my-2">
          {placedSlots.map((slot, idx) => (
            <div
              key={idx}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnSlot(e, idx)}
              onClick={() => handleSlotTap(idx)}
              className={`w-12 h-14 sm:w-16 sm:h-20 rounded-2xl border-2 flex items-center justify-center font-black text-2xl sm:text-4xl transition-all duration-200 cursor-pointer shadow-md ${
                slot
                  ? isSolved
                    ? 'bg-emerald-500 border-white text-slate-950 scale-105 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : showError
                    ? 'bg-rose-600 border-rose-300 text-white animate-bounce'
                    : 'bg-gradient-to-b from-sky-400 to-blue-600 border-cyan-200 text-white hover:scale-95'
                  : 'bg-slate-900/80 border-dashed border-slate-600 hover:border-amber-400 text-slate-500'
              }`}
              draggable={!!slot}
              onDragStart={(e) => slot && handleDragStart(e, slot, 'slot', idx)}
            >
              {slot ? slot.char : idx + 1}
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleCheckWord}
            disabled={isSolved || placedSlots.some((s) => s === null)}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-base sm:text-lg shadow-xl active:scale-95 transition ${
              isSolved
                ? 'bg-emerald-500 text-slate-950'
                : placedSlots.some((s) => s === null)
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950'
            }`}
          >
            <Check className="w-5 h-5 stroke-[3]" />
            {isSolved ? 'SOLVED!' : 'CHECK ANSWER'}
          </button>

          <button
            onClick={handleShuffleBank}
            className="flex items-center gap-1.5 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 text-sm active:scale-95 transition"
            title="Reshuffle Available Letters"
          >
            <Shuffle className="w-4 h-4 text-emerald-400" /> Reshuffle
          </button>
        </div>

        {/* Error Feedback */}
        {showError && (
          <div className="mt-3 flex items-center gap-2 text-rose-400 text-sm font-bold animate-in fade-in">
            <AlertCircle className="w-4 h-4" />
            <span>Not quite right yet! Check the letter positions and try again.</span>
          </div>
        )}

        {/* Solved celebration banner */}
        {isSolved && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400 rounded-2xl text-emerald-300 font-black text-base sm:text-lg text-center flex items-center justify-center gap-2 animate-in zoom-in-95">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>EXCELLENT WORK! THE WORD IS "{currentItem.word}"!</span>
          </div>
        )}
      </div>

      {/* Available Letter Bank Deck */}
      <div className="p-4 sm:p-5 bg-slate-900/90 border-2 border-slate-700 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
            AVAILABLE LETTER TILES (TAP TO PLACE):
          </span>
          <span className="text-xs text-slate-400">
            {bankLetters.length} letters remaining
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 min-h-[60px]">
          {bankLetters.length === 0 ? (
            <div className="text-slate-500 text-sm italic py-2">
              All letter tiles placed! Tap CHECK ANSWER or tap a placed letter to return it.
            </div>
          ) : (
            bankLetters.map((tile) => (
              <button
                key={tile.id}
                onClick={() => handleBankTileTap(tile)}
                draggable
                onDragStart={(e) => handleDragStart(e, tile, 'bank')}
                className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg active:scale-95 transition-all border-2 border-white/60 cursor-pointer"
                aria-label={`Letter ${tile.char}`}
              >
                {tile.char}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Teacher Scoring Override Deck */}
      <div className="mt-3 p-4 bg-slate-900/80 border-2 border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-bold text-slate-300">
            Teacher Score Control: Award points manually to:
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAwardManually('teamA')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm rounded-xl active:scale-95 transition shadow"
          >
            Award {teamA.name} (+{currentItem.points})
          </button>
          <button
            onClick={() => handleAwardManually('teamB')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs sm:text-sm rounded-xl active:scale-95 transition shadow"
          >
            Award {teamB.name} (+{currentItem.points})
          </button>
        </div>
      </div>

      {awardSuccessMsg && (
        <div className="mt-2 text-center text-emerald-300 font-bold text-sm">
          {awardSuccessMsg}
        </div>
      )}
    </div>
  );
};
