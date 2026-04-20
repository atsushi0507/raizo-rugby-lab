import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { getAllPositions } from '@/lib/mdx';

type PositionColor = 'forward' | 'half' | 'back';

interface PositionDef {
  number: number;
  shortName: string;
  x: number;
  y: number;
  color: PositionColor;
}

const POSITIONS: PositionDef[] = [
  { number: 1,  shortName: 'PR',  x: 18, y: 10, color: 'forward' },
  { number: 2,  shortName: 'HO',  x: 50, y: 8,  color: 'forward' },
  { number: 3,  shortName: 'PR',  x: 82, y: 10, color: 'forward' },
  { number: 6,  shortName: 'FL',  x: 10, y: 30, color: 'forward' },
  { number: 4,  shortName: 'LO',  x: 32, y: 20, color: 'forward' },
  { number: 5,  shortName: 'LO',  x: 68, y: 20, color: 'forward' },
  { number: 7,  shortName: 'FL',  x: 90, y: 30, color: 'forward' },
  { number: 8,  shortName: 'No8', x: 50, y: 35, color: 'forward' },
  { number: 9,  shortName: 'SH',  x: 50, y: 50, color: 'half' },
  { number: 10, shortName: 'SO',  x: 50, y: 65, color: 'half' },
  { number: 12, shortName: 'CTB', x: 25, y: 70, color: 'back' },
  { number: 13, shortName: 'CTB', x: 75, y: 70, color: 'back' },
  { number: 11, shortName: 'WTB', x: 8,  y: 80, color: 'back' },
  { number: 14, shortName: 'WTB', x: 92, y: 80, color: 'back' },
  { number: 15, shortName: 'FB',  x: 50, y: 85, color: 'back' },
];

const COLOR_MAP: Record<PositionColor, { border: string; bg: string; text: string }> = {
  forward: { border: 'border-red-300',   bg: 'bg-red-100',   text: 'text-red-700' },
  half:    { border: 'border-amber-400', bg: 'bg-amber-100', text: 'text-amber-700' },
  back:    { border: 'border-blue-300',  bg: 'bg-blue-100',  text: 'text-blue-700' },
};

const PREFIX: Record<number, string> = {
  1: 'lh_1', 2: 'ho_2', 3: 'th_3', 4: 'lo_4', 5: 'lo_5',
  6: 'fl_6', 7: 'fl_7', 8: 'no8_8', 9: 'sh_9', 10: 'so_10',
  11: 'lw_11', 12: 'ctb_12', 13: 'ctb_13', 14: 'rw_14', 15: 'fb_15',
};

function hasIcon(n: number): boolean {
  const p = PREFIX[n];
  if (!p) return false;
  return fs.existsSync(path.join(process.cwd(), 'public', 'positions', p + '_icon.png'));
}

function PositionIcon({ pos, linkedId }: { pos: PositionDef; linkedId?: string }) {
  const iconExists = hasIcon(pos.number);
  const prefix = PREFIX[pos.number];
  const colors = COLOR_MAP[pos.color];

  const content = (
    <div
      className={'absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2' + (linkedId ? ' group cursor-pointer' : '')}
      style={{ left: pos.x + '%', top: pos.y + '%' }}
    >
      <div className={'w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden border-2 shadow-lg transition-transform ' + colors.border + ' ' + colors.bg + (linkedId ? ' group-hover:scale-110 group-hover:shadow-xl' : '')}>
        {iconExists ? (
          <Image
            src={'/positions/' + prefix + '_icon.png'}
            alt={pos.number + ' ' + pos.shortName}
            width={44}
            height={44}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={'w-full h-full flex items-center justify-center font-bold text-xs md:text-sm ' + colors.text}>
            {pos.number}
          </div>
        )}
      </div>
      <span className="text-[9px] md:text-[10px] font-bold text-white mt-0.5 whitespace-nowrap" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
        {pos.shortName}
      </span>
    </div>
  );

  if (linkedId) {
    return <Link href={'/positions/' + linkedId}>{content}</Link>;
  }
  return content;
}

export async function FieldMap() {
  const allPositions = await getAllPositions();
  const numberToId = new Map(allPositions.map((p) => [p.number, p.id]));

  return (
    <div className="mb-12">
      <div className="relative w-full max-w-3xl mx-auto" style={{ aspectRatio: '4 / 3' }}>
        <div className="absolute inset-0 rounded-xl overflow-hidden bg-green-600">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 6%, rgba(255,255,255,0.2) 6%, rgba(255,255,255,0.2) 6.5%)' }}
          />
          <div className="absolute left-[3%] top-0 bottom-0 w-0.5 bg-white/30" />
          <div className="absolute right-[3%] top-0 bottom-0 w-0.5 bg-white/30" />
          <div className="absolute left-[3%] right-[3%] top-[2%] h-0.5 bg-white/50" />
          <div className="absolute left-[3%] right-[3%] top-[18%] h-px bg-white/20" />
          <div className="absolute left-[3%] right-[3%] top-[55%] h-0.5 bg-white/35" />
          <div className="absolute left-[3%] right-[3%] top-[88%] h-0.5 bg-white/50" />
          <div className="absolute left-[3%] right-[3%] top-[88%] bottom-[2%] bg-green-700/40" />
          <div className="absolute left-1/2 top-[86%] -translate-x-1/2">
            <div className="w-14 md:w-20 h-1 bg-white/70 rounded-full" />
            <div className="absolute -left-7 md:-left-10 top-0 w-1 h-6 md:h-8 bg-white/60 rounded-b" />
            <div className="absolute -right-7 md:-right-10 top-0 w-1 h-6 md:h-8 bg-white/60 rounded-b" />
          </div>
          <span className="absolute top-[1%] left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] text-white/40 font-medium tracking-wider">CENTER LINE</span>
          <span className="absolute top-[90%] left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] text-white/40 font-medium tracking-wider">GOAL LINE</span>
        </div>
        {POSITIONS.map((pos) => (
          <PositionIcon key={pos.number} pos={pos} linkedId={numberToId.get(pos.number)} />
        ))}
        <div className="absolute bottom-2 right-3 flex items-center gap-3 text-[9px] md:text-[10px] text-white/80">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-100 border border-red-300" />FW</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-100 border border-amber-400" />HB</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-100 border border-blue-300" />BK</span>
        </div>
      </div>
    </div>
  );
}
