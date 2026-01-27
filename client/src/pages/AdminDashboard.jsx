import { useState } from 'react';
import Users from '../components/Users/Users'; // The User Manager
import AdminReactivationQueue from '../components/AdminReactivationQueue/AdminReactivationQueue';
import AdminSupportTickets from '../components/Admin/AdminSupportTickets';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <div className="admin-dashboard-layout" style={{ display: 'flex' }}>

      {/* Sidebar Navigation */}
      <aside style={{ width: '250px', background: '#1e293b', color: 'white', minHeight: '100vh', padding: '20px' }}>
        <h2 style={{ marginBottom: '30px' }}>Admin Panel</h2>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setActiveTab('tickets')} style={{ textAlign: 'left', padding: '10px', background: activeTab === 'tickets' ? '#334155' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '6px' }}>
             🎫 Support Tickets
          </button>
          <button onClick={() => setActiveTab('users')} style={{ textAlign: 'left', padding: '10px', background: activeTab === 'users' ? '#334155' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '6px' }}>
             👥 User Management
          </button>
          <button onClick={() => setActiveTab('reactivations')} style={{ textAlign: 'left', padding: '10px', background: activeTab === 'reactivations' ? '#334155' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '6px' }}>
             🔄 Reactivation Queue
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', maxHeight: '100vh' }}>
        {activeTab === 'tickets' && <AdminSupportTickets />}
        {activeTab === 'users' && <Users />} {/* Reusing your Users component! */}
        {activeTab === 'reactivations' && <AdminReactivationQueue />}
      </main>

    </div>
  );
};

export default AdminDashboard;
