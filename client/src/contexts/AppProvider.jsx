import { BrowserRouter as Router } from 'react-router-dom'
import { FetcherProvider } from './Fetcher/FetcherProvider';
import { AuthProvider } from './Auth/AuthProvider';
import { ToggleProvider } from './Toggle/ToggleProvider';


export const AppProvider = ({ children }) => {
  return (
    <Router>
      <ToggleProvider>
        <AuthProvider>
          <FetcherProvider>
            {children}
          </FetcherProvider>
        </AuthProvider>
      </ToggleProvider>
    </Router>
  )
}
