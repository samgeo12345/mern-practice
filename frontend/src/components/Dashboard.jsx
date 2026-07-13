import './Dashboard.css';

export default function Dashboard() {
  // In a real flow, you would clear the token and return to the login screen
  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        
        <header className="dashboard-header">
          <h2>System Dashboard</h2>
          <button className="neon-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="dashboard-grid">
          
          <div className="data-card">
            <h3 className="card-title">Server Status</h3>
            <p className="card-value status-online">Online</p>
          </div>
          
          <div className="data-card">
            <h3 className="card-title">Active Sessions</h3>
            <p className="card-value">1,024</p>
          </div>
          
          <div className="data-card">
            <h3 className="card-title">Database Load</h3>
            <p className="card-value">14%</p>
          </div>

        </div>
      </div>
    </div>
  );
}