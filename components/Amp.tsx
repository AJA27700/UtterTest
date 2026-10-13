import { Fragment } from 'react'

// "Honey & Maple" with the ampersand in the italic display style, as on the static site.
export default function Amp({ text }: { text: string }) {
  return <>{text.split('&').map((part, i) => <Fragment key={i}>{i > 0 && <span className="amp">&amp;</span>}{part}</Fragment>)}</>
}
