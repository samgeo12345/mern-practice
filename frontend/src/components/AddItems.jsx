import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddItem.css';

export default function AddItem() {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null); // Stores the actual file
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Create a FormData object (Required for file uploads!)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    
    // The key 'image' MUST exactly match upload.single('image') in your Node server!
    formData.append('image', image); 

    try {
      // 2. Send the request
      // Notice we DO NOT set 'Content-Type': 'application/json' here.
      // The browser automatically sets the correct headers for FormData.
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Item added successfully!');
        // Clear the form
        setTitle('');
        setCategory('');
        setImage(null);
        
        // After 2 seconds, redirect back to the dashboard
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setMessage(data.message || 'Error adding item');
      }
    } catch (error) {
      setMessage('Network error. Is your server running?');
    }
  };

  return (
    <div className="add-item-wrapper">
      <div className="add-item-container">
        <h2>Add New Directory Item</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              className="neon-input" 
              placeholder="Item Title (e.g. Quantum Processor)" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <input 
              type="text" 
              className="neon-input" 
              placeholder="Category (e.g. Hardware)" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label className="file-label">Upload Image:</label>
            <input 
              type="file" 
              className="neon-file-input" 
              accept="image/*" // Only allow image files
              onChange={(e) => setImage(e.target.files[0])} // Grab the first file selected
              required 
            />
          </div>
          
          <button type="submit" className="neon-button">
            Save Item to Database
          </button>
          
          <button type="button" className="cancel-button" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
        </form>

        {message && <p className="status-message">{message}</p>}
      </div>
    </div>
  );
}