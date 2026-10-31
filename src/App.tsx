/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface Stage {
  t: string;
  b: string;
  c: string;
}

interface Look {
  c0: [number, number, number];
  c1: [number, number, number];
  c2: [number, number, number];
  glow: [number, number, number];
  gI: number;
  freq: number;
  warp: number;
  cells: number;
  gas: number;
  shell: number;
  boil: number;
}

const STAGES: Stage[] = [
  { t: '4,6 bilhões de anos atrás', b: 'Nebulosa solar', c: 'Uma nuvem fria colapsa para o centro' },
  { t: '4,57 bilhões de anos atrás', b: 'Protoestrela', c: 'A gravidade aquece o jovem núcleo' },
  { t: '4,5 bilhões de anos atrás', b: 'Ignição', c: 'O hidrogênio começa a queimar' },
  { t: 'Hoje', b: 'O Sol', c: 'Na metade de sua vida' },
  { t: '1 bilhão de anos no futuro', b: 'Sol mais brilhante', c: 'Os oceanos evaporam completamente' },
  { t: '5 bilhões de anos no futuro', b: 'Subgigante', c: 'O núcleo esgota seu combustível' },
  { t: '7,6 bilhões de anos no futuro', b: 'Gigante vermelha', c: 'O Sol engole Mercúrio' },
  { t: '7,7 bilhões de anos no futuro', b: 'Flash de hélio', c: 'O núcleo entra em nova ignição' },
  { t: '7,8 bilhões de anos no futuro', b: 'Nebulosa planetária', c: 'As camadas externas se dissipam' },
  { t: '8 bilhões de anos no futuro', b: 'Anã branca', c: 'Uma brasa do tamanho da Terra' },
];

const LOOK: Look[] = [
  { c0: [0.05, 0.01, 0.1],   c1: [0.62, 0.12, 0.42], c2: [1.9, 0.85, 0.5],  glow: [0.8, 0.25, 0.6],  gI: 0.22, freq: 2.6, warp: 1.9, cells: 0,    gas: 1,    shell: 0, boil: 1 },
  { c0: [0.015, 0.004, 0],  c1: [0.62, 0.05, 0.01], c2: [3, 1.1, 0.15],   glow: [1.3, 0.2, 0.04],  gI: 0.28, freq: 3.1, warp: 1.2, cells: 1,    gas: 0,    shell: 0, boil: 0.7 },
  { c0: [0.5, 0.05, 0],     c1: [1.7, 0.48, 0.03],  c2: [3.2, 2, 0.55],    glow: [1.6, 0.5, 0.06],  gI: 0.85, freq: 4.6, warp: 1.6, cells: 0.3,  gas: 0,    shell: 0, boil: 1.5 },
  { c0: [1, 0.26, 0.01],    c1: [2.3, 1, 0.12],     c2: [3.6, 2.9, 1.3],   glow: [1.8, 0.68, 0.1],  gI: 1,    freq: 3.4, warp: 1.1, cells: 0,    gas: 0,    shell: 0, boil: 1.1 },
  { c0: [1.5, 0.72, 0.2],   c1: [3, 2.1, 0.8],      c2: [4.6, 4.3, 3.4],   glow: [1.9, 1.2, 0.5],   gI: 1.2,  freq: 3.8, warp: 1.1, cells: 0,    gas: 0,    shell: 0, boil: 1.3 },
  { c0: [0.6, 0.1, 0.005],  c1: [1.8, 0.5, 0.03],   c2: [3, 1.5, 0.25],    glow: [1.7, 0.42, 0.05], gI: 0.9,  freq: 3,   warp: 1.6, cells: 0.15, gas: 0,    shell: 0, boil: 1.2 },
  { c0: [0.22, 0.008, 0.003],c1: [1.25, 0.1, 0.015],c2: [3, 0.95, 0.1],   glow: [1.8, 0.16, 0.03], gI: 0.85, freq: 2,   warp: 2.1, cells: 0.35, gas: 0,    shell: 0, boil: 1.4 },
  { c0: [1.6, 0.8, 0.3],    c1: [4, 3, 1.4],        c2: [8, 7, 5.5],       glow: [2.4, 1.6, 0.8],   gI: 1.7,  freq: 3.2, warp: 2,   cells: 0,    gas: 0,    shell: 0, boil: 3 },
  { c0: [0.02, 0.09, 0.12], c1: [0.1, 0.7, 0.72],   c2: [1.8, 0.42, 0.16], glow: [0.3, 0.7, 0.8],   gI: 0.3,  freq: 3.4, warp: 1.5, cells: 0,    gas: 0.75, shell: 1, boil: 0.9 },
  { c0: [0.8, 1, 1.5],      c1: [1.7, 2.1, 3],      c2: [3.6, 4.2, 5.4],   glow: [0.8, 1.2, 2.1],   gI: 0.9,  freq: 2.6, warp: 0.8, cells: 0,    gas: 0,    shell: 0, boil: 0.5 },
];

const LAST = STAGES.length - 1;
const PER = 4;
const N = LAST * PER + 1; // 37
const START = 3;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const capRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const ticksRef = useRef<HTMLDivElement | null>(null);
  const e0Ref = useRef<HTMLSpanElement | null>(null);
  const e1Ref = useRef<HTMLSpanElement | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  // Initialize Cosmic Ambient Music Synthesizer
  useEffect(() => {
    let ctx: AudioContext | null = null;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AudioContextClass();
      audioCtxRef.current = ctx;
    } catch {
      return;
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    // Smooth fade in cosmic ambient
    masterGain.gain.exponentialRampToValueAtTime(0.24, ctx.currentTime + 3.0);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Cosmic Lowpass Filter with gentle resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(2.2, ctx.currentTime);
    filter.connect(masterGain);
    filterRef.current = filter;

    // Layer 1: Sub-Bass Gravitational Wave Drone (55Hz / A1 base)
    const subOsc1 = ctx.createOscillator();
    subOsc1.type = 'sine';
    subOsc1.frequency.setValueAtTime(55, ctx.currentTime);

    const subOsc2 = ctx.createOscillator();
    subOsc2.type = 'triangle';
    subOsc2.frequency.setValueAtTime(55.4, ctx.currentTime); // subtle binaural beat

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.4, ctx.currentTime);
    subOsc1.connect(subGain);
    subOsc2.connect(subGain);
    subGain.connect(filter);

    subOsc1.start();
    subOsc2.start();

    // Layer 2: Ethereal Cosmic Harmony Chords (Open Space Pad: A2, E3, A3, C#4, E4)
    const chordFrequencies = [110, 164.81, 220, 277.18, 329.63, 440];
    const oscList: OscillatorNode[] = [];

    chordFrequencies.forEach((freq, idx) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      // Slight detune for celestial shimmer
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.8, ctx.currentTime);

      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime((idx / (chordFrequencies.length - 1)) * 1.6 - 0.8, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.12 / chordFrequencies.length, ctx.currentTime);

      // Slow LFO for organic cosmic breathing
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.06 + idx * 0.02, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.04 / chordFrequencies.length, ctx.currentTime);
      lfo.connect(lfoGain.gain);
      lfo.start();

      osc.connect(panner);
      panner.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      oscList.push(osc);
    });

    // Layer 3: Solar Wind / Pink Noise Atmosphere
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(600, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.8, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, ctx.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    whiteNoise.start();

    // Auto-resume audio context upon user gesture if suspended by browser policy
    const resumeAudio = () => {
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
    };

    window.addEventListener('pointerdown', resumeAudio, { once: true });
    window.addEventListener('keydown', resumeAudio, { once: true });
    window.addEventListener('wheel', resumeAudio, { once: true });
    window.addEventListener('touchstart', resumeAudio, { once: true });

    // Attempt immediate start
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    return () => {
      window.removeEventListener('pointerdown', resumeAudio);
      window.removeEventListener('keydown', resumeAudio);
      window.removeEventListener('wheel', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
      try {
        subOsc1.stop();
        subOsc2.stop();
        oscList.forEach((o) => o.stop());
        whiteNoise.stop();
        ctx?.close();
      } catch {}
    };
  }, []);

  const toggleAudio = () => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (!isMuted) {
      // Mute with smooth fade
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      setIsMuted(true);
    } else {
      // Unmute with smooth fade
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.24, ctx.currentTime + 0.4);
      setIsMuted(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const cap = capRef.current;
    const track = trackRef.current;
    const ticksContainer = ticksRef.current;
    const e0 = e0Ref.current;
    const e1 = e1Ref.current;

    if (!canvas || !cap || !track || !ticksContainer || !e0 || !e1) return;

    // Create 37 ticks
    ticksContainer.innerHTML = '';
    const tickEls: HTMLElement[] = [];
    const tickH = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const el = document.createElement('i');
      ticksContainer.appendChild(el);
      tickEls.push(el);
      tickH[i] = i % PER ? 0.17 : 0.28;
    }

    // Set caption helper
    function setCaption(idx: number) {
      if (!track || !e0 || !e1 || !cap) return;
      track.setAttribute('aria-valuenow', String(idx));
      track.setAttribute('aria-valuetext', `${STAGES[idx].t}: ${STAGES[idx].b}`);
      e0.classList.toggle('on', idx === 0);
      e1.classList.toggle('on', idx === LAST);

      const newLine = document.createElement('div');
      newLine.className = 'line off';
      newLine.innerHTML = `<h1>${STAGES[idx].t}</h1><p><b>${STAGES[idx].b}</b>${STAGES[idx].c}</p>`;
      cap.appendChild(newLine);
      void newLine.offsetWidth; // Force layout
      newLine.classList.remove('off');

      const children = cap.querySelectorAll<HTMLDivElement>('.line');
      children.forEach((child) => {
        if (child !== newLine) {
          child.classList.add('off');
          setTimeout(() => {
            if (child.parentNode) child.remove();
          }, 240);
        }
      });
    }

    // WebGL setup
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const vsSource = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
    const fsSource = `precision highp float;
  uniform vec2 res;
  uniform float sc, rad, cy, fade, t, evo, rot, blur, starX, freq, warp, cells, gas, shell, gI, flick;
  uniform vec3 c0, c1, c2, glow;
  float h(vec3 p){ p = fract(p*.3183099 + .1); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
  float n3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
    return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x), mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x), f.y),
               mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x), mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x), f.y), f.z); }
  float fbm(vec3 p){ float a=.5, s=0.; for(int i=0;i<5;i++){ s+=a*n3(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=.5; } return s; }
  vec3 stars(vec2 uv){
    vec2 q = (uv + vec2(starX, 0.))*34., id = floor(q), f = fract(q)-.5;
    float r = fract(sin(dot(id,vec2(127.1,311.7)))*43758.5453);
    vec2 o = vec2(fract(r*17.3),fract(r*91.7))-.5;
    float tw = .55+.45*sin(t*(.7+r*1.8)+r*40.);
    vec2 g = f-o*.7; g.x *= 1./(1.+blur*7.);
    return vec3(smoothstep(.975,1.,r)*smoothstep(.06,.0,length(g))*tw*.55);
  }
  void main(){
    vec2 uv = (gl_FragCoord.xy - .5*res)/res.y, p = (uv - vec2(0., cy))/sc;
    float d = length(p), e = max(d-rad, 0.);
    vec3 col = stars(uv);

    // tight halo that ends completely a short way off the ball, the page stays pure black
    vec2 dir = p/max(d,1e-4);
    float rays = .72 + .56*fbm(vec3(dir*2.4, evo*.5));
    float hal = exp(-e/(rad*.11))*smoothstep(rad*.6, rad*.12, e);
    col += glow*gI*.7*hal*rays*flick;

    // soft pool of light under the ball, standing in for the reference's contact shadow
    float py = (p.y + rad + .065)/.0135, px = p.x/(rad*1.02);
    float pool = max(0., 1.-px*px) * exp(-py*py);
    col += glow*min(gI,1.)*.1*pool*pool;

    if(d < rad + .02){
      float k = min(d/rad, 1.);
      vec3 nrm = vec3(p/rad, sqrt(max(1.-k*k, 0.)));
      float cr = cos(rot), sr = sin(rot);
      vec3 n = vec3(nrm.x*cr + nrm.z*sr, nrm.y, -nrm.x*sr + nrm.z*cr);
      // spinning fast smears the surface along its axis of rotation
      float sq = 1./(1.+blur*3.2);
      vec3 q = vec3(n.x*sq, n.y, n.z*sq);
      float w1 = fbm(q*freq + vec3(0.,0.,evo*.28)), w2 = fbm(q*freq*.9 + 7. - vec3(evo*.22,0.,0.));
      float v = fbm(q*freq*1.7 + warp*2.2*vec3(w1, w2, w1-w2));
      float vein = 1.-abs(2.*fbm(q*freq*1.5 + warp*1.3*vec3(w2, w1, 0.))-1.);
      vein = pow(vein, 9.);
      float s = smoothstep(.24,.76,v);
      s = mix(s, clamp(vein*1.25 + s*.14,0.,1.), cells);
      vec3 c = mix(c0, c1, smoothstep(.0,.55,s));
      c = mix(c, c2, smoothstep(.5,1.,s));
      float mu = nrm.z;
      if(shell > .001){
        // planetary nebula: a hot point, a teal cavity and a filament shell seen through the ball
        vec3 sh = c0 + c1*smoothstep(.95,.3,k)*(.25+v*1.2);
        float fil = smoothstep(.5,.82,k)*smoothstep(1.,.8,k)*pow(v+.32,3.)*3.2;
        sh += c2*fil + vec3(3.5,4.,5.)*exp(-k*k/.012);
        c = mix(c, sh, shell);
      } else {
        c *= mix(mix(.34, .8, gas), 1., pow(mu,.5));
      }
      c += glow*pow(1.-mu,2.6)*.42*min(gI,1.)*(1.-gas);
      float edge = smoothstep(1., .985, k);
      float soft = smoothstep(1., .58, k + (fbm(q*3.4 + evo*.1)-.5)*.62) * smoothstep(1., .9, k);
      float a = mix(edge, soft, gas);
      col = mix(col, c, a);
    }
    col = 1. - exp(-col*1.15);
    gl_FragColor = vec4(pow(col, vec3(.4545))*fade, 1.);
  }`;

    function compileShader(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const u: Record<string, WebGLUniformLocation | null> = {};
    [
      'res', 'sc', 'rad', 'cy', 'fade', 't', 'evo', 'rot', 'blur', 'starX',
      'freq', 'warp', 'cells', 'gas', 'shell', 'gI', 'flick', 'c0', 'c1', 'c2', 'glow'
    ].forEach((name) => {
      u[name] = gl.getUniformLocation(prog, name);
    });

    let scVal = 1;
    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      scVal = Math.min(1, (window.innerWidth / window.innerHeight) * 1.5);
    }
    window.addEventListener('resize', resize);
    resize();

    // State
    let x = START / LAST;
    let stage = START;
    let omega = 14;
    let rot = 0;
    let evo = 0;
    let starX = 0;
    let lastInput = -1e9;
    let hover = -1;
    let dragX: number | null = null;
    const t0 = performance.now();
    let nextAuto = t0 + 5000;

    // Deep copy of initial LOOK
    const cur: Look = JSON.parse(JSON.stringify(LOOK[START]));
    setCaption(START);

    function moveTo(nx: number, now: number) {
      nx = clamp(nx, 0, 1);
      omega += (nx - x) * 150;
      x = nx;
      lastInput = now;
    }

    function px(e: { clientX: number }): number {
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      return clamp((e.clientX - rect.left) / rect.width);
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      moveTo(x + d * (e.deltaMode === 1 ? 0.012 : 0.00075), performance.now());
    };

    const onTrackPointerMove = (e: PointerEvent) => {
      hover = px(e);
      if (e.pointerType === 'mouse' && dragX === null) {
        moveTo(hover, performance.now());
      }
    };

    const onTrackPointerLeave = () => {
      hover = -1;
    };

    const onPointerDown = (e: PointerEvent) => {
      dragX = e.clientX;
      if (track.contains(e.target as Node)) {
        moveTo(px(e), performance.now());
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragX !== null) {
        if (track.contains(e.target as Node)) {
          moveTo(px(e), performance.now());
        } else {
          const dx = e.clientX - dragX;
          dragX = e.clientX;
          moveTo(x + dx / Math.min(window.innerWidth, 900), performance.now());
        }
      }
    };

    const onPointerUp = () => {
      dragX = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        moveTo(clamp(x + 1 / LAST), performance.now());
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        moveTo(clamp(x - 1 / LAST), performance.now());
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    track.addEventListener('pointermove', onTrackPointerMove);
    track.addEventListener('pointerleave', onTrackPointerLeave);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('keydown', onKeyDown);

    // Animation frame
    let animId: number;
    let lastTime = performance.now();

    function render(now: number) {
      if (!gl || !canvas) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const f = (r: number) => 1 - Math.exp(-dt * r);
      const time = (now - t0) / 1000;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1. Idle autoplay
      if (!reduced && now - lastInput > 5000 && now > nextAuto) {
        const iCurr = Math.round(x * LAST);
        x = ((iCurr + 1) % (LAST + 1)) / LAST;
        omega += 9;
        nextAuto = now + 2600;
      }

      // 2. Stage switch
      const i = Math.round(x * LAST);
      if (i !== stage) {
        omega += omega >= 0 ? 7 : -7;
        stage = i;
        setCaption(i);

        // Modulate cosmic audio filter based on stage energy
        if (filterRef.current && audioCtxRef.current) {
          const targetFreq = 300 + stage * 65 + (cur.gI * 120);
          filterRef.current.frequency.setTargetAtTime(targetFreq, audioCtxRef.current.currentTime, 0.4);
        }
      }

      // 3. Ease cur towards LOOK[stage]
      const target = LOOK[stage];
      const easeRate = reduced ? f(60) : f(13);

      cur.freq += (target.freq - cur.freq) * easeRate;
      cur.warp += (target.warp - cur.warp) * easeRate;
      cur.cells += (target.cells - cur.cells) * easeRate;
      cur.gas += (target.gas - cur.gas) * easeRate;
      cur.shell += (target.shell - cur.shell) * easeRate;
      cur.gI += (target.gI - cur.gI) * easeRate;
      cur.boil += (target.boil - cur.boil) * easeRate;

      for (let c = 0; c < 3; c++) {
        cur.c0[c] += (target.c0[c] - cur.c0[c]) * easeRate;
        cur.c1[c] += (target.c1[c] - cur.c1[c]) * easeRate;
        cur.c2[c] += (target.c2[c] - cur.c2[c]) * easeRate;
        cur.glow[c] += (target.glow[c] - cur.glow[c]) * easeRate;
      }

      // 4. Spin decay
      omega *= Math.exp(-dt * 3.6);

      // 5. Spin & blur
      const spin = reduced ? 0 : 0.22 + omega;
      const blur = Math.min(1.4, Math.abs(omega) * 0.1);

      // 6. Accumulate
      rot += spin * dt;
      evo += dt * cur.boil * (1 + Math.abs(omega) * 0.1);
      starX += omega * dt * 0.012;

      // 7. Set uniforms
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.sc, scVal);
      gl.uniform1f(u.rad, 0.17);
      gl.uniform1f(u.cy, 0.13);
      gl.uniform1f(u.fade, Math.min(1, (now - t0) / 500));
      gl.uniform1f(u.t, time);
      gl.uniform1f(u.evo, evo);
      gl.uniform1f(u.rot, rot);
      gl.uniform1f(u.blur, blur);
      gl.uniform1f(u.starX, starX);
      gl.uniform1f(u.freq, cur.freq);
      gl.uniform1f(u.warp, cur.warp);
      gl.uniform1f(u.cells, cur.cells);
      gl.uniform1f(u.gas, cur.gas);
      gl.uniform1f(u.shell, cur.shell);
      gl.uniform1f(u.gI, cur.gI);

      const flick = 1 + 0.1 * Math.sin(time * 2.1) + 0.06 * Math.sin(time * 5.3);
      gl.uniform1f(u.flick, flick);

      gl.uniform3fv(u.c0, cur.c0);
      gl.uniform3fv(u.c1, cur.c1);
      gl.uniform3fv(u.c2, cur.c2);
      gl.uniform3fv(u.glow, cur.glow);

      // 8. Draw
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // 9. Update ticks
      const active = x * (N - 1);
      const bellAt = (hover >= 0 ? hover : x) * (N - 1);
      const fTick = f(22);
      for (let j = 0; j < N; j++) {
        const q = j - bellAt;
        const bell = Math.exp((-q * q) / 5.5);
        const diffAct = j - active;
        const on = Math.exp((-diffAct * diffAct) / 0.22);
        const goal = Math.max((j % PER ? 0.17 : 0.28) + bell * 0.55, on);
        tickH[j] += (goal - tickH[j]) * fTick;
        tickEls[j].style.transform = `scaleY(${tickH[j]})`;
        tickEls[j].style.opacity = `${0.3 + bell * 0.35 + on * 0.6}`;
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('wheel', onWheel);
      track.removeEventListener('pointermove', onTrackPointerMove);
      track.removeEventListener('pointerleave', onTrackPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <>
      <canvas id="gl" ref={canvasRef} />

      {/* Discreet Cosmic Sound Control */}
      <button
        onClick={toggleAudio}
        className="fixed top-5 right-5 z-50 flex items-center gap-2 text-xs tracking-wider uppercase text-white/60 hover:text-white transition-all cursor-pointer bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md pointer-events-auto shadow-lg"
        title={isMuted ? 'Ativar trilha cósmica' : 'Silenciar trilha cósmica'}
        aria-label={isMuted ? 'Ativar trilha cósmica' : 'Silenciar trilha cósmica'}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
        <span className="font-medium text-[11px] select-none">{isMuted ? 'Sem som' : 'Som cósmico'}</span>
      </button>

      <div className="ui">
        <div className="cap" id="cap" ref={capRef} />
        <div
          id="track"
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Linha do tempo"
          aria-valuemin={0}
          aria-valuemax={LAST}
        >
          <div id="ticks" ref={ticksRef} />
          <div className="ends">
            <span id="e0" ref={e0Ref}>
              Nebulosa
            </span>
            <span id="e1" ref={e1Ref}>
              Anã branca
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
