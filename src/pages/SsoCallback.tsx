import { useClerk } from '@clerk/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SsoCallback() {
  const { handleRedirectCallback } = useClerk()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      await handleRedirectCallback({})
      navigate('/')
    }
    
    handleCallback()
  }, [handleRedirectCallback, navigate])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #4f46e5',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}></div>
      <p>Completing sign in...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
