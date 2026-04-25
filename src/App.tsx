import { useAuth, UserButton } from '@clerk/react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import CustomSignUp from './components/CustomSignUp'
import CustomSignIn from './components/CustomSignIn'
import SsoCallback from './pages/SsoCallback'
import { useState } from 'react'

function Home() {
  const {getToken, isSignedIn } = useAuth()
  const [showSignUp, setShowSignUp] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchProtectedData = async () => {
    try {
      setLoading(true)
      // Get the session token from Clerk
      const token = await getToken();
      
      // Make request to your Express backend
      const response = await fetch('http://localhost:3000/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      console.log('Data from backend:', data);
      setUserData(data)
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false)
    }
  };
  
  if (isSignedIn) {
    return (
      <>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
          <h1>Welcome!</h1>
          <UserButton />
        </header>
        <main style={{ padding: '2rem' }}>
          <p>You are signed in!</p>
          
          <button 
            onClick={fetchProtectedData}
            disabled={loading}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Loading...' : 'Fetch Protected Data from Backend'}
          </button>

          {userData && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '4px' }}>
              <h3>User Data from Backend:</h3>
              <pre style={{ overflow: 'auto' }}>
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}
        </main>
      </>
    )
  }

  return (
    <>
      <header style={{ padding: '1rem', textAlign: 'center' }}>
        <h1>Julie's Authentication Project</h1>
      </header>
      <main>
        {showSignUp ? (
          <>
            <CustomSignUp />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setShowSignUp(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4f46e5',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <CustomSignIn />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setShowSignUp(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4f46e5',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </>
        )}
      </main>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sso-callback" element={<SsoCallback />} />
    </Routes>
  )
}

export default App