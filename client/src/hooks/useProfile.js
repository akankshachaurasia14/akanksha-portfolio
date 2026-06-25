import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function useProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchProfile() {
      try {
        const response = await fetch(`${API_URL}/api/profile`)
        if (!response.ok) throw new Error(`Server responded with ${response.status}`)
        const data = await response.json()
        if (isMounted) {
          setProfile(data)
          setLoading(false)
        }
      } catch (err) {
        console.warn('Could not reach backend, using bundled fallback data:', err.message)
        if (isMounted) {
          // Local fallback so the page still renders something meaningful
          // even if the backend is unreachable (e.g. still deploying, or
          // VITE_API_URL not configured yet).
          import('../data/fallbackProfile.json').then((mod) => {
            if (isMounted) {
              setProfile(mod.default)
              setLoading(false)
              setError('offline')
            }
          })
        }
      }
    }

    fetchProfile()
    return () => {
      isMounted = false
    }
  }, [])

  return { profile, loading, error, apiUrl: API_URL }
}
