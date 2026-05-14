import { useEffect, useMemo, useState } from 'react'

const launchDate = new Date('2026-06-01T00:00:00+02:00')

const features = [
  {
    title: 'News portals',
    mkTitle: 'Новински портали',
    text: 'Follow local headlines, announcements, and everything people in Strumica are talking about.',
    mkText: 'Следи локални вести, соопштенија и се за што зборува Струмица.',
  },
  {
    title: 'Food delivery',
    mkTitle: 'Достава на храна',
    text: 'Order from favorite restaurants, cafes, and bakeries without jumping between different apps.',
    mkText: 'Нарачувај од омилени ресторани, кафулиња и пекари без менување апликации.',
  },
  {
    title: 'Shopping',
    mkTitle: 'Пазарување',
    text: 'Discover local stores, promotions, new products, and everyday essentials around the city.',
    mkText: 'Откривај локални продавници, промоции, нови производи и секојдневни потреби.',
  },
  {
    title: 'Price checks',
    mkTitle: 'Проверка на цени',
    text: 'Compare prices faster and find the best option before you buy.',
    mkText: 'Споредувај цени побрзо и најди ја најдобрата опција пред купување.',
  },
]

const stats = [
  { value: '01', label: 'June launch', mkLabel: 'Лансирање во јуни' },
  { value: '24/7', label: 'City updates', mkLabel: 'Градски новости' },
  { value: '1', label: 'App for everything', mkLabel: 'Апликација за се' },
]

function getTimeRemaining() {
  const total = Math.max(launchDate.getTime() - Date.now(), 0)
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))

  return { total, days, hours, minutes, seconds }
}

function App() {
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining())
  const countdownItems = useMemo(
    () => [
      { value: timeRemaining.days, label: 'Days', mkLabel: 'Дена' },
      { value: timeRemaining.hours, label: 'Hours', mkLabel: 'Часа' },
      { value: timeRemaining.minutes, label: 'Minutes', mkLabel: 'Минути' },
      { value: timeRemaining.seconds, label: 'Seconds', mkLabel: 'Секунди' },
    ],
    [timeRemaining],
  )

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(getTimeRemaining())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <main className="page-shell">
      <section className="hero section-grid">
        <div className="hero-copy">
          <p className="eyebrow">Coming to Strumica on June 1</p>
          <h1>Moja Strumica is almost here.</h1>
          <p className="lead">
            The city super app that brings local news, food delivery, shopping, prices, services, and everyday
            information into one place.
          </p>
          <p className="lead lead-mk">
            Градската супер апликација што ги собира локалните вести, доставата на храна, пазарувањето, цените,
            услугите и секојдневните информации на едно место.
          </p>
          <div className="hero-actions" aria-label="Launch information">
            <a href="#countdown" className="button-primary">
              Watch the countdown
            </a>
            <a href="#features" className="button-secondary">
              See what is coming
            </a>
          </div>
        </div>

        <div className="app-preview" aria-label="Moja Strumica app preview">
          <div className="phone-frame">
            <div className="phone-status">
              <span>9:41</span>
              <span>Moja Strumica</span>
            </div>
            <div className="phone-card spotlight-card">
              <span className="card-label">Today / Денес</span>
              <strong>Everything in Strumica, one tap away.</strong>
            </div>
            <div className="phone-list">
              <span>Latest news</span>
              <span>Food nearby</span>
              <span>Best prices</span>
              <span>Local shopping</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip" aria-label="Launch highlights">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <small>{stat.mkLabel}</small>
          </div>
        ))}
      </section>

      <section className="section-block" id="countdown">
        <div className="section-heading">
          <p className="eyebrow">The countdown has started</p>
          <h2>Launching June 1, 2026.</h2>
          <p>Лансирање на 1 јуни 2026. Струмица добива една апликација за секојдневниот градски живот.</p>
        </div>

        <div className="countdown-grid" aria-live="polite">
          {countdownItems.map((item) => (
            <div className="countdown-card" key={item.label}>
              <strong>{String(item.value).padStart(2, '0')}</strong>
              <span>{item.label}</span>
              <small>{item.mkLabel}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block feature-section" id="features">
        <div className="section-heading">
          <p className="eyebrow">Built for everyday city life</p>
          <h2>One app for the things Strumica needs most.</h2>
          <p>
            Моја Струмица ќе ги поврзе луѓето, бизнисите и информациите што го движат градот секој ден.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-dot" />
              <h3>{feature.title}</h3>
              <h4>{feature.mkTitle}</h4>
              <p>{feature.text}</p>
              <p className="mk-copy">{feature.mkText}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <p className="eyebrow">Be ready</p>
          <h2>Strumica, your app is coming.</h2>
          <p>
            Stay close. On June 1, Moja Strumica starts bringing the city together in a faster, simpler way.
          </p>
          <p className="mk-copy">
            Биди подготвен. На 1 јуни, Моја Струмица почнува да го поврзува градот на побрз и поедноставен начин.
          </p>
        </div>
        <a href="#countdown" className="button-primary">
          Countdown to launch
        </a>
      </section>
    </main>
  )
}

export default App
