// Ported from the static site by port_pages.py. Edit freely: this file is now the source.
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function Recipes() {
  return (
    <>
      <section className="page-hero" aria-labelledby="rec-title">
        <div className="page-hero__inner">
          <span className="eyebrow">
            <img src="/assets/icons/cooking.webp" alt="" width="20" height="20" />
            Recipes
          </span>
          <h1 id="rec-title">
            Straight from
            <br />
            <em>the dairy case.</em>
          </h1>
          <p className="lede">Simple things to make with raw cream, buttermilk, yogurt and the rest of your order.</p>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: '6px' }}>
            <a className="chip" href="#cultured-butter">
              <img src="/assets/icons/butter.webp" alt="" width="22" height="22" />
              Cultured butter at home
            </a>
            <a className="chip" href="#coffee-cap">
              <img src="/assets/icons/hot-beverage.webp" alt="" width="22" height="22" />A whipped cream cap for your coffee
            </a>
            <a className="chip" href="#buttermilk-eggs">
              <img src="/assets/icons/cooking.webp" alt="" width="22" height="22" />
              Buttermilk scrambled eggs
            </a>
            <a className="chip" href="#warm-dates">
              <img src="/assets/icons/palm-tree.webp" alt="" width="22" height="22" />
              Warm dates with butter &amp; cream
            </a>
            <a className="chip" href="#sweet-couscous">
              <img src="/assets/icons/cooked-rice.webp" alt="" width="22" height="22" />
              Sweet Egyptian couscous
            </a>
            <a className="chip" href="#labneh">
              <img src="/assets/icons/bowl-with-spoon.webp" alt="" width="22" height="22" />
              Labneh from any yogurt
            </a>
          </div>
        </div>
        <div className="float hide-sm" data-speed=".12" style={{ '--x': '6%', '--y': '30%', '--s': '118px' } as React.CSSProperties}>
          <img src="/assets/icons/cooking.webp" alt="" width="118" height="118" />
        </div>
        <div
          className="float hide-sm"
          data-speed=".08"
          style={{ '--x': '85%', '--y': '26%', '--s': '112px', '--delay': '-2s' } as React.CSSProperties}
        >
          <img src="/assets/icons/butter.webp" alt="" width="112" height="112" />
        </div>
      </section>
      <section className="section section--tight" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="callout callout--butter" data-reveal="" style={{ maxWidth: '880px', margin: '0 auto 26px' }}>
            <img src="/assets/icons/ice.webp" alt="" width="48" height="48" loading="lazy" />
            <div>
              <b>Kitchen note: keep your cream fresh longer</b>
              <p>
                As soon as it arrives, move cream into a glass jar and set the jar in a bowl of ice water in the fridge. Top up the ice as
                it melts. Sitting in near-freezing water, cream keeps longer and won&apos;t sour as fast. The same trick works for butter.
              </p>
            </div>
          </div>
          <div className="recipe-grid" data-stagger="">
            <article className="recipe" id="cultured-butter" style={{ '--tint': '#FBE8A6' } as React.CSSProperties} data-reveal="">
              <div className="recipe__top">
                <div>
                  <span className="label">2 days, mostly waiting · About 1¼ lb butter</span>
                  <h3>Cultured butter at home</h3>
                </div>
                <img src="/assets/icons/butter.webp" alt="" width="96" height="96" loading="lazy" />
              </div>
              <div className="recipe__body">
                <h4>You&apos;ll need</h4>
                <ul>
                  <li>1 quart raw heavy cream</li>
                  <li>⅛ tsp mesophilic culture (like MM 100), or 2 tbsp cultured buttermilk</li>
                  <li>A big bowl of ice water</li>
                  <li>Salt, if you like</li>
                </ul>
                <h4>Method</h4>
                <ol>
                  <li>Pour the cream into a clean glass or stainless steel bowl and warm it gently to about 77°F.</li>
                  <li>
                    Stir in the culture. Cover it and keep it near 77°F for about 24 hours, until it thickens and smells pleasantly tangy.
                  </li>
                  <li>Set the bowl in ice water and chill for 12 to 24 hours, until it’s cold all the way through.</li>
                  <li>
                    Beat the cold cream in a stand mixer on medium. It will go past whipped cream and suddenly break into yellow butter and
                    thin buttermilk.
                  </li>
                  <li>Pour off the buttermilk and save it for baking.</li>
                  <li>
                    Press the butter under very cold water, changing the water until it runs clear. Salt it if you like, pack it into a jar
                    and chill.
                  </li>
                </ol>
                <p style={{ margin: '0' }}>
                  <b style={{ color: 'var(--pasture)' }}>Tip:</b> In a hurry? Skip the culturing and just chill the cream well. You’ll get
                  sweet-cream butter instead.
                </p>
                <p className="recipe__uses">
                  From the shop: <Link href="/category/cow-dairy#raw-heavy-cream">Raw heavy cream</Link>,{' '}
                  <Link href="/products/product_lists/gurnsey-dairy#raw-guernsey-cream">Raw Guernsey cream</Link>
                </p>
              </div>
            </article>
            <article className="recipe" id="coffee-cap" style={{ '--tint': '#F8DDC4' } as React.CSSProperties} data-reveal="">
              <div className="recipe__top">
                <div>
                  <span className="label">5 minutes · Tops 4 coffees</span>
                  <h3>A whipped cream cap for your coffee</h3>
                </div>
                <img src="/assets/icons/hot-beverage.webp" alt="" width="96" height="96" loading="lazy" />
              </div>
              <div className="recipe__body">
                <h4>You&apos;ll need</h4>
                <ul>
                  <li>½ cup raw heavy cream, very cold</li>
                  <li>1 tsp maple syrup (optional)</li>
                  <li>Hot coffee</li>
                </ul>
                <h4>Method</h4>
                <ol>
                  <li>Chill a bowl and whisk in the freezer for 10 minutes.</li>
                  <li>Whip the cream until it holds soft peaks. Fold in the maple syrup.</li>
                  <li>
                    Spoon a big dollop onto hot coffee. It melts slowly into a creamy, cappuccino-like cap, and tastes better than pouring
                    the cream straight in.
                  </li>
                </ol>
                <p style={{ margin: '0' }}>
                  <b style={{ color: 'var(--pasture)' }}>Tip:</b> Raw cream thickens and thins with the seasons, so whipping time varies a
                  little.
                </p>
                <p className="recipe__uses">
                  From the shop: <Link href="/category/cow-dairy#raw-heavy-cream">Raw heavy cream</Link>,{' '}
                  <Link href="/category/honey-maple-syrup-and-sweeteners#annies-kitchen-maple-syrup">Maple syrup</Link>,{' '}
                  <Link href="/category/coffee-from-artizan-coffee">Coffee</Link>
                </p>
              </div>
            </article>
            <article className="recipe" id="buttermilk-eggs" style={{ '--tint': '#E1ECD2' } as React.CSSProperties} data-reveal="">
              <div className="recipe__top">
                <div>
                  <span className="label">10 minutes · Serves 2</span>
                  <h3>Buttermilk scrambled eggs</h3>
                </div>
                <img src="/assets/icons/cooking.webp" alt="" width="96" height="96" loading="lazy" />
              </div>
              <div className="recipe__body">
                <h4>You&apos;ll need</h4>
                <ul>
                  <li>4 pastured eggs</li>
                  <li>3 tbsp raw buttermilk</li>
                  <li>A pinch of salt</li>
                  <li>1 tbsp raw butter</li>
                  <li>Chopped chives, to finish</li>
                </ul>
                <h4>Method</h4>
                <ol>
                  <li>Whisk the eggs, buttermilk and salt until smooth.</li>
                  <li>Melt the butter in a pan over low heat.</li>
                  <li>Add the eggs and stir slowly with a spatula, pulling the curds in from the edges.</li>
                  <li>Take the pan off the heat while the eggs are still glossy. They’ll keep cooking. Top with chives.</li>
                </ol>
                <p style={{ margin: '0' }}>
                  <b style={{ color: 'var(--pasture)' }}>Tip:</b> The buttermilk keeps the curds soft. It works in mashed potatoes and
                  pancakes too: anywhere a recipe calls for milk or water.
                </p>
                <p className="recipe__uses">
                  From the shop: <Link href="/category/eggs">Pastured eggs</Link>,{' '}
                  <Link href="/category/cow-dairy#raw-buttermilk">Raw buttermilk</Link>,{' '}
                  <Link href="/category/cow-dairy#raw-grass-fed-butter">Raw butter</Link>
                </p>
              </div>
            </article>
            <article className="recipe" id="warm-dates" style={{ '--tint': '#FBE1DC' } as React.CSSProperties} data-reveal="">
              <div className="recipe__top">
                <div>
                  <span className="label">10 minutes · Serves 2</span>
                  <h3>
                    Warm dates with butter <span className="amp">&amp;</span> cream
                  </h3>
                </div>
                <img src="/assets/icons/palm-tree.webp" alt="" width="96" height="96" loading="lazy" />
              </div>
              <div className="recipe__body">
                <h4>You&apos;ll need</h4>
                <ul>
                  <li>½ cup ground dates</li>
                  <li>1 tbsp grass-fed butter</li>
                  <li>½ tsp cinnamon</li>
                  <li>1 cup raw milk, or ½ cup cream</li>
                  <li>A squeeze of lemon</li>
                </ul>
                <h4>Method</h4>
                <ol>
                  <li>Melt the butter in a small pot over medium-low heat.</li>
                  <li>Stir in the ground dates and cinnamon for a minute, until fragrant.</li>
                  <li>Pour in the milk or cream and simmer for 3 to 4 minutes, stirring, until thick and glossy.</li>
                  <li>Finish with a squeeze of lemon and eat it warm.</li>
                </ol>
                <p style={{ margin: '0' }}>
                  <b style={{ color: 'var(--pasture)' }}>Tip:</b> A cozy breakfast on a cold morning. It’s also good spooned over yogurt.
                </p>
                <p className="recipe__uses">
                  From the shop: <Link href="/category/dates-raisins#ground-dates">Ground dates</Link>,{' '}
                  <Link href="/category/cow-dairy#raw-cow-milk">Raw milk</Link>,{' '}
                  <Link href="/category/cow-dairy#raw-grass-fed-butter">Butter</Link>
                </p>
              </div>
            </article>
            <article className="recipe" id="sweet-couscous" style={{ '--tint': '#DCE7F6' } as React.CSSProperties} data-reveal="">
              <div className="recipe__top">
                <div>
                  <span className="label">20 minutes · Serves 4</span>
                  <h3>Sweet Egyptian couscous</h3>
                </div>
                <img src="/assets/icons/cooked-rice.webp" alt="" width="96" height="96" loading="lazy" />
              </div>
              <div className="recipe__body">
                <h4>You&apos;ll need</h4>
                <ul>
                  <li>1 cup Egyptian couscous</li>
                  <li>1 cup boiling water</li>
                  <li>3 tbsp butter or ghee</li>
                  <li>3 tbsp sugar</li>
                  <li>¼ cup chopped nuts</li>
                  <li>2 tbsp raisins</li>
                  <li>Warm milk, to serve</li>
                </ul>
                <h4>Method</h4>
                <ol>
                  <li>Rub the couscous with 1 tablespoon of melted butter in a bowl.</li>
                  <li>Pour over the boiling water, cover and let it sit for 10 minutes.</li>
                  <li>Fluff with a fork and work in the rest of the butter.</li>
                  <li>Stir in the sugar, top with nuts and raisins, and serve warm with a pitcher of warm milk.</li>
                </ol>
                <p style={{ margin: '0' }}>
                  <b style={{ color: 'var(--pasture)' }}>Tip:</b> For a savory version, skip the sugar and serve it with stewed meat and
                  vegetables.
                </p>
                <p className="recipe__uses">
                  From the shop: <Link href="/category/grains-couscous-pasta-dried-beans#egyptian-couscous">Egyptian couscous</Link>,{' '}
                  <Link href="/category/grass-fed-ghee">Grass-fed ghee</Link>, <Link href="/category/cow-dairy#raw-cow-milk">Raw milk</Link>
                </p>
              </div>
            </article>
            <article className="recipe" id="labneh" style={{ '--tint': '#E8E0F4' } as React.CSSProperties} data-reveal="">
              <div className="recipe__top">
                <div>
                  <span className="label">Overnight · About 1½ cups</span>
                  <h3>Labneh from any yogurt</h3>
                </div>
                <img src="/assets/icons/bowl-with-spoon.webp" alt="" width="96" height="96" loading="lazy" />
              </div>
              <div className="recipe__body">
                <h4>You&apos;ll need</h4>
                <ul>
                  <li>1 quart plain yogurt (cream-top cow or sheep)</li>
                  <li>½ tsp salt</li>
                  <li>Olive oil and za’atar, to serve</li>
                </ul>
                <h4>Method</h4>
                <ol>
                  <li>Stir the salt into the yogurt.</li>
                  <li>Line a sieve with cheesecloth and set it over a bowl. Spoon in the yogurt and fold the cloth over the top.</li>
                  <li>
                    Leave it in the fridge for 12 to 24 hours. The longer it drains, the thicker it gets. Save the whey for baking or
                    smoothies.
                  </li>
                  <li>Spread it on a plate, drizzle with olive oil and shower it with za’atar. Scoop it up with warm bread.</li>
                </ol>
                <p style={{ margin: '0' }}>
                  <b style={{ color: 'var(--pasture)' }}>Tip:</b> Roll very thick labneh into balls and keep them under olive oil in a jar.
                </p>
                <p className="recipe__uses">
                  From the shop: <Link href="/category/cow-dairy#cream-top-yogurt">Cream-top yogurt</Link>,{' '}
                  <Link href="/category/sheep-dairy#raw-sheep-yogurt">Sheep yogurt</Link>,{' '}
                  <Link href="/category/organic-oils-olives-olive-oil-olive-foods">Olive oil &amp; za’atar</Link>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
