import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  Easing,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Inter} from '@remotion/google-fonts/Inter';
import {JetBrainsMono} from '@remotion/google-fonts/JetBrainsMono';

const {fontFamily: inter} = Inter.loadFont();
const {fontFamily: mono} = JetBrainsMono.loadFont();

const BG = '#050505';
const GRID = '#121212';
const RED = '#E10600';
const WHITE = '#FFFFFF';
const MUTED = '#888888';
const M = 90;
const W = 1080;
const H = 1920;
const CONTENT = W - M * 2;

const CODE = [
  'ffmpeg -y \\',
  '  -framerate 30 \\',
  '  -i frames/f_%04d.png \\',
  '  -c:v libx264 \\',
  '  -pix_fmt yuv420p \\',
  '  animare.mp4',
].join('\n');

const SUBTITLE = 'Cada frame se dibuja con codigo y se codifica con ffmpeg';
const WORDS = SUBTITLE.split(' ');

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

const Grid: React.FC = () => (
  <svg width={W} height={H} style={{position: 'absolute', top: 0, left: 0}}>
    {Array.from({length: 14}, (_, i) => (
      <line key={`v${i}`} x1={i * 80} y1={0} x2={i * 80} y2={H} stroke={GRID} strokeWidth={1} />
    ))}
    {Array.from({length: 25}, (_, i) => (
      <line key={`h${i}`} x1={0} y1={i * 80} x2={W} y2={i * 80} stroke={GRID} strokeWidth={1} />
    ))}
  </svg>
);

export const AnimareDev: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const labelOp = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: easeOut});
  const ruleGrow = interpolate(frame, [12, 42], [0, 1], {...clamp, easing: easeInOut});
  const headSpring = spring({frame: frame - 24, fps, config: {damping: 200}});
  const redSpring = spring({frame: frame - 42, fps, config: {damping: 180}});

  const countVal = Math.round(
    interpolate(frame, [58, 148], [0, 1080], {...clamp, easing: easeOut})
  );
  const barPct = interpolate(frame, [72, 168], [0, 1], {...clamp, easing: easeInOut});

  const chars = Math.max(0, Math.round((frame - 90) * 2.6));
  const codeText = CODE.slice(0, Math.min(chars, CODE.length));
  const panelOp = interpolate(frame, [84, 96], [0, 1], {...clamp, easing: easeOut});

  const curtain = interpolate(frame, [176, 200], [0, 1], {...clamp, easing: easeInOut});
  const logoOp = interpolate(frame, [196, 208], [0, 1], {...clamp, easing: easeOut});

  return (
    <AbsoluteFill style={{backgroundColor: BG, fontFamily: inter}}>
      <Grid />

      <div style={{position:'absolute', left:M, top:168, color:WHITE,
        fontFamily:mono, fontSize:34, fontWeight:700, letterSpacing:2, opacity:labelOp}}>
        animare.dev
      </div>

      <div style={{position:'absolute', left:M, top:240,
        width:CONTENT * ruleGrow, height:4, backgroundColor:RED}} />

      <div style={{position:'absolute', left:M, top:320, color:WHITE,
        fontSize:132, fontWeight:900, letterSpacing:-4, opacity:headSpring,
        transform:`translateY(${(1 - headSpring) * 40}px)`}}>
        Pipeline
      </div>

      <div style={{position:'absolute', left:M, top:480, color:RED,
        fontSize:132, fontWeight:900, letterSpacing:-4, opacity:redSpring,
        transform:`scale(${0.86 + redSpring * 0.14})`, transformOrigin:'left center'}}>
        ACTIVO.
      </div>

      <div style={{position:'absolute', left:M, top:690, color:MUTED, fontFamily:mono,
        fontSize:28, fontWeight:700, letterSpacing:3,
        opacity:interpolate(frame, [52, 66], [0, 1], {...clamp, easing:easeOut})}}>
        FRAMES RENDERIZADOS
      </div>

      <div style={{position:'absolute', left:M, top:736, color:WHITE, fontFamily:mono,
        fontSize:104, fontWeight:700, letterSpacing:-2,
        opacity:interpolate(frame, [52, 66], [0, 1], {...clamp, easing:easeOut})}}>
        {String(countVal).padStart(4, '0')}
      </div>

      <div style={{position:'absolute', left:M, top:900, width:CONTENT, height:12,
        backgroundColor:'#1a1a1a'}} />
      <div style={{position:'absolute', left:M, top:900, width:CONTENT * barPct,
        height:12, backgroundColor:RED}} />
      <div style={{position:'absolute', left:M, top:932, color:MUTED, fontFamily:mono,
        fontSize:26, fontWeight:700,
        opacity:interpolate(frame, [70, 84], [0, 1], {...clamp, easing:easeOut})}}>
        {Math.round(barPct * 100)}% - 30 fps - 1080x1920
      </div>

      <div style={{position:'absolute', left:M, top:1010, width:CONTENT,
        backgroundColor:'#0d0d0d', border:'1px solid #1a1a1a',
        borderLeft:`4px solid ${RED}`, padding:'28px 30px', opacity:panelOp}}>
        <pre style={{margin:0, color:'#e8e8e8', fontFamily:mono, fontSize:27,
          lineHeight:1.55, whiteSpace:'pre-wrap'}}>
          {codeText}
          {chars < CODE.length && frame % 20 < 12 ? (
            <span style={{color:RED}}>|</span>
          ) : null}
        </pre>
      </div>

      <div style={{position:'absolute', left:M, top:1440, width:CONTENT,
        color:RED, fontSize:52, fontWeight:700, lineHeight:1.35}}>
        {WORDS.map((w, i) => {
          const s = 112 + i * 6;
          const op = interpolate(frame, [s, s + 12], [0, 1], {...clamp, easing:easeOut});
          const ty = interpolate(frame, [s, s + 12], [16, 0], {...clamp, easing:easeOut});
          return (
            <span key={i} style={{display:'inline-block', marginRight:'0.26em',
              opacity:op, transform:`translateY(${ty}px)`}}>
              {w}
            </span>
          );
        })}
      </div>

      <AbsoluteFill style={{backgroundColor:RED, transform:`scaleY(${curtain})`,
        transformOrigin:'top center'}} />

      <div style={{position:'absolute', left:0, top:0, width:W, height:H,
        display:'flex', alignItems:'center', justifyContent:'center', opacity:logoOp}}>
        <div style={{color:WHITE, fontFamily:mono, fontSize:44, fontWeight:700, letterSpacing:3}}>
          animare.dev
        </div>
      </div>
    </AbsoluteFill>
  );
};
