// Reads the homepage announcements from content/announcements.md (see the notes at the top of that file).
import fs from 'node:fs'
import path from 'node:path'

export type Announcement = { title: string; text: string[]; date?: string; link?: { href: string; label: string } }

export function getAnnouncements(): Announcement[] {
  let md = ''
  try { md = fs.readFileSync(path.join(process.cwd(), 'content', 'announcements.md'), 'utf8') } catch { return [] }
  md = md.replace(/<!--[\s\S]*?-->/g, '').replace(/\r\n/g, '\n')
  return md.split(/^##\s+/m).slice(1).map((block) => {
    const [first, ...rest] = block.split('\n')
    const a: Announcement = { title: first.trim(), text: [] }
    const body: string[] = []
    for (const line of rest) {
      const m = line.match(/^\s*(date|link)\s*:\s*(.+)$/i)
      if (m && !body.join('').trim()) {
        if (m[1].toLowerCase() === 'date') a.date = m[2].trim()
        else { const [href, label] = m[2].split('|').map((s) => s.trim()); if (href) a.link = { href, label: label || 'Read more' } }
      } else body.push(line)
    }
    a.text = body.join('\n').split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean)
    return a
  }).filter((a) => a.title)
}
