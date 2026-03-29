const mongoose = require('mongoose');
require('dotenv').config();
const VehicleListing = require('../models/VehicleListing');

const SELLER_ID = '69c913048eac2f3093fe3b5f'; // Account: sishanhewa4@gmail.com

const vehicleMakes = ['Toyota', 'Honda', 'Suzuki', 'Nissan', 'Mitsubishi', 'Hyundai', 'Kia', 'Mercedes-Benz', 'BMW', 'Audi'];
const models = {
  'Toyota': ['Prius', 'Aqua', 'Vitz', 'Corolla', 'CHR', 'Premio', 'Allion', 'Land Cruiser'],
  'Honda': ['Civic', 'Vezel', 'Fit', 'Grace', 'CR-V'],
  'Suzuki': ['WagonR', 'Alto', 'Swift', 'Vitara', 'Spacia'],
  'Nissan': ['Leaf', 'X-Trail', 'Dayz', 'Patrol'],
  'Mitsubishi': ['Pajero', 'Montero', 'Lancer', 'Outlander'],
  'Hyundai': ['Tucson', 'Santa Fe', 'Elantra'],
  'Kia': ['Sportage', 'Sorento', 'Rio'],
  'Mercedes-Benz': ['C200', 'E250', 'CLA'],
  'BMW': ['320i', '520d', 'X5'],
  'Audi': ['A4', 'A6', 'Q7']
};

const locations = ['Colombo', 'Kandy', 'Gampaha', 'Kurunegala', 'Kalutara', 'Galle', 'Matara', 'Ratnapura', 'Anuradhapura', 'Jaffna', 'Batticaloa', 'Badulla'];
const bodyTypes = ['Sedan', 'Hatchback', 'SUV', 'Coupé', 'Van', 'Pickup', 'Jeep'];
const transmissions = ['Automatic', 'Manual', 'Tiptronic'];
const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

const seedData = [];

for (let i = 0; i < 50; i++) {
  const make = vehicleMakes[Math.floor(Math.random() * vehicleMakes.length)];
  const model = models[make][Math.floor(Math.random() * models[make].length)];
  const year = Math.floor(Math.random() * (2024 - 2010 + 1)) + 2010;
  const price = Math.floor(Math.random() * (25000000 - 3000000 + 1)) + 3000000;
  const mileage = Math.floor(Math.random() * (150000 - 5000 + 1)) + 5000;
  const location = locations[Math.floor(Math.random() * locations.length)];
  const bodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
  const transmission = transmissions[Math.floor(Math.random() * transmissions.length)];
  const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
  const engineCapacity = Math.floor(Math.random() * (3000 - 660 + 1)) + 660;
  
  seedData.push({
    sellerId: SELLER_ID,
    title: `${year} ${make} ${model} for Sale in ${location}`,
    make,
    model,
    year,
    price,
    mileage,
    transmission,
    fuelType,
    engineCapacity,
    bodyType,
    location,
    isNegotiable: Math.random() > 0.5,
    description: `Excellently maintained ${make} ${model} ${year}. Single owner, low mileage, and in mint condition. Perfect for family use. Price negotiable after inspection in ${location}.`,
    condition: i % 5 === 0 ? 'Reconditioned' : 'Used',
    status: 'Available',
    // Using high quality generic vehicle images from Unsplash for realistic sample feel
    images: [`https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80`], 
  });
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing listings as per user request
    await VehicleListing.deleteMany({});
    console.log('Old listings cleared.');

    await VehicleListing.insertMany(seedData);
    console.log('Successfully seeded 50 Riyasewana-style listings!');
    
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
