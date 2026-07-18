import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // State for the search bar
  const [searchQuery, setSearchQuery] = useState('');
  
  // State to hold the items from MongoDB
  const [items, setItems] = useState([]);

  // Fetch items from the backend when the dashboard loads
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        setItems(data); // Save the database items into our state
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };

    fetchItems();
  }, []); // Empty array ensures this only runs once on page load

  // Handle logging out
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Filter the items based on what is typed in the search bar
  const filteredItems = items.filter((item) => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        
        <header className="dashboard-header">
          <h2>System Directory</h2>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="neon-btn" onClick={() => navigate('/add-item')}>
              + Add Item
            </button>
            
            <button 
              className="neon-btn" 
              onClick={handleLogout} 
              style={{ background: 'transparent', color: '#ff0055', border: '1px solid #ff0055' }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* The Search Bar */}
        <div className="search-container">
          <input 
            type="text" 
            className="neon-input search-bar" 
            placeholder="Search directory..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Rendering the Items */}
        <div className="items-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item._id} className="item-card">
                <img src={item.imageUrl} alt={item.title} className="item-image" />
                <div className="item-info">
                  <h3>{item.title}</h3>
                  <span className="item-badge">{item.category}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No items found matching "{searchQuery}"</p>
          )}
        </div>

      </div>
    </div>
  );
}