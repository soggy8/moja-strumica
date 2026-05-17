import { useCallback, useEffect, useMemo, useState } from 'react'

const WELCOME_DISMISSED_KEY = 'moja-strumica-welcome-dismissed'

const launchDate = new Date('2026-06-10T00:00:00+02:00')

const appShowcase = [
  {
    eyebrow: 'Home / Дома',
    title: 'Start with what matters today',
    mkTitle: 'Започни со она што ти треба денес',
    text: 'Promoted local spots, a fast path into every category, space for short offers, and a peek at city events—all from one calm home screen.',
    mkText:
      'Промовирани локални места, брз пристап до категории, место за кратки понуди и преглед на градски настани—се на еден екран.',
    image: '/screenshots/home.png',
    imageAlt: 'Moja Strumica home screen with promoted offers, categories, and city events',
  },
  {
    eyebrow: 'News / Вести',
    title: 'Stay close to what Strumica is talking about',
    mkTitle: 'Следи што зборува Струмица',
    text: 'A curated feed for local headlines, announcements, weekend plans, and business updates—with clear tags, dates, and read-more links.',
    mkText:
      'Курирана лента за локални наслови, соопштенија, викенд планови и бизнис вести—со ознаки, датуми и линк „прочитај повеќе“.',
    image: '/screenshots/news.png',
    imageAlt: 'News feed in Moja Strumica listing local stories and announcements',
  },
  {
    eyebrow: 'Categories / Категории',
    title: 'Everyday city topics, organized for quick jumps',
    mkTitle: 'Градски теми, подредени за брз избор',
    text: 'News, food, shopping, price checks, salons, and events each get their own entry point—so browsing feels simple, not scattered across browsers and groups.',
    mkText:
      'Вести, храна, пазарување, цени, салони и настани имаат свои влезови—наместо да лутеш низ груби и групи.',
    image: '/screenshots/categories.png',
    imageAlt: 'Category list in Moja Strumica with icons for news, food, shopping, and more',
  },
  {
    eyebrow: 'Food / Храна',
    title: 'See who is open, then act in one tap',
    mkTitle: 'Види кој е отворен и продолжи со еден допир',
    text: 'Rich photos, open status, favorites, and action chips for delivery or menu links help you decide fast—without leaving the app.',
    mkText:
      'Фотографии, статус „отворено“, омилени и копчиња за достава или мени те водат побрзо—без скокање меѓу апликации.',
    image: '/screenshots/food.png',
    imageAlt: 'Food listings with images, open badges, and delivery or menu tags',
  },
  {
    eyebrow: 'Place profile / Профил на место',
    title: 'From story to call, map, or menu',
    mkTitle: 'Од опис до повик, мапа или мени',
    text: 'Each place can show highlights, tags, today’s hours, and direct actions—call, Viber, maps, and menu—plus save it to favorites.',
    mkText:
      'Секое место може да покаже клучни точки, тагови, денешни часови и директни акции—повик, Viber, мапа и мени—и зачувување во омилени.',
    image: '/screenshots/place.png',
    imageAlt: 'Business profile with photos, key points, hours, and contact actions',
  },
]

const stats = [
  { value: '10', label: 'June launch', mkLabel: 'Лансирање во јуни' },
  { value: '24/7', label: 'City updates', mkLabel: 'Градски новости' },
  { value: '1', label: 'App for everything', mkLabel: 'Апликација за се' },
]

const APPLICATION_API_URL = '/api/applications'
const ADMIN_APPLICATIONS_API_URL = '/api/admin/applications'

async function readApiResponse(response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    if (text.trimStart().startsWith('<')) {
      throw new Error(
        'The server returned a web page instead of API data. In Caddy, proxy /api/* to the moja-strumica gunicorn port (see systemd unit, often 5052) before the SPA fallback.',
      )
    }

    throw new Error('The server returned an invalid API response.')
  }
}

const emptyApplicationForm = {
  name: '',
  surname: '',
  companyName: '',
  email: '',
  phone: '',
}

function ApplicationPage({ onBack }) {
  const [formData, setFormData] = useState(emptyApplicationForm)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setIsSubmitting(true)
    setStatusMessage('')
    setStatusType('')

    try {
      const response = await fetch(APPLICATION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          company_name: formData.companyName,
          email: formData.email,
          phone: formData.phone,
        }),
      })

      const result = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(result?.error || 'Application could not be submitted.')
      }

      setStatusType('success')
      setStatusMessage('Application submitted successfully. We will contact you soon.')
      setFormData(emptyApplicationForm)
    } catch (error) {
      setStatusType('error')
      setStatusMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell application-shell">
      <div className="application-nav section-grid">
        <button type="button" className="button-secondary" onClick={onBack}>
          ← Back to home
        </button>
        <span>Business applications / Апликации за бизниси</span>
      </div>

      <section className="application-page section-grid">
        <div className="application-copy">
          <p className="eyebrow">Apply for a place in the app</p>
          <h1>Bring your brand into Moja Strumica.</h1>
          <p className="lead">
            Companies, brands, shops, restaurants, salons, services, and local businesses can apply to be listed inside
            the app before launch — applying is free and there is no fee to submit this form or reserve a pre-launch
            spot.
          </p>
          <p className="lead lead-mk">
            Компании, брендови, продавници, ресторани, салони, услуги и локални бизниси можат да аплицираат за место
            во апликацијата пред лансирање — аплицирањето е бесплатно и нема никаква такса за аплицирање ниту за место пред
            лансирање.
          </p>
        </div>

        <form className="application-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <p className="eyebrow">Application form</p>
            <h2>Submit your details.</h2>
          </div>

          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </label>

          <label>
            Surname
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Enter your surname"
              required
            />
          </label>

          <label>
            Company name
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="company@email.com"
              required
            />
          </label>

          <label>
            Phone number
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+389 XX XXX XXX"
              required
            />
          </label>

          {statusMessage && <div className={`application-message ${statusType}`}>{statusMessage}</div>}

          <button type="submit" className="button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit application'}
          </button>

          <p className="form-note">
            Each email and phone number can submit only one application.
          </p>
        </form>
      </section>
    </main>
  )
}

function AdminPage({ onBack }) {
  const [adminPassword, setAdminPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [applications, setApplications] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  async function loadApplications(event) {
    event.preventDefault()

    setIsLoading(true)
    setStatusMessage('')
    setStatusType('')

    try {
      const response = await fetch(ADMIN_APPLICATIONS_API_URL, {
        method: 'GET',
        headers: {
          'X-Admin-Password': adminPassword,
        },
      })

      const result = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(result?.error || 'Could not load applications.')
      }

      const loadedApplications = Array.isArray(result?.applications) ? result.applications : []

      setApplications(loadedApplications)
      setIsLoggedIn(true)
      setStatusType('success')
      setStatusMessage(`Loaded ${loadedApplications.length} application(s).`)
    } catch (error) {
      setApplications([])
      setIsLoggedIn(false)
      setStatusType('error')
      setStatusMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleLogout() {
    setAdminPassword('')
    setShowPassword(false)
    setApplications([])
    setStatusMessage('')
    setStatusType('')
    setIsLoggedIn(false)
  }

  function formatDate(dateValue) {
    if (!dateValue) return '-'

    return new Date(dateValue.replace(' ', 'T')).toLocaleString()
  }

  return (
    <main className="page-shell admin-shell">
      <div className="application-nav section-grid">
        <button type="button" className="button-secondary" onClick={onBack}>
          ← Back to home
        </button>
        <span>Admin access</span>
      </div>

      {!isLoggedIn ? (
        <section className="admin-page section-grid">
          <div className="section-heading">
            <p className="eyebrow">Admin login</p>
            <h1>Login</h1>
            <p>Enter the admin password to view submitted business applications.</p>
          </div>

          <form className="admin-login-card" onSubmit={loadApplications}>
            <label>
              Admin password
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  placeholder="Enter admin password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((currentValue) => !currentValue)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <button type="submit" className="button-primary" disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Login'}
            </button>

            {statusMessage && <div className={`application-message ${statusType}`}>{statusMessage}</div>}
          </form>
        </section>
      ) : (
        <section className="admin-page section-grid">
          <div className="admin-header-row">
            <div className="section-heading">
              <p className="eyebrow">Admin panel</p>
              <h1>Applications</h1>
              <p>View all businesses that applied for a place inside Moja Strumica.</p>
            </div>

            <button type="button" className="button-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {statusMessage && <div className={`application-message ${statusType}`}>{statusMessage}</div>}

          <div className="admin-table-card">
            {applications.length === 0 ? (
              <p className="admin-empty">No applications have been submitted yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Surname</th>
                      <th>Company</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id}>
                        <td>{application.id}</td>
                        <td>{application.name}</td>
                        <td>{application.surname}</td>
                        <td>{application.company_name}</td>
                        <td>{application.email}</td>
                        <td>{application.phone}</td>
                        <td>{formatDate(application.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}

function SiteNavbar({ page, onGoHome, onGoApply }) {
  function handleBrandClick() {
    if (page !== 'home') onGoHome()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="site-navbar">
      <nav className="site-navbar-shell section-grid" aria-label="Primary navigation">
        <button type="button" className="site-navbar-brand" onClick={handleBrandClick}>
          <span className="site-navbar-logo-dot" aria-hidden />
          <span>Moja Strumica</span>
        </button>

        <div className="site-navbar-links">
          {page === 'home' ? (
            <>
              <a href="#countdown" className="site-navbar-link">
                Countdown
              </a>
              <a href="#features" className="site-navbar-link">
                Features
              </a>
            </>
          ) : (
            <span className={`site-navbar-pill-label ${page === 'admin' ? 'is-muted' : ''}`}>
              {page === 'application' ? 'Business application' : 'Admin'}
            </span>
          )}
        </div>

        <div className="site-navbar-cta-wrap">
          {page === 'home' ? (
            <button type="button" className="button-primary site-navbar-cta" onClick={onGoApply}>
              Apply free
            </button>
          ) : (
            <button type="button" className="site-navbar-home-link" onClick={onGoHome}>
              ← Home
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}

function getTimeRemaining() {
  const total = Math.max(launchDate.getTime() - Date.now(), 0)
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))

  return { total, days, hours, minutes, seconds }
}

function WelcomeModal({ open, onApply, onDismiss }) {
  useEffect(() => {
    if (!open) return

    function handleEscape(event) {
      if (event.key === 'Escape') onDismiss()
    }

    document.addEventListener('keydown', handleEscape)
    const overflowBefore = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = overflowBefore
    }
  }, [open, onDismiss])

  if (!open) return null

  return (
    <div
      className="welcome-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-dialog-title"
      aria-describedby="welcome-dialog-desc"
      lang="mk"
    >
      <div className="welcome-dialog welcome-dialog--mk">
        <p className="eyebrow">Пред лансирање</p>
        <h2 id="welcome-dialog-title" className="welcome-dialog-title">
          Аплицирај бесплатно
        </h2>
        <div className="welcome-dialog-block">
          <p className="welcome-dialog-label">Што е Моја Струмица?</p>
          <p id="welcome-dialog-desc" className="welcome-dialog-lead">
            Градска супер апликација за Струмица — локални вести, достава на храна, пазарување, цени, настани, услуги и
            бизниси на едно место. Стартува на <strong>10 јуни 2026</strong>.
          </p>
        </div>

        <div className="welcome-dialog-block">
          <p className="welcome-dialog-label">За што аплицираш?</p>
          <p className="welcome-dialog-lead">
            Резервираш <strong>бесплатно место</strong> за твојот бизнис уште пред стартот — продавница, ресторан, салон,
            услуга или бренд — за да те наоѓаат жителите на Струмица директно во апликацијата, без посредници.
          </p>
        </div>

        <p className="welcome-dialog-hook">
          Аплицирањето е бесплатно · Придружи се рано додека има слободни места
        </p>

        <button type="button" className="welcome-apply-btn" onClick={onApply}>
          Аплицирај сега — бесплатно
        </button>

        <button type="button" className="welcome-dismiss-link" onClick={onDismiss}>
          Продолжи со прегледување
        </button>
      </div>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('home')
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
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

  useEffect(() => {
    try {
      const forceWelcome = new URLSearchParams(window.location.search).get('welcome') === '1'
      if (forceWelcome) {
        localStorage.removeItem(WELCOME_DISMISSED_KEY)
        setShowWelcomeModal(true)
        return
      }
      if (!localStorage.getItem(WELCOME_DISMISSED_KEY)) setShowWelcomeModal(true)
    } catch {
      setShowWelcomeModal(true)
    }
  }, [])

  const dismissWelcomeModal = useCallback(() => {
    try {
      localStorage.setItem(WELCOME_DISMISSED_KEY, '1')
    } catch {
      /* ignore */
    }
    setShowWelcomeModal(false)
  }, [])

  const applyFromWelcomeModal = useCallback(() => {
    try {
      localStorage.setItem(WELCOME_DISMISSED_KEY, '1')
    } catch {
      /* ignore */
    }
    setShowWelcomeModal(false)
    setActivePage('application')
  }, [])

  function goHome() {
    setActivePage('home')
  }

  if (activePage === 'application') {
    return (
      <>
        <SiteNavbar page="application" onGoHome={goHome} onGoApply={() => setActivePage('application')} />
        <ApplicationPage onBack={goHome} />
      </>
    )
  }

  if (activePage === 'admin') {
    return (
      <>
        <SiteNavbar page="admin" onGoHome={goHome} onGoApply={() => setActivePage('application')} />
        <AdminPage onBack={goHome} />
      </>
    )
  }

  return (
    <>
      <SiteNavbar page="home" onGoHome={goHome} onGoApply={() => setActivePage('application')} />
      <main className="page-shell">
        <WelcomeModal open={showWelcomeModal} onApply={applyFromWelcomeModal} onDismiss={dismissWelcomeModal} />
        <section className="hero section-grid">
          <div className="hero-copy">
            <p className="eyebrow">Coming to Strumica on June 10</p>
            <h1>Moja Strumica is almost here.</h1>
            <p className="lead">
              The city super app that brings local news, food delivery, shopping, prices, services, events, salons,
              local businesses, and everyday information into one place.
            </p>
            <p className="lead lead-mk">
              Градската супер апликација што ги собира локалните вести, доставата на храна, пазарувањето, цените,
              услугите, настаните, салоните, локалните бизниси и секојдневните информации на едно место.
            </p>
            <div className="hero-actions" aria-label="Launch information">
              <button type="button" className="button-primary" onClick={() => setActivePage('application')}>
                Apply as a business for free
              </button>
              <a href="#countdown" className="button-secondary">
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
                <span>Events tonight</span>
                <span>Barbers and salons</span>
                <span>Best prices</span>
                <span>City services</span>
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
            <h2>Launching June 10, 2026.</h2>
            <p>Лансирање на 10 јуни 2026. Струмица добива една апликација за секојдневниот градски живот.</p>
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
            <h2>See the app before launch.</h2>
            <p>
              Real screens from the build: home, news, categories, food discovery, and business profiles. Моја Струмица
              ги врзува луѓето, бизнисите и информациите што го движат градот—овде е како тоа изгледа во раката.
            </p>
          </div>

          <div className="showcase-stack">
            {appShowcase.map((item, index) => (
              <article
                className={`showcase-row${index % 2 === 1 ? ' showcase-row--reverse' : ''}`}
                key={item.title}
              >
                <div className="showcase-copy">
                  <p className="eyebrow">{item.eyebrow}</p>
                  <h3 className="showcase-title">{item.title}</h3>
                  <h4 className="showcase-mk-title">{item.mkTitle}</h4>
                  <p>{item.text}</p>
                  <p className="mk-copy">{item.mkText}</p>
                </div>
                <figure className="showcase-device">
                  <div className="phone-frame phone-frame--screenshot">
                    <div className="phone-screen">
                      <img src={item.image} alt={item.imageAlt} width={390} height={844} loading="lazy" decoding="async" />
                    </div>
                  </div>
                </figure>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-panel">
          <div>
            <p className="eyebrow">Be ready</p>
            <h2>Strumica, your app is coming.</h2>
            <p>
              Stay close. On June 10, Moja Strumica starts bringing the city together in a faster, simpler way, with
              more of the places, services, events, and daily decisions people actually need.
            </p>
            <p className="mk-copy">
              Биди подготвен. На 10 јуни, Моја Струмица почнува да го поврзува градот на побрз и поедноставен начин,
              со повеќе места, услуги, настани и секојдневни одлуки што навистина им требаат на луѓето.
            </p>
          </div>
          <button type="button" className="button-primary" onClick={() => setActivePage('application')}>
            Apply for a spot
          </button>
        </section>
        <button
          type="button"
          className="hidden-admin-button"
          onClick={() => setActivePage('admin')}
          aria-label="Admin access"
        />

      </main>
    </>
  )
}

export default App
