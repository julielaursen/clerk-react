import { useSignIn } from '@clerk/react'
import { useState, type FormEvent } from 'react'

export default function CustomSignIn() {
  const { signIn, errors, fetchStatus } = useSignIn()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!signIn) {
      return
    }

    const { error } = await signIn.password({
      emailAddress,
      password,
    })

    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session }) => {
          // Handle session tasks if needed
          if (session?.currentTask) {
            console.log(session?.currentTask)
            return
          }
          // User is signed in
          window.location.href = '/'
        },
      })
    } else if (signIn.status === 'needs_second_factor') {
      // Handle MFA - see Clerk docs for MFA custom flows
      console.log('MFA required')
    } else if (signIn.status === 'needs_client_trust') {
      // Handle client trust verification
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code'
      )
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode()
      }
    } else {
      console.error('Sign-in attempt not complete:', signIn)
    }
  }

  if (!signIn) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Sign In</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          {errors.fields.identifier && (
            <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.fields.identifier.message}
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
          {fetchStatus === 'fetching' ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
