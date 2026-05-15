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
  {
    title: 'Barbers and salons',
    mkTitle: 'Бербери и салони',
    text: 'Find barbers, cosmetic salons, beauty studios, wellness spots, and appointment-ready services.',
    mkText: 'Најди бербери, козметички салони, студија за убавина, велнес места и услуги со термин.',
  },
  {
    title: 'Concerts and events',
    mkTitle: 'Концерти и настани',
    text: 'See upcoming concerts, parties, festivals, sports, culture, and weekend plans before they pass you by.',
    mkText: 'Следи концерти, забави, фестивали, спорт, култура и викенд планови пред да поминат.',
  },
  {
    title: 'Kids and families',
    mkTitle: 'Детски и семејни настани',
    text: 'Discover kids events, workshops, birthday places, activities, playgrounds, and family-friendly ideas.',
    mkText: 'Откриј детски настани, работилници, родендени, активности, игралишта и семејни идеи.',
  },
  {
    title: 'City directory',
    mkTitle: 'Градски именик',
    text: 'Explore pharmacies, doctors, gyms, mechanics, taxis, real estate, jobs, ads, and useful local contacts.',
    mkText: 'Пребарај аптеки, доктори, теретани, мајстори, такси, недвижности, работа, огласи и локални контакти.',
  },
]

const stats = [
  { value: '01', label: 'June launch', mkLabel: 'Лансирање во јуни' },
  { value: '24/7', label: 'City updates', mkLabel: 'Градски новости' },
  { value: '1', label: 'App for everything', mkLabel: 'Апликација за се' },
]

const APPLICATION_API_URL = 'http://127.0.0.1:5000/api/applications'
const ADMIN_APPLICATIONS_API_URL = 'http://127.0.0.1:5000/api/admin/applications'

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

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Application could not be submitted.')
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
            the app before launch.
          </p>
          <p className="lead lead-mk">
            Компании, брендови, продавници, ресторани, салони, услуги и локални бизниси можат да аплицираат за место
            во апликацијата пред лансирање.
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

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Could not load applications.')
      }

      const loadedApplications = Array.isArray(result.applications) ? result.applications : []

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

function getTimeRemaining() {
  const total = Math.max(launchDate.getTime() - Date.now(), 0)
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))

  return { total, days, hours, minutes, seconds }
}

function App() {
  const [activePage, setActivePage] = useState('home')
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

  if (activePage === 'application') {
    return <ApplicationPage onBack={() => setActivePage('home')} />
  }

  if (activePage === 'admin') {
    return <AdminPage onBack={() => setActivePage('home')} />
  }

  return (
    <main className="page-shell">
      <section className="hero section-grid">
        <div className="hero-copy">
          <p className="eyebrow">Coming to Strumica on June 1</p>
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
              Apply as a business
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
          <h2>One app for almost everything Strumica needs.</h2>
          <p>
            From news, food, shopping, and prices to barbers, cosmetic salons, concerts, kids events, jobs, taxis,
            doctors, gyms, and local services. Моја Струмица ќе ги поврзе луѓето, бизнисите и информациите што го
            движат градот секој ден.
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
            Stay close. On June 1, Moja Strumica starts bringing the city together in a faster, simpler way, with
            more of the places, services, events, and daily decisions people actually need.
          </p>
          <p className="mk-copy">
            Биди подготвен. На 1 јуни, Моја Струмица почнува да го поврзува градот на побрз и поедноставен начин,
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
  )
}

export default App
