import React, { useState, useEffect } from 'react';
import { GameMode, Team, TeamId } from './types/game';
import { calculateTeamScore } from './game/rules';
import { sound } from './utils/sound';
import { ScoreHeader } from './components/ScoreHeader';
import { LobbyView } from './components/LobbyView';
import { WordScrambleGame } from './components/WordScrambleGame';
import { SpinWheelGame } from './components/SpinWheelGame';
import { StoryChainGame } from './components/StoryChainGame';
import { TimerWidget } from './components/TimerWidget';
import { VictoryModal } from './components/VictoryModal';

const INITIAL_TEAM_A: Team = {
  id: 'teamA',
  name: 'TEAM TIGERS',
  score: 0,
  color: '#0284C7',
  avatar: '🐯'
};

const INITIAL_TEAM_B: Team = {
  id: 'teamB',
  name: 'TEAM EAGLES',
  score: 0,
  color: '#EA580C',
  avatar: '🦅'
};

export default function App() {
  // Support ?autostart=1 or ?game=scramble/wheel/story
  const [currentMode, setCurrentMode] = useState<GameMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const gameParam = params.get('game') as GameMode;
      if (gameParam && ['scramble', 'wheel', 'story'].includes(gameParam)) {
        return gameParam;
      }
      if (params.get('autostart') === '1') {
        return 'scramble';
      }
    }
    return 'lobby';
  });

  // Persistent team scores during current session
  const [teamA, setTeamA] = useState<Team>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_team_a');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_TEAM_A;
  });

  const [teamB, setTeamB] = useState<Team>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_team_b');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_TEAM_B;
  });

  const [activeTurn, setActiveTurn] = useState<TeamId>('teamA');
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);

  // Sync teams to localStorage
  useEffect(() => {
    localStorage.setItem('arena_team_a', JSON.stringify(teamA));
  }, [teamA]);

  useEffect(() => {
    localStorage.setItem('arena_team_b', JSON.stringify(teamB));
  }, [teamB]);

  // Set dataset.state for Ultra Mode verification
  useEffect(() => {
    document.body.dataset.state = currentMode === 'lobby' ? 'title' : 'playing';
  }, [currentMode]);

  const handleUpdateScore = (teamId: TeamId, delta: number) => {
    if (teamId === 'teamA') {
      setTeamA((prev) => ({
        ...prev,
        score: calculateTeamScore(prev.score, delta)
      }));
    } else {
      setTeamB((prev) => ({
        ...prev,
        score: calculateTeamScore(prev.score, delta)
      }));
    }
  };

  const handleUpdateTeamName = (teamId: TeamId, newName: string) => {
    if (teamId === 'teamA') {
      setTeamA((prev) => ({ ...prev, name: newName }));
    } else {
      setTeamB((prev) => ({ ...prev, name: newName }));
    }
  };

  const handleToggleTurn = () => {
    setActiveTurn((prev) => (prev === 'teamA' ? 'teamB' : 'teamA'));
  };

  const handleToggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
  };

  const handleResetScores = () => {
    setTeamA((prev) => ({ ...prev, score: 0 }));
    setTeamB((prev) => ({ ...prev, score: 0 }));
    sound.playTap();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Universal Scoreboard & Control Header */}
      <ScoreHeader
        teamA={teamA}
        teamB={teamB}
        activeTurn={activeTurn}
        currentMode={currentMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onUpdateScore={handleUpdateScore}
        onUpdateTeamName={handleUpdateTeamName}
        onToggleTurn={handleToggleTurn}
        onGoHome={() => setCurrentMode('lobby')}
        onOpenTimer={() => setIsTimerOpen(true)}
        onOpenVictory={() => setIsVictoryOpen(true)}
        onResetScores={handleResetScores}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-y-auto">
        {currentMode === 'lobby' && (
          <LobbyView
            onSelectGame={(mode) => setCurrentMode(mode)}
            onOpenVictory={() => setIsVictoryOpen(true)}
            teamA={teamA}
            teamB={teamB}
          />
        )}

        {currentMode === 'scramble' && (
          <WordScrambleGame
            teamA={teamA}
            teamB={teamB}
            activeTurn={activeTurn}
            onUpdateScore={handleUpdateScore}
            onOpenTimer={() => setIsTimerOpen(true)}
          />
        )}

        {currentMode === 'wheel' && (
          <SpinWheelGame
            teamA={teamA}
            teamB={teamB}
            activeTurn={activeTurn}
            onUpdateScore={handleUpdateScore}
            onOpenTimer={() => setIsTimerOpen(true)}
          />
        )}

        {currentMode === 'story' && (
          <StoryChainGame
            teamA={teamA}
            teamB={teamB}
            activeTurn={activeTurn}
            onUpdateScore={handleUpdateScore}
            onToggleTurn={handleToggleTurn}
            onOpenTimer={() => setIsTimerOpen(true)}
          />
        )}
      </main>

      {/* Floating Arena Timer Widget */}
      <TimerWidget
        initialSeconds={30}
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        floating
      />

      {/* Grand Victory / Tournament Results Ceremony */}
      <VictoryModal
        teamA={teamA}
        teamB={teamB}
        isOpen={isVictoryOpen}
        onClose={() => setIsVictoryOpen(false)}
        onResetTournament={handleResetScores}
        onGoHome={() => setCurrentMode('lobby')}
      />
    </div>
  );
}
