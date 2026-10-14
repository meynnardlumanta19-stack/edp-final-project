const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Sample In-Memory Mock Data for Lakbay Lokal
let destinations = [
  {
    id: "1",
    name: "Monte Cueva Shrine",
    category: "Tourist Spot",
    location: "Maasin City, Southern Leyte",
    description: "A popular religious landmark featuring a chapel inside a natural cave with 300+ steps to the top.",
    budget: "Low",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    id: "2",
    name: "Guinsohotan Falls",
    category: "Tourist Spot",
    location: "Maasin City, Southern Leyte",
    description: "Scenic waterfall surrounded by lush tropical greenery, perfect for nature tripping and cool swims.",
    budget: "Low",
    imageUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9"
  },
  {
    id: "3",
    name: "Local Seafood Grill & Restaurant",
    category: "Restaurant",
    location: "Maasin City Coastal Road",
    description: "Fresh catch of the day grilled to perfection served with local side dishes.",
    budget: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
  },
  {
    id: "4",
    name: "Ampil Beach Resort",
    category: "Beach",
    location: "Southern Leyte",
    description: "White sand beach resort offering comfortable overnight stays and water activities.",
    budget: "High",
    imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206"
  },
   {
    id: "5",
    name: "Ampil Beach Resort",
    category: "Beach",
    location: "Southern Leyte",
    description: "White sand beach resort offering comfortable overnight stays and water activities.",
    budget: "High",
    imageUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206"
  }
];

// 1. Requested GET Endpoint: /api/lakbay-lokal/get
app.get('/api/lakbay-lokal/get', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Successfully retrieved Lakbay Lokal data",
    count: destinations.length,
    data: destinations
  });
});

// 2. Main Filterable GET Endpoint (Search, Category, Budget)
app.get('/api/destinations', (req, res) => {
  const { search, category, budget } = req.query;
  let results = [...destinations];

  if (search) {
    results = results.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category && category !== 'All') {
    results = results.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (budget && budget !== 'All') {
    results = results.filter(item => item.budget.toLowerCase() === budget.toLowerCase());
  }

  res.status(200).json(results);
});

// 3. POST: Add new destination
app.post('/api/destinations', (req, res) => {
  const { name, category, location, description, budget, imageUrl } = req.body;
  
  if (!name || !category || !location || !budget) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  const newDestination = {
    id: Date.now().toString(),
    name,
    category,
    location,
    description: description || '',
    budget,
    imageUrl: imageUrl || ''
  };

  destinations.push(newDestination);
  res.status(201).json({ message: 'Destination created successfully', data: newDestination });
});

// 4. PUT: Edit / Update destination
app.put('/api/destinations/:id', (req, res) => {
  const { id } = req.params;
  const index = destinations.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Destination not found' });
  }

  destinations[index] = { ...destinations[index], ...req.body };
  res.status(200).json({ message: 'Destination updated successfully', data: destinations[index] });
});

// 5. DELETE: Remove destination
app.delete('/api/destinations/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = destinations.length;
  destinations = destinations.filter(item => item.id !== id);

  if (destinations.length === initialLength) {
    return res.status(404).json({ error: 'Destination not found' });
  }

  res.status(200).json({ message: 'Destination deleted successfully' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Lakbay Lokal Backend Server running on port ${PORT}`);
});