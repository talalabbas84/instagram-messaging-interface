import './App.css'
import InstagramMessaging from './components/InstagramMessaging/InstagramMessaging'
import { SessionProvider } from './context/SessionContext'

function App() {
  return (
    <SessionProvider>
      <InstagramMessaging />
    </SessionProvider>
  )
}

export default App
