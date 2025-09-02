// import { FetcherContext } from './FetcherContext.jsx'
// import { useNotification } from '../../hooks/useNotification.js'
// import { useState } from 'react';

// export const FetcherProvider = ({ children }) => {
//   const [isLoaded, setIsLoaded] = useState(false)
//   const { addNotification } = useNotification()

//   const fetcher = async (url, options = {}, fallbackError = 'An error occurred.') => {
//   const config = { credentials: 'include', ...options }

//   try {
//     const response = await fetch(url, config)
//     const data = await response.json().catch(() => ({})) // failsafe for non-JSON
//     console.log('Data From Fetcher Call: ', data)
//     console.log('URL from Fetcher: ', url)
//     if (!response.ok || data.success === false) {
//       const errorMessage = data?.message || fallbackError

//       addNotification({
//         headerText: 'Error',
//         bodyText: response.status === 401
//           ? 'You are not authorized to access this content.'
//           : errorMessage,
//         imgURL: '/assets/error.jpg',
//         variantTheme: 'danger',
//         customTheme: '.toast-error'
//       })

//       setIsLoaded(true)
//       return { success: false, error: errorMessage, status: response.status }
//     }

//     setIsLoaded(true)
//     return { success: true, data: data }

//   } catch (err) {
//     addNotification({
//       headerText: 'Error',
//       bodyText: 'Unable to reach the server.',
//       imgURL: '/assets/error.jpg',
//       variantTheme: 'danger',
//       customTheme: '.toast-error'
//     })

//     setIsLoaded(true)
//     return { success: false, error: 'Network error', status: null }
//   }
// }

//   return (
//     <FetcherContext.Provider value={{ fetcher, isLoaded, setIsLoaded }}>
//       {children}
//     </FetcherContext.Provider>
//   )
// }
import { FetcherContext } from './FetcherContext.jsx'
import { useNotification } from '../../hooks/useNotification.js'
import { useState } from 'react'

export const FetcherProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { addNotification } = useNotification()

  // Backend URL from environment, defaults to empty string
  const backendUrl = import.meta.env.VITE_BACKEND_URL || ''

  const fetcher = async (url, options = {}, fallbackError = 'An error occurred.') => {
    // Prepend backend URL if the URL starts with a slash
    const finalUrl = url.startsWith('/') ? `${backendUrl}${url}` : url

    const config = { credentials: 'include', ...options }

    try {
      const response = await fetch(finalUrl, config)
      const data = await response.json().catch(() => ({})) // failsafe for non-JSON

      console.log('Data From Fetcher Call:', data)
      console.log('URL from Fetcher:', finalUrl)

      if (!response.ok || data.success === false) {
        const errorMessage = data?.message || fallbackError

        addNotification({
          headerText: 'Error',
          bodyText:
            response.status === 401
              ? 'You are not authorized to access this content.'
              : errorMessage,
          imgURL: '/assets/error.jpg',
          variantTheme: 'danger',
          customTheme: '.toast-error',
        })

        setIsLoaded(true)
        return { success: false, error: errorMessage, status: response.status }
      }

      setIsLoaded(true)
      return { success: true, data: data }
    } catch (err) {
      addNotification({
        headerText: 'Error',
        bodyText: 'Unable to reach the server.',
        imgURL: '/assets/error.jpg',
        variantTheme: 'danger',
        customTheme: '.toast-error',
      })

      setIsLoaded(true)
      return { success: false, error: 'Network error', status: null }
    }
  }

  return (
    <FetcherContext.Provider value={{ fetcher, isLoaded, setIsLoaded }}>
      {children}
    </FetcherContext.Provider>
  )
}
