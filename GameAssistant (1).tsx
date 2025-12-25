
import React, { useState, useEffect } from 'react';
import { Player, RoleType, GamePhase, GameLog, GameStats } from '../types';
import { ROLES } from '../constants';
import { soundEngine } from './SoundEngine';
import { Play, Skull, Shield, Activity, UserCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GameAssistant: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [round, setRound] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [logs, setLogs] = useState<GameLog[]>([]);
  const [stats, setStats] = useState<GameStats[]>([]);
  const [selectedForSwap, setSelectedForSwap] = useState<number[]>([]);
  const [commanderId, setCommanderId] = useState<number | null>(null);

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
    addLog("生物神经网络初始化完成。8名玩家已分配角色。", 'system');
  };

  useEffect(() => {
    if (players.length === 0) initGame();
  }, []);

  const startGame = () => {
    soundEngine.playPhaseTransition();
    setRound(1);
    setPhase(GamePhase.ROUND_START);
    const randomCommander = Math.floor(Math.random() * 8);
    setCommanderId(randomCommander);
    addLog(`=== 战斗开始：第一轮监测开启 ===`, 'alert');
    addLog(`本轮“指挥者”为：玩家 ${randomCommander + 1}`, 'system');
    updateStats(1);
  };

  const nextPhase = () => {
    soundEngine.playPhaseTransition();
    if (phase === GamePhase.ROUND_START) {
      setPhase(GamePhase.SEAT_SWAP);
      soundEngine.playVirusStealth(); 
      addLog("阶段一【细胞迁移与免疫巡逻】：指挥者提议换座，请全员表决方案。", 'action');
    } else if (phase === GamePhase.SEAT_SWAP) {
      setPhase(GamePhase.RESOLUTION);
      addLog("阶段二【特异性识别与应答】：系统正在结算邻座接触...", 'action');
      processInteractions();
    } else if (phase === GamePhase.RESOLUTION) {
      setPhase(GamePhase.ROUND_END);
      updateStats(round);
      checkVictory();
    } else if (phase === GamePhase.ROUND_END) {
      if (commanderId !== null) {
        setCommanderId((commanderId + 1) % 8);
      }
      setRound(r => r + 1);
      setPhase(GamePhase.ROUND_START);
      addLog(`=== 第 ${round + 1} 轮：机体稳态扫描 ===`, 'alert');
    }
  };

  const checkVictory = () => {
    const virusCount = players.filter(p => p.role === RoleType.VIRUS).length;
    addLog(`阶段三【信息公布】：当前场上病毒总数为 ${virusCount} 个。`, 'system');
    if (virusCount === 0) {
      soundEngine.playVictory();
      addLog("🎉 最终胜利：病毒载量清零！机体免疫系统获得完全胜利。", 'alert');
    } else if (virusCount >= 5) {
      addLog("⚠️ 失败：病毒扩散失控！机体进入多脏器衰竭阶段。", 'alert');
      soundEngine.playInfectionWarning();
    }
  };

  const updateStats = (currentRound: number) => {
    const virusCount = players.filter(p => p.role === RoleType.VIRUS).length;
    const immuneCount = players.filter(p => p.role === RoleType.IMMUNE_CELL).length;
    const civilianCount = players.filter(p => p.role === RoleType.CIVILIAN_CELL).length;
    
    setStats(prev => [...prev, {
      round: currentRound,
      virusCount,
      immuneCellCount: immuneCount,
      civilianCount
    }]);
  };

  const executeSwap = () => {
    if (selectedForSwap.length !== 2) return;
    const p1 = players.find(p => p.id === selectedForSwap[0]);
    const p2 = players.find(p => p.id === selectedForSwap[1]);
    
    if (p1 && p2) {
      const p1Pair = p1.pairId;
      const p2Pair = p2.pairId;
      setPlayers(players.map(p => {
        if (p.id === p1.id) return { ...p, pairId: p2Pair };
        if (p.id === p2.id) return { ...p, pairId: p1Pair };
        return p;
      }));
      addLog(`执行方案：${p1.name} 与 ${p2.name} 交换座位。`, 'action');
      setSelectedForSwap([]);
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
        setTimeout(() => cureVirus(virus.id), 800);
      }
    });
  };

  const cureVirus = (playerId: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, role: RoleType.CIVILIAN_CELL, immunityExpiresRound: round + 1 };
      }
      return p;
    }));
    const pName = players.find(p => p.id === playerId)?.name;
    addLog(`【特异性治愈】免疫细胞清除了 ${pName} 的病毒。该玩家获得一轮免疫力。`, 'action');
  };

  const infectPlayer = (targetId: number) => {
    const target = players.find(p => p.id === targetId);
    if (!target) return;
    if (target.immunityExpiresRound >= round) {
      addLog(`【免疫记忆】${target.name} 具有免疫力，无法被再次感染。`, 'alert');
      return;
    }
    soundEngine.playInfectionWarning();
    setPlayers(prev => prev.map(p => {
      if (p.id === targetId) return { ...p, role: RoleType.VIRUS };
      return p;
    }));
    addLog(`【警报：新感染】${target.name} 被病毒感染，身份转变为病毒。`, 'alert');
  };

  const handleSwapSelect = (id: number) => {
    if (selectedForSwap.includes(id)) {
      setSelectedForSwap(prev => prev.filter(i => i !== id));
    } else {
      if (selectedForSwap.length < 2) {
        setSelectedForSwap(prev => [...prev, id]);
        soundEngine.playPhaseTransition();
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-bio-primary/20 shadow-2xl relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} className="text-bio-primary animate-pulse" />
                <span className="text-xs font-black text-bio-primary uppercase tracking-[0.2em]">实时仿真模拟</span>
              </div>
              <h2 className="text-4xl font-black text-white">{getPhaseLabel(phase)}</h2>
              {commanderId !== null && phase !== GamePhase.SETUP && (
                <div className="flex items-center gap-2 mt-2 text-yellow-500 font-bold">
                  <UserCircle size={18} />
                  <span>当前指挥者：{players[commanderId]?.name}</span>
                </div>
              )}
            </div>
            <div className="text-right">
               <div className="text-5xl font-black text-slate-800">R0{round}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(id => (
              <div key={id} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-5">
                <div className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest border-b border-slate-700 pb-2">区域 {id}</div>
                <div className="flex gap-4">
                  {players.filter(p => p.pairId === id).map(p => (
                    <div 
                      key={p.id}
                      onClick={() => phase === GamePhase.SEAT_SWAP && handleSwapSelect(p.id)}
                      className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all duration-300 relative
                        ${selectedForSwap.includes(p.id) ? 'bg-bio-primary/20 border-bio-primary' : 'bg-slate-950 border-slate-800'}
                      `}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center
                          ${p.role === RoleType.IMMUNE_CELL ? 'bg-blue-500/10 text-blue-400' : 
                            p.role === RoleType.VIRUS ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-500'}
                        `}>
                          {p.role === RoleType.IMMUNE_CELL ? <Shield size={20} /> : 
                           p.role === RoleType.VIRUS ? <Skull size={20} /> : <div className="font-black text-xs">CELL</div>}
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 truncate w-full">{p.name}</span>
                        {p.immunityExpiresRound >= round && round > 0 && <div className="absolute top-0 right-0 p-1"><Shield size={10} className="text-green-500" /></div>}
                        {p.id === commanderId && <div className="text-[8px] bg-yellow-600 px-1 rounded text-white font-bold">指挥者</div>}
                        {phase === GamePhase.RESOLUTION && p.role === RoleType.CIVILIAN_CELL && players.filter(partner => partner.pairId === id && partner.id !== p.id)[0]?.role === RoleType.VIRUS && (
                          <button onClick={(e) => { e.stopPropagation(); infectPlayer(p.id); }} className="mt-2 text-[8px] bg-red-600 text-white px-2 py-1 rounded font-bold">感染</button>
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
              <button onClick={startGame} className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-lg transition-all">启动协议</button>
            ) : (
              <div className="flex gap-4">
                {phase === GamePhase.SEAT_SWAP && selectedForSwap.length === 2 && (
                  <button onClick={executeSwap} className="px-6 py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-2xl font-black">确认方案</button>
                )}
                <button onClick={nextPhase} className="px-8 py-4 bg-bio-primary hover:bg-sky-500 text-white rounded-2xl font-black flex items-center gap-3">
                  {phase === GamePhase.ROUND_END ? "开启下一轮" : "下一阶段"} <Play size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {phase !== GamePhase.SETUP && (
          <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 h-[350px]">
             <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest">流行病学趋势</h3>
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={stats}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                 <XAxis dataKey="round" stroke="#475569" />
                 <YAxis stroke="#475569" />
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                 <Line type="monotone" dataKey="virusCount" name="病毒" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
                 <Line type="monotone" dataKey="immuneCellCount" name="免疫" stroke="#0ea5e9" strokeWidth={2} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-[2rem] border border-slate-800 flex flex-col h-[750px] overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h3 className="font-black text-white text-xs tracking-widest uppercase">作战日志终端</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {logs.map((log, idx) => (
            <div key={idx} className={`p-4 rounded-xl border-l-4 ${
              log.type === 'alert' ? 'border-red-500 bg-red-500/5' :
              log.type === 'action' ? 'border-bio-primary bg-bio-primary/5' :
              'border-slate-700 bg-slate-800/30'
            }`}>
              <div className="flex justify-between text-[10px] mb-1 font-bold">
                <span className="text-slate-500">{log.timestamp}</span>
                <span className="text-bio-primary">R{log.round}</span>
              </div>
              <div className="text-sm text-slate-200 font-bold leading-relaxed">{log.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getPhaseLabel = (phase: GamePhase) => {
  switch (phase) {
    case GamePhase.SETUP: return "系统部署";
    case GamePhase.ROUND_START: return "稳态监控";
    case GamePhase.SEAT_SWAP: return "细胞迁移";
    case GamePhase.RESOLUTION: return "识别结算";
    case GamePhase.ROUND_END: return "结果分析";
    default: return "未就绪";
  }
};

export default GameAssistant;
