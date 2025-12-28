import React, { useState, useEffect } from 'react';
import { Player, RoleType, GamePhase, GameLog, GameStats, GameMode } from '../types';
import { ROLES, ADVANCED_RULES } from '../constants';
import { soundEngine } from './SoundEngine';
import { Play, Skull, Shield, Activity, UserCircle, Zap, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GameAssistantProps {
  mode: GameMode;
}

function GameAssistant({ mode }: GameAssistantProps) {
  const isAdvanced = mode === GameMode.ADVANCED;
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [round, setRound] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [logs, setLogs] = useState<GameLog[]>([]);
  const [stats, setStats] = useState<GameStats[]>([]);
  const [selectedForSwap, setSelectedForSwap] = useState<string[]>([]);
  const [commanderId, setCommanderId] = useState<string | null>(null);
  
  const [currentEventCard, setCurrentEventCard] = useState<any>(null);
  const [swapCountThisRound, setSwapCountThisRound] = useState(0);
  const [revealedPlayerId, setRevealedPlayerId] = useState<string | null>(null);

  const addLog = (message: string, type: 'action' | 'system' | 'alert' = 'system') => {
    setLogs(prev => [{
      round,
      message,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      type
    }, ...prev]);
  };

  const initGame = () => {
    const rolesConfig = [
      RoleType.IMMUNE_CELL,
      RoleType.VIRUS, RoleType.VIRUS,
      RoleType.CIVILIAN_CELL, RoleType.CIVILIAN_CELL, RoleType.CIVILIAN_CELL, RoleType.CIVILIAN_CELL, RoleType.CIVILIAN_CELL
    ];
    const shuffledRoles = [...rolesConfig].sort(() => Math.random() - 0.5);

    const initialPlayers: Player[] = [];
    for (let i = 0; i < 8; i++) {
      initialPlayers.push({
        id: String(i),
        pairId: Math.floor(i / 2) + 1,
        name: `玩家 ${i + 1}`,
        role: shuffledRoles[i],
        immunityExpiresRound: 0,
        statusEffects: []
      });
    }
    setPlayers(initialPlayers);
    addLog(`系统初始化完成。${isAdvanced ? '【进阶模式】已激活' : '【基础模式】已激活'}。`, 'system');
  };

  useEffect(() => {
    initGame();
  }, [mode]);

  const startGame = () => {
    soundEngine.playPhaseTransition();
    setRound(1);
    setPhase(GamePhase.ROUND_START);
    const randomIdx = Math.floor(Math.random() * 8);
    setCommanderId(String(randomIdx));
    addLog(`=== 监测开启：第一轮探测 ===`, 'alert');
    if (isAdvanced) triggerRandomEvent();
    updateStats(1);
  };

  const triggerRandomEvent = () => {
    const card = ADVANCED_RULES.eventCards[Math.floor(Math.random() * ADVANCED_RULES.eventCards.length)];
    setCurrentEventCard(card);
    addLog(`【事件触发：${card.name}】${card.effect}`, 'alert');
    if (card.id === 'medication') {
      const virusPlayers = players.filter(p => p.role === RoleType.VIRUS);
      if (virusPlayers.length > 0) cureVirus(virusPlayers[0].id);
    }
  };

  const nextPhase = () => {
    soundEngine.playPhaseTransition();
    if (phase === GamePhase.ROUND_START) {
      setPhase(GamePhase.SEAT_SWAP);
      setSwapCountThisRound(0);
      setRevealedPlayerId(null);
      addLog("阶段一【细胞迁移】：指挥者提议换座方案。", 'action');
    } else if (phase === GamePhase.SEAT_SWAP) {
      setPhase(GamePhase.RESOLUTION);
      processInteractions();
    } else if (phase === GamePhase.RESOLUTION) {
      setPhase(GamePhase.ROUND_END);
      updateStats(round);
      checkVictory();
    } else if (phase === GamePhase.ROUND_END) {
      if (isAdvanced) {
        setPlayers(prev => prev.map(p => p.pendingInfectionRound === round ? { ...p, role: RoleType.VIRUS, pendingInfectionRound: undefined } : p));
      }
      if (commanderId !== null) setCommanderId(String((Number(commanderId) + 1) % 8));
      const nextR = round + 1;
      setRound(nextR);
      setPhase(GamePhase.ROUND_START);
      if (isAdvanced) triggerRandomEvent();
    }
  };

  const checkVictory = () => {
    const virusCount = players.filter(p => p.role === RoleType.VIRUS).length;
    addLog(`阶段三【信息通报】：当前病毒总数为 ${virusCount}。`, 'system');
    if (virusCount === 0) {
      soundEngine.playVictory();
      addLog("🎉 最终胜利：机体免疫系统全胜。", 'alert');
    } else if (virusCount >= 4) {
      addLog("⚠️ 警报：病毒载量超限，病毒阵营胜利。", 'alert');
    }
  };

  const updateStats = (r: number) => {
    const v = players.filter(p => p.role === RoleType.VIRUS).length;
    setStats(prev => [...prev, { round: r, virusCount: v, immuneCellCount: 1, civilianCount: 7 - v }]);
  };

  const executeSwap = () => {
    if (selectedForSwap.length !== 2) return;
    const [id1, id2] = selectedForSwap;
    const p1 = players.find(p => p.id === id1);
    const p2 = players.find(p => p.id === id2);
    if (p1 && p2) {
      const pr1 = p1.pairId;
      const pr2 = p2.pairId;
      setPlayers(prev => prev.map(p => p.id === id1 ? { ...p, pairId: pr2 } : p.id === id2 ? { ...p, pairId: pr1 } : p));
      addLog(`迁移执行：${p1.name} 与 ${p2.name} 交换位置。`, 'action');
      setSelectedForSwap([]);
      setSwapCountThisRound(prev => prev + 1);
    }
  };

  const processInteractions = () => {
    const pairs: Record<number, Player[]> = { 1: [], 2: [], 3: [], 4: [] };
    players.forEach(p => pairs[p.pairId].push(p));
    Object.values(pairs).forEach(pair => {
      if (pair.length !== 2) return;
      const immune = pair.find(p => p.role === RoleType.IMMUNE_CELL);
      const virus = pair.find(p => p.role === RoleType.VIRUS);
      if (immune && virus) cureVirus(virus.id);
    });
  };

  const cureVirus = (id: string) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, role: RoleType.CIVILIAN_CELL, immunityExpiresRound: round + 1 } : p));
    addLog(`【特异性治愈】成功清除了病毒携带者。`, 'action');
  };

  const infectPlayer = (id: string) => {
    const target = players.find(p => p.id === id);
    if (!target || target.immunityExpiresRound >= round) return;
    if (isAdvanced && currentEventCard?.id === 'latency') {
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, pendingInfectionRound: round } : p));
      addLog(`【病毒潜伏】感染成功，下一回合生效。`, 'alert');
    } else {
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, role: RoleType.VIRUS } : p));
      addLog(`【感染警报】病毒已扩散。`, 'alert');
    }
  };

  const maxSwaps = (isAdvanced && currentEventCard?.id === 'inflammation') ? 2 : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-bio-primary/20 relative shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
               <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${isAdvanced ? 'bg-rose-600' : 'bg-bio-primary/20 text-bio-primary'}`}>
                  {isAdvanced ? 'Advanced' : 'Basic'}
                </span>
              </div>
              <h2 className="text-4xl font-black text-white">{getPhaseLabel(phase)}</h2>
              {commanderId && phase !== GamePhase.SETUP && <div className="text-yellow-500 font-bold mt-2">指挥者：{players.find(p => p.id === commanderId)?.name}</div>}
            </div>
            <div className="text-5xl font-black text-slate-800">R{round < 10 ? `0${round}` : round}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(pid => (
              <div key={pid} className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 shadow-inner">
                <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest border-b border-slate-700/50 pb-2">区域 {pid}</div>
                <div className="flex gap-4">
                  {players.filter(p => p.pairId === pid).map(p => (
                    <div key={p.id} onClick={() => {
                      if (phase === GamePhase.SEAT_SWAP) {
                        if (selectedForSwap.includes(p.id)) setSelectedForSwap(s => s.filter(i => i !== p.id));
                        else if (selectedForSwap.length < 2) setSelectedForSwap(s => [...s, p.id]);
                      } else if (isAdvanced && currentEventCard?.id === 'checkup') {
                        setRevealedPlayerId(p.id);
                      }
                    }} className={`flex-1 p-4 rounded-xl border transition-all duration-300 relative cursor-pointer ${selectedForSwap.includes(p.id) ? 'border-bio-primary bg-bio-primary/10 shadow-[0_0_15px_rgba(14,165,233,0.2)]' : 'border-slate-800 bg-slate-950 hover:bg-slate-900'}`}>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ${selectedForSwap.includes(p.id) ? 'scale-110' : ''} ${p.role === RoleType.IMMUNE_CELL ? 'bg-blue-500/10 text-blue-400' : p.role === RoleType.VIRUS ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-500'}`}>
                          {p.role === RoleType.IMMUNE_CELL ? <Shield size={18} /> : p.role === RoleType.VIRUS ? <Skull size={18} /> : <div className="text-[8px] font-bold">CELL</div>}
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 tracking-tight">{p.name}</span>
                        {p.immunityExpiresRound >= round && round > 0 && <Shield size={10} className="text-green-500 absolute top-2 right-2 drop-shadow-sm" />}
                        {revealedPlayerId === p.id && <Eye size={10} className="text-amber-500 absolute top-2 left-2 animate-pulse" />}
                        {phase === GamePhase.RESOLUTION && p.role === RoleType.CIVILIAN_CELL && players.some(pt => pt.pairId === pid && pt.id !== p.id && pt.role === RoleType.VIRUS) && (
                          <button onClick={(e) => { e.stopPropagation(); infectPlayer(p.id); }} className="text-[8px] bg-red-600 hover:bg-red-500 px-2 py-1 rounded mt-1 font-black transition-colors">感染</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end gap-4">
            {phase === GamePhase.SETUP ? (
              <button onClick={startGame} className="px-10 py-5 bg-green-600 hover:bg-green-500 rounded-2xl font-black shadow-lg shadow-green-900/20 transition-all active:scale-95">启动仿真协议</button>
            ) : (
              <div className="flex gap-4">
                {selectedForSwap.length === 2 && swapCountThisRound < maxSwaps && <button onClick={executeSwap} className="px-6 py-4 bg-yellow-600 hover:bg-yellow-500 rounded-2xl font-black shadow-lg shadow-yellow-900/20 transition-all active:scale-95">确认迁移方案</button>}
                <button onClick={nextPhase} className="px-8 py-4 bg-bio-primary hover:bg-sky-500 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-sky-900/20 transition-all active:scale-95">进入下阶段 <Play size={18} /></button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 h-[250px] shadow-xl">
          <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">机体感染率实时监控</div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="round" stroke="#475569" fontSize={10} />
              <YAxis stroke="#475569" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
              <Line type="monotone" dataKey="virusCount" name="病毒载量" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-slate-900 rounded-[2rem] border border-slate-800 h-[750px] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-800 font-black text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2 bg-slate-950/50">
          <Activity size={14} className="text-bio-primary" /> 终端作战日志
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-950/10">
          {logs.length === 0 && <div className="text-slate-600 text-xs italic text-center mt-10">等待系统流同步...</div>}
          {logs.map((log, i) => (
            <div key={i} className={`text-[13px] p-3 rounded-xl border-l-4 shadow-sm animate-fade-in transition-all ${log.type === 'alert' ? 'border-red-500 bg-red-500/5' : 'border-bio-primary bg-bio-primary/5'}`}>
              <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-tighter">
                <span>{log.timestamp}</span>
                <span className="text-bio-highlight">ROUND {log.round}</span>
              </div>
              <div className="text-slate-200 font-medium leading-relaxed">{log.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getPhaseLabel = (p: GamePhase) => {
  switch (p) {
    case GamePhase.SETUP: return "系统部署 DEPLOY";
    case GamePhase.ROUND_START: return "稳态监控 MONITOR";
    case GamePhase.SEAT_SWAP: return "细胞迁移 MIGRATION";
    case GamePhase.RESOLUTION: return "识别结算 RESPONSE";
    case GamePhase.ROUND_END: return "结果分析 ANALYZE";
    default: return "未就绪 UNREADY";
  }
};

export default GameAssistant;
