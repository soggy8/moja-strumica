import { useCallback, useEffect, useMemo, useState } from 'react'

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
const PROMO_SPOTS_API_URL = '/api/promo-spots'
const ADMIN_PROMO_SPOTS_API_URL = '/api/admin/promo-spots'

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
  const [founderSpotsEdit, setFounderSpotsEdit] = useState('3')
  const [earlyBirdSpotsEdit, setEarlyBirdSpotsEdit] = useState('7')
  const [promoSaveMessage, setPromoSaveMessage] = useState('')
  const [promoSaveType, setPromoSaveType] = useState('')
  const [isSavingPromo, setIsSavingPromo] = useState(false)

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

      try {
        const promoResponse = await fetch(PROMO_SPOTS_API_URL)
        const promoData = await readApiResponse(promoResponse)
        if (promoResponse.ok && promoData) {
          setFounderSpotsEdit(String(promoData.founderSpotsLeft ?? 3))
          setEarlyBirdSpotsEdit(String(promoData.earlyBirdSpotsLeft ?? 7))
        }
      } catch {
        setFounderSpotsEdit('3')
        setEarlyBirdSpotsEdit('7')
      }
    } catch (error) {
      setApplications([])
      setIsLoggedIn(false)
      setStatusType('error')
      setStatusMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function savePromoSpots(event) {
    event.preventDefault()
    setPromoSaveMessage('')
    setPromoSaveType('')

    const founder = Number.parseInt(founderSpotsEdit, 10)
    const earlyBird = Number.parseInt(earlyBirdSpotsEdit, 10)

    if (
      !Number.isFinite(founder) ||
      !Number.isFinite(earlyBird) ||
      founder < 0 ||
      earlyBird < 0 ||
      founder > 100 ||
      earlyBird > 100
    ) {
      setPromoSaveType('error')
      setPromoSaveMessage('Use whole numbers between 0 and 100 for both spot counts.')
      return
    }

    setIsSavingPromo(true)

    try {
      const response = await fetch(ADMIN_PROMO_SPOTS_API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': adminPassword,
        },
        body: JSON.stringify({
          founderSpotsLeft: founder,
          earlyBirdSpotsLeft: earlyBird,
        }),
      })

      const result = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(result?.error || 'Could not save promo spots.')
      }

      setFounderSpotsEdit(String(result.founderSpotsLeft))
      setEarlyBirdSpotsEdit(String(result.earlyBirdSpotsLeft))
      setPromoSaveType('success')
      setPromoSaveMessage('Promo spot counts updated. The public pricing page will show these values on refresh.')
    } catch (error) {
      setPromoSaveType('error')
      setPromoSaveMessage(error.message)
    } finally {
      setIsSavingPromo(false)
    }
  }

  function handleLogout() {
    setAdminPassword('')
    setShowPassword(false)
    setApplications([])
    setStatusMessage('')
    setStatusType('')
    setIsLoggedIn(false)
    setFounderSpotsEdit('3')
    setEarlyBirdSpotsEdit('7')
    setPromoSaveMessage('')
    setPromoSaveType('')
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

          <form className="admin-promo-card" onSubmit={savePromoSpots}>
            <h2 className="admin-promo-title">Pricing page — launch spots</h2>
            <p className="admin-promo-desc">
              These numbers appear on the public &quot;Launch promotions&quot; section. Lower them when a business
              claims a founding or early-bird place.
            </p>
            <div className="admin-promo-fields">
              <label>
                Founding member spots left (max 3)
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={founderSpotsEdit}
                  onChange={(e) => setFounderSpotsEdit(e.target.value)}
                  required
                />
              </label>
              <label>
                Early-bird spots left (max 7)
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={earlyBirdSpotsEdit}
                  onChange={(e) => setEarlyBirdSpotsEdit(e.target.value)}
                  required
                />
              </label>
            </div>
            <button type="submit" className="button-primary" disabled={isSavingPromo}>
              {isSavingPromo ? 'Saving…' : 'Save spot counts'}
            </button>
            {promoSaveMessage && <div className={`application-message ${promoSaveType}`}>{promoSaveMessage}</div>}
          </form>

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
              <a href="#pricing" className="site-navbar-link">
                Pricing
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

const PRICING_FOUNDER_CAP = 3
const PRICING_EARLY_BIRD_CAP = 7

function PricingSection({ founderSpotsLeft, earlyBirdSpotsLeft, onApply }) {
  const founderOpen = Math.max(0, founderSpotsLeft)
  const earlyOpen = Math.max(0, earlyBirdSpotsLeft)
  const founderPct =
    PRICING_FOUNDER_CAP > 0 ? (Math.min(founderOpen, PRICING_FOUNDER_CAP) / PRICING_FOUNDER_CAP) * 100 : 0
  const earlyPct =
    PRICING_EARLY_BIRD_CAP > 0 ? (Math.min(earlyOpen, PRICING_EARLY_BIRD_CAP) / PRICING_EARLY_BIRD_CAP) * 100 : 0

  return (
    <section className="section-block pricing-section" id="pricing">
      <div className="section-heading">
        <p className="eyebrow">For businesses</p>
        <h2>Pricing and launch offers.</h2>
        <p>
          Monthly plans for visibility inside Moja Strumica. Prices are per month unless a promotion says otherwise.
        </p>
        <p className="mk-copy">
          Месечни планови за присуство во Моја Струмица. Цените се месечно освен каде што е наведена промоција.
        </p>
      </div>

      <div className="pricing-grid">
        <article className="pricing-card">
          <h3 className="pricing-card-title">Basic</h3>
          <p className="pricing-card-price">
            <span className="pricing-amount">€30</span>
            <span className="pricing-period">/ month</span>
          </p>
          <ul className="pricing-list">
            <li>Business account and profile in the app</li>
            <li>One complimentary 15-second promo video for your business</li>
            <li>Up to 3 notifications per month to all app users</li>
          </ul>
          <p className="pricing-card-mk">Основен профил, бесплатен 15-сек. промо видео, до 3 известувања месечно.</p>
        </article>

        <article className="pricing-card pricing-card--featured">
          <p className="pricing-card-ribbon">Popular</p>
          <h3 className="pricing-card-title">Premium</h3>
          <p className="pricing-card-price">
            <span className="pricing-amount">€60</span>
            <span className="pricing-period">/ month</span>
          </p>
          <ul className="pricing-list">
            <li>Business account and profile in the app</li>
            <li>One complimentary 15-second promo video for your business</li>
            <li>Up to 3 notifications per month to all app users</li>
            <li>Complimentary small website for your business</li>
            <li>Dedicated space for your advertisement in the app</li>
          </ul>
          <p className="pricing-card-mk">
            Профил, 15-сек. промо видео, до 3 известувања месечно, мала веб-страница, рекламен простор во апликацијата.
          </p>
        </article>

        <article className="pricing-card">
          <h3 className="pricing-card-title">Ultra</h3>
          <p className="pricing-card-price">
            <span className="pricing-amount">€100</span>
            <span className="pricing-period">/ month</span>
          </p>
          <ul className="pricing-list">
            <li>Business account and profile in the app</li>
            <li>One complimentary 15-second promo video for your business</li>
            <li>Complimentary small website for your business</li>
            <li>Advertising presence inside the app</li>
            <li>Up to one push notification every day to all app users</li>
            <li>Top priority placement for your in-app advertisement</li>
          </ul>
          <p className="pricing-card-mk">
            Профил, промо видео, веб-страница, реклама во апликацијата, известување секој ден, највидна рекламна
            позиција.
          </p>
        </article>
      </div>

      <div className="pricing-promos-block">
        <div className="pricing-promos-intro-wrap">
          <h3 className="pricing-promos-heading">Launch promotions</h3>
          <p className="pricing-promos-intro">
            Two limited <strong>pre-launch waves</strong> (founding + early bird), then a separate{' '}
            <strong>hospitality bundle</strong> for food &amp; drink venues. Spots update when you refresh the page.
          </p>
          <ul className="pricing-promos-legend" aria-label="How to read this section">
            <li>
              <span className="pricing-legend-key" aria-hidden="true">
                1
              </span>
              <span>Wave 1 — rarest slots, longest free period.</span>
            </li>
            <li>
              <span className="pricing-legend-key" aria-hidden="true">
                2
              </span>
              <span>Wave 2 — still before launch, different billing timing.</span>
            </li>
            <li>
              <span className="pricing-legend-key pricing-legend-key--special" aria-hidden="true">
                ★
              </span>
              <span>Special — menus + QR, then pick Premium or Ultra pricing.</span>
            </li>
          </ul>
        </div>

        <div className="pricing-promos-limited">
          <article className="pricing-promo-card pricing-promo-card--accent">
            <div className="pricing-promo-card-head">
              <span className="pricing-promo-step" aria-hidden="true">
                1
              </span>
              <div className="pricing-promo-head-text">
                <p className="pricing-promo-eyebrow">Wave 1 · max {PRICING_FOUNDER_CAP} businesses</p>
                <h4 className="pricing-promo-title">Founding members</h4>
              </div>
            </div>

            <div
              className="pricing-spots-widget"
              role="group"
              aria-label={`Founding member spots: ${founderOpen} still available (out of ${PRICING_FOUNDER_CAP})`}
            >
              <div className="pricing-spots-widget-top">
                <span className="pricing-spots-widget-label">Availability</span>
                <span className="pricing-spots-fraction">
                  <strong>{founderOpen}</strong>
                  <span className="pricing-spots-inline-suffix">
                    of {PRICING_FOUNDER_CAP} founding spots still open
                  </span>
                </span>
              </div>
              <div
                className="pricing-spots-bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={PRICING_FOUNDER_CAP}
                aria-valuenow={Math.min(founderOpen, PRICING_FOUNDER_CAP)}
                aria-label="Share of founding slots still open"
              >
                <div className="pricing-spots-bar-fill" style={{ width: `${founderPct}%` }} />
              </div>
            </div>

            <ol className="pricing-promo-timeline">
              <li>
                <span className="pricing-timeline-label">Months 1–3</span>
                <span className="pricing-timeline-value">Free</span>
              </li>
              <li>
                <span className="pricing-timeline-label">Months 4–6</span>
                <span className="pricing-timeline-value">Ultra €50/mo (3 paid months)</span>
              </li>
              <li>
                <span className="pricing-timeline-label">From month 7</span>
                <span className="pricing-timeline-value">Ultra €50/mo while active</span>
              </li>
            </ol>

            <p className="pricing-promo-body">
              The first three businesses get <strong>three months free</strong>. The <strong>next three months</strong> are
              each billed at <strong>Ultra €50/month</strong>. After that, the <strong>same €50/month Ultra</strong>{' '}
              continues for as long as you stay subscribed.
            </p>
            <p className="pricing-promo-mk">
              Првите 3 месеци бесплатно, потоа <strong>следните 3 месеци по 50 € месечно</strong> (Ултра), потоа{' '}
              <strong>истата цена</strong> додека сте активни.
            </p>
          </article>

          <article className="pricing-promo-card pricing-promo-card--wave2">
            <div className="pricing-promo-card-head">
              <span className="pricing-promo-step" aria-hidden="true">
                2
              </span>
              <div className="pricing-promo-head-text">
                <p className="pricing-promo-eyebrow">Wave 2 · max {PRICING_EARLY_BIRD_CAP} businesses</p>
                <h4 className="pricing-promo-title">Early bird</h4>
              </div>
            </div>

            <div
              className="pricing-spots-widget"
              role="group"
              aria-label={`Early bird spots: ${earlyOpen} still available (out of ${PRICING_EARLY_BIRD_CAP})`}
            >
              <div className="pricing-spots-widget-top">
                <span className="pricing-spots-widget-label">Availability</span>
                <span className="pricing-spots-fraction">
                  <strong>{earlyOpen}</strong>
                  <span className="pricing-spots-inline-suffix">
                    of {PRICING_EARLY_BIRD_CAP} early-bird spots still open
                  </span>
                </span>
              </div>
              <div
                className="pricing-spots-bar pricing-spots-bar--wave2"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={PRICING_EARLY_BIRD_CAP}
                aria-valuenow={Math.min(earlyOpen, PRICING_EARLY_BIRD_CAP)}
                aria-label="Share of early bird slots still open"
              >
                <div className="pricing-spots-bar-fill" style={{ width: `${earlyPct}%` }} />
              </div>
            </div>

            <ul className="pricing-promo-highlights">
              <li>
                <strong>Billing starts</strong> at public launch
              </li>
              <li>
                <strong>Ultra locks in</strong> at €50/month while your subscription stays active
              </li>
            </ul>

            <p className="pricing-promo-body">
              The next seven businesses <strong>start paying from launch</strong> and keep{' '}
              <strong>Ultra for €50/month</strong> for the lifetime of an active subscription.
            </p>
            <p className="pricing-promo-mk">
              Следните 7: плаќање од лансирање и заклучена Ултра цена од 50 € месечно додека сте активни.
            </p>
          </article>
        </div>

        <article className="pricing-promo-card pricing-promo-card--hospitality">
          <div className="pricing-promo-card-head pricing-promo-card-head--wide">
            <span className="pricing-promo-step pricing-promo-step--special" aria-hidden="true">
              ★
            </span>
            <div className="pricing-promo-head-text">
              <p className="pricing-promo-eyebrow">Hospitality · menus &amp; QR</p>
              <h4 className="pricing-promo-title">Venue bundle (restaurants, cafés, bars)</h4>
            </div>
            <p className="pricing-promo-price-tag">
              <span className="pricing-promo-price-amount">€300</span>
              <span className="pricing-promo-price-note">one-time setup</span>
            </p>
          </div>

          <div className="pricing-promo-hospitality-grid">
            <div className="pricing-promo-hospitality-includes">
              <p className="pricing-promo-includes-title">Included in setup</p>
              <ul className="pricing-promo-checklist">
                <li>Website menu page</li>
                <li>Matching in-app menu</li>
                <li>QR codes for tables &amp; print</li>
              </ul>
            </div>
            <div className="pricing-promo-hospitality-after">
              <p className="pricing-promo-includes-title">Then choose monthly</p>
              <ul className="pricing-promo-checklist pricing-promo-checklist--compact">
                <li>
                  <strong>Premium</strong> — €50/mo
                </li>
                <li>
                  <strong>Ultra</strong> — €70/mo
                </li>
              </ul>
            </div>
          </div>

          <p className="pricing-promo-body pricing-promo-body--flush">
            Built for venues that want guests scanning once and seeing the same offers on the web and in the app.
          </p>
          <p className="pricing-promo-mk">
            Угостителство: 300 € еднократно за веб и апликациско мени + QR. Потоа Premium 50 € или Ultra 70 € месечно.
          </p>
        </article>

        <div className="pricing-cta-row">
          <button type="button" className="button-primary" onClick={onApply}>
            Apply as a business
          </button>
          <p className="pricing-cta-note">
            Not sure which offer applies? Note it in your application and we will confirm before you pay anything.
          </p>
        </div>
      </div>
    </section>
  )
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onDismiss()
      }}
    >
      <div className="welcome-dialog welcome-dialog--mk">
        <div className="welcome-dialog-header">
          <span className="welcome-dialog-brand" aria-hidden="true">
            Moja Strumica
          </span>
          <button type="button" className="welcome-close-btn" onClick={onDismiss} aria-label="Затвори го прозорецот">
            ×
          </button>
        </div>

        <p className="welcome-eyebrow">Проект за градот · пред лансирање</p>
        <h2 id="welcome-dialog-title" className="welcome-dialog-title">
          Добредојдовте
        </h2>
        <p className="welcome-dialog-subtitle">Краток преглед пред стартот на апликацијата.</p>

        <div className="welcome-dialog-block">
          <p className="welcome-dialog-label">Што е Моја Струмица?</p>
          <p id="welcome-dialog-desc" className="welcome-dialog-lead">
            Градска супер апликација за Струмица — локални вести, достава на храна, пазарување, цени, настани, услуги и
            бизниси на едно место. Стартува на <strong>10 јуни 2026</strong>.
          </p>
        </div>

        <div className="welcome-dialog-block">
          <p className="welcome-dialog-label">Заинтересиран бизнис?</p>
          <p className="welcome-dialog-lead">
            Можеш да резервираш <strong>бесплатно место</strong> уште пред стартот — продавница, ресторан, салон, услуга
            или бренд — за да те наоѓаат жителите на Струмица директно во апликацијата.
          </p>
        </div>

        <p className="welcome-dialog-hook">Аплицирањето е бесплатно. Прозорецов можете да го затворите во секое време.</p>

        <div className="welcome-dialog-actions">
          <button type="button" className="welcome-apply-btn" onClick={onApply}>
            Аплицирај бесплатно
          </button>
          <button type="button" className="welcome-dismiss-btn" onClick={onDismiss}>
            Само преглед на сајтот
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('home')
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [promoSpots, setPromoSpots] = useState({ founder: 3, earlyBird: 7 })
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
    let cancelled = false

    ;(async () => {
      try {
        const response = await fetch(PROMO_SPOTS_API_URL)
        const data = await readApiResponse(response)
        if (cancelled || !response.ok || !data) return
        setPromoSpots({
          founder: data.founderSpotsLeft ?? 3,
          earlyBird: data.earlyBirdSpotsLeft ?? 7,
        })
      } catch {
        /* keep defaults */
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const dismissWelcomeModal = useCallback(() => {
    setShowWelcomeModal(false)
  }, [])

  const applyFromWelcomeModal = useCallback(() => {
    setShowWelcomeModal(false)
    setActivePage('application')
  }, [])

  function goHome() {
    setActivePage('home')
    setShowWelcomeModal(true)
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
              <a href="#pricing" className="button-secondary">
                Pricing
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

        <PricingSection
          founderSpotsLeft={promoSpots.founder}
          earlyBirdSpotsLeft={promoSpots.earlyBird}
          onApply={() => setActivePage('application')}
        />

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
