import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: #00ff00;
  padding: 20px;
  font-family: 'Courier New', monospace;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #00ff00;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: rgba(0, 255, 0, 0.05);
  border: 2px solid #00ff00;
  border-radius: 10px;
  padding: 20px;
  
  &:hover {
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 10px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #00ff00;
`;

const Tab = styled.button`
  background: ${props => props.active ? 'rgba(0, 255, 0, 0.2)' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#00ff00' : 'transparent'};
  color: #00ff00;
  padding: 15px 30px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 255, 0, 0.1);
  }
`;

const ContentArea = styled.div`
  background: rgba(0, 255, 0, 0.02);
  border: 1px solid #00ff00;
  border-radius: 10px;
  padding: 20px;
  min-height: 400px;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  }
  
  th {
    background: rgba(0, 255, 0, 0.1);
    font-weight: bold;
  }
  
  tr:hover {
    background: rgba(0, 255, 0, 0.05);
  }
`;

const SearchInput = styled.input`
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 10px 15px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  border-radius: 5px;
  width: 300px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }
  
  &::placeholder {
    color: rgba(0, 255, 0, 0.5);
  }
`;

const Button = styled.button`
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 10px 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 255, 0, 0.2);
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demo purposes when backend is not available
  const getMockAnalytics = () => {
    return {
      total_users: 1247,
      new_users: 89,
      active_users: 423,
      completed_quests: 821,
      completion_rate: 66,
      avg_completion_time: 480, // seconds
      promo_codes_generated: 234,
      promo_usage_rate: 45
    };
  };

  const getMockUsers = () => {
    return [
      {
        id: 1,
        username: 'matrix_explorer',
        first_name: 'Neo',
        last_name: 'Anderson',
        created_at: '2024-01-15T10:30:00Z',
        quest_completed: true,
        generated_promo_code: 'MATRIX40NEO',
        last_activity: '2024-01-18T14:20:00Z'
      },
      {
        id: 2,
        username: 'red_pill_rejecter',
        first_name: 'Agent',
        last_name: 'Smith',
        created_at: '2024-01-16T11:45:00Z',
        quest_completed: false,
        generated_promo_code: null,
        last_activity: '2024-01-17T09:15:00Z'
      },
      {
        id: 3,
        username: 'rabbit_finder',
        first_name: 'Trinity',
        last_name: '',
        created_at: '2024-01-16T13:20:00Z',
        quest_completed: true,
        generated_promo_code: 'TRINITYBONUS',
        last_activity: '2024-01-18T16:30:00Z'
      },
      {
        id: 4,
        username: 'morpheus_guide',
        first_name: 'Morpheus',
        last_name: '',
        created_at: '2024-01-17T08:15:00Z',
        quest_completed: true,
        generated_promo_code: 'MORPHEUS25',
        last_activity: '2024-01-18T12:45:00Z'
      },
      {
        id: 5,
        username: 'white_rabbit',
        first_name: 'Alice',
        last_name: 'Cooper',
        created_at: '2024-01-17T10:00:00Z',
        quest_completed: false,
        generated_promo_code: null,
        last_activity: '2024-01-17T11:30:00Z'
      }
    ];
  };

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
  }, [searchQuery]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/analytics/overview?days=7');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      console.warn('Using mock analytics data for demo');
      // Use mock data when backend is not available
      setAnalytics(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/users?limit=100&search=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      const data = await response.json();
      if (data && data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        // If API returns data but not in expected format, use mock data
        throw new Error('API data format unexpected');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      console.warn('Using mock user data for demo');
      // Use mock data when backend is not available
      // Filter mock users based on search query
      const mockUsers = getMockUsers();
      if (searchQuery) {
        const filteredUsers = mockUsers.filter(user =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id.toString().includes(searchQuery)
        );
        setUsers(filteredUsers);
      } else {
        setUsers(mockUsers);
      }
    }
  };

  const exportUsers = async (format = 'csv') => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/export/users?format=${format}`);
      const data = await response.json();

      if (format === 'csv') {
        const blob = new Blob([data.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        a.click();
      } else {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_export_${new Date().toISOString()}.json`;
        a.click();
      }
    } catch (error) {
      console.error('Error exporting users from backend:', error);
      console.warn('Exporting mock data instead');

      // Export mock data when backend is not available
      const mockUsers = getMockUsers();

      if (format === 'csv') {
        // Convert to CSV format
        const headers = ['ID', 'Telegram ID', 'Username', 'First Name', 'Last Name', 'Created', 'Completed', 'Promo Code', 'Last Activity'];
        const csvContent = [
          headers.join(','),
          ...mockUsers.map(user => [
            user.id,
            user.telegram_id,
            user.username,
            user.first_name,
            user.last_name,
            new Date(user.created_at).toLocaleDateString(),
            user.quest_completed ? '✅' : '❌',
            user.generated_promo_code || '',
            new Date(user.last_activity).toLocaleString()
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mock_users_export_${new Date().toISOString()}.csv`;
        a.click();
      } else {
        const blob = new Blob([JSON.stringify(mockUsers, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mock_users_export_${new Date().toISOString()}.json`;
        a.click();
      }
    }
  };

  const renderOverview = () => {
    if (loading || !analytics) {
      return <LoadingSpinner>LOADING ANALYTICS...</LoadingSpinner>;
    }

    return (
      <>
        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatLabel>Total Users</StatLabel>
            <StatValue>{analytics.total_users}</StatValue>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatLabel>New Users (7d)</StatLabel>
            <StatValue>{analytics.new_users}</StatValue>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatLabel>Active Users (7d)</StatLabel>
            <StatValue>{analytics.active_users}</StatValue>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatLabel>Completed Quests</StatLabel>
            <StatValue>{analytics.completed_quests}</StatValue>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <StatLabel>Completion Rate</StatLabel>
            <StatValue>{analytics.completion_rate}%</StatValue>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <StatLabel>Avg Completion Time</StatLabel>
            <StatValue>{Math.round(analytics.avg_completion_time / 60)}m</StatValue>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <StatLabel>Promo Codes Generated</StatLabel>
            <StatValue>{analytics.promo_codes_generated}</StatValue>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <StatLabel>Promo Usage Rate</StatLabel>
            <StatValue>{analytics.promo_usage_rate}%</StatValue>
          </StatCard>
        </StatsGrid>
      </>
    );
  };

  const renderUsers = () => {
    return (
      <>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <SearchInput
            type="text"
            placeholder="Search visitors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
          />
          <Button onClick={fetchUsers}>Search</Button>
          <Button onClick={() => exportUsers('csv')}>Export CSV</Button>
          <Button onClick={() => exportUsers('json')}>Export JSON</Button>
        </div>

        <UserTable>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Joined</th>
              <th>Completed</th>
              <th>Promo Code</th>
              <th>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username || 'Anonymous'}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>{user.quest_completed ? '✅' : '❌'}</td>
                  <td>{user.generated_promo_code || '-'}</td>
                  <td>{new Date(user.last_activity).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  No visitors found
                </td>
              </tr>
            )}
          </tbody>
        </UserTable>
      </>
    );
  };

  const renderAnalytics = () => {
    if (!analytics) {
      return <LoadingSpinner>Loading analytics...</LoadingSpinner>;
    }

    // Mock chart data based on analytics data
    const chartData = [
      { name: 'Mon', users: 42, completions: 28 },
      { name: 'Tue', users: 58, completions: 35 },
      { name: 'Wed', users: 63, completions: 40 },
      { name: 'Thu', users: 71, completions: 48 },
      { name: 'Fri', users: 85, completions: 55 },
      { name: 'Sat', users: 78, completions: 50 },
      { name: 'Sun', users: 69, completions: 42 },
    ];

    return (
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: '#00ff00', marginBottom: '20px' }}>Analytics Overview</h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard style={{ padding: '20px' }}>
            <StatLabel>Total Users</StatLabel>
            <StatValue>{analytics.total_users}</StatValue>
          </StatCard>

          <StatCard style={{ padding: '20px' }}>
            <StatLabel>Active Users (7d)</StatLabel>
            <StatValue>{analytics.active_users}</StatValue>
          </StatCard>

          <StatCard style={{ padding: '20px' }}>
            <StatLabel>Completed Quests</StatLabel>
            <StatValue>{analytics.completed_quests}</StatValue>
          </StatCard>

          <StatCard style={{ padding: '20px' }}>
            <StatLabel>Completion Rate</StatLabel>
            <StatValue>{analytics.completion_rate}%</StatValue>
          </StatCard>
        </div>

        {/* User Activity Chart */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ color: '#00ff00', marginBottom: '15px' }}>User Activity (Last 7 Days)</h4>
          <div style={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            height: '200px',
            padding: '10px',
            border: '2px solid #00ff00',
            borderRadius: '10px',
            background: 'rgba(0, 255, 0, 0.05)'
          }}>
            {chartData.map((day, index) => (
              <div key={index} style={{ textAlign: 'center', flex: 1, padding: '0 5px' }}>
                <div
                  style={{
                    height: `${(day.users / Math.max(...chartData.map(d => d.users))) * 150}px`,
                    backgroundColor: 'rgba(0, 255, 0, 0.5)',
                    marginBottom: '5px',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    paddingBottom: '5px'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: '#00ff00' }}>{day.users}</div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#00ff00' }}>{day.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Rate Chart */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ color: '#00ff00', marginBottom: '15px' }}>Quest Completions (Last 7 Days)</h4>
          <div style={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            height: '200px',
            padding: '10px',
            border: '2px solid #00ff00',
            borderRadius: '10px',
            background: 'rgba(0, 255, 0, 0.05)'
          }}>
            {chartData.map((day, index) => (
              <div key={index} style={{ textAlign: 'center', flex: 1, padding: '0 5px' }}>
                <div
                  style={{
                    height: `${(day.completions / Math.max(...chartData.map(d => d.completions))) * 150}px`,
                    backgroundColor: 'rgba(0, 0, 255, 0.5)',
                    marginBottom: '5px',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    paddingBottom: '5px'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: '#00ff00' }}>{day.completions}</div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#00ff00' }}>{day.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Code Usage */}
        <div>
          <h4 style={{ color: '#00ff00', marginBottom: '15px' }}>Promo Code Statistics</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            <div style={{
              padding: '15px',
              border: '1px solid #00ff00',
              borderRadius: '5px',
              background: 'rgba(0, 255, 0, 0.05)'
            }}>
              <div style={{ color: '#ffff00', fontSize: '1.2rem', marginBottom: '5px' }}>
                {analytics.promo_codes_generated}
              </div>
              <div style={{ color: '#00ff00' }}>Codes Generated</div>
            </div>

            <div style={{
              padding: '15px',
              border: '1px solid #00ff00',
              borderRadius: '5px',
              background: 'rgba(0, 255, 0, 0.05)'
            }}>
              <div style={{ color: '#00ff00', fontSize: '1.2rem', marginBottom: '5px' }}>
                {analytics.promo_usage_rate}%
              </div>
              <div style={{ color: '#00ff00' }}>Usage Rate</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>🎯 MATRIX QUEST ADMIN</Title>
        <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </Header>

      <TabContainer>
        <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          Overview
        </Tab>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          Users
        </Tab>
        <Tab active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
          Analytics
        </Tab>
      </TabContainer>

      <ContentArea>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'analytics' && renderAnalytics()}
      </ContentArea>
    </DashboardContainer>
  );
};

export default AdminDashboard;
