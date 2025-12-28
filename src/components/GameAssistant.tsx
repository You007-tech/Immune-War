import React, { useState, useEffect } from 'react';
import { Player, RoleType, GamePhase, GameLog, GameStats, GameMode } from '../types';
import { ROLES, ADVANCED_RULES } from '../constants';
import { soundEngine } from './SoundEngine';
import { Play, Skull, Shield, Activity, UserCircle, Zap, AlertTriangle, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GameAssistantProps {
  mode: GameMode;
}

const GameAssistant: React.FC<GameAssistantProps> = ({ mode }) => {
  const isAdvanced = mode === 'ADVANCED';
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [round, setRound] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [logs, setLogs] = useState<GameLog[]>([]);
  const [stats, setStats] = useState<GameStats[]>([]);
  const [selectedForSwap, setSelectedForSwap] = useState<number[]>([]);
  const [commanderId, setCommanderId] = useState<number | null>(null);
  
  // 进阶模式状态
  const [currentEventCard, setCurrentEventCard] = useState<typeof ADVANCED_RULES.eventCards[0] | null>(null);
  const [swapCountThisRound, setSwapCountThisRound] = useState(0);
  const [revealedPlayerId, setRevealedPlayerId] = useState<number | null>(null);

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
        id: i,
        pairId: Math.floor(i / 2) + 1,
        name: `玩家 ${i + 1}`,
        role: shuffledRoles[i],
        immunityExpiresRound: 0,
        statusEffects: []
      });
    }
    setPlayers(initialPlayers);
    addLog(`生物神经网络初始化完成。${isAdvanced ? '【进阶模式】已激活' : '【基础模式】已激活'}。`, 'system');
  };

  useEffect(() => {
    initGame();
  }, [mode]);

  const startGame = () => {
    soundEngine.playPhaseTransition();
    setRound(1);
    setPhase(GamePhase.ROUND_START);
    const randomCommander = Math.floor(Math.random() * 8);
    setCommanderId(randomCommander);
    addLog(`=== 战斗开始：第一轮监测开启 ===`, 'alert');
    addLog(`本轮“指挥者”为：玩家 ${randomCommander + 1}`, 'system');
    
    if (isAdvanced) {
      triggerRandomEvent();
    }
    updateStats(1);
  };

  const triggerRandomEvent = () => {
    const card = ADVANCED_RULES.eventCards[Math.floor(Math.random() * ADVANCED_RULES.eventCards.length)];
    setCurrentEventCard(card);
    addLog(`【事件触发：${card.name}】${card.effect}`, 'alert');
    
    // 立即生效的事件：药物治疗
    if (card.id === 'medication') {
      const virusPlayers = players.filter(p => p.role === RoleType.VIRUS);
      if (virusPlayers.length > 0) {
        const target = virusPlayers[Math.floor(Math.random() * virusPlayers.length)];
        cureVirus(target.id);
      } else {
        addLog("机体现状：未发现可治疗的病毒载量。", 'system');
      }
    }
  };

  const nextPhase = () => {
    soundEngine.playPhaseTransition();
    if (phase === GamePhase.ROUND_START) {
      setPhase(GamePhase.SEAT_SWAP);
      setSwapCountThisRound(0);
      setRevealedPlayerId(null);
      soundEngine.playVirusStealth(); 
      addLog("阶段一【细胞迁移】：指挥者提议换座方案。", 'action');
    } else if (phase === GamePhase.SEAT_SWAP) {
      setPhase(GamePhase.RESOLUTION);
      addLog("阶段二【识别结算】：结算接触后果...", 'action');
      processInteractions();
    } else if (phase === GamePhase.RESOLUTION) {
      setPhase(GamePhase.ROUND_END);
      updateStats(round);
      checkVictory();
    } else if (phase === GamePhase.ROUND_END) {
      // 检查延迟感染
      if (isAdvanced) {
        setPlayers(prev => prev.map(p => {
          if (p.pendingInfectionRound === round) {
            addLog(`【潜伏结束】玩家 ${p.id + 1} 的病毒转换现已生效。`, 'alert');
            return { ...p, role: RoleType.VIRUS, pendingInfectionRound: undefined };
          }
          return p;
        }));
      }

      if (commanderId !== null) setCommanderId((commanderId + 1) % 8);
      const nextRound = round + 1;
      setRound(nextRound);
      setPhase(GamePhase.ROUND_START);
      addLog(`=== 第 ${nextRound} 轮扫描开启 ===`, 'alert');
      if (isAdvanced) {
        triggerRandomEvent();
      }
    }
  };

  const checkVictory = () => {
    const virusCount = players.filter(p => p.role === RoleType.VIRUS).length;
    addLog(`阶段三【信息公布】：场上活性病毒总数为 ${virusCount}。`, 'system');
    if (virusCount === 0) {
      soundEngine.playVictory();
      addLog("🎉 最终胜利：病毒载量清零！机体免疫系统胜利。", 'alert');
    } else if (virusCount >= 5) {
      addLog("⚠️ 失败：病毒扩散失控！", 'alert');
      soundEngine.playInfectionWarning();
    }
  };

  const updateStats = (currentRound: number) => {
    const virusCount = players.filter(p => p.role === RoleType.VIRUS).length;
    const immuneCount = players.filter(p => p.role === RoleType.IMMUNE_CELL).length;
    const civilianCount = players.filter(p => p.role === RoleType.CIVILIAN_CELL).length;
    setStats(prev => [...prev, { round: currentRound, virusCount, immuneCellCount: immuneCount, civilianCount }]);
  };

  const executeSwap = () => {
    if (selectedForSwap.length !== 2) return;
    const p1 = players.find(p => p.id === selectedForSwap[0]);
    const p2 = players.find(p => p.id === selectedForSwap[1]);
    if (p1 && p2) {
      const p1Pair = p1.pairId;
      const p2Pair = p2.pairId;
      setPlayers(prev => prev.map(p => {
        if (p.id === p1.id) return { ...p, pairId: p2Pair };
        if (p.id === p2.id) return { ...p, pairId: p1Pair };
        return p;
      }));
      addLog(`执行迁移：${p1.name} 与 ${p2.name} 交换位置。`, 'action');
      setSelectedForSwap([]);
      setSwapCountThisRound(prev => prev + 1);
      soundEngine.playPhaseTransition();
    }
  };

  const processInteractions = () => {
    const pairs: Record<number, Player[]> = { 1: [], 2: [], 3: [], 4: [] };
    players.forEach(p => pairs[p.pairId].push(p));
    Object.values(pairs).forEach((pairPlayers) => {
      if (pairPlayers.length !== 2) return;
      const immune = pairPlayers.find(p => p.role === RoleType.IMMUNE_CELL);
      const virus = pairPlayers.find(p => p.role === RoleType.VIRUS);
      if (immune && virus) {
        soundEngine.playImmuneAlert();
        cureVirus(virus.id);
      }
    });
  };

  const cureVirus = (playerId: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) return { ...p, role: RoleType.CIVILIAN_CELL, immunityExpiresRound: round + 1 };
      return p;
    }));
    const pName = players.find(p => p.id === playerId)?.name;
    addLog(`【特异性治愈】免疫系统成功清除了 ${pName} 携带的病毒。`, 'action');
  };

  const infectPlayer = (targetId: number) => {
    const target = players.find(p => p.id === targetId);
    if (!target) return;
    if (target.immunityExpiresRound >= round) {
       addLog(`【免疫记忆】${target.name} 尚处保护期，无法被感染。`, 'alert');
       return;
    }
    
    soundEngine.playInfectionWarning();
    
    if (isAdvanced && currentEventCard?.id === 'latency') {
      setPlayers(prev => prev.map(p => {
        if (p.id === targetId) return { ...p, pendingInfectionRound: round };
        return p;
      }));
      addLog(`【新感染（潜伏）】病毒已侵入 ${target.name}，转换将在下一轮生效。`, 'alert');
    } else {
      setPlayers(prev => prev.map(p => {
        if (p.id === targetId) return { ...p, role: RoleType.VIRUS };
        return p;
      }));
      addLog(`【新感染警报】${target.name} 已被感染。`, 'alert');
    }
  };

  const handleReveal = (pid: number) => {
    if (revealedPlayerId === null && isAdvanced && currentEventCard?.id === 'checkup') {
      setRevealedPlayerId(pid);
      addLog(`【身份核实】指挥者确认了玩家 ${pid + 1} 的身份。`, 'action');
    }
  };

  const maxSwaps = (isAdvanced && currentEventCard?.id === 'inflammation') ? 2 : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-bio-primary/20 shadow-2xl relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${isAdvanced ? 'bg-rose-600 text-white' : 'bg-bio-primary/20 text-bio-primary'}`}>
                  {isAdvanced ? 'Advanced Mode 进阶模式' : 'Basic Mode 基础模式'}
                </span>
                {isAdvanced && currentEventCard && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-500 animate-pulse">
                    <Zap size={10} /> {currentEventCard.name}
                  </span>
                )}
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{getPhaseLabel(phase)}</h2>
              {commanderId !== null && phase !== GamePhase.SETUP && (
                <div className="text-yellow-500 font-bold mt-2 flex items-center gap-2">
                  <UserCircle size={18} />
                  <span>当前指挥者：{players[commanderId]?.name}</span>
                </div>
              )}
            </div>
            <div className="text-5xl font-black text-slate-800">R{round < 10 ? `0${round}` : round}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(id => (
              <div key={id} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-5">
                <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest border-b border-slate-700 pb-2">区域 {id}</div>
                <div className="flex gap-4">
                  {players.filter(p => p.pairId === id).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        if (phase === GamePhase.SEAT_SWAP) {
                          if (selectedForSwap.includes(p.id)) {
                            setSelectedForSwap(prev => prev.filter(i => i !== p.id));
                          } else if (selectedForSwap.length < 2) {
                            setSelectedForSwap(prev => [...prev, p.id]);
                          }
                        } else if (isAdvanced && currentEventCard?.id === 'checkup' && phase !== GamePhase.SETUP) {
                          handleReveal(p.id);
                        }
                      }}
                      className={`flex-1 p-4 rounded-xl border transition-all cursor-pointer relative 
                        ${selectedForSwap.includes(p.id) ? 'border-bio-primary bg-bio-primary/10' : 'border-slate-800 bg-slate-950'}
                        ${revealedPlayerId === p.id ? 'ring-2 ring-amber-500' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          p.role === RoleType.IMMUNE_CELL ? 'bg-blue-500/10 text-blue-400' : 
                          p.role === RoleType.VIRUS ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {p.role === RoleType.IMMUNE_CELL ? <Shield size={16} /> : 
                           p.role === RoleType.VIRUS ? <Skull size={16} /> : 
                           <div className="text-[8px] font-bold">CELL</div>}
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 truncate w-full">{p.name}</span>
                        {p.immunityExpiresRound >= round && round > 0 && <Shield size={10} className="text-green-500 absolute top-2 right-2" />}
                        {p.pendingInfectionRound === round && <Activity size={10} className="text-amber-500 absolute top-2 left-2 animate-ping" />}
                        
                        {revealedPlayerId === p.id && (
                          <div className="absolute -top-1 -right-1 bg-amber-500 p-0.5 rounded-full shadow-lg">
                            <Eye size={10} className="text-white" />
                          </div>
                        )}

                        {phase === GamePhase.RESOLUTION && p.role === RoleType.CIVILIAN_CELL && 
                          players.some(partner => partner.pairId === id && partner.id !== p.id && partner.role === RoleType.VIRUS) && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); infectPlayer(p.id); }} 
                            className="text-[8px] bg-red-600 px-2 py-1 rounded text-white font-bold mt-1 hover:bg-red-500"
                          >
                            感染
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {phase === GamePhase.SEAT_SWAP && (
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  迁移次数: {swapCountThisRound} / {maxSwaps}
                </span>
              )}
            </div>
            <div className="flex gap-4">
              {phase === GamePhase.SETUP ? (
                <button onClick={startGame} className="px-8 py-4 bg-green-600 rounded-2xl font-black hover:bg-green-500 transition-all active:scale-95 shadow-lg shadow-green-900/20">启动仿真协议</button>
              ) : (
                <div className="flex gap-4">
                  {phase === GamePhase.SEAT_SWAP && selectedForSwap.length === 2 && swapCountThisRound < maxSwaps && (
                    <button onClick={executeSwap} className="px-6 py-4 bg-yellow-600 rounded-2xl font-black hover:bg-yellow-500 transition-all active:scale-95">确认迁移</button>
                  )}
                  <button onClick={nextPhase} className="px-8 py-4 bg-bio-primary rounded-2xl font-black flex items-center gap-3 hover:bg-sky-500 transition-all active:scale-95 shadow-lg shadow-sky-900/20">
                    {phase === GamePhase.ROUND_END ? "开启下轮稳态扫描" : "进入下一阶段"} <Play size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isAdvanced && currentEventCard && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex items-start gap-4 animate-fade-in shadow-xl shadow-amber-900/10">
            <Zap className="text-amber-500 mt-1 shrink-0" size={24} />
            <div>
              <h4 className="font-black text-amber-500 uppercase tracking-tighter text-lg">{currentEventCard.name} 已生效</h4>
              <p className="text-slate-300 text-sm font-medium leading-relaxed">{currentEventCard.effect}</p>
              <p className="text-slate-500 text-[10px] italic mt-2">机理分析：{currentEventCard.bioLink}</p>
            </div>
          </div>
        )}

        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 h-[300px] shadow-xl">
           <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">流行病学趋势监控</div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="round" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="virusCount" name="病毒载量" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="immuneCellCount" name="免疫防御力" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-slate-900 rounded-[2rem] border border-slate-800 flex flex-col h-[750px] overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950 font-black text-xs tracking-[0.2em] text-slate-500 flex items-center gap-2">
          <Activity size={14} className="text-bio-primary" /> 作战日志终端
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {logs.length === 0 && <div className="text-slate-600 text-xs italic text-center mt-10">等待系统日志流同步...</div>}
          {logs.map((log, i) => (
            <div key={i} className={`text-sm p-3 rounded-xl border-l-4 shadow-sm transition-all animate-fade-in ${log.type === 'alert' ? 'border-red-500 bg-red-500/5' : 'border-bio-primary bg-bio-primary/5'}`}>
              <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-bold">
                <span>{log.timestamp}</span>
                <span className="text-bio-primary">ROUND {log.round}</span>
              </div>
              <div className="text-slate-200 font-medium leading-relaxed">{log.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getPhaseLabel = (phase: GamePhase) => {
  switch (phase) {
    case GamePhase.SETUP: return "系统部署 DEPLOYMENT";
    case GamePhase.ROUND_START: return "稳态监控 MONITORING";
    case GamePhase.SEAT_SWAP: return "细胞迁移 MIGRATION";
    case GamePhase.RESOLUTION: return "识别结算 RESPONSE";
    case GamePhase.ROUND_END: return "结果分析 ANALYSIS";
    default: return "未就绪 UNREADY";
  }
};

export default GameAssistant;
