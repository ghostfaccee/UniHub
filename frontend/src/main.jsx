import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const TOKEN_KEY = 'unihub_access_token'
const USER_KEY = 'unihub_username'

const services = [
  { title: 'Расписание', endpoint: '/timetable', description: 'Расписание занятий студента.', icon: '▦' },
  { title: 'еКурсы', endpoint: '/ecourses', description: 'Учебные курсы и материалы.', icon: '◫' },
  { title: 'Юспорт', endpoint: '/usport', description: 'Спортивные активности СФУ.', icon: '◉' },
  { title: 'Библиотека', endpoint: '/papers', description: 'Научные материалы и публикации.', icon: '▤' },
  { title: 'Информация СФУ', endpoint: '/uniinfo', description: 'Информация университета.', icon: 'ⓘ' },
  { title: 'О нас', endpoint: '/aboutus', description: 'Информация о проекте UniHub.', icon: '◇' },
]

const notifications = [
  ['Стипендия', 'Начислена государственная стипендия.'],
  ['Дедлайн', 'Не забудьте проверить ближайшие учебные задачи.'],
  ['Цифровой пропуск', 'Проверьте актуальность данных пропуска.'],
  ['Новая оценка', 'Появилась новая учебная информация.'],
]

async function api(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(path, { ...options, headers })
  let data = null
  try { data = await response.json() } catch {}

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem(TOKEN_KEY)
      throw new Error('Сессия истекла. Войдите снова.')
    }
    throw new Error(data?.detail || 'Ошибка сервера')
  }
  return data
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [screen, setScreen] = useState(() => localStorage.getItem(TOKEN_KEY) ? 'dashboard' : 'auth')
  const [username, setUsername] = useState(() => localStorage.getItem(USER_KEY) || '')
  const [authMode, setAuthMode] = useState('login')
  const [auth, setAuth] = useState({ username: '', password: '', group: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [service, setService] = useState(null)
  const [courseQuery, setCourseQuery] = useState('')

  const visibleNotifications = useMemo(() => notifications.filter(([title]) =>
    title.toLowerCase().includes(courseQuery.toLowerCase()) || !courseQuery
  ), [courseQuery])

  useEffect(() => {
    if (!token) return
    const onStorage = () => setToken(localStorage.getItem(TOKEN_KEY))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [token])

  async function handleAuth(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const path = authMode === 'login' ? '/login' : '/register'
      const payload = authMode === 'login'
        ? { username: auth.username, password: auth.password }
        : auth
      const data = await api(path, { method: 'POST', body: JSON.stringify(payload) })

      if (authMode === 'register') {
        setAuthMode('login')
        setError('Аккаунт создан. Теперь войдите.')
        return
      }

      localStorage.setItem(TOKEN_KEY, data.access_token)
      localStorage.setItem(USER_KEY, auth.username)
      setToken(data.access_token)
      setUsername(auth.username)
      setScreen('dashboard')
      setAuth({ username: '', password: '', group: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUsername('')
    setScreen('auth')
  }

  async function openService(item) {
    try {
      const data = await api(item.endpoint)
      const target = typeof data?.detail === 'string' ? data.detail.trim() : ''

      // Backend returns the external service URL in `detail`.
      // No API response is shown in the UI: the user is simply redirected.
      if (/^(https?:\/\/)/i.test(target)) {
        window.location.assign(target)
        return
      }

      // If the backend is not configured with a URL yet, keep the user on the dashboard.
      console.warn(`UniHub: ${item.endpoint} did not return a redirect URL in detail.`)
    } catch (err) {
      if (err.message === 'Сессия истекла. Войдите снова.') {
        logout()
        return
      }
      console.error(`UniHub: failed to open ${item.title}`, err)
    }
  }

  if (!token || screen === 'auth') {
    return <AuthScreen mode={authMode} setMode={setAuthMode} auth={auth} setAuth={setAuth} onSubmit={handleAuth} busy={busy} error={error} />
  }

  if (screen === 'profile') {
    return <ProfileScreen username={username} onBack={() => setScreen('dashboard')} onLogout={logout} />
  }

  if (screen === 'certificate') {
    return <CertificateScreen onBack={() => setScreen('dashboard')} />
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="logo">U</div><div><strong>UniHub</strong><span>Сибирский федеральный университет</span></div></div>
        <div className="top-actions">
          <button className="ghost-button" onClick={() => setScreen('profile')}>{username || 'Профиль'}</button>
          <button className="danger-button" onClick={logout}>Выйти</button>
        </div>
      </header>

      <section className="hero">
        <div><p className="eyebrow">ЕДИНЫЙ СТУДЕНЧЕСКИЙ СЕРВИС</p><h1>Добро пожаловать в UniHub.</h1><p>Ваши университетские сервисы собраны в одном месте.</p></div>
        <button className="primary-button" onClick={() => setScreen('certificate')}>Справка из университета</button>
      </section>

      <section className="grid-layout">
        <div className="main-column">
          <article className="card schedule-card">
            <div className="card-head"><div><p className="eyebrow">СЕГОДНЯ</p><h2>Расписание</h2></div><button className="link-button" onClick={() => openService(services[0])}>Открыть →</button></div>
            <div className="schedule-row"><span>09:00</span><div><strong>Программная инженерия</strong><small>Аудитория 312 · КИ26-11Б</small></div></div>
            <div className="schedule-row"><span>11:00</span><div><strong>Математический анализ</strong><small>Аудитория 418 · КИ26-11Б</small></div></div>
            <div className="schedule-row"><span>14:00</span><div><strong>Архитектура информационных систем</strong><small>Корпус ИКИТ</small></div></div>
          </article>

          <article className="card">
            <div className="card-head"><div><p className="eyebrow">УЧЁБА</p><h2>еКурсы</h2></div><button className="link-button" onClick={() => openService(services[1])}>Открыть →</button></div>
            <div className="course-grid">
              {[['Архитектура информационных систем', 72], ['Программирование', 48], ['Математический анализ', 25]].map(([name, progress]) => <div className="course" key={name}><div className="course-top"><strong>{name}</strong><span>{progress}%</span></div><div className="progress"><i style={{width: `${progress}%`}} /></div></div>)}
            </div>
          </article>
        </div>

        <aside className="side-column">
          <article className="card"><div className="card-head"><div><p className="eyebrow">АКТУАЛЬНОЕ</p><h2>Уведомления</h2></div></div><div className="notice-list">{visibleNotifications.map(([title, text]) => <div className="notice" key={title}><strong>{title}</strong><span>{text}</span></div>)}</div><input className="search" value={courseQuery} onChange={e => setCourseQuery(e.target.value)} placeholder="Фильтр уведомлений" /></article>
          <article className="card"><div className="card-head"><div><p className="eyebrow">СЕРВИСЫ</p><h2>Университет</h2></div></div><div className="service-list">{services.map(item => <button key={item.endpoint} onClick={() => openService(item)}><span className="service-icon">{item.icon}</span><span><strong>{item.title}</strong><small>{item.description}</small></span><b>→</b></button>)}</div></article>
        </aside>
      </section>
    </main>
  )
}

function AuthScreen({ mode, setMode, auth, setAuth, onSubmit, busy, error }) {
  return <main className="auth-page"><div className="auth-card"><div className="auth-logo">U</div><p className="eyebrow">СФУ · UNIHUB</p><h1>{mode === 'login' ? 'Вход в UniHub' : 'Создание аккаунта'}</h1><p className="muted">JWT-аутентификация через ваш FastAPI backend.</p><form onSubmit={onSubmit}><label>Логин<input required value={auth.username} onChange={e => setAuth({...auth, username: e.target.value})} autoComplete="username" /></label><label>Пароль<input required type="password" value={auth.password} onChange={e => setAuth({...auth, password: e.target.value})} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>{mode === 'register' && <label>Группа<input required value={auth.group} onChange={e => setAuth({...auth, group: e.target.value})} placeholder="КИ26-11Б" /></label>}{error && <div className="auth-message">{error}</div>}<button className="primary-button wide" disabled={busy}>{busy ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button></form><button className="switch-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Создать аккаунт' : 'У меня уже есть аккаунт'}</button></div></main>
}

function ProfileScreen({ username, onBack, onLogout }) { return <main className="subpage"><div className="subpage-head"><button className="ghost-button" onClick={onBack}>← UniHub</button><button className="danger-button" onClick={onLogout}>Выйти</button></div><div className="profile-card"><div className="avatar">{username.slice(0,2).toUpperCase()}</div><p className="eyebrow">ПРОФИЛЬ</p><h1>{username || 'Пользователь'}</h1><div className="profile-grid"><div><span>Логин</span><strong>{username || '—'}</strong></div><div><span>Авторизация</span><strong>JWT Bearer Token</strong></div><div><span>Backend</span><strong>FastAPI</strong></div><div><span>Сессия</span><strong>Активна</strong></div></div></div></main> }

function CertificateScreen({ onBack }) { const [sent, setSent] = useState(false); return <main className="subpage"><div className="subpage-head"><button className="ghost-button" onClick={onBack}>← UniHub</button></div><div className="form-card"><p className="eyebrow">ДОКУМЕНТЫ</p><h1>Запрос справки</h1><p className="muted">HTML-заглушка интерфейса. Backend для этой операции пока не предусмотрен.</p><label>Тип справки<select><option>Справка с места обучения</option><option>Справка для общежития</option></select></label><label>Комментарий<textarea placeholder="Дополнительная информация" /></label><button className="primary-button" onClick={() => setSent(true)}>{sent ? 'Заявка создана (демо)' : 'Отправить заявку'}</button></div></main> }

createRoot(document.getElementById('root')).render(<App />)
