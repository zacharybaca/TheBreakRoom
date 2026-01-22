import ErrorModal from '../ErrorModal/ErrorModal';
import { useLocation, useNavigate } from 'react-router-dom';

const ErrorRouteWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { message, icon } = location.state || {};

  return (
    <ErrorModal
      errorStatement={message || 'Something went wrong!'}
      errorIcon={icon || '/assets/error.png'}
      onClose={() => navigate('/')}
    />
  );
};

export default ErrorRouteWrapper;
