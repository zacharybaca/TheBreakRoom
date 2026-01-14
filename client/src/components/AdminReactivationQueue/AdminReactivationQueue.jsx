import { useState, useEffect } from 'react';
import { UserCheck, RefreshCw, XCircle } from 'lucide-react';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import { useFetcher } from '../../hooks/useFetcher';
import './admin-reactivation-queue.css';

const AdminReactivationQueue = () => {
  const [requests, setRequests] = useState([
    {
      _id: 23,
      firstName: 'Test',
      lastName: 'Testing',
      username: 'Tester',
      email: 'test@test.com',
      job: {
        title: 'Tester',
      },
    },
  ]);
  const [loading, setLoading] = useState(true);
  const { fetcher } = useFetcher();

  // Fetch requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      const { success, data } = await fetcher(
        '/api/users/reactivation-requests'
      );
      if (success) setRequests(data);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  // Handle Approve Click
  const handleApprove = async (userId) => {
    const { success, message } = await fetcher(
      `/api/users/${userId}/reactivate`,
      {
        method: 'POST',
      }
    );

    if (success) {
      alert(message);
      // Remove from UI immediately
      setRequests((prev) => prev.filter((u) => u._id !== userId));
    } else {
      alert('Failed to reactivate: ' + message);
    }
  };

  if (loading)
    return <div className="arq-loading">Checking for requests...</div>;

  return (
    <div className="arq-container">
      <div className="arq-header">
        <RefreshCw size={28} className="arq-icon" />
        <h2>Reactivation Queue</h2>
        <span className="arq-badge">{requests.length}</span>
      </div>

      {requests.length === 0 ? (
        <div className="arq-empty">
          <p>
            No pending reactivation requests. The breakroom is running smoothly!
          </p>
        </div>
      ) : (
        <div className="arq-list">
          {requests.map((user) => (
            <div key={user._id} className="arq-item glow-on-hover">
              <div className="arq-user-info">
                <h3>
                  `{user.firstName} {user.lastName}`
                </h3>
                <span className="arq-meta">
                  @{user.username} • {user.email}
                </span>
                <span className="arq-job">
                  {user.job?.title || 'No Job Title'}
                </span>
              </div>

              <ReusableStyledButton
                title="Reactivate"
                onClick={() => handleApprove(user._id)}
                className="arq-approve-btn"
                icon={<UserCheck size={18} />}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReactivationQueue;
