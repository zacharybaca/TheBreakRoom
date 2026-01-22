import { Search, UserX, UserCheck, ShieldAlert } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers'; // Import Context
import AdminBanUserModal from '../AdminBanUserModal/AdminBanUserModal';
import './users.css';

const Users = () => {
  // 1. Consume Context instead of local state
  const {
    filteredUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    userToBan,
    setUserToBan,
    handleBanSuccess,
    currentUser,
  } = useUsers();

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
              onChange={(e) => setSearchQuery(e.target.value)} // Uses Context setter
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
              <div
                key={user._id}
                className={`user-card ${user.isBanned ? 'banned-card' : ''}`}
              >
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
                  <span className="user-job">
                    {user.job?.title || 'No Job Title'}
                  </span>
                </div>

                {/* ADMIN ACTIONS */}
                {currentUser?.isAdmin &&
                  currentUser?._id !== user._id &&
                  !user.isAdmin && (
                    <button
                      className={`admin-action-btn ${user.isBanned ? 'unban' : 'ban'}`}
                      onClick={() => setUserToBan(user)} // Sets Context state
                      title={
                        user.isBanned ? 'Reactivate Account' : 'Suspend Account'
                      }
                    >
                      {user.isBanned ? (
                        <UserCheck size={18} />
                      ) : (
                        <UserX size={18} />
                      )}
                      {user.isBanned ? 'Reactivate' : 'Suspend'}
                    </button>
                  )}
              </div>
            ))
          ) : (
            <p className="no-results">
              No users found matching "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* MODAL: Uses Context State */}
      {userToBan && (
        <AdminBanUserModal
          userToBan={userToBan}
          onClose={() => setUserToBan(null)}
          onSuccess={handleBanSuccess}
        />
      )}
    </div>
  );
};

export default Users;
