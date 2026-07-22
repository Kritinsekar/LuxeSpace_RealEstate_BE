const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  password: process.env.DB_PASSWORD || "2249",
  database: process.env.DB_NAME || "real_estate_db",
});

async function seed() {
  try {
    await pool.connect();
    console.log("Connected to PostgreSQL for seeding...");

    // 1. Get or create an owner user
    let userResult = await pool.query("SELECT id FROM users LIMIT 1");
    let ownerId;
    
    if (userResult.rows.length > 0) {
      ownerId = userResult.rows[0].id;
      console.log(`Found existing user with ID: ${ownerId}`);
    } else {
      console.log("No users found. Creating a mock owner...");
      const insertUser = await pool.query(
        `INSERT INTO users (name, email, password, phone) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        ["System Owner", "owner@luxespace.com", "$2b$10$xyz", "9876543210"]
      );
      ownerId = insertUser.rows[0].id;
      console.log(`Created mock owner with ID: ${ownerId}`);
    }

    const properties = [
      {
        title: "3 BHK Luxury Apartment in Hiranandani Gardens",
        description: "Premium semi-furnished 3 BHK flat with imported marble flooring, modular kitchen with chimney, false ceiling, and high-rise lake views. Premium tower with clubhouse, gym, and pool.",
        price: 28500000,
        city: "Mumbai",
        address: "Oakwood Towers, Hiranandani Gardens, Powai",
        bedrooms: 3,
        bathrooms: 3,
        image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        property_type: "Apartment",
        area_sqft: 1650,
        status: "Available"
      },
      {
        title: "4 BHK Ultra Villa in Prestige Ozone",
        description: "Exclusive standalone villa inside a gated community. Features private garden space, home theater room, Italian marble finishes, solar backup, and 24/7 security.",
        price: 45000000,
        city: "Bangalore",
        address: "Prestige Ozone, Whitefield",
        bedrooms: 4,
        bathrooms: 4,
        image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
        property_type: "Villa",
        area_sqft: 3800,
        status: "Available"
      },
      {
        title: "2 BHK Elegant Penthouse in Kalyani Nagar",
        description: "Modern penthouse with a huge private terrace deck offering skyline views. Fully modular kitchen, customized walk-in closets, and direct access to sky lounge.",
        price: 16500000,
        city: "Pune",
        address: "Skyline Heights, Kalyani Nagar",
        bedrooms: 2,
        bathrooms: 2,
        image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        property_type: "Penthouse",
        area_sqft: 1100,
        status: "Available"
      },
      {
        title: "5 BHK Royal Palace Enclave",
        description: "Grand villa with double-height ceiling, private indoor swimming pool, fitness gym space, and separate servant quarters. Highly secure gated neighborhood.",
        price: 98000000,
        city: "Delhi",
        address: "Golf Course Road, DLF Phase 5",
        bedrooms: 5,
        bathrooms: 5,
        image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        property_type: "Villa",
        area_sqft: 6500,
        status: "Available"
      },
      {
        title: "3 BHK Premium Condo in Jubilee Hills",
        description: "Condo with floor-to-ceiling glass windows, wide sun deck balcony, separate dry/wet kitchens, and automated parking slots. Located in prime Jubilee Hills heights.",
        price: 32000000,
        city: "Hyderabad",
        address: "Jubilee Hills View Heights",
        bedrooms: 3,
        bathrooms: 3,
        image_url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
        property_type: "Condo",
        area_sqft: 2200,
        status: "Available"
      },
      {
        title: "4 BHK Duplex Penthouse",
        description: "Duplex penthouse overlooking tree-lined lanes. Comes with private infinity-edge plunge pool, outdoor bar counter, customized home theater room, and central AC.",
        price: 52000000,
        city: "Pune",
        address: "Boat Club Road Elite",
        bedrooms: 4,
        bathrooms: 4,
        image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
        property_type: "Penthouse",
        area_sqft: 4200,
        status: "Available"
      },
      {
        title: "3 BHK Seafacing Apartment in Carter Road",
        description: "Breathtaking sea-facing apartment. Features large french windows, expansive living lounge, teakwood furniture, and automated security monitoring systems.",
        price: 75000000,
        city: "Mumbai",
        address: "Carter Road Promenade, Bandra West",
        bedrooms: 3,
        bathrooms: 3,
        image_url: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80",
        property_type: "Apartment",
        area_sqft: 1800,
        status: "Available"
      },
      {
        title: "2 BHK Luxury Smart Home in New Friends Colony",
        description: "Fully automated smart home with voice-controlled lighting, smart lock doors, motion-sensor faucets, climate control, and modular kitchen spaces.",
        price: 18500000,
        city: "Delhi",
        address: "New Friends Colony West Enclave",
        bedrooms: 2,
        bathrooms: 2,
        image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
        property_type: "House",
        area_sqft: 1250,
        status: "Available"
      }
    ];

    for (const prop of properties) {
      await pool.query(
        `INSERT INTO properties (
          title, description, price, city, address, bedrooms, bathrooms, image_url, property_type, area_sqft, status, owner_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          prop.title,
          prop.description,
          prop.price,
          prop.city,
          prop.address,
          prop.bedrooms,
          prop.bathrooms,
          prop.image_url,
          prop.property_type,
          prop.area_sqft,
          prop.status,
          ownerId
        ]
      );
      console.log(`Inserted: ${prop.title}`);
    }

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await pool.end();
  }
}

seed();
