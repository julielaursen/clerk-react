import { useAuth, useUser, UserButton } from '@clerk/react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import CustomSignUp from './components/CustomSignUp'
import CustomSignIn from './components/CustomSignIn'
import SsoCallback from './pages/SsoCallback'
import { useState } from 'react'

function Home() {
  const { isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const [showSignUp, setShowSignUp] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
  })
  
  const handleEditClick = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!user) return
    
    try {
      setIsSaving(true)
      
      // Update user in Clerk
      await user.update({
        firstName: editData.firstName,
        lastName: editData.lastName,
      })

      // Optional: Also send to your Express backend
      const token = await getToken()
      await fetch('http://localhost:3000/api/user/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: editData.firstName,
          lastName: editData.lastName,
        }),
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    })
  }
  
  if (isSignedIn && user) {
    return (
      <>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <h1>Welcome Back!</h1>
          <UserButton />
        </header>
        <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ 
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#111827' }}>Profile Information</h2>
            
            {!isEditing && (
              <button
                onClick={handleEditClick}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '1.5rem',
                }}
              >
                Edit Profile
              </button>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      fontSize: '1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                    }}
                  />
                ) : (
                  <p style={{ margin: 0, fontSize: '1rem', color: '#111827' }}>
                    {user.firstName || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      fontSize: '1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                    }}
                  />
                ) : (
                  <p style={{ margin: 0, fontSize: '1rem', color: '#111827' }}>
                    {user.lastName || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Email
                </label>
                <p style={{ margin: 0, fontSize: '1rem', color: '#111827' }}>
                  {user.primaryEmailAddress?.emailAddress || 'No email'}
                </p>
                {!isEditing && (
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Email cannot be edited here</span>
                )}
              </div>

              {user.username && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Username
                  </label>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#111827' }}>
                    {user.username}
                  </p>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Account Created
                </label>
                <p style={{ margin: 0, fontSize: '1rem', color: '#111827' }}>
                  {new Date(user.createdAt!).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {isEditing && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500',
                      opacity: isSaving ? 0.6 : 1,
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'white',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
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