import { useState, useEffect } from 'react';
import {
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  X
} from 'lucide-react';
import { useFetcher } from '../../hooks/useFetcher';
import ReusableStyledButton from '../ReusableStyledButton/ReusableStyledButton';
import './admin-support.css';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Open'); // 'Open', 'Resolved', 'All'
  const [selectedTicket, setSelectedTicket] = useState(null); // For Modal

  // Modal Form State
  const [adminResponse, setAdminResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const { fetcher } = useFetcher();

  // 1. Fetch Tickets
  const fetchTickets = async () => {
    setIsLoading(true);
    // You can adjust your backend to accept ?status= query params if you want server-side filtering
    const { success, data } = await fetcher('/api/support');
    if (success) setTickets(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 2. Open Modal Handler
  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setAdminResponse(ticket.adminResponse || '');
    setNewStatus(ticket.status);
  };

  // 3. Submit Update (Reply/Close)
  const handleUpdateTicket = async () => {
    const { success, message } = await fetcher(`/api/support/${selectedTicket._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        adminResponse: adminResponse
      })
    });

    if (success) {
      alert('Ticket updated successfully');
      // Update local state
      setTickets(prev => prev.map(t =>
        t._id === selectedTicket._id
          ? { ...t, status: newStatus, adminResponse }
          : t
      ));
      setSelectedTicket(null); // Close modal
    } else {
      alert(message || 'Failed to update ticket');
    }
  };

  // 4. Filtering Logic
  const displayedTickets = tickets.filter(t => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Open') return t.status === 'Open' || t.status === 'In Progress';
    if (filterStatus === 'Resolved') return t.status === 'Resolved' || t.status === 'Closed';
    return true;
  });

  return (
    <div className="admin-support-container">
      {/* Header & Filters */}
      <div className="support-header">
        <h2>Support Tickets</h2>
        <div className="status-filters">
          <button
            className={`filter-btn ${filterStatus === 'Open' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Open')}
          >
            Open / Pending
          </button>
          <button
            className={`filter-btn ${filterStatus === 'Resolved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Resolved')}
          >
            Resolved
          </button>
          <button
            className={`filter-btn ${filterStatus === 'All' ? 'active' : ''}`}
            onClick={() => setFilterStatus('All')}
          >
            All History
          </button>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="tickets-list">
        {isLoading ? (
          <p>Loading tickets...</p>
        ) : displayedTickets.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} color="#10B981" />
            <p>All caught up! No tickets found.</p>
          </div>
        ) : (
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Subject</th>
                <th>User</th>
                <th>Category</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedTickets.map(ticket => (
                <tr key={ticket._id} className="ticket-row">
                  <td>
                    <span className={`status-badge ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="ticket-subject">{ticket.subject}</td>
                  <td>
                    <div className="ticket-user">
                      <img src={ticket.user?.avatarUrl || '/assets/default-avatar.png'} alt="av" />
                      <span>{ticket.user?.username || 'Unknown'}</span>
                    </div>
                  </td>
                  <td>{ticket.category}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleOpenTicket(ticket)}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- DETAIL MODAL --- */}
      {selectedTicket && (
        <div className="modal-overlay">
          <div className="ticket-modal">
            <div className="modal-header">
              <h3>{selectedTicket.subject}</h3>
              <button className="close-icon" onClick={() => setSelectedTicket(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* Original Message */}
              <div className="message-block user-message">
                <label>From: {selectedTicket.user?.name} (@{selectedTicket.user?.username})</label>
                <p>{selectedTicket.message}</p>
              </div>

              {/* Admin Reply Area */}
              <div className="message-block admin-reply-area">
                <label>Admin Response:</label>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Type your reply to the user here..."
                  rows={4}
                />
              </div>

              {/* Action Bar */}
              <div className="modal-actions">
                <div className="status-changer">
                  <label>Set Status:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <ReusableStyledButton
                  title="Update Ticket"
                  onClick={handleUpdateTicket}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupportTickets;
