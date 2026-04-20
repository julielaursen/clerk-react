import { useAuth, UserButton } from '@clerk/react'
import './App.css'
import CustomSignUp from './components/CustomSignUp'
import CustomSignIn from './components/CustomSignIn'
import { useState } from 'react'

function App() {
  const { isSignedIn } = useAuth()
  const [showSignUp, setShowSignUp] = useState(true)

  if (isSignedIn) {
    return (
      <>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
          <h1>Welcome!</h1>
          <UserButton />
        </header>
        <main style={{ padding: '2rem' }}>
          <p>You are signed in!</p>
        </main>
      </>
    )
  }

  return (
    <>
      <header style={{ padding: '1rem', textAlign: 'center' }}>
        <h1>Clerk Custom Sign Up Flow</h1>
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

export default App
