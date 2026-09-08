const express = require("express");
const cors = require("cors");

const {
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
} = require("./database");

const app = express();
const PORT = 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: "5mb" }));

// ============================================================
// HEALTH
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Digital Product Passport API is running",
    version: "3.0.0",
    database: "PostgreSQL",
  });
});

// ============================================================
// GET ALL PRODUCTS
// ============================================================

app.get("/api/products", async (req, res) => {
  try {
    const products = await getAllProducts();

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load products",
      error: error.message,
    });
  }
});

// ============================================================
// GET PRODUCT
// ============================================================

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load product",
      error: error.message,
    });
  }
});

// ============================================================
// CREATE PRODUCT
// ============================================================

app.post("/api/products", async (req, res) => {
  try {
    const body = req.body;

    if (!body.name || !body.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Device name is required",
      });
    }

    if (!body.manufacturer || !body.manufacturer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand / manufacturer is required",
      });
    }

    if (!body.category || !body.category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Device category is required",
      });
    }

    let id = body.id || body.productId;

    if (!id) {
      const products = await getAllProducts();

      const numbers = products
        .map((product) => {
          const match = String(product.id).match(
            /DPP-(\d+)/
          );

          return match ? Number(match[1]) : 0;
        })
        .filter(Boolean);

      const next =
        numbers.length > 0
          ? Math.max(...numbers) + 1
          : 1;

      id = `DPP-${String(next).padStart(4, "0")}`;
    }

    const existing = await getProductById(id);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Product ID already exists",
      });
    }

    const product = {
      id,
      name: body.name,
      category: body.category,
      year:
        body.year ||
        new Date().getFullYear().toString(),

      status: body.status || "Active",

      manufacturer:
        body.manufacturer || "",

      material:
        body.material || "",

      repairability:
        body.repairability || "",

      recyclability:
        body.recyclability || "",

      description:
        body.description || "",

      model_number:
        body.model_number || "",

      serial_number:
        body.serial_number || "",

      operating_system:
        body.operating_system || "",

      processor:
        body.processor || "",

      ram:
        body.ram || "",

      storage:
        body.storage || "",

      battery_capacity:
        body.battery_capacity || "",

      manufacturing_location:
        body.manufacturing_location || "",

      manufacturing_date:
        body.manufacturing_date || "",

      carbon_footprint:
        body.carbon_footprint || "",

      energy_source:
        body.energy_source || "",

      device_condition:
        body.device_condition || "",

      expected_lifespan:
        body.expected_lifespan || "",

      repair_info:
        body.repair_info || "",

      reuse_pathway:
        body.reuse_pathway || "",

      recyclable_components:
        body.recyclable_components || "",

      recycling_info:
        body.recycling_info || "",

      data_disposal:
        body.data_disposal || "",

      end_of_life:
        body.end_of_life || "",

      image:
        body.image || "",
    };

    const created = await createProduct(product);

    await addLifecycleEvent(
      id,
      "registered",
      "Digital Product Passport created."
    );

    res.status(201).json({
      success: true,
      message: "Product registered successfully",
      product: created,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create product",
      error: error.message,
    });
  }
});

// ============================================================
// UPDATE PRODUCT
// ============================================================

app.put("/api/products/:id", async (req, res) => {
  try {
    const existing = await getProductById(
      req.params.id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const body = req.body;

    const product = {
      name:
        body.name ?? existing.name,

      category:
        body.category ?? existing.category,

      year:
        body.year ?? existing.year,

      status:
        body.status ?? existing.status,

      manufacturer:
        body.manufacturer ??
        existing.manufacturer,

      material:
        body.material ??
        existing.material,

      repairability:
        body.repairability ??
        existing.repairability,

      recyclability:
        body.recyclability ??
        existing.recyclability,

      description:
        body.description ??
        existing.description,

      model_number:
        body.model_number ??
        existing.model_number,

      serial_number:
        body.serial_number ??
        existing.serial_number,

      operating_system:
        body.operating_system ??
        existing.operating_system,

      processor:
        body.processor ??
        existing.processor,

      ram:
        body.ram ??
        existing.ram,

      storage:
        body.storage ??
        existing.storage,

      battery_capacity:
        body.battery_capacity ??
        existing.battery_capacity,

      manufacturing_location:
        body.manufacturing_location ??
        existing.manufacturing_location,

      manufacturing_date:
        body.manufacturing_date ??
        existing.manufacturing_date,

      carbon_footprint:
        body.carbon_footprint ??
        existing.carbon_footprint,

      energy_source:
        body.energy_source ??
        existing.energy_source,

      device_condition:
        body.device_condition ??
        existing.device_condition,

      expected_lifespan:
        body.expected_lifespan ??
        existing.expected_lifespan,

      repair_info:
        body.repair_info ??
        existing.repair_info,

      reuse_pathway:
        body.reuse_pathway ??
        existing.reuse_pathway,

      recyclable_components:
        body.recyclable_components ??
        existing.recyclable_components,

      recycling_info:
        body.recycling_info ??
        existing.recycling_info,

      data_disposal:
        body.data_disposal ??
        existing.data_disposal,

      end_of_life:
        body.end_of_life ??
        existing.end_of_life,

      image:
        body.image ??
        existing.image,
    };

    const updated = await updateProduct(
      req.params.id,
      product
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update product",
      error: error.message,
    });
  }
});

// ============================================================
// DELETE PRODUCT
// ============================================================

app.delete("/api/products/:id", async (req, res) => {
  try {
    const existing = await getProductById(
      req.params.id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const deleted = await deleteProduct(
      req.params.id
    );

    res.json({
      success: true,
      message: "Product deleted successfully",
      product: deleted,
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete product",
      error: error.message,
    });
  }
});

// ============================================================
// DASHBOARD
// ============================================================

app.get("/api/dashboard", async (req, res) => {
  try {
    const statistics =
      await getDashboardStats();

    res.json({
      success: true,
      statistics,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load dashboard",
      error: error.message,
    });
  }
});

// ============================================================
// LIFECYCLE GET
// ============================================================

app.get(
  "/api/products/:id/lifecycle",
  async (req, res) => {
    try {
      const product =
        await getProductById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const lifecycle =
        await getLifecycleEvents(
          req.params.id
        );

      res.json({
        success: true,
        productId: product.id,
        lifecycle,
      });
    } catch (error) {
      console.error(
        "LIFECYCLE GET ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Unable to load lifecycle",
        error: error.message,
      });
    }
  }
);

// ============================================================
// GENERIC LIFECYCLE ACTION
// ============================================================

async function lifecycleAction(
  req,
  res,
  status,
  eventType,
  defaultDescription
) {
  try {
    const product =
      await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const description =
      req.body?.description ||
      defaultDescription;

    const updated =
      await updateProductStatus(
        req.params.id,
        status
      );

    const event =
      await addLifecycleEvent(
        req.params.id,
        eventType,
        description
      );

    res.json({
      success: true,
      message: `${eventType} event recorded`,
      product: updated,
      event,
    });
  } catch (error) {
    console.error(
      "LIFECYCLE ACTION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: `Unable to record ${eventType}`,
      error: error.message,
    });
  }
}

// ============================================================
// REPAIR
// ============================================================

app.post(
  "/api/products/:id/repair",
  async (req, res) => {
    await lifecycleAction(
      req,
      res,
      "Repaired",
      "repair",
      "Product repair event recorded."
    );
  }
);

// ============================================================
// REUSE
// ============================================================

app.post(
  "/api/products/:id/reuse",
  async (req, res) => {
    await lifecycleAction(
      req,
      res,
      "Reused",
      "reuse",
      "Product reuse event recorded."
    );
  }
);

// ============================================================
// RECYCLE
// ============================================================

app.post(
  "/api/products/:id/recycle",
  async (req, res) => {
    await lifecycleAction(
      req,
      res,
      "Recycled",
      "recycle",
      "Product recycling event recorded."
    );
  }
);

// ============================================================
// QR LOOKUP
// ============================================================

app.get(
  "/api/qr/:productId",
  async (req, res) => {
    try {
      const product =
        await getProductById(
          req.params.productId
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "QR product not found",
        });
      }

      res.json({
        success: true,
        message: "QR code product identified",
        productId: product.id,
        product,
      });
    } catch (error) {
      console.error("QR ERROR:", error);

      res.status(500).json({
        success: false,
        message: "QR lookup failed",
        error: error.message,
      });
    }
  }
);

// ============================================================
// 404
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// ============================================================
// START SERVER
// ============================================================

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log("");
      console.log("==========================================");
      console.log("   DIGITAL PRODUCT PASSPORT BACKEND");
      console.log("==========================================");
      console.log("");
      console.log(
        `🚀 Server: http://localhost:${PORT}`
      );
      console.log("🗄️ Database: PostgreSQL");
      console.log("");
      console.log("API:");
      console.log("GET    /");
      console.log("GET    /api/products");
      console.log("GET    /api/products/:id");
      console.log("POST   /api/products");
      console.log("PUT    /api/products/:id");
      console.log("DELETE /api/products/:id");
      console.log(
        "GET    /api/products/:id/lifecycle"
      );
      console.log("GET    /api/dashboard");
      console.log("GET    /api/qr/:productId");
      console.log(
        "POST   /api/products/:id/repair"
      );
      console.log(
        "POST   /api/products/:id/reuse"
      );
      console.log(
        "POST   /api/products/:id/recycle"
      );
      console.log("");
      console.log("==========================================");
      console.log("");
    });
  } catch (error) {
    console.error(
      "❌ Server could not start:",
      error
    );

    process.exit(1);
  }
}

startServer();