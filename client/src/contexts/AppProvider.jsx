import { BrowserRouter as Router } from 'react-router-dom'
import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';


export const AppProvider = ({ children }) => {
  return (
    <Router>
      <AuthProvider>
        <FetcherProvider>
          {children}
        </FetcherProvider>
      </AuthProvider>
    </Router>
  )
}
