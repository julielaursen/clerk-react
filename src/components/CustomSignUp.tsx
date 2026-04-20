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
