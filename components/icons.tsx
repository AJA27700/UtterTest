// The site's small line icons, as React components.
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }

export const Arrow = () => <svg className="arrow" {...base} strokeWidth={2.4}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
export const ArrowUp = () => <svg {...base} strokeWidth={2.6}><path d="M12 19V5M6 11l6-6 6 6" /></svg>
export const Chevron = (p: { className?: string }) => <svg {...base} className={p.className} width={18} height={18} strokeWidth={2.6}><path d="M6 9l6 6 6-6" /></svg>
export const Search = () => <svg {...base} strokeWidth={2.6}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" /></svg>
export const X = () => <svg {...base} strokeWidth={3.4}><path d="M6 6l12 12M18 6L6 18" /></svg>
export const Check = () => <svg {...base} strokeWidth={3}><path d="M5 12.5l4.5 4.5L19 7" /></svg>
export const Phone = () => <svg {...base} strokeWidth={2}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
export const Mail = () => <svg {...base} strokeWidth={2}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7.5l8.5 6 8.5-6" /></svg>
export const Truck = () => <svg {...base} strokeWidth={2}><path d="M2.5 6.5h11v9.5h-11zM13.5 9.5h4l3.5 3.5v3h-7.5" /><circle cx="6.5" cy="17.5" r="1.9" /><circle cx="17" cy="17.5" r="1.9" /></svg>
export const User = () => <svg {...base} strokeWidth={2}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
export const Bag = () => <svg {...base} strokeWidth={2}><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" /><path d="M9 10V7a3 3 0 0 1 6 0v3" /></svg>
export const Minus = () => <svg {...base} strokeWidth={2.8}><path d="M5 12h14" /></svg>
export const Plus = () => <svg {...base} strokeWidth={2.8}><path d="M12 5v14M5 12h14" /></svg>
export const Trash = () => <svg {...base} strokeWidth={2}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
export const Chat = () => <svg {...base} strokeWidth={2}><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.8 8.8 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z" /></svg>
export const Pin = () => <svg {...base} strokeWidth={2}><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.6" /></svg>
export const Leaf = () => <svg {...base} strokeWidth={2.2}><path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15" /><path d="M5 19l7-7" /></svg>

export function Ribbon({ text, id }: { text: string; id: string }) {
  return (
    <svg className="ribbon" viewBox="0 0 640 112" role="img" aria-label={text}>
      <defs>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE7A0" /><stop offset=".48" stopColor="#F5C544" /><stop offset="1" stopColor="#DDA02A" /></linearGradient>
        <linearGradient id={`${id}-tail`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E7AF38" /><stop offset="1" stopColor="#B98019" /></linearGradient>
        <path id={`${id}-arc`} d="M80 72Q320 46 560 72" />
      </defs>
      <path d="M102 46H20l24 30-24 30h82z" fill={`url(#${id}-tail)`} />
      <path d="M538 46h82l-24 30 24 30h-82z" fill={`url(#${id}-tail)`} />
      <path d="M80 90l22 16V90z" fill="#8A5E10" /><path d="M560 90l-22 16V90z" fill="#8A5E10" />
      <path d="M80 30Q320 2 560 30V90Q320 62 80 90Z" fill={`url(#${id}-band)`} stroke="#B8841D" strokeWidth={2} />
      <path d="M86 38Q320 12 554 38" fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />
      <text className="ribbon__text"><textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle">{text}</textPath></text>
    </svg>
  )
}
