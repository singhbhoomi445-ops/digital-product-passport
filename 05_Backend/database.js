require("dotenv").config();

const { Pool } = require("pg");

// ============================================================
// POSTGRESQL CONNECTION
// ============================================================

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "digital_product_passport",
  password: "Mahadev@08",
  port: 5432,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

pool.on("error", (error) => {
  console.error("❌ PostgreSQL error:", error);
});

// ============================================================
// DATABASE INITIALIZATION
// ============================================================

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        year TEXT,
        status TEXT DEFAULT 'Active',
        manufacturer TEXT,
        material TEXT,
        repairability TEXT,
        recyclability TEXT,

        description TEXT,
        model_number TEXT,
        serial_number TEXT,
        operating_system TEXT,
        processor TEXT,
        ram TEXT,
        storage TEXT,
        battery_capacity TEXT,

        manufacturing_location TEXT,
        manufacturing_date TEXT,
        carbon_footprint TEXT,
        energy_source TEXT,

        device_condition TEXT,
        expected_lifespan TEXT,
        repair_info TEXT,
        reuse_pathway TEXT,

        recyclable_components TEXT,
        recycling_info TEXT,
        data_disposal TEXT,
        end_of_life TEXT,

        image TEXT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS lifecycle_events (
        id SERIAL PRIMARY KEY,
        product_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (product_id)
          REFERENCES products(id)
          ON DELETE CASCADE
      )
    `);

    // Add new columns if an older products table already exists.
    const columns = [
      ["description", "TEXT"],
      ["model_number", "TEXT"],
      ["serial_number", "TEXT"],
      ["operating_system", "TEXT"],
      ["processor", "TEXT"],
      ["ram", "TEXT"],
      ["storage", "TEXT"],
      ["battery_capacity", "TEXT"],
      ["manufacturing_location", "TEXT"],
      ["manufacturing_date", "TEXT"],
      ["carbon_footprint", "TEXT"],
      ["energy_source", "TEXT"],
      ["device_condition", "TEXT"],
      ["expected_lifespan", "TEXT"],
      ["repair_info", "TEXT"],
      ["reuse_pathway", "TEXT"],
      ["recyclable_components", "TEXT"],
      ["recycling_info", "TEXT"],
      ["data_disposal", "TEXT"],
      ["end_of_life", "TEXT"],
      ["image", "TEXT"],
    ];

    for (const [column, type] of columns) {
      await pool.query(`
        ALTER TABLE products
        ADD COLUMN IF NOT EXISTS ${column} ${type}
      `);
    }

    console.log("✅ PostgreSQL tables ready");

    await insertInitialProducts();

    console.log("✅ Initial products checked");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

// ============================================================
// INITIAL PRODUCTS
// ============================================================

async function insertInitialProducts() {
  const initialProducts = [
    {
      id: "DPP-001",
      name: "Dell Latitude 5420",
      category: "Laptop",
      year: "2025",
      status: "Active",
      manufacturer: "Dell",
      material: "Aluminium, Plastic, Electronics",
      repairability: "High",
      recyclability: "85%",
      description:
        "Professional laptop designed for long-term productivity and repairability.",
      model_number: "Latitude 5420",
      serial_number: "DELL-DPP-001",
      operating_system: "Windows 11",
      processor: "Intel Core i5",
      ram: "16 GB",
      storage: "512 GB SSD",
      battery_capacity: "63 Wh",
      manufacturing_location: "India",
      manufacturing_date: "2025-03-10",
      carbon_footprint: "210 kg CO₂e",
      energy_source: "Grid + Renewable",
      device_condition: "Good",
      expected_lifespan: "5–7 years",
      repair_info:
        "Battery, RAM, SSD and keyboard can be serviced or replaced.",
      reuse_pathway: "Refurbishment → Secondary user",
      recyclable_components:
        "Aluminium, copper, steel, plastics and electronics",
      recycling_info:
        "Return the laptop to an authorized e-waste recycling facility.",
      data_disposal:
        "Securely erase all personal data before reuse or recycling.",
      end_of_life:
        "Repair → Reuse → Refurbish → Recover materials → Recycle",
      image: "",
    },

    {
      id: "DPP-002",
      name: "Samsung Galaxy S22",
      category: "Smartphone",
      year: "2024",
      status: "Repaired",
      manufacturer: "Samsung",
      material: "Glass, Aluminium, Electronics",
      repairability: "Medium",
      recyclability: "80%",
      description:
        "Compact smartphone with a repair and reuse oriented lifecycle.",
      model_number: "SM-S901",
      serial_number: "SAM-DPP-002",
      operating_system: "Android",
      processor: "Snapdragon",
      ram: "8 GB",
      storage: "128 GB",
      battery_capacity: "3700 mAh",
      manufacturing_location: "South Korea",
      manufacturing_date: "2024-02-12",
      carbon_footprint: "160 kg CO₂e",
      energy_source: "Grid + Renewable",
      device_condition: "Repaired",
      expected_lifespan: "4–6 years",
      repair_info:
        "Screen, battery and selected internal components can be serviced.",
      reuse_pathway: "Repair → Secondary user",
      recyclable_components:
        "Glass, aluminium, copper, plastics and electronic components",
      recycling_info:
        "Use an authorized electronic waste collection point.",
      data_disposal:
        "Perform a secure factory reset and remove personal accounts.",
      end_of_life:
        "Reuse → Refurbish → Material recovery → Recycle",
      image: "",
    },

    {
      id: "DPP-003",
      name: "HP EliteBook",
      category: "Laptop",
      year: "2023",
      status: "Reused",
      manufacturer: "HP",
      material: "Aluminium, Plastic, Electronics",
      repairability: "High",
      recyclability: "82%",
      description:
        "Business laptop designed for extended use and refurbishment.",
      model_number: "EliteBook 840",
      serial_number: "HP-DPP-003",
      operating_system: "Windows 11",
      processor: "Intel Core i7",
      ram: "16 GB",
      storage: "512 GB SSD",
      battery_capacity: "53 Wh",
      manufacturing_location: "India",
      manufacturing_date: "2023-06-20",
      carbon_footprint: "195 kg CO₂e",
      energy_source: "Grid + Renewable",
      device_condition: "Good",
      expected_lifespan: "5–7 years",
      repair_info:
        "Storage, battery, memory and keyboard are serviceable.",
      reuse_pathway: "Refurbishment → Secondary user",
      recyclable_components:
        "Aluminium, copper, steel, plastics and electronics",
      recycling_info:
        "Send the device to an authorized e-waste recycler.",
      data_disposal:
        "Securely erase all personal information before transfer.",
      end_of_life:
        "Reuse → Refurbish → Recover materials → Recycle",
      image: "",
    },

    {
      id: "DPP-004",
      name: "Apple iPhone 13",
      category: "Smartphone",
      year: "2024",
      status: "Active",
      manufacturer: "Apple",
      material: "Glass, Aluminium, Electronics",
      repairability: "Medium",
      recyclability: "78%",
      description:
        "Smartphone with traceable material and end-of-life information.",
      model_number: "A2633",
      serial_number: "APPLE-DPP-004",
      operating_system: "iOS",
      processor: "A15 Bionic",
      ram: "4 GB",
      storage: "128 GB",
      battery_capacity: "3227 mAh",
      manufacturing_location: "China",
      manufacturing_date: "2024-01-18",
      carbon_footprint: "170 kg CO₂e",
      energy_source: "Grid + Renewable",
      device_condition: "Good",
      expected_lifespan: "4–6 years",
      repair_info:
        "Battery, display and selected components can be serviced.",
      reuse_pathway: "Repair → Refurbishment → Secondary user",
      recyclable_components:
        "Glass, aluminium, copper, plastics and electronic components",
      recycling_info:
        "Use an authorized electronics recycling or collection facility.",
      data_disposal:
        "Back up data, sign out of accounts and securely erase the device.",
      end_of_life:
        "Reuse → Refurbish → Recover materials → Recycle",
      image: "",
    },
  ];

  for (const product of initialProducts) {
    await pool.query(
      `
      INSERT INTO products (
        id,
        name,
        category,
        year,
        status,
        manufacturer,
        material,
        repairability,
        recyclability,
        description,
        model_number,
        serial_number,
        operating_system,
        processor,
        ram,
        storage,
        battery_capacity,
        manufacturing_location,
        manufacturing_date,
        carbon_footprint,
        energy_source,
        device_condition,
        expected_lifespan,
        repair_info,
        reuse_pathway,
        recyclable_components,
        recycling_info,
        data_disposal,
        end_of_life,
        image
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15,$16,$17,
        $18,$19,$20,$21,$22,$23,$24,$25,
        $26,$27,$28,$29,$30
      )
      ON CONFLICT (id) DO NOTHING
      `,
      [
        product.id,
        product.name,
        product.category,
        product.year,
        product.status,
        product.manufacturer,
        product.material,
        product.repairability,
        product.recyclability,
        product.description,
        product.model_number,
        product.serial_number,
        product.operating_system,
        product.processor,
        product.ram,
        product.storage,
        product.battery_capacity,
        product.manufacturing_location,
        product.manufacturing_date,
        product.carbon_footprint,
        product.energy_source,
        product.device_condition,
        product.expected_lifespan,
        product.repair_info,
        product.reuse_pathway,
        product.recyclable_components,
        product.recycling_info,
        product.data_disposal,
        product.end_of_life,
        product.image,
      ]
    );
  }
}

// ============================================================
// GET ALL PRODUCTS
// ============================================================

async function getAllProducts() {
  const result = await pool.query(`
    SELECT *
    FROM products
    ORDER BY created_at DESC
  `);

  return result.rows;
}

// ============================================================
// GET PRODUCT
// ============================================================

async function getProductById(id) {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}

// ============================================================
// CREATE PRODUCT
// ============================================================

async function createProduct(product) {
  const result = await pool.query(
    `
    INSERT INTO products (
      id,
      name,
      category,
      year,
      status,
      manufacturer,
      material,
      repairability,
      recyclability,
      description,
      model_number,
      serial_number,
      operating_system,
      processor,
      ram,
      storage,
      battery_capacity,
      manufacturing_location,
      manufacturing_date,
      carbon_footprint,
      energy_source,
      device_condition,
      expected_lifespan,
      repair_info,
      reuse_pathway,
      recyclable_components,
      recycling_info,
      data_disposal,
      end_of_life,
      image
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,
      $10,$11,$12,$13,$14,$15,$16,$17,
      $18,$19,$20,$21,$22,$23,$24,$25,
      $26,$27,$28,$29,$30
    )
    RETURNING *
    `,
    [
      product.id,
      product.name,
      product.category,
      product.year,
      product.status,
      product.manufacturer,
      product.material,
      product.repairability,
      product.recyclability,
      product.description,
      product.model_number,
      product.serial_number,
      product.operating_system,
      product.processor,
      product.ram,
      product.storage,
      product.battery_capacity,
      product.manufacturing_location,
      product.manufacturing_date,
      product.carbon_footprint,
      product.energy_source,
      product.device_condition,
      product.expected_lifespan,
      product.repair_info,
      product.reuse_pathway,
      product.recyclable_components,
      product.recycling_info,
      product.data_disposal,
      product.end_of_life,
      product.image,
    ]
  );

  return result.rows[0];
}

// ============================================================
// UPDATE PRODUCT
// ============================================================

async function updateProduct(id, product) {
  const result = await pool.query(
    `
    UPDATE products
    SET
      name = $1,
      category = $2,
      year = $3,
      status = $4,
      manufacturer = $5,
      material = $6,
      repairability = $7,
      recyclability = $8,
      description = $9,
      model_number = $10,
      serial_number = $11,
      operating_system = $12,
      processor = $13,
      ram = $14,
      storage = $15,
      battery_capacity = $16,
      manufacturing_location = $17,
      manufacturing_date = $18,
      carbon_footprint = $19,
      energy_source = $20,
      device_condition = $21,
      expected_lifespan = $22,
      repair_info = $23,
      reuse_pathway = $24,
      recyclable_components = $25,
      recycling_info = $26,
      data_disposal = $27,
      end_of_life = $28,
      image = $29
    WHERE id = $30
    RETURNING *
    `,
    [
      product.name,
      product.category,
      product.year,
      product.status,
      product.manufacturer,
      product.material,
      product.repairability,
      product.recyclability,
      product.description,
      product.model_number,
      product.serial_number,
      product.operating_system,
      product.processor,
      product.ram,
      product.storage,
      product.battery_capacity,
      product.manufacturing_location,
      product.manufacturing_date,
      product.carbon_footprint,
      product.energy_source,
      product.device_condition,
      product.expected_lifespan,
      product.repair_info,
      product.reuse_pathway,
      product.recyclable_components,
      product.recycling_info,
      product.data_disposal,
      product.end_of_life,
      product.image,
      id,
    ]
  );

  return result.rows[0];
}

// ============================================================
// DELETE PRODUCT
// ============================================================

async function deleteProduct(id) {
  const result = await pool.query(
    `
    DELETE FROM products
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
}

// ============================================================
// UPDATE STATUS
// ============================================================

async function updateProductStatus(id, status) {
  const result = await pool.query(
    `
    UPDATE products
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return result.rows[0];
}

// ============================================================
// LIFECYCLE EVENT
// ============================================================

async function addLifecycleEvent(
  productId,
  eventType,
  description
) {
  const result = await pool.query(
    `
    INSERT INTO lifecycle_events (
      product_id,
      event_type,
      description
    )
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [productId, eventType, description]
  );

  return result.rows[0];
}

// ============================================================
// GET LIFECYCLE
// ============================================================

async function getLifecycleEvents(productId) {
  const result = await pool.query(
    `
    SELECT *
    FROM lifecycle_events
    WHERE product_id = $1
    ORDER BY created_at ASC
    `,
    [productId]
  );

  return result.rows;
}

// ============================================================
// DASHBOARD STATS
// ============================================================

async function getDashboardStats() {
  const productsResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM products
  `);

  const repairsResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM lifecycle_events
    WHERE event_type = 'repair'
  `);

  const reusedResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM lifecycle_events
    WHERE event_type = 'reuse'
  `);

  const recyclingResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM lifecycle_events
    WHERE event_type = 'recycle'
  `);

  const activeResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM products
    WHERE status = 'Active'
  `);

  const repairedProductsResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM products
    WHERE status = 'Repaired'
  `);

  const reusedProductsResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM products
    WHERE status = 'Reused'
  `);

  const recycledProductsResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM products
    WHERE status = 'Recycled'
  `);

  return {
    products: Number(productsResult.rows[0].count),
    repairs: Number(repairsResult.rows[0].count),
    reused: Number(reusedResult.rows[0].count),
    recycling: Number(recyclingResult.rows[0].count),
    active: Number(activeResult.rows[0].count),
    repairedProducts: Number(
      repairedProductsResult.rows[0].count
    ),
    reusedProducts: Number(
      reusedProductsResult.rows[0].count
    ),
    recycledProducts: Number(
      recycledProductsResult.rows[0].count
    ),
  };
}

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  pool,
  initializeDatabase,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  addLifecycleEvent,
  getLifecycleEvents,
  getDashboardStats,
};