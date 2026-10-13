// About Us, copied in full from the new site (front.uddermilk.com/about-us): intro, three cards,
// an "On this page" menu, seven sections and the owners' signature.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

const TOC: [string, string][] = [
  ['why', 'Why we exist'],
  ['lactose', 'Lactose intolerance — another view'],
  ['farmers', 'Our farmers & practices'],
  ['local', 'Land of milk & honey — local food'],
  ['serve', 'Who we gladly serve'],
  ['grain', 'Grain, sourcing & quality'],
  ['right', 'Your right & our promise'],
]

function Sec({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="about-sec" id={id} aria-labelledby={`${id}-t`} data-reveal="">
      <h2 id={`${id}-t`}>{title}</h2>
      {children}
    </section>
  )
}

export default function AboutUs() {
  return (
    <>
      <section className="page-hero" aria-labelledby="about-title">
        <div className="page-hero__inner">
          <span className="eyebrow">
            <img src="/assets/icons/brown-cow-face.webp" alt="" width="20" height="20" />
            Udder Milk Creamery Co-op
          </span>
          <h1 id="about-title">
            About <em>us</em>
          </h1>
          <p className="lede">
            Real milk, real farmers, and food brought to you fresh — because what is on store shelves is no longer milk in its true form.
          </p>
          <p className="about-links">
            <Link href="/faq">FAQ</Link> · <Link href="/terms-services">Member policies</Link> · <Link href="/contact-us">Contact us</Link>
          </p>
        </div>
      </section>

      <section className="section section--tight" style={{ paddingTop: '6px' }} aria-label="What we stand for">
        <div className="container">
          <div className="status-row about-cards" data-stagger="">
            <div className="status" data-reveal="">
              <img src="/assets/icons/red-heart.webp" alt="" width="36" height="36" />
              <b>Farm-fresh &amp; clean</b>
              <p>Grass-fed dairy and meat from farmers who avoid pesticides, herbicides, fungicides, GMO seed, and irradiation.</p>
            </div>
            <div className="status" data-reveal="">
              <img src="/assets/icons/round-pushpin.webp" alt="" width="36" height="36" />
              <b>Local &amp; timely</b>
              <p>Food harvested or made within 1–2 days — not shelf-stable supplements stripped of nutrients.</p>
            </div>
            <div className="status" data-reveal="">
              <img src="/assets/icons/four-leaf-clover.webp" alt="" width="36" height="36" />
              <b>Standards we keep</b>
              <p>We monitor what we bring you. If quality slips, we find another farmer rather than lower our bar.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight" style={{ paddingTop: '10px' }}>
        <div className="container about-layout">
          <nav className="about-toc" aria-label="On this page">
            <span className="label">On this page</span>
            <ul>
              {TOC.map(([id, t]) => (
                <li key={id}><a href={`#${id}`}>{t}</a></li>
              ))}
            </ul>
          </nav>

          <div className="about-body">
            <Sec id="why" title="Why we exist">
              <p className="about-lead">The main reason we are here for you is that there is no more milk left in the store — and this really is no joke.</p>
              <p>All milk has been tampered with and changed — even the organic kind — and it is getting people sick. We have proof — lots of proof.</p>
              <p>
                It is not in its true form anymore because of pasteurization, homogenization, and ultra-pasteurization, and the synthetic vitamin
                A and D they add back into processed milk.
              </p>
              <p className="about-note about-note--warm">
                Synthetic vitamin D is among the worst things for your heart muscle. The best way to boost D levels is with the sun — and if not
                the sun, raw grass-fed milk or butter.
              </p>
            </Sec>

            <Sec id="lactose" title="Lactose intolerance — another view">
              <p>
                <b>You are not lactose intolerant.</b> You are pasteurization and homogenization intolerant. This is no joke — this is reality.
              </p>
              <p>
                When they started to pasteurize milk, it created what people call &quot;lactose intolerance.&quot; They make you think something is
                wrong with you — when in fact pasteurization itself made you unable to digest the milk.
              </p>
              <p>
                A very small number of people (roughly one in five thousand, maybe more) cannot digest raw milk, but many of them tolerate raw
                cream, butter, and raw ice cream with no problem.
              </p>
            </Sec>

            <Sec id="farmers" title="Our farmers & practices">
              <p>
                We strive to keep our customers happy and healthy with fresh-from-the-farm dairy and meat: pesticide-free, fungicide-free,
                herbicide-free, antibiotic-free, irradiation-free, and GMO-free. <b>No grain is given</b> to the cows used for our dairy or beef.
              </p>
              <p>
                All farmers we work with are free of pesticides, herbicides, fungicides, and insecticides, as well as GMO seed. They do not
                irradiate their food. They chose this sustainable, clean farming path years ago, and we trust they adhere to it.
              </p>
              <p>
                We source mostly from non-Amish farms now; a few partners are Amish. Every farmer has plenty of acreage so nutrition is never
                compromised — with much rotation of grazing.
              </p>
            </Sec>

            <Sec id="local" title="Land of milk & honey — local food">
              <p><b>This is the land of milk (raw) and honey (local)</b></p>
              <p>Food in America has been compromised for too long. There seem to be more supermarkets than farms near people&apos;s homes these days.</p>
              <p>
                People rush to supplements that are no longer in their true form — even many &quot;organic&quot; products are heavily processed.
                Organic food exists; we offer food that reaches you within <b>1–2 days</b> after harvest or production.
              </p>
              <blockquote className="about-quote">
                <span>Give me liberty (with raw / fresh dairy)</span>
                <span>or give me death</span>
                <small>(with store-bought knock-off / fake dairy)</small>
              </blockquote>
              <p>
                Many supplements are so far removed from their original form that most nutrients are gone — except what we know:{' '}
                <b>raw dairy, pickled foods, fermented foods, and fresh garden vegetables</b>. Eating farm-fresh, local, properly farmed food can
                be healthier than any supplement.
              </p>
              <p>
                Why local? Not only for the economy — for health benefits from the region where you live. The flora and bacteria in local food,
                according to many master herbalists, help inoculate against disease and strengthen the immune system.
              </p>
            </Sec>

            <Sec id="serve" title="Who we gladly serve">
              <p>
                We gladly serve anyone who wants to stay healthy with raw grass-fed milk — including people managing serious health challenges,
                allergy sufferers, autoimmune conditions, and those who are sick and tired of being sick and tired.
              </p>
              <p>
                We also serve members who find it difficult to drive to a farm every week to pick up fresh food for themselves. Remember: when you
                have patience for your sickness, God rewards you more.
              </p>
            </Sec>

            <Sec id="grain" title="Grain, sourcing & quality">
              <p>
                Farms we work with are careful with grain when it is needed — for example, for chickens and goats. Many local farmers buy
                &quot;GMO-free&quot; grain that still carries pesticides. Our partners either grow their own feed or purchase certified organic grain —
                not from the typical regional feed suppliers.
              </p>
              <p>
                We are not farmer-direct, but that can be a plus: we monitor what we bring you and keep standards high. If an item needs better
                quality and a farmer will not improve it, we move on — sometimes to a farmer farther away. If everyone loves our butter, we keep
                searching until we find better butter. We will not keep ordering from a farmer whose product has lost quality.
              </p>
            </Sec>

            <Sec id="right" title="Your right & our promise">
              <p>
                Enjoy everything you receive from us. If anything is not suitable, please let us know — don&apos;t be shy. In every bite and sip,
                remember to thank God for this food before and after you finish.
              </p>
              <p>
                If you like, get into the habit of saying there is an <b>illegal ban against this kind of dairy toward We the People</b> — it is
                not illegal. It is an illegal ban against us in the U.S.A.
              </p>
              <p>
                You do not have to ask anyone&apos;s permission for this kind of dairy; it is your inherent right. As soon as you ask, your right
                becomes a privilege — and power transfers to whoever grants that privilege to take it away.
              </p>
              <p>
                Thank you Max Kane, who knows the difference between a right and a privilege, and for biking across America for this cause. Thank
                you Gina and Moaz for being brave enough to start this website and trail-blaze for other farmers.
              </p>
              <p>Thank you to the Amish farmer who, when asked years ago if this was illegal, looked puzzled and answered:</p>
              <p className="about-quote about-quote--green">&quot;According to God this is very legal.&quot;</p>
              <p>He is absolutely, positively correct.</p>
              <p className="about-note about-note--red">
                What is wrong is bringing you dirty, unorganic, grain-fed fake milk that has been pasteurized and homogenized — contributing to
                heart disease, pasteurization intolerance (often called lactose intolerance), and other serious ailments. That is a crime against
                humanity in reality.
              </p>
            </Sec>

            <p className="about-sign" data-reveal="">Kathy, Moaz, Gina</p>
            <p className="about-shop">
              <Link className="btn" href="/shop">
                Shop our products{' '}
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
