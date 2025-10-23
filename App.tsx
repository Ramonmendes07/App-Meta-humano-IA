import React, { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';
import { Screen, RunData, CommunityPost, Challenge, LeaderboardUser, CommunityChallenge, AIOutput } from './types';
import { MOCK_RUN_HISTORY, MOCK_COMMUNITY_POSTS, MOCK_CHALLENGES, MOCK_LEADERBOARD, MOCK_COMMUNITY_CHALLENGES, MOCK_STRAVA_ACTIVITIES, RunnerIcon, TrophyIcon, GlobeIcon, BrainIcon, UsersIcon, StravaIcon, SparklesIcon } from './constants';
import { useRunTracker } from './hooks/useRunTracker';

// --- AI SIMULATION ---

// This function simulates the AI Coach based on the user's prompt logic.
const getAICoachAnalysis = (runHistory: RunData[]): AIOutput => {
  if (runHistory.length < 3) {
    // Not enough data for analysis
    return {
      summary: "Dados insuficientes para uma análise completa. Continue correndo para ativar o Coach Inteligente.",
      diagnostics: { delta_pace_percent: 0, acwr: 0, recovery_signal_0_3: 0, risk_level: 'low', flags: [] },
      today_plan: { type: 'easy', duration_min: 30, structure: ["30min Z2 conversacional"], notes: "Foque em consistência.", mental_protocol: [], recovery: [] },
      neurotech_message: { short_push: "O primeiro passo é o mais importante. Continue construindo sua base.", storytelling: "Cada corrida é um dado novo que você envia para o sistema. O autoconhecimento começa com a coleta.", cta: "Complete uma corrida leve de 30 minutos hoje." },
      educational_bits: ["Consistência é mais importante que intensidade no início.", "Hidrate-se bem, mesmo em dias frios."]
    };
  }

  const last3Runs = runHistory.slice(0, 3);
  const avgPaceLast3 = last3Runs.reduce((sum, run) => sum + run.avgPace, 0) / 3;
  const overallAvgPace = runHistory.reduce((sum, run) => sum + run.avgPace, 0) / runHistory.length;
  
  const deltaPacePercent = ((avgPaceLast3 - overallAvgPace) / overallAvgPace) * 100;

  // Simulate ACWR and recovery for demonstration
  const simulatedACWR = 0.8 + Math.random() * 0.8; // Random ACWR in a plausible range
  const simulatedRecoverySignal = Math.floor(Math.random() * 3); // Random recovery signal
  
  if (deltaPacePercent > 10 && simulatedACWR > 1.3) {
     return {
      summary: "Queda de performance com carga elevada. Ajuste hoje = resiliência e recuperação.",
      diagnostics: { delta_pace_percent: 12, acwr: 1.42, recovery_signal_0_3: 2, risk_level: "high", flags: ["low_sleep","low_hrv"] },
      today_plan: { type: "deload", duration_min: 40, structure: ["30min Z2 conversacional", "10min mobilidade + core leve"], notes: "Hidratação, reduzir calor, terreno plano.", mental_protocol: ["respiração 4-6 (10min)", "visualização 3min"], recovery: ["Synapse Flow 20min", "banho morno", "sono 8h"] },
      neurotech_message: { short_push: `Seu pace caiu ${deltaPacePercent.toFixed(0)}% nos últimos treinos. Hoje é Missão Resiliência: Z2 + foco.`, storytelling: "O aço volta ao fogo antes de brilhar. Deload tático para renascer mais forte.", cta: "Execute 30min Z2 + Synapse Flow 20min hoje." },
      educational_bits: ["ACWR alto aumenta risco de lesão; deload reduz microdanos e restaura sistema nervoso.", "Sono <6h derruba HRV; priorize 7–9h para plasticidade neural."]
    };
  } else if (simulatedACWR < 0.8) {
      return {
      summary: "Carga de treino baixa. Adicionar estímulo leve para manter a progressão.",
      diagnostics: { delta_pace_percent: deltaPacePercent, acwr: simulatedACWR, recovery_signal_0_3: simulatedRecoverySignal, risk_level: "low", flags: [] },
      today_plan: { type: "easy", duration_min: 30, structure: ["25min Z2", "5min educativos (skipping, etc)"], notes: "Foco na forma e cadência.", mental_protocol: ["Foco na respiração ritmada."], recovery: ["Alongamento leve 5min."] },
      neurotech_message: { short_push: "O corpo pede consistência. Um estímulo leve hoje mantém a máquina neural ativa.", storytelling: "A inércia é o inimigo do progresso. Mantenha o momentum com uma sessão controlada.", cta: "Execute 30min Z2 + educativos." },
      educational_bits: ["Educativos melhoram a eficiência da corrida.", "Manter uma carga mínima previne destreino."]
    };
  } else {
     return {
      summary: "Zona segura. Progresso controlado.",
      diagnostics: { delta_pace_percent: 2, acwr: 1.05, recovery_signal_0_3: 1, risk_level: "moderate", flags: [] },
      today_plan: { type: "tempo", duration_min: 35, structure: ["10min Z2", "20min Z3 tempo run", "5min Z2"], notes: "Cadência estável, postura neutra.", mental_protocol: ["mantra: 'Eu comando o ritmo'"], recovery: ["alongamento 8min", "hidratação", "sono 7–9h"] },
      neurotech_message: { short_push: "Estabilidade conquistada. Hoje: Progresso controlado.", storytelling: "Repita o essencial com precisão. Sólido hoje, mais veloz amanhã.", cta: "Tempo run 20–30min Z3." },
      educational_bits: ["Tempo run melhora limiar de lactato e economia de corrida.", "Hidratação adequada mantém a mecânica e o controle térmico."]
    };
  }
};


// --- HELPER COMPONENTS ---

const NeonCard: FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => (
    <div
        className={`bg-gray-900/50 border border-green-400/50 backdrop-blur-sm p-6 rounded-lg shadow-[0_0_15px_rgba(74,222,128,0.2)] hover:border-green-400/80 hover:shadow-[0_0_25px_rgba(74,222,128,0.4)] transition-all duration-300 ${className} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
    >
        {children}
    </div>
);

const NeonButton: FC<{ children: React.ReactNode; onClick?: () => void; className?: string; variant?: 'primary' | 'secondary'; disabled?: boolean }> = ({ children, onClick, className = '', variant = 'primary', disabled }) => {
    const baseClasses = "font-orbitron px-8 py-3 rounded-md text-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";
    const primaryClasses = "bg-green-500 text-black shadow-[0_0_10px_rgba(74,222,128,0.5)] hover:bg-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.8)]";
    const secondaryClasses = "border-2 border-green-500 text-green-500 hover:bg-green-500/20 hover:text-green-400";
    // FIX: Add disabled prop and styles to the NeonButton component.
    const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none";
    
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variant === 'primary' ? primaryClasses : secondaryClasses} ${disabledClasses} ${className}`}>
            {children}
        </button>
    );
};

const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    if (h !== '00') return `${h}:${m}:${s}`;
    return `${m}:${s}`;
};

const formatPace = (pace: number): string => {
    if (pace === 0 || !isFinite(pace)) return '0:00';
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};


// --- SCREENS / MODULES ---

const HomeScreen: FC<{ onNavigate: (screen: Screen) => void }> = ({ onNavigate }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 bg-black transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="text-center z-10">
            <h1 className="font-orbitron text-5xl md:text-7xl font-bold text-green-400 tracking-widest animate-neon-pulse" style={{ textShadow: '0 0 10px #34d399' }}>
                META HUMANOS
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300 font-light">CORPOS QUE CORREM. MENTES QUE COMANDAM.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 w-full max-w-4xl z-10">
            <NeonCard className="text-center" onClick={() => onNavigate(Screen.Running)}>
                <RunnerIcon className="w-12 h-12 mx-auto text-green-400 mb-2" />
                <h2 className="font-orbitron text-2xl">Iniciar Corrida</h2>
            </NeonCard>
            <NeonCard className="text-center" onClick={() => onNavigate(Screen.Challenges)}>
                <TrophyIcon className="w-12 h-12 mx-auto text-green-400 mb-2" />
                <h2 className="font-orbitron text-2xl">Desafio do Mês</h2>
            </NeonCard>
            <NeonCard className="text-center" onClick={() => onNavigate(Screen.Community)}>
                <GlobeIcon className="w-12 h-12 mx-auto text-green-400 mb-2" />
                <h2 className="font-orbitron text-2xl">Minha Tribo</h2>
            </NeonCard>
            <NeonCard className="text-center" onClick={() => onNavigate(Screen.Dashboard)}>
                <BrainIcon className="w-12 h-12 mx-auto text-green-400 mb-2" />
                <h2 className="font-orbitron text-2xl">Painel NeuroTech</h2>
            </NeonCard>
        </div>
    </div>
  );
};

const RunningScreen: FC<{ onRunComplete: (run: RunData) => void }> = ({ onRunComplete }) => {
    const { status, error, distance, elapsedTime, currentPace, elevationGain, startRun, pauseRun, resumeRun, stopRun, resetRun } = useRunTracker();
    const [finalRun, setFinalRun] = useState<RunData | null>(null);

    const handleStop = () => {
        const runData = stopRun();
        setFinalRun(runData);
        onRunComplete({...runData, source: 'app'});
    };

    const handleReset = () => {
        resetRun();
        setFinalRun(null);
    }
    
    if (status === 'finished' && finalRun) {
        return (
            <div className="p-4 pt-10 flex flex-col items-center">
                <h2 className="font-orbitron text-3xl text-green-400 mb-6">Resumo da Corrida</h2>
                <NeonCard className="w-full max-w-md">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-gray-400">Distância</p>
                            <p className="text-3xl font-bold">{finalRun.distance.toFixed(2)} km</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Tempo</p>
                            <p className="text-3xl font-bold">{formatTime(finalRun.time)}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Pace Médio</p>
                            <p className="text-3xl font-bold">{formatPace(finalRun.avgPace/60)}/km</p>
                        </div>
                         <div>
                            <p className="text-gray-400">Elevação</p>
                            <p className="text-3xl font-bold">{finalRun.elevationGain} m</p>
                        </div>
                    </div>
                </NeonCard>
                <NeonButton onClick={handleReset} className="mt-8">Nova Corrida</NeonButton>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-between min-h-[calc(100vh-80px)] p-4">
            <div className="w-full text-center">
                <p className="font-orbitron text-6xl md:text-8xl text-white tracking-tighter">{formatTime(elapsedTime / 1000)}</p>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-lg text-center my-8">
                <div>
                    <p className="text-gray-400 text-sm">Distância (km)</p>
                    <p className="font-orbitron text-4xl">{distance.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Pace (min/km)</p>
                    <p className="font-orbitron text-4xl">{formatPace(currentPace)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Elevação (m)</p>
                    <p className="font-orbitron text-4xl">{Math.round(elevationGain)}</p>
                </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
                {status === 'idle' && <NeonButton onClick={startRun} className="w-48 h-20 rounded-full">INICIAR</NeonButton>}
                {status === 'running' && <NeonButton onClick={pauseRun} variant="secondary" className="w-32">PAUSAR</NeonButton>}
                {status === 'paused' && <NeonButton onClick={resumeRun} className="w-32">RETOMAR</NeonButton>}
                {(status === 'running' || status === 'paused') && <NeonButton onClick={handleStop} className="w-32 bg-red-600 hover:bg-red-500 shadow-red-500/50 hover:shadow-red-500/80">PARAR</NeonButton>}
            </div>
        </div>
    );
};


const CommunityScreen: FC = () => (
    <div className="p-4 space-y-8">
        <div>
            <h2 className="font-orbitron text-2xl text-green-400 mb-4">Ranking Semanal (Km)</h2>
            <NeonCard>
                <ul className="space-y-3">
                    {MOCK_LEADERBOARD.map(user => (
                        <li key={user.rank} className="flex justify-between items-center text-lg">
                            <span className="flex items-center">
                                <span className="font-bold w-8">{user.rank}.</span>
                                <span>{user.name} <span className="text-xs text-gray-400">({user.level})</span></span>
                            </span>
                            <span className="font-orbitron text-green-400">{user.distance.toFixed(1)} km</span>
                        </li>
                    ))}
                </ul>
            </NeonCard>
        </div>

        <div>
            <h2 className="font-orbitron text-2xl text-green-400 mb-4">Feed da Tribo</h2>
            <div className="space-y-6">
                {MOCK_COMMUNITY_POSTS.map((post: CommunityPost) => (
                    <NeonCard key={post.id}>
                        <div className="flex items-start space-x-4">
                            <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="font-bold text-green-400">{post.author}</p>
                                <p className="mt-2 text-gray-300">{post.content}</p>
                                {post.run && (
                                    <div className="mt-3 border-l-2 border-green-500 pl-3 text-sm flex space-x-4">
                                        <span>🏃 {post.run.distance}</span>
                                        <span>⏱️ {post.run.time}</span>
                                        <span>⚡ {post.run.pace}</span>
                                    </div>
                                )}
                                <div className="flex space-x-6 mt-4 text-gray-400">
                                    <span>❤️ {post.likes}</span>
                                    <span>💬 {post.comments}</span>
                                </div>
                            </div>
                        </div>
                    </NeonCard>
                ))}
            </div>
        </div>
    </div>
);

const AICoachAnalysisCard: FC<{ analysis: AIOutput }> = ({ analysis }) => {
    const riskColor = {
        low: 'text-green-400',
        moderate: 'text-yellow-400',
        high: 'text-red-500',
    };
    
    // Create mock data for charts as the analysis object is just a snapshot
    const paceTrendData = [
        { name: 'D-2', trend: parseFloat((analysis.diagnostics.delta_pace_percent - Math.random() * 5).toFixed(1)) },
        { name: 'D-1', trend: parseFloat((analysis.diagnostics.delta_pace_percent - Math.random() * 2).toFixed(1)) },
        { name: 'Hoje', trend: parseFloat(analysis.diagnostics.delta_pace_percent.toFixed(1)) },
    ];

    const acwrData = [
        { name: 'Carga', acwr: parseFloat(analysis.diagnostics.acwr.toFixed(2)) }
    ];

    const getAcwrColor = (acwr: number) => {
        if (acwr > 1.5) return "#ef4444"; // red-500
        if (acwr > 1.3) return "#facc15"; // yellow-400
        return "#34d399"; // green-400 (custom)
    }

    return (
        <NeonCard>
            <div className="text-center mb-6">
                <h3 className="font-orbitron text-xl text-green-400">Análise do Coach Inteligente</h3>
                <p className="text-gray-300 italic mt-2">"{analysis.neurotech_message.storytelling}"</p>
            </div>
            
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-lg">Plano de Hoje: {analysis.today_plan.type} ({analysis.today_plan.duration_min} min)</h4>
                <p className="text-gray-400 mt-2">{analysis.neurotech_message.cta}</p>
                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                    {analysis.today_plan.structure.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h5 className="font-bold text-center text-gray-300 mb-2">Tendência de Pace (%)</h5>
                    <ResponsiveContainer width="100%" height={150}>
                        <LineChart data={paceTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #34d399' }} />
                            <Line type="monotone" dataKey="trend" stroke="#34d399" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                 <div>
                    <h5 className="font-bold text-center text-gray-300 mb-2">Carga Aguda vs Crônica (ACWR)</h5>
                    <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={acwrData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} />
                            <YAxis domain={[0, 2]} stroke="#9ca3af" fontSize={12}/>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #34d399' }} cursor={{fill: 'rgba(74, 222, 128, 0.1)'}} />
                            <ReferenceLine y={0.8} label={{ value: 'Seguro', position: 'insideTopLeft', fill: '#9ca3af', fontSize: 10 }} stroke="#6b7280" strokeDasharray="3 3" />
                            <ReferenceLine y={1.3} stroke="#6b7280" strokeDasharray="3 3" />
                            <Bar dataKey="acwr" fill={getAcwrColor(analysis.diagnostics.acwr)} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h5 className="font-bold mb-2">Diagnóstico Detalhado</h5>
                    <p>Risco: <span className={`font-bold ${riskColor[analysis.diagnostics.risk_level]}`}>{analysis.diagnostics.risk_level.toUpperCase()}</span></p>
                    <p>Recuperação: <span className="font-bold">{analysis.diagnostics.recovery_signal_0_3}/3</span></p>
                </div>
                <div>
                    <h5 className="font-bold mb-2">Protocolo Mental & Recuperação</h5>
                    <p>Mental: {analysis.today_plan.mental_protocol.join(', ') || 'N/A'}</p>
                    <p>Recuperação: {analysis.today_plan.recovery.join(', ') || 'N/A'}</p>
                </div>
            </div>
             <div className="mt-6 text-xs text-gray-500 border-t border-gray-700 pt-3">
                <h5 className="font-bold text-gray-400 mb-1">Microdicas:</h5>
                <ul className="list-disc list-inside">
                    {analysis.educational_bits.map((bit, i) => <li key={i}>{bit}</li>)}
                </ul>
            </div>
        </NeonCard>
    );
};


const DashboardScreen: FC<{ runHistory: RunData[], isStravaConnected: boolean, setIsStravaConnected: (c: boolean) => void, onStravaSync: () => void, aiAnalysis: AIOutput | null, isAnalyzing: boolean, onRequestAIAnalysis: () => void, isSyncingStrava: boolean, stravaSyncMessage: string }> = ({ runHistory, isStravaConnected, setIsStravaConnected, onStravaSync, aiAnalysis, isAnalyzing, onRequestAIAnalysis, isSyncingStrava, stravaSyncMessage }) => {
     const chartData = [...runHistory].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 10).map(run => ({
        name: new Date(run.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        km: run.distance,
    }));
    
    return (
        <div className="p-4 space-y-8">
            <h2 className="font-orbitron text-2xl text-green-400 mb-4">Painel NeuroTech</h2>

            <NeonCard>
                <div className="text-center">
                    <SparklesIcon className="w-12 h-12 mx-auto text-green-400 mb-2 animate-pulse" />
                     <h3 className="text-lg font-bold mb-2">Coach Inteligente Meta-Humano</h3>
                     <p className="text-sm text-gray-400 mb-4">Receba uma análise de performance e um plano de treino diário gerado por IA.</p>
                     <NeonButton onClick={onRequestAIAnalysis} disabled={isAnalyzing}>
                        {isAnalyzing ? 'Analisando...' : 'Analisar Performance'}
                     </NeonButton>
                </div>
            </NeonCard>

            {isAnalyzing && (
                <div className="text-center p-8">
                    <p className="font-orbitron animate-pulse">PROCESSANDO DADOS NEURAIS...</p>
                </div>
            )}

            {aiAnalysis && <AICoachAnalysisCard analysis={aiAnalysis} />}
            
            <NeonCard>
                {!isStravaConnected ? (
                    <div className="text-center">
                        <StravaIcon className="w-12 h-12 mx-auto text-[#FC4C02] mb-2"/>
                        <h3 className="text-lg font-bold mb-2">Conectar com Strava</h3>
                        <p className="text-sm text-gray-400 mb-4">Sincronize suas atividades do Strava para analizar sua performance.</p>
                        <NeonButton onClick={() => setIsStravaConnected(true)} className="bg-[#FC4C02] hover:bg-[#db4402] text-white">Conectar</NeonButton>
                    </div>
                ) : (
                    <div className="text-center">
                         <h3 className="text-lg font-bold mb-2 text-green-400">Conectado ao Strava</h3>
                         <p className="text-sm text-gray-400 mb-4">Sincronize suas últimas corridas ou desconecte sua conta.</p>
                         <div className="flex justify-center gap-4">
                             <NeonButton onClick={onStravaSync} disabled={isSyncingStrava}>
                                 {isSyncingStrava ? 'Sincronizando...' : 'Sincronizar'}
                            </NeonButton>
                             <NeonButton onClick={() => setIsStravaConnected(false)} variant="secondary" disabled={isSyncingStrava}>
                                 Desconectar
                            </NeonButton>
                         </div>
                         {stravaSyncMessage && <p className="text-sm text-green-400 mt-3">{stravaSyncMessage}</p>}
                    </div>
                )}
            </NeonCard>

            <NeonCard>
                <h3 className="text-lg font-bold mb-4">Progresso de Distância (Últimas 10)</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #34d399' }} />
                        <Line type="monotone" dataKey="km" stroke="#34d399" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </NeonCard>
            <NeonCard>
                 <h3 className="text-lg font-bold mb-4">Histórico de Corridas</h3>
                 <ul className="space-y-4">
                     {runHistory.map((run, index) => (
                         <li key={run.stravaId || index} className="grid grid-cols-4 gap-2 text-center border-b border-gray-700 pb-2 items-center">
                             <div>
                                 <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                                     {run.source === 'strava' && <StravaIcon className="w-4 h-4 text-[#FC4C02]" />}
                                     Data
                                 </p>
                                 <p>{new Date(run.date).toLocaleDateString()}</p>
                             </div>
                             <div>
                                 <p className="text-sm text-gray-400">Distância</p>
                                 <p>{run.distance.toFixed(2)} km</p>
                             </div>
                             <div>
                                 <p className="text-sm text-gray-400">Tempo</p>
                                 <p>{formatTime(run.time)}</p>
                             </div>
                             <div>
                                 <p className="text-sm text-gray-400">Pace</p>
                                 <p>{formatPace(run.avgPace / 60)}/km</p>
                             </div>
                         </li>
                     ))}
                 </ul>
            </NeonCard>
        </div>
    );
}

const ChallengesScreen: FC = () => (
    <div className="p-4 space-y-6">
        <h2 className="font-orbitron text-2xl text-green-400 mb-4">Desafios Individuais</h2>
        {MOCK_CHALLENGES.map((challenge: Challenge) => (
            <NeonCard key={challenge.id}>
                <h3 className="font-bold text-xl text-green-400">{challenge.title}</h3>
                <p className="text-gray-400 mt-1">{challenge.description}</p>
                <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{challenge.progress} / {challenge.goal} {challenge.unit}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}></div>
                    </div>
                </div>
                <p className="text-xs text-yellow-400 mt-3">Recompensa: {challenge.reward}</p>
            </NeonCard>
        ))}
    </div>
);

const CommunityChallengesScreen: FC = () => (
    <div className="p-4 space-y-6">
        <h2 className="font-orbitron text-2xl text-green-400 mb-4">Desafios da Comunidade</h2>
        {MOCK_COMMUNITY_CHALLENGES.map((challenge: CommunityChallenge) => {
            const progressPercentage = Math.min((challenge.currentProgress / challenge.goal) * 100, 100);
            const isCompleted = progressPercentage >= 100;

            return (
                <NeonCard key={challenge.id}>
                    <h3 className="font-bold text-xl text-green-400">{challenge.title}</h3>
                    <p className="text-gray-400 mt-1">{challenge.description}</p>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Progresso da Tribo</span>
                            <span>{challenge.currentProgress.toLocaleString()} / {challenge.goal.toLocaleString()} {challenge.unit}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
                            <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end mt-3 text-xs text-gray-400">
                       <span>{challenge.contributors.toLocaleString()} corredores contribuindo</span>
                       {challenge.topContributor && <span>Top: {challenge.topContributor.name} ({challenge.topContributor.distance} km)</span>}
                    </div>
                    {isCompleted && (
                        <div className="mt-4 p-3 bg-green-500/20 border border-green-400 rounded-lg text-center">
                            <p className="font-bold text-green-300">🏆 META ATINGIDA! Parabéns, Tribo!</p>
                        </div>
                    )}
                </NeonCard>
            )
        })}
    </div>
);

const BottomNav: FC<{ active: Screen, onNavigate: (screen: Screen) => void }> = ({ active, onNavigate }) => {
    const navItems = [
        { screen: Screen.Running, icon: RunnerIcon, label: "Correr" },
        { screen: Screen.Community, icon: GlobeIcon, label: "Tribo" },
        { screen: Screen.Dashboard, icon: BrainIcon, label: "Painel" },
        { screen: Screen.Challenges, icon: TrophyIcon, label: "Desafios" },
        { screen: Screen.CommunityChallenges, icon: UsersIcon, label: "Des. Tribo" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-green-500/30 flex justify-around p-2">
            {navItems.map(item => (
                <button
                    key={item.screen}
                    onClick={() => onNavigate(item.screen)}
                    className={`flex flex-col items-center flex-1 p-1 rounded-md transition-colors duration-300 ${active === item.screen ? 'text-green-400' : 'text-gray-500 hover:text-green-400/70'}`}
                >
                    <item.icon className="w-7 h-7" />
                    <span className="text-xs mt-1">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};


// --- MAIN APP COMPONENT ---

const App: FC = () => {
    const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Home);
    const [runHistory, setRunHistory] = useState<RunData[]>(MOCK_RUN_HISTORY);
    const [showContent, setShowContent] = useState(false);
    const [isStravaConnected, setIsStravaConnected] = useState<boolean>(false);
    const [aiAnalysis, setAiAnalysis] = useState<AIOutput | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [isSyncingStrava, setIsSyncingStrava] = useState<boolean>(false);
    const [stravaSyncMessage, setStravaSyncMessage] = useState<string>('');


    useEffect(() => {
        // Simple fade-in effect for screen transitions
        setShowContent(false);
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, [activeScreen]);


    const handleNavigate = (screen: Screen) => {
        setActiveScreen(screen);
    };

    const handleRunComplete = useCallback((run: RunData) => {
        setRunHistory(prev => [run, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, []);

    const handleStravaSync = useCallback(() => {
        setIsSyncingStrava(true);
        setStravaSyncMessage('');
        
        setTimeout(() => {
            const newRuns = MOCK_STRAVA_ACTIVITIES.map(activity => {
                const distanceKm = activity.distance / 1000;
                return {
                    stravaId: activity.id,
                    distance: distanceKm,
                    time: activity.moving_time,
                    avgPace: distanceKm > 0 ? activity.moving_time / distanceKm : 0,
                    date: activity.start_date_local.split('T')[0],
                    elevationGain: activity.total_elevation_gain,
                    source: 'strava' as const,
                };
            });
            
            let uniqueNewRunsCount = 0;
            setRunHistory(prev => {
                const existingStravaIds = new Set(prev.map(r => r.stravaId).filter(Boolean));
                const uniqueNewRuns = newRuns.filter(r => !existingStravaIds.has(r.stravaId));
                uniqueNewRunsCount = uniqueNewRuns.length;
                return [...uniqueNewRuns, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            });

            if (uniqueNewRunsCount > 0) {
                setStravaSyncMessage(`${uniqueNewRunsCount} nova(s) atividade(s) sincronizada(s)!`);
            } else {
                setStravaSyncMessage('Nenhuma atividade nova encontrada.');
            }
            setIsSyncingStrava(false);
        }, 1500);

    }, []);

    const handleRequestAIAnalysis = useCallback(() => {
        setIsAnalyzing(true);
        setAiAnalysis(null);
        setTimeout(() => {
            const analysis = getAICoachAnalysis(runHistory);
            setAiAnalysis(analysis);
            setIsAnalyzing(false);
        }, 1500);
    }, [runHistory]);


    const renderScreen = () => {
        switch (activeScreen) {
            case Screen.Home:
                return <HomeScreen onNavigate={handleNavigate} />;
            case Screen.Running:
                return <RunningScreen onRunComplete={handleRunComplete}/>;
            case Screen.Community:
                return <CommunityScreen />;
            case Screen.Dashboard:
                return <DashboardScreen 
                    runHistory={runHistory} 
                    isStravaConnected={isStravaConnected} 
                    setIsStravaConnected={setIsStravaConnected}
                    onStravaSync={handleStravaSync}
                    aiAnalysis={aiAnalysis}
                    isAnalyzing={isAnalyzing}
                    onRequestAIAnalysis={handleRequestAIAnalysis}
                    isSyncingStrava={isSyncingStrava}
                    stravaSyncMessage={stravaSyncMessage}
                    />;
            case Screen.Challenges:
                return <ChallengesScreen />;
            case Screen.CommunityChallenges:
                return <CommunityChallengesScreen />;
            default:
                return <HomeScreen onNavigate={handleNavigate} />;
        }
    };
    
    return (
        <main className="bg-black min-h-screen text-gray-200">
            <div className={`transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                {renderScreen()}
            </div>
            {activeScreen !== Screen.Home && (
                 <div className="pb-20"> {/* Padding to prevent content from being hidden by nav */}
                    {/* FIX: Corrected typo from `active-screen` to `activeScreen` to pass the correct prop. */}
                    <BottomNav active={activeScreen} onNavigate={handleNavigate} />
                </div>
            )}
        </main>
    );
}

export default App;
