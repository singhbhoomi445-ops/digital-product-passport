import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

const STORAGE_KEY = "dpp_products";

const API_BASE_URL = "http://localhost:5000";
const NETWORK_IP = "10.250.46.190";

const emptyProduct = {
  name: "",
  brand: "",
  category: "",
  productId: "",
  description: "",

  modelNumber: "",
  serialNumber: "",
  operatingSystem: "",
  processor: "",
  ram: "",
  storage: "",
  batteryCapacity: "",

  manufacturingLocation: "",
  manufacturingDate: "",
  carbonFootprint: "",
  energySource: "",

  deviceCondition: "",
  expectedLifespan: "",
  repairability: "",
  repairInfo: "",
  reusePathway: "",

  recyclableComponents: "",
  recyclingInfo: "",
  dataDisposal: "",
  endOfLife: "",

  image: "",
};

const demoProducts = [
  {
    id: "DPP-0001",
    name: "EcoBook Pro 14",
    brand: "GreenTech",
    category: "Laptop",
    productId: "DPP-0001",
    description:
      "Energy-efficient laptop designed for long-term use, repair, reuse and responsible recycling.",

    modelNumber: "ECOBOOK-14",
    serialNumber: "GT-ECO-2026-0001",
    operatingSystem: "Windows 11",
    processor: "Intel Core i5",
    ram: "16 GB",
    storage: "512 GB SSD",
    batteryCapacity: "54 Wh",

    manufacturingLocation: "Bengaluru, India",
    manufacturingDate: "2026-03-15",
    carbonFootprint: "185 kg CO₂e",
    energySource: "Renewable + Grid",

    deviceCondition: "Good",
    expectedLifespan: "5–7 years",
    repairability: "High",
    repairInfo:
      "Battery, SSD and keyboard can be replaced by an authorized service provider.",
    reusePathway: "Refurbishment → Secondary user",

    recyclableComponents:
      "Aluminium, copper, steel, plastics and electronic components",
    recyclingInfo:
      "Return the device to an authorized e-waste collection or recycling facility.",
    dataDisposal:
      "Erase personal data and perform a secure factory reset before transfer or recycling.",
    endOfLife:
      "Reuse → Refurbish → Recover materials → Recycle",

    image: "",
    createdAt: new Date().toISOString(),
  },
];

function getProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(demoProducts)
      );

      return demoProducts;
    }

    return JSON.parse(saved);
  } catch {
    return demoProducts;
  }
}

function createProductId(products) {
  const numbers = products
    .map((product) => {
      const match = String(
        product.id || product.productId || ""
      ).match(/DPP-(\d+)/);

      return match ? Number(match[1]) : 0;
    })
    .filter(Boolean);

  const nextNumber =
    numbers.length
      ? Math.max(...numbers) + 1
      : 1;

  return `DPP-${String(nextNumber).padStart(4, "0")}`;
}

function encodeProduct(product) {
  try {
    const json = JSON.stringify(product);

    const bytes =
      new TextEncoder().encode(json);

    let binary = "";

    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    return "";
  }
}

function decodeProduct(value) {
  try {
    const base64 = value
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padding = "=".repeat(
      (4 - (base64.length % 4)) % 4
    );

    const binary = atob(
      base64 + padding
    );

    const bytes = Uint8Array.from(
      binary,
      (char) => char.charCodeAt(0)
    );

    return JSON.parse(
      new TextDecoder().decode(bytes)
    );
  } catch {
    return null;
  }
}

/*
============================================================
QR URL
============================================================

IMPORTANT:

Computer:
http://localhost:5173

Phone:
http://10.250.46.190:5173

The QR MUST use the network IP instead of localhost.
============================================================
*/

function getPassportUrl(product) {
  const encoded = encodeProduct(product);

  const protocol =
    window.location.protocol || "http:";

  const port =
    window.location.port || "5173";

  let host = window.location.hostname;

  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1"
  ) {
    host = NETWORK_IP;
  }

  return `${protocol}//${host}:${port}${window.location.pathname}?passport=${encoded}`;
}

function formatDate(date) {
  if (!date) {
    return "Not provided";
  }

  try {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return date;
  }
}

function App() {
  const [products, setProducts] =
    useState(getProducts);

  const [page, setPage] =
    useState("dashboard");

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [form, setForm] =
    useState(emptyProduct);

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [showDeleteModal, setShowDeleteModal] =
    useState(null);

  const [toast, setToast] =
    useState("");

  const [showQR, setShowQR] =
    useState(null);

  const [passportProduct, setPassportProduct] =
    useState(null);

  const [apiStatus, setApiStatus] =
    useState("checking");

  /*
  ============================================================
  SAVE LOCAL COPY
  ============================================================
  */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(products)
    );
  }, [products]);

  /*
  ============================================================
  CHECK BACKEND
  ============================================================
  */

  useEffect(() => {
    fetch(`${API_BASE_URL}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend unavailable");
        }

        return response.json();
      })
      .then(() => {
        setApiStatus("online");
      })
      .catch(() => {
        setApiStatus("offline");
      });
  }, []);

  /*
  ============================================================
  PASSPORT FROM QR
  ============================================================
  */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const passportData =
      params.get("passport");

    if (!passportData) {
      return;
    }

    const decoded =
      decodeProduct(passportData);

    if (decoded) {
      setPassportProduct(decoded);
      setSelectedProduct(decoded);
      setPage("passport");
    }
  }, []);

  /*
  ============================================================
  TOAST
  ============================================================
  */

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer =
      setTimeout(() => {
        setToast("");
      }, 2800);

    return () => clearTimeout(timer);
  }, [toast]);

  /*
  ============================================================
  FILTER
  ============================================================
  */

  const filteredProducts =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return products;
      }

      return products.filter(
        (product) =>
          [
            product.name,
            product.brand,
            product.category,
            product.productId,
            product.id,
            product.modelNumber,
            product.serialNumber,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
      );
    }, [products, search]);

  /*
  ============================================================
  STATISTICS
  ============================================================
  */

  const totalProducts =
    products.length;

  const totalRecycled =
    useMemo(() => {
      if (!products.length) {
        return 0;
      }

      const values =
        products
          .map((product) =>
            parseFloat(
              String(
                product.recyclability ||
                product.recycledContent ||
                ""
              ).replace("%", "")
            )
          )
          .filter(
            (value) =>
              !Number.isNaN(value)
          );

      if (!values.length) {
        return 0;
      }

      return Math.round(
        values.reduce(
          (sum, value) =>
            sum + value,
          0
        ) / values.length
      );
    }, [products]);

  /*
  ============================================================
  INPUT
  ============================================================
  */

  const handleInput = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
  ============================================================
  ADD
  ============================================================
  */

  const openAddProduct = () => {
    setEditingId(null);

    setForm({
      ...emptyProduct,
      productId:
        createProductId(products),
    });

    setPage("add");
  };

  /*
  ============================================================
  EDIT
  ============================================================
  */

  const openEditProduct = (
    product
  ) => {
    setEditingId(product.id);

    setForm({
      ...emptyProduct,
      ...product,
    });

    setPage("add");
  };

  /*
  ============================================================
  SAVE PRODUCT
  ============================================================
  */

  const saveProduct = async (
    event
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setToast(
        "Please enter a device name."
      );
      return;
    }

    if (!form.brand.trim()) {
      setToast(
        "Please enter the brand / manufacturer."
      );
      return;
    }

    const generatedId =
      form.productId ||
      createProductId(products);

    const product = {
      ...form,

      id: generatedId,
      productId: generatedId,

      createdAt:
        editingId
          ? products.find(
              (item) =>
                item.id ===
                editingId
            )?.createdAt ||
            new Date().toISOString()
          : new Date().toISOString(),
    };

    /*
    ==========================================================
    UPDATE EXISTING PRODUCT
    ==========================================================
    */

    if (editingId) {
      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/products/${editingId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                name: product.name,
                category:
                  product.category,
                year:
                  product.year ||
                  new Date()
                    .getFullYear()
                    .toString(),
                status:
                  product.status ||
                  "Active",
                manufacturer:
                  product.brand,
                material:
                  product.material ||
                  "Not specified",
                repairability:
                  product.repairability ||
                  "Not specified",
                recyclability:
                  product.recyclability ||
                  "Not specified",
              }),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Update failed"
          );
        }

        const data =
          await response.json();

        const backendProduct =
          data.product;

        setProducts(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                editingId
                  ? {
                      ...item,
                      ...product,
                      ...(backendProduct
                        ? {
                            id:
                              backendProduct.id,
                            productId:
                              backendProduct.id,
                            name:
                              backendProduct.name,
                            category:
                              backendProduct.category,
                            brand:
                              backendProduct.manufacturer,
                            year:
                              backendProduct.year,
                            status:
                              backendProduct.status,
                            material:
                              backendProduct.material,
                            repairability:
                              backendProduct.repairability,
                            recyclability:
                              backendProduct.recyclability,
                          }
                        : {}),
                    }
                  : item
            )
        );

        setToast(
          "Device passport updated in PostgreSQL."
        );
      } catch (error) {
        console.error(error);

        /*
        Local fallback
        */

        setProducts(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                editingId
                  ? product
                  : item
            )
        );

        setToast(
          "Backend unavailable. Saved locally."
        );
      }
    }

    /*
    ==========================================================
    CREATE NEW PRODUCT
    ==========================================================
    */

    else {
      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/products`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                id: generatedId,
                name: product.name,
                category:
                  product.category ||
                  "Device",
                year:
                  product.year ||
                  new Date()
                    .getFullYear()
                    .toString(),
                status:
                  product.status ||
                  "Active",
                manufacturer:
                  product.brand,
                material:
                  product.material ||
                  "Not specified",
                repairability:
                  product.repairability ||
                  "Not specified",
                recyclability:
                  product.recyclability ||
                  "Not specified",
              }),
            }
          );

        if (!response.ok) {
          const errorData =
            await response.json()
              .catch(() => null);

          throw new Error(
            errorData?.message ||
              "Create failed"
          );
        }

        const data =
          await response.json();

        const backendProduct =
          data.product;

        const finalProduct = {
          ...product,

          id:
            backendProduct?.id ||
            generatedId,

          productId:
            backendProduct?.id ||
            generatedId,

          brand:
            backendProduct?.manufacturer ||
            product.brand,

          name:
            backendProduct?.name ||
            product.name,

          category:
            backendProduct?.category ||
            product.category,

          year:
            backendProduct?.year ||
            product.year,

          status:
            backendProduct?.status ||
            product.status ||
            "Active",

          createdAt:
            backendProduct?.created_at ||
            product.createdAt,
        };

        setProducts(
          (current) => [
            finalProduct,
            ...current,
          ]
        );

        setToast(
          "Device passport created in PostgreSQL."
        );
      } catch (error) {
        console.error(error);

        /*
        Local fallback
        */

        setProducts(
          (current) => [
            product,
            ...current,
          ]
        );

        setToast(
          "Backend unavailable. Saved locally."
        );
      }
    }

    setForm(emptyProduct);
    setEditingId(null);
    setPage("products");
  };

  /*
  ============================================================
  DELETE PRODUCT
  ============================================================
  */

  const deleteProduct = async (
    id
  ) => {
    try {
      const response =
        await fetch(
          `${API_BASE_URL}/api/products/${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Delete failed"
        );
      }

      setProducts(
        (current) =>
          current.filter(
            (product) =>
              product.id !== id
          )
      );

      setShowDeleteModal(null);

      setToast(
        "Device passport deleted from PostgreSQL."
      );
    } catch (error) {
      console.error(error);

      setProducts(
        (current) =>
          current.filter(
            (product) =>
              product.id !== id
          )
      );

      setShowDeleteModal(null);

      setToast(
        "Backend unavailable. Deleted locally."
      );
    }
  };

  /*
  ============================================================
  VIEW PRODUCT
  ============================================================
  */

  const viewProduct = (
    product
  ) => {
    setSelectedProduct(product);
    setPassportProduct(product);
    setPage("passport");
  };

  /*
  ============================================================
  QR
  ============================================================
  */

  const openQR = (
    product
  ) => {
    setShowQR(product);
  };

  /*
  ============================================================
  COPY QR LINK
  ============================================================
  */

  const copyPassportLink =
    async (product) => {
      const url =
        getPassportUrl(product);

      try {
        await navigator.clipboard.writeText(
          url
        );

        setToast(
          "Passport link copied."
        );
      } catch {
        setToast(
          "Copy failed. Please copy the link manually."
        );
      }
    };

  /*
  ============================================================
  DOWNLOAD QR
  ============================================================
  */

  const downloadQR = (
    product
  ) => {
    const canvas =
      document.getElementById(
        `qr-${product.id}`
      );

    if (!canvas) {
      return;
    }

    const link =
      document.createElement(
        "a"
      );

    link.download =
      `${product.id}-QR.png`;

    link.href =
      canvas.toDataURL(
        "image/png"
      );

    link.click();

    setToast(
      "QR code downloaded."
    );
  };

  /*
  ============================================================
  HOME
  ============================================================
  */

  const goHome = () => {
    window.history.pushState(
      {},
      "",
      window.location.pathname
    );

    setPassportProduct(null);
    setSelectedProduct(null);
    setPage("dashboard");
  };

  /*
  ============================================================
  OPEN PASSPORT
  ============================================================
  */

  const goToPassport = (
    product
  ) => {
    const url =
      getPassportUrl(product);

    window.history.pushState(
      {},
      "",
      url
    );

    setPassportProduct(product);
    setSelectedProduct(product);
    setPage("passport");
  };

  /*
  ============================================================
  PASSPORT PAGE
  ============================================================
  */

  if (
    page === "passport" &&
    passportProduct
  ) {
    return (
      <PassportPage
        product={
          passportProduct
        }
        onBack={goHome}
        onHome={goHome}
      />
    );
  }

  /*
  ============================================================
  MAIN APPLICATION
  ============================================================
  */

  return (
    <div className="app-shell">

      <aside className="sidebar">

        <div className="brand-area">

          <div className="brand-mark">
            D
          </div>

          <div>
            <h1>EcoPass</h1>

            <span>
              Digital Product Passport
            </span>
          </div>

        </div>

        <nav className="navigation">

          <button
            className={
              page === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setPage(
                "dashboard"
              )
            }
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={
              page === "products"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setPage(
                "products"
              )
            }
          >
            <span>▦</span>
            Products
          </button>

          <button
            className={
              page === "add"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={
              openAddProduct
            }
          >
            <span>＋</span>
            Add Product
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="circular-card">

            <div className="circular-icon">
              ♻
            </div>

            <strong>
              Circular by design
            </strong>

            <p>
              Give every device a
              transparent digital
              identity from creation
              to reuse, repair and
              end of life.
            </p>

          </div>

          <div className="version">
            <span>EcoPass</span>
            <span>v1.0</span>
          </div>

        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <div>

            <span className="eyebrow">
              DIGITAL PRODUCT PASSPORT
            </span>

            <h2>

              {page === "dashboard" &&
                "Device intelligence, simplified."}

              {page === "products" &&
                "Your device library"}

              {page === "add" &&
                (editingId
                  ? "Update device passport"
                  : "Create a new device passport")}

            </h2>

          </div>

          <div className="topbar-actions">

            <span
              className={
                apiStatus === "online"
                  ? "backend-status online"
                  : apiStatus === "offline"
                  ? "backend-status offline"
                  : "backend-status"
              }
            >
              <i></i>

              {apiStatus ===
                "online"
                ? "PostgreSQL connected"
                : apiStatus ===
                  "offline"
                ? "Backend offline"
                : "Checking backend..."}
            </span>

            <button
              className="primary-button"
              onClick={
                openAddProduct
              }
            >
              <span>＋</span>
              Add Device
            </button>

          </div>

        </header>

        {page ===
          "dashboard" && (
          <Dashboard
            products={products}
            totalProducts={
              totalProducts
            }
            totalRecycled={
              totalRecycled
            }
            onAdd={
              openAddProduct
            }
            onView={
              viewProduct
            }
            onQR={openQR}
            onProducts={() =>
              setPage(
                "products"
              )
            }
          />
        )}

        {page ===
          "products" && (
          <ProductsPage
            products={
              filteredProducts
            }
            search={search}
            setSearch={
              setSearch
            }
            onAdd={
              openAddProduct
            }
            onView={
              viewProduct
            }
            onEdit={
              openEditProduct
            }
            onDelete={(
              product
            ) =>
              setShowDeleteModal(
                product
              )
            }
            onQR={openQR}
          />
        )}

        {page === "add" && (
          <AddProductPage
            form={form}
            editingId={
              editingId
            }
            onInput={
              handleInput
            }
            onSave={
              saveProduct
            }
            onCancel={() => {
              setEditingId(null);
              setForm(
                emptyProduct
              );
              setPage(
                "products"
              );
            }}
          />
        )}

      </main>

      {showQR && (
        <QRModal
          product={showQR}
          url={getPassportUrl(
            showQR
          )}
          onClose={() =>
            setShowQR(null)
          }
          onDownload={() =>
            downloadQR(
              showQR
            )
          }
          onCopy={() =>
            copyPassportLink(
              showQR
            )
          }
          onOpen={() => {
            setShowQR(null);
            goToPassport(
              showQR
            );
          }}
        />
      )}

      {showDeleteModal && (
        <div className="modal-backdrop">

          <div className="confirm-modal">

            <div className="danger-icon">
              !
            </div>

            <h3>
              Delete device passport?
            </h3>

            <p>
              This will remove{" "}
              <strong>
                {
                  showDeleteModal.name
                }
              </strong>{" "}
              from the device
              library.
            </p>

            <div className="modal-actions">

              <button
                className="secondary-button"
                onClick={() =>
                  setShowDeleteModal(
                    null
                  )
                }
              >
                Cancel
              </button>

              <button
                className="danger-button"
                onClick={() =>
                  deleteProduct(
                    showDeleteModal.id
                  )
                }
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

    </div>
  );
}


/*
================================================================
DASHBOARD
================================================================
*/

function Dashboard({
  products,
  totalProducts,
  totalRecycled,
  onAdd,
  onView,
  onQR,
  onProducts,
}) {
  return (
    <div className="page-body">

      <section className="hero-panel">

        <div className="hero-content">

          <span className="hero-label">
            TRACEABILITY • REUSE • REPAIR • RECYCLE
          </span>

          <h3>
            Every device has
            <br />
            a{" "}
            <em>
              digital story worth knowing.
            </em>
          </h3>

          <p>
            Create, manage and share
            Digital Product Passports
            for electronic devices with
            a unique QR identity.
          </p>

          <div className="hero-actions">

            <button
              className="hero-button"
              onClick={onAdd}
            >
              Create Device
              <span>→</span>
            </button>

            <button
              className="hero-link"
              onClick={
                onProducts
              }
            >
              View device library →
            </button>

          </div>

        </div>

        <div className="hero-visual">

          <div className="orbit orbit-one"></div>

          <div className="orbit orbit-two"></div>

          <div className="passport-orb">

            <div className="orb-inner">

              <span>♻</span>

              <strong>
                DPP
              </strong>

              <small>
                DEVICE IDENTITY
              </small>

            </div>

          </div>

          <div className="floating-tag tag-one">
            <span>✓</span>
            Traceable
          </div>

          <div className="floating-tag tag-two">
            <span>↗</span>
            Reusable
          </div>

        </div>

      </section>

      <section className="stats-grid">

        <StatCard
          icon="▦"
          label="Total devices"
          value={
            totalProducts
          }
          suffix=""
          description="Digital identities created"
        />

        <StatCard
          icon="♻"
          label="Circular readiness"
          value={
            totalRecycled
          }
          suffix="%"
          description="Recycling information recorded"
        />

        <StatCard
          icon="⌁"
          label="Passport status"
          value="100"
          suffix="%"
          description="Ready for QR sharing"
        />

        <StatCard
          icon="◎"
          label="QR identities"
          value={
            totalProducts
          }
          suffix=""
          description="Unique device passports"
        />

      </section>

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              DEVICE LIBRARY
            </span>

            <h3>
              Recently added
            </h3>

          </div>

          <button
            className="text-button"
            onClick={
              onProducts
            }
          >
            View all →
          </button>

        </div>

        {products.length ===
        0 ? (
          <EmptyProducts
            onAdd={onAdd}
          />
        ) : (
          <div className="product-grid">

            {products
              .slice(0, 4)
              .map(
                (product) => (
                  <ProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                    onView={
                      onView
                    }
                    onQR={
                      onQR
                    }
                  />
                )
              )}

          </div>
        )}

      </section>

    </div>
  );
}


/*
================================================================
STAT CARD
================================================================
*/

function StatCard({
  icon,
  label,
  value,
  suffix,
  description,
}) {
  return (
    <div className="stat-card">

      <div className="stat-top">

        <div className="stat-icon">
          {icon}
        </div>

        <span className="status-dot"></span>

      </div>

      <span className="stat-label">
        {label}
      </span>

      <div className="stat-value">

        {value}

        <small>
          {suffix}
        </small>

      </div>

      <p>
        {description}
      </p>

    </div>
  );
}


/*
================================================================
PRODUCTS PAGE
================================================================
*/

function ProductsPage({
  products,
  search,
  setSearch,
  onAdd,
  onView,
  onEdit,
  onDelete,
  onQR,
}) {
  return (
    <div className="page-body">

      <div className="library-header">

        <div>

          <span className="eyebrow">
            YOUR DEVICE COLLECTION
          </span>

          <h3>
            All devices
          </h3>

          <p>
            Manage every digital
            device passport from
            one place.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={onAdd}
        >
          ＋ Add Device
        </button>

      </div>

      <div className="search-bar">

        <span>⌕</span>

        <input
          value={search}
          onChange={(
            event
          ) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search by device, brand, model, serial number or ID..."
        />

      </div>

      {products.length ===
      0 ? (
        <EmptyProducts
          onAdd={onAdd}
        />
      ) : (
        <div className="product-grid large">

          {products.map(
            (product) => (
              <ProductCard
                key={
                  product.id
                }
                product={
                  product
                }
                onView={
                  onView
                }
                onQR={
                  onQR
                }
                onEdit={
                  onEdit
                }
                onDelete={
                  onDelete
                }
              />
            )
          )}

        </div>
      )}

    </div>
  );
}


/*
================================================================
PRODUCT CARD
================================================================
*/

function ProductCard({
  product,
  onView,
  onQR,
  onEdit,
  onDelete,
}) {
  const status =
    product.status ||
    "Active";

  return (
    <article className="product-card">

      <div className="product-image">

        {product.image ? (
          <img
            src={
              product.image
            }
            alt={
              product.name
            }
          />
        ) : (
          <div className="product-placeholder">

            <span>▣</span>

            <small>
              DPP
            </small>

          </div>
        )}

        <span className="product-status">

          <i></i>

          {status}

        </span>

        <span className="product-category">
          {
            product.category ||
            "Device"
          }
        </span>

      </div>

      <div className="product-info">

        <div className="product-id">
          {
            product.productId ||
            product.id
          }
        </div>

        <h4>
          {product.name}
        </h4>

        <p className="product-brand">
          {
            product.brand ||
            product.manufacturer ||
            "Not specified"
          }
        </p>

        <div className="product-mini-grid">

          <div>

            <span>
              Model
            </span>

            <strong>
              {
                product.modelNumber ||
                "—"
              }
            </strong>

          </div>

          <div>

            <span>
              Condition
            </span>

            <strong>
              {
                product.deviceCondition ||
                "—"
              }
            </strong>

          </div>

        </div>

        <div className="product-actions">

          <button
            className="view-button"
            onClick={() =>
              onView(
                product
              )
            }
          >
            View Passport
          </button>

          <button
            className="qr-small-button"
            onClick={() =>
              onQR(
                product
              )
            }
            title="Show QR code"
          >
            QR
          </button>

          {onEdit && (
            <button
              className="icon-button"
              onClick={() =>
                onEdit(
                  product
                )
              }
              title="Edit device"
            >
              ✎
            </button>
          )}

          {onDelete && (
            <button
              className="icon-button delete-icon"
              onClick={() =>
                onDelete(
                  product
                )
              }
              title="Delete device"
            >
              ×
            </button>
          )}

        </div>

      </div>

    </article>
  );
}


/*
================================================================
ADD PRODUCT PAGE
================================================================
*/

function AddProductPage({
  form,
  editingId,
  onInput,
  onSave,
  onCancel,
}) {
  return (
    <div className="page-body">

      <div className="form-header">

        <div>

          <span className="eyebrow">
            DIGITAL DEVICE PASSPORT BUILDER
          </span>

          <h3>
            {editingId
              ? "Update device"
              : "Add a new device"}
          </h3>

          <p>
            Enter the information that
            will become part of this
            device's digital identity.
          </p>

        </div>

        <div className="form-id-preview">

          <span>
            Passport ID
          </span>

          <strong>
            {
              form.productId ||
              "DPP-0000"
            }
          </strong>

        </div>

      </div>

      <form
        className="product-form"
        onSubmit={onSave}
      >

        <FormSection
          number="01"
          title="Device identity"
          description="Basic information used to identify the digital device."
        >

          <div className="form-grid">

            <Field
              label="Device name"
              name="name"
              value={
                form.name
              }
              onChange={
                onInput
              }
              placeholder="e.g. EcoBook Pro 14"
              required
            />

            <Field
              label="Brand / manufacturer"
              name="brand"
              value={
                form.brand
              }
              onChange={
                onInput
              }
              placeholder="e.g. GreenTech"
              required
            />

            <Field
              label="Device category"
              name="category"
              value={
                form.category
              }
              onChange={
                onInput
              }
              placeholder="e.g. Laptop"
            />

            <Field
              label="Product ID"
              name="productId"
              value={
                form.productId
              }
              onChange={
                onInput
              }
              placeholder="DPP-0001"
            />

            <div className="field full">

              <label>
                Device description
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  onInput
                }
                placeholder="Describe the device, purpose and key characteristics..."
                rows="4"
              />

            </div>

          </div>

        </FormSection>

        <FormSection
          number="02"
          title="Device Specifications"
          description="Add the technical information that identifies and describes the digital device."
        >

          <div className="form-grid">

            <Field
              label="Model number"
              name="modelNumber"
              value={
                form.modelNumber
              }
              onChange={
                onInput
              }
              placeholder="e.g. EcoBook-14"
            />

            <Field
              label="Serial number"
              name="serialNumber"
              value={
                form.serialNumber
              }
              onChange={
                onInput
              }
              placeholder="e.g. GT-ECO-2026-0001"
            />

            <Field
              label="Operating system"
              name="operatingSystem"
              value={
                form.operatingSystem
              }
              onChange={
                onInput
              }
              placeholder="e.g. Windows 11"
            />

            <Field
              label="Processor"
              name="processor"
              value={
                form.processor
              }
              onChange={
                onInput
              }
              placeholder="e.g. Intel Core i5"
            />

            <Field
              label="RAM"
              name="ram"
              value={
                form.ram
              }
              onChange={
                onInput
              }
              placeholder="e.g. 16 GB"
            />

            <Field
              label="Storage"
              name="storage"
              value={
                form.storage
              }
              onChange={
                onInput
              }
              placeholder="e.g. 512 GB SSD"
            />

            <Field
              label="Battery capacity"
              name="batteryCapacity"
              value={
                form.batteryCapacity
              }
              onChange={
                onInput
              }
              placeholder="e.g. 54 Wh"
            />

          </div>

        </FormSection>

        <FormSection
          number="03"
          title="Manufacturing & traceability"
          description="Add information that allows the device to be traced through its lifecycle."
        >

          <div className="form-grid">

            <Field
              label="Manufacturing location"
              name="manufacturingLocation"
              value={
                form.manufacturingLocation
              }
              onChange={
                onInput
              }
              placeholder="e.g. Bengaluru, India"
            />

            <Field
              label="Manufacturing date"
              name="manufacturingDate"
              type="date"
              value={
                form.manufacturingDate
              }
              onChange={
                onInput
              }
            />

            <Field
              label="Carbon footprint"
              name="carbonFootprint"
              value={
                form.carbonFootprint
              }
              onChange={
                onInput
              }
              placeholder="e.g. 185 kg CO₂e"
            />

            <Field
              label="Energy source"
              name="energySource"
              value={
                form.energySource
              }
              onChange={
                onInput
              }
              placeholder="e.g. Renewable + Grid"
            />

          </div>

        </FormSection>

        <FormSection
          number="04"
          title="Repair & reuse"
          description="Information that helps extend the useful life of the device."
        >

          <div className="form-grid">

            <Field
              label="Device condition"
              name="deviceCondition"
              value={
                form.deviceCondition
              }
              onChange={
                onInput
              }
              placeholder="e.g. Good"
            />

            <Field
              label="Expected lifespan"
              name="expectedLifespan"
              value={
                form.expectedLifespan
              }
              onChange={
                onInput
              }
              placeholder="e.g. 5–7 years"
            />

            <Field
              label="Repairability"
              name="repairability"
              value={
                form.repairability
              }
              onChange={
                onInput
              }
              placeholder="e.g. High"
            />

            <Field
              label="Reuse pathway"
              name="reusePathway"
              value={
                form.reusePathway
              }
              onChange={
                onInput
              }
              placeholder="e.g. Refurbishment → Secondary user"
            />

            <div className="field full">

              <label>
                Repair information
              </label>

              <textarea
                name="repairInfo"
                value={
                  form.repairInfo
                }
                onChange={
                  onInput
                }
                placeholder="Explain which components can be repaired or replaced..."
                rows="3"
              />

            </div>

          </div>

        </FormSection>

        <FormSection
          number="05"
          title="Recycling & end of life"
          description="Help users understand responsible recovery, recycling and disposal."
        >

          <div className="form-grid">

            <div className="field full">

              <label>
                Recyclable components
              </label>

              <textarea
                name="recyclableComponents"
                value={
                  form.recyclableComponents
                }
                onChange={
                  onInput
                }
                placeholder="e.g. Aluminium, copper, steel, plastics and electronic components"
                rows="3"
              />

            </div>

            <div className="field full">

              <label>
                Recycling instructions
              </label>

              <textarea
                name="recyclingInfo"
                value={
                  form.recyclingInfo
                }
                onChange={
                  onInput
                }
                placeholder="Tell users how and where the device should be recycled..."
                rows="3"
              />

            </div>

            <div className="field full">

              <label>
                Data disposal
              </label>

              <textarea
                name="dataDisposal"
                value={
                  form.dataDisposal
                }
                onChange={
                  onInput
                }
                placeholder="e.g. Securely erase personal data before reuse or recycling."
                rows="3"
              />

            </div>

            <div className="field full">

              <label>
                End-of-life pathway
              </label>

              <textarea
                name="endOfLife"
                value={
                  form.endOfLife
                }
                onChange={
                  onInput
                }
                placeholder="e.g. Reuse → Refurbish → Recover materials → Recycle"
                rows="3"
              />

            </div>

          </div>

        </FormSection>

        <FormSection
          number="06"
          title="Device image"
          description="Optional visual identity for the device passport."
        >

          <div className="form-grid">

            <div className="field full">

              <label>
                Image URL
              </label>

              <input
                type="url"
                name="image"
                value={
                  form.image
                }
                onChange={
                  onInput
                }
                placeholder="https://example.com/device-image.jpg"
              />

              <small className="field-help">
                You can leave this blank.
                The passport will use the
                EcoPass visual automatically.
              </small>

            </div>

          </div>

        </FormSection>

        <div className="form-footer">

          <div>

            <span className="save-note">
              ✓
            </span>

            <div>

              <strong>
                Ready to create a
                digital device identity?
              </strong>

              <p>
                Your device will be
                saved and receive a
                unique QR passport.
              </p>

            </div>

          </div>

          <div className="form-footer-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={
                onCancel
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button large-button"
            >
              {editingId
                ? "Save Changes"
                : "Save Device"}

              <span>→</span>
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}


/*
================================================================
FORM SECTION
================================================================
*/

function FormSection({
  number,
  title,
  description,
  children,
}) {
  return (
    <section className="form-section">

      <div className="form-section-title">

        <div className="section-number">
          {number}
        </div>

        <div>

          <h4>
            {title}
          </h4>

          <p>
            {description}
          </p>

        </div>

      </div>

      {children}

    </section>
  );
}


/*
================================================================
FIELD
================================================================
*/

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div className="field">

      <label>

        {label}

        {required && (
          <span>*</span>
        )}

      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={
          onChange
        }
        placeholder={
          placeholder
        }
        required={
          required
        }
      />

    </div>
  );
}


/*
================================================================
EMPTY PRODUCTS
================================================================
*/

function EmptyProducts({
  onAdd,
}) {
  return (
    <div className="empty-state">

      <div className="empty-icon">
        ＋
      </div>

      <h3>
        No devices yet
      </h3>

      <p>
        Create your first Digital
        Product Passport and give
        the device a unique QR
        identity.
      </p>

      <button
        className="primary-button"
        onClick={onAdd}
      >
        Create First Device
      </button>

    </div>
  );
}


/*
================================================================
QR MODAL
================================================================
*/

function QRModal({
  product,
  url,
  onClose,
  onDownload,
  onCopy,
  onOpen,
}) {
  return (
    <div className="modal-backdrop">

      <div className="qr-modal">

        <button
          className="modal-close"
          onClick={
            onClose
          }
        >
          ×
        </button>

        <div className="qr-heading">

          <span className="eyebrow">
            DIGITAL DEVICE IDENTITY
          </span>

          <h3>
            Device QR Code
          </h3>

          <p>
            Scan this code with a
            phone camera to open the
            exact digital device
            passport.
          </p>

        </div>

        <div className="qr-box">

          <QRCodeCanvas
            id={`qr-${product.id}`}
            value={url}
            size={240}
            level="M"
            includeMargin
          />

        </div>

        <div className="qr-product">

          <div className="qr-product-mark">
            D
          </div>

          <div>

            <strong>
              {product.name}
            </strong>

            <span>
              {
                product.productId ||
                product.id
              }
            </span>

          </div>

        </div>

        <div className="qr-actions">

          <button
            className="secondary-button"
            onClick={
              onCopy
            }
          >
            Copy Link
          </button>

          <button
            className="secondary-button"
            onClick={
              onDownload
            }
          >
            Download QR
          </button>

          <button
            className="primary-button"
            onClick={
              onOpen
            }
          >
            Open Passport →
          </button>

        </div>

        <div className="scan-note">

          <span>
            📱
          </span>

          <div>

            <strong>
              Phone scanning
            </strong>

            <p>
              Make sure your phone
              and computer are on the
              same Wi-Fi network.
            </p>

            <small>
              QR address:
              <br />
              {url}
            </small>

          </div>

        </div>

      </div>

    </div>
  );
}


/*
================================================================
PASSPORT PAGE
================================================================
*/

function PassportPage({
  product,
  onBack,
  onHome,
}) {
  const lifecycle = [
    {
      number: "01",
      title: "Device",
      value:
        product.modelNumber ||
        "Device specifications provided",
      icon: "▣",
    },
    {
      number: "02",
      title: "Traceability",
      value:
        product.manufacturingLocation ||
        "Manufacturing information not provided",
      icon: "⌂",
    },
    {
      number: "03",
      title: "Repair & reuse",
      value:
        product.reusePathway ||
        product.repairInfo ||
        "Repair and reuse information not provided",
      icon: "↻",
    },
    {
      number: "04",
      title: "Recycle",
      value:
        product.endOfLife ||
        "Recycling pathway not provided",
      icon: "♻",
    },
  ];

  return (
    <div className="passport-page">

      <header className="passport-topbar">

        <button
          className="passport-brand"
          onClick={
            onHome
          }
        >

          <span className="brand-mark">
            D
          </span>

          <span>

            <strong>
              EcoPass
            </strong>

            <small>
              Digital Product Passport
            </small>

          </span>

        </button>

        <div className="passport-top-actions">

          <span className="verified-pill">

            <i></i>

            Verified Passport

          </span>

          <button
            className="back-button"
            onClick={
              onBack
            }
          >
            ← Dashboard
          </button>

        </div>

      </header>

      <main className="passport-content">

        <div className="passport-breadcrumb">

          DIGITAL DEVICE PASSPORT{" "}
          <span>/</span>{" "}
          {
            product.productId ||
            product.id
          }

        </div>

        <section className="passport-hero">

          <div className="passport-product-visual">

            {product.image ? (
              <img
                src={
                  product.image
                }
                alt={
                  product.name
                }
              />
            ) : (
              <div className="passport-placeholder">

                <div className="large-leaf">
                  ▣
                </div>

                <span>
                  DIGITAL
                </span>

                <strong>
                  DEVICE
                </strong>

              </div>
            )}

            <div className="visual-badge">

              <span>
                ✓
              </span>

              Digital identity verified

            </div>

          </div>

          <div className="passport-intro">

            <span className="passport-category">

              {
                product.category ||
                "DIGITAL DEVICE"
              }

            </span>

            <h1>
              {product.name}
            </h1>

            <p className="passport-brand-name">

              Manufactured by{" "}

              <strong>
                {
                  product.brand ||
                  product.manufacturer ||
                  "Not specified"
                }
              </strong>

            </p>

            <p className="passport-description">

              {
                product.description ||
                "This Digital Product Passport provides transparent information about the device, its specifications, traceability, repair, reuse and responsible end of life."
              }

            </p>

            <div className="passport-id-row">

              <div>

                <span>
                  Passport ID
                </span>

                <strong>
                  {
                    product.productId ||
                    product.id
                  }
                </strong>

              </div>

              <div>

                <span>
                  Model
                </span>

                <strong>
                  {
                    product.modelNumber ||
                    "—"
                  }
                </strong>

              </div>

              <div>

                <span>
                  Manufactured
                </span>

                <strong>
                  {
                    formatDate(
                      product.manufacturingDate
                    )
                  }
                </strong>

              </div>

            </div>

          </div>

        </section>

        <section className="passport-metrics">

          <Metric
            label="Condition"
            value={
              product.deviceCondition ||
              "—"
            }
            icon="◆"
          />

          <Metric
            label="Repairability"
            value={
              product.repairability ||
              "—"
            }
            icon="↻"
          />

          <Metric
            label="Expected lifespan"
            value={
              product.expectedLifespan ||
              "—"
            }
            icon="◷"
          />

          <Metric
            label="Battery"
            value={
              product.batteryCapacity ||
              "—"
            }
            icon="⚡"
          />

        </section>

        <section className="passport-section">

          <div className="passport-section-heading">

            <div>

              <span className="eyebrow">
                DEVICE JOURNEY
              </span>

              <h2>
                Lifecycle at a glance
              </h2>

            </div>

            <span className="journey-status">

              <i></i>

              Traceable

            </span>

          </div>

          <div className="lifecycle-line">

            {lifecycle.map(
              (item) => (
                <div
                  className="lifecycle-step"
                  key={
                    item.number
                  }
                >

                  <div className="timeline-node">
                    {
                      item.icon
                    }
                  </div>

                  <span className="timeline-number">
                    {
                      item.number
                    }
                  </span>

                  <h4>
                    {
                      item.title
                    }
                  </h4>

                  <p>
                    {
                      item.value
                    }
                  </p>

                </div>
              )
            )}

          </div>

        </section>

        <section className="passport-info-grid">

          <InfoCard
            title="Device specifications"
            icon="▣"
            value={
              product.modelNumber ||
              "Specifications not provided"
            }
            text={`Processor: ${
              product.processor ||
              "—"
            } • RAM: ${
              product.ram ||
              "—"
            } • Storage: ${
              product.storage ||
              "—"
            }`}
          />

          <InfoCard
            title="Traceability"
            icon="⌂"
            value={
              product.manufacturingLocation ||
              "Location not provided"
            }
            text={`Manufactured: ${
              formatDate(
                product.manufacturingDate
              )
            }`}
          />

          <InfoCard
            title="Repair & reuse"
            icon="↻"
            value={
              product.repairInfo ||
              "Repair information not provided"
            }
            text={
              product.reusePathway
                ? `Reuse pathway: ${product.reusePathway}`
                : "Keeping devices in use for longer supports circularity."
            }
          />

          <InfoCard
            title="Recycling & recovery"
            icon="♻"
            value={
              product.recyclingInfo ||
              "Recycling instructions not provided"
            }
            text={
              product.endOfLife ||
              "Choose reuse, recovery or responsible recycling whenever possible."
            }
          />

          <InfoCard
            title="Recyclable components"
            icon="◇"
            value={
              product.recyclableComponents ||
              "Component information not provided"
            }
            text="Separate recoverable materials and use an authorized e-waste recycling pathway."
          />

          <InfoCard
            title="Data disposal"
            icon="⌁"
            value={
              product.dataDisposal ||
              "Data disposal information not provided"
            }
            text="Protect user information by securely removing personal data before reuse or recycling."
          />

        </section>

        <section className="passport-footer-card">

          <div className="footer-qr-icon">
            D
          </div>

          <div>

            <span className="eyebrow">
              DIGITAL PRODUCT PASSPORT
            </span>

            <h3>
              One device. One identity.
              One transparent lifecycle.
            </h3>

            <p>
              This passport connects
              device information with
              a unique digital identity
              that can be accessed
              through its QR code.
            </p>

          </div>

        </section>

      </main>

      <footer className="passport-footer">

        <span>
          EcoPass Digital Product Passport
        </span>

        <span>
          Built for traceability,
          reuse & circularity
        </span>

      </footer>

    </div>
  );
}


/*
================================================================
METRIC
================================================================
*/

function Metric({
  label,
  value,
  icon,
}) {
  return (
    <div className="passport-metric">

      <div className="metric-icon">
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


/*
================================================================
INFO CARD
================================================================
*/

function InfoCard({
  title,
  icon,
  value,
  text,
}) {
  return (
    <article className="info-card">

      <div className="info-card-icon">
        {icon}
      </div>

      <span className="eyebrow">
        {title}
      </span>

      <h3>
        {value}
      </h3>

      <p>
        {text}
      </p>

    </article>
  );
}

export default App;