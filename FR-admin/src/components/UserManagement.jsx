import { useState, useEffect } from 'react';
import { UserX, UserCheck, Mail } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}/toggle-status`, {
        method: 'POST'
      });
      await fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const sendEmail = async (email) => {
    try {
      await fetch('http://localhost:5000/api/notifications/send-admin-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message: 'Admin notification' })
      });
      alert(`Email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="users-page">
      <div className="page-header">
        <h2>Manage Users</h2>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Subscription</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <span className={`subscription-badge ${user.subscription}`}>
                    {user.subscription}
                  </span>
                </td>
                <td>{user.joinDate}</td>
                <td>
                  <div className="actions">
                    <button 
                      className="btn-icon"
                      onClick={() => toggleUserStatus(user.id)}
                      title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                    <button 
                      className="btn-icon"
                      onClick={() => sendEmail(user.email)}
                      title="Send Email"
                    >
                      <Mail size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;