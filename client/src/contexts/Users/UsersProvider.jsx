import { useState, useEffect, useMemo } from 'react';
import { useFetcher } from '../../hooks/useFetcher';
import { useAuth } from '../../hooks/useAuth';
import { UsersContext } from './UsersContext';

export const UsersProvider = ({ children }) => {
  const { fetcher } = useFetcher();
  const { user: currentUser } = useAuth(); // Needed for permission checks if you move logic here

  // --- 1. State Moved from Component ---
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userToBan, setUserToBan] = useState(null); // Modal state

  // --- 2. Fetch Logic (Moved from useEffect) ---
  const fetchUsers = async () => {
    setIsLoading(true);
    const { success, data } = await fetcher('/api/users');
    if (success) {
      setUsers(data);
    }
    setIsLoading(false);
  };

  // Initial Fetch on Mount
  useEffect(() => {
    fetchUsers();
  }, []); // Run once when provider mounts (usually app start or route change)

  // --- 3. Filter Logic (Memoized for performance) ---
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(lowerQuery) ||
        u.username?.toLowerCase().includes(lowerQuery) ||
        u.job?.title?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [users, searchQuery]);

  // --- 4. Ban Success Handler ---
  const handleBanSuccess = () => {
    if (!userToBan) return;

    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u._id === userToBan._id) {
          // Toggle local state to match server update
          return { ...u, isBanned: !u.isBanned };
        }
        return u;
      })
    );
    // Optional: Close modal automatically here if you prefer
    // setUserToBan(null);
  };

  return (
    <UsersContext.Provider
      value={{
        // State
        users,
        filteredUsers, // Expose the filtered list directly!
        isLoading,
        searchQuery,
        userToBan,
        currentUser, // Useful to pass down

        // Actions (Setters)
        setSearchQuery,
        setUserToBan,
        fetchUsers, // In case you need to manually refresh later
        handleBanSuccess,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
