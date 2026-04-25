import { useSignUp } from '@clerk/react'
import { useState, type FormEvent } from 'react'

export default function CustomSignUp() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [code, setCode] = useState('')
  const [showVerification, setShowVerification] = useState(false)

  // Handle Google OAuth sign-up
  const handleGoogleSignUp = async () => {
    if (!signUp) {
      alert('⚠️ Clerk is not initialized! Please add your VITE_CLERK_PUBLISHABLE_KEY to the .env file')
      console.error('Clerk not initialized. Check your .env file has a valid VITE_CLERK_PUBLISHABLE_KEY')
      return
    }

    const { error } = await signUp.sso({
      strategy: 'oauth_google',
      redirectCallbackUrl: '/sso-callback',
      redirectUrl: '/',
    })

    if (error) {
      console.error(JSON.stringify(error, null, 2))
    }
  }

  // Handle the submission of the sign-up form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!signUp) {
      return
    }

    const { error } = await signUp.password({
      emailAddress,
      password,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    })

    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    // Send the email verification code
    if (!error) {
      await signUp.verifications.sendEmailCode()
      setShowVerification(true)
    }
  }

  // Handle the verification of the email address
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault()

    if (!signUp) {
      return
    }

    await signUp.verifications.verifyEmailCode({
      code,
    })

    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session }) => {
          // Handle session tasks if needed
          if (session?.currentTask) {
            console.log(session?.currentTask)
            return
          }
          // User is signed up and signed in
          window.location.href = '/'
        },
      })
    } else {
      console.error('Sign-up attempt not complete:', signUp)
    }
  }

  if (!signUp) {
    return <div>Loading...</div>
  }

  // Show verification form if needed
  if (
    showVerification &&
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address')
  ) {
    return (
      <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
        <h2>Verify your email</h2>
        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="code" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Verification Code
            </label>
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              We sent a verification code to {emailAddress}
            </p>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="Enter verification code"
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            />
            {errors.fields.code && (
              <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.fields.code.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={fetchStatus === 'fetching'}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: fetchStatus === 'fetching' ? 'not-allowed' : 'pointer',
              opacity: fetchStatus === 'fetching' ? 0.6 : 1,
            }}
          >
            {fetchStatus === 'fetching' ? 'Verifying...' : 'Verify Email'}
          </button>

          <button
            type="button"
            onClick={() => signUp.verifications.sendEmailCode()}
            style={{
              padding: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: 'transparent',
              color: '#4f46e5',
              border: '1px solid #4f46e5',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Resend code
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Sign Up</h2>
      
      {/* Google Sign Up Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          backgroundColor: 'white',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontWeight: 500,
        }}
      >
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </svg>
        Continue with Google
      </button>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '1.5rem',
        gap: '0.5rem',
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
        <span style={{ color: '#666', fontSize: '0.875rem' }}>or</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="firstName" style={{ display: 'block', marginBottom: '0.5rem' }}>
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label htmlFor="lastName" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          />
          {errors.fields.emailAddress && (
            <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.fields.emailAddress.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          />
          {errors.fields.password && (
            <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.fields.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={fetchStatus === 'fetching'}
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: fetchStatus === 'fetching' ? 'not-allowed' : 'pointer',
            opacity: fetchStatus === 'fetching' ? 0.6 : 1,
          }}
        >
          {fetchStatus === 'fetching' ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      {/* Required for sign-up flows - Clerk's bot protection */}
      <div id="clerk-captcha" />
    </div>
  )
}
