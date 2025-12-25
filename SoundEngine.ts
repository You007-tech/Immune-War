export class BioSoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.enabled = true;
  }

  toggle(val: boolean) {
    this.enabled = val;
    if (val && !this.ctx) this.init();
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1, startTime: number = 0) {
    if (!this.enabled || !this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration);
  }

  // 免疫阵营：明亮的节奏音效
  playImmuneAlert() {
    // 律动的双音符，象征警报与响应
    this.playTone(880, 'sine', 0.15, 0.05);
    this.playTone(1320, 'sine', 0.25, 0.03, 0.1);
  }

  // 病毒阵营：低沉且有节奏的潜伏音
  playVirusStealth() {
    // 模拟脉动的心跳或呼吸节奏
    this.playTone(110, 'triangle', 0.6, 0.08);
    this.playTone(115, 'sine', 0.6, 0.05, 0.05);
  }

  // 感染警告：不和谐的节奏下降
  playInfectionWarning() {
    const tempo = 0.12;
    // 节奏感强烈的下降音阶
    this.playTone(440, 'sawtooth', 0.3, 0.04);
    this.playTone(330, 'sawtooth', 0.3, 0.04, tempo);
    this.playTone(220, 'sawtooth', 0.4, 0.04, tempo * 2);
  }

  // 阶段转换：上升的律动
  playPhaseTransition() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // 频率扫描
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.6);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.3);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  // 胜利音效：和谐的琶音
  playVictory() {
    const arpeggio = [523.25, 659.25, 783.99, 1046.50]; // C Major
    arpeggio.forEach((freq, i) => {
      this.playTone(freq, 'sine', 0.5, 0.03, i * 0.15);
    });
  }
}

export const soundEngine = new BioSoundEngine();