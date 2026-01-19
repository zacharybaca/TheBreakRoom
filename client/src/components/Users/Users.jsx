import React, { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, ShieldAlert } from 'lucide-react';
import { useFetcher } from '../../hooks/useFetcher';
import { useAuth } from '../../hooks/useAuth';
import AdminBanUserModal from '../AdminBanUserModal/AdminBanUserModal';
import './users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // State for the Ban Modal
  const [userToBan, setUserToBan] = useState(null);

  const { fetcher } = useFetcher();
  const { user: currentUser } = useAuth(); // Get currently logged-in user

  // 1. Fetch Users on Load
  useEffect(() => {
    const getUsers = async () => {
      // Assuming your backend route is /api/users
      const { success, data } = await fetcher('/api/users');
      if (success) {
        setUsers(data);
      }
      setIsLoading(false);
    };
    getUsers();
  }, []);

  // 2. Search Filter Logic
  const filteredUsers = users.filter((u) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(lowerQuery) ||
      u.username?.toLowerCase().includes(lowerQuery) ||
      u.job?.title?.toLowerCase().includes(lowerQuery)
    );
  });

  // 3. Callback when a ban/unban is successful
  const handleBanSuccess = () => {
    // We update the local state instantly without re-fetching everything
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u._id === userToBan._id) {
            // Toggle the ban status locally to reflect the change
            return { ...u, isBanned: !u.isBanned };
        }
        return u;
      })
    );
  };

  return (
    <div id="users-page-container">
      <div id="users-content">

        {/* Header Section */}
        <header className="users-header">
          <div className="header-text">
            <h1>Co-Venters</h1>
            <p>Find and connect with people across the community.</p>
          </div>

          {/* Search Bar */}
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by name or job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="users-search-input"
            />
          </div>
        </header>

        {/* User Grid */}
        <div className="users-grid">
          {isLoading ? (
            <p className="loading-text">Loading directory...</p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className={`user-card ${user.isBanned ? 'banned-card' : ''}`}>

                {/* Visual Banner for Banned Users */}
                {user.isBanned && (
                    <div className="banned-badge">
                        <ShieldAlert size={14} /> Suspended
                    </div>
                )}

                <img
                  src={user.avatarUrl || '/assets/default-avatar.png'}
                  alt={user.name}
                  className="user-avatar"
                />

                <div className="user-info">
                  <h3>{user.name}</h3>
                  <span className="user-username">@{user.username}</span>
                  <span className="user-job">{user.job?.title || 'No Job Title'}</span>
                </div>

                {/* ADMIN ACTIONS */}
                {/* Only show if:
                    1. Current user IS admin
                    2. Target user is NOT the current user (can't ban self)
                    3. Target user is NOT an admin (can't ban peers)
                */}
                {currentUser?.isAdmin && currentUser?._id !== user._id && !user.isAdmin && (
                  <button
                    className={`admin-action-btn ${user.isBanned ? 'unban' : 'ban'}`}
                    onClick={() => setUserToBan(user)}
                    title={user.isBanned ? "Reactivate Account" : "Suspend Account"}
                  >
                    {user.isBanned ? <UserCheck size={18} /> : <UserX size={18} />}
                    {user.isBanned ? "Reactivate" : "Suspend"}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="no-results">No users found matching "{searchQuery}"</p>
          )}
        </div>
      </div>

      {/* MODAL: Conditionally Rendered */}
      {userToBan && (
        <AdminBanUserModal
          userToBan={userToBan}
          onClose={() => setUserToBan(null)} // Close modal
          onSuccess={handleBanSuccess}       // Update list on success
        />
      )}

    </div>
  );
};

export default Users;
