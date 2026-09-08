import { useState } from "react";

const API = "http://localhost:5000/api";

function RegisterProduct({ onCancel, onProductCreated }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    year: "",
    manufacturer: "",
    material: "",
    repairability: "High",
    recyclability: ""
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.id ||
      !form.name ||
      !form.category ||
      !form.year ||
      !form.manufacturer
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create product."
        );
      }

      if (onProductCreated) {
        onProductCreated(data.product);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        <button
          className="back-link"
          onClick={onCancel}
        >
          ← Back to Dashboard
        </button>

        <div className="register-heading">
          <div>
            <div className="register-eyebrow">
              DIGITAL PRODUCT PASSPORT
            </div>

            <h1>
              Register New Product
            </h1>

            <p>
              Create a digital passport and begin
              tracking the product lifecycle.
            </p>
          </div>

          <div className="register-icon">
            +
          </div>
        </div>

        {error && (
          <div className="form-error">
            ⚠ {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="register-form"
        >

          <div className="form-section">

            <div className="section-title">
              <span>01</span>
              Product Identity
            </div>

            <div className="form-grid">

              <div className="field">
                <label>
                  Product ID *
                </label>

                <input
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  placeholder="Example: DPP-005"
                />

                <small>
                  Unique passport identifier
                </small>
              </div>

              <div className="field">
                <label>
                  Product Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Lenovo ThinkPad"
                />
              </div>

              <div className="field">
                <label>
                  Category *
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">
                    Select category
                  </option>

                  <option>
                    Laptop
                  </option>

                  <option>
                    Smartphone
                  </option>

                  <option>
                    Tablet
                  </option>

                  <option>
                    Monitor
                  </option>

                  <option>
                    Other Electronics
                  </option>
                </select>
              </div>

              <div className="field">
                <label>
                  Manufacturing Year *
                </label>

                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="2026"
                  type="number"
                />
              </div>

            </div>

          </div>

          <div className="form-section">

            <div className="section-title">
              <span>02</span>
              Manufacturer & Materials
            </div>

            <div className="form-grid">

              <div className="field">
                <label>
                  Manufacturer *
                </label>

                <input
                  name="manufacturer"
                  value={form.manufacturer}
                  onChange={handleChange}
                  placeholder="Company name"
                />
              </div>

              <div className="field">
                <label>
                  Main Materials
                </label>

                <input
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  placeholder="Aluminium, Plastic, Electronics"
                />
              </div>

            </div>

          </div>

          <div className="form-section">

            <div className="section-title">
              <span>03</span>
              Circularity Information
            </div>

            <div className="form-grid">

              <div className="field">
                <label>
                  Repairability
                </label>

                <select
                  name="repairability"
                  value={form.repairability}
                  onChange={handleChange}
                >
                  <option>
                    High
                  </option>

                  <option>
                    Medium
                  </option>

                  <option>
                    Low
                  </option>
                </select>
              </div>

              <div className="field">
                <label>
                  Recyclability
                </label>

                <input
                  name="recyclability"
                  value={form.recyclability}
                  onChange={handleChange}
                  placeholder="Example: 85%"
                />
              </div>

            </div>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-button"
              disabled={saving}
            >
              {saving
                ? "Creating..."
                : "Create Digital Passport →"}
            </button>

          </div>

        </form>

      </div>

      <style>{`

        .register-page {
          min-height: 100vh;
          background:
            linear-gradient(
              135deg,
              #f4f8fb,
              #eef8f5
            );
          padding: 35px;
        }

        .register-container {
          max-width: 950px;
          margin: 0 auto;
        }

        .back-link {
          border: none;
          background: transparent;
          color: #1976d2;
          font-size: 12px;
          font-weight: 800;
          padding: 0;
          margin-bottom: 25px;
        }

        .register-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border: 1px solid #e2ebf2;
          border-radius: 20px;
          padding: 28px 32px;
          margin-bottom: 18px;
          box-shadow:
            0 10px 30px
            rgba(35,70,100,.05);
        }

        .register-eyebrow {
          color: #00a884;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.4px;
          margin-bottom: 8px;
        }

        .register-heading h1 {
          margin: 0;
          color: #102a43;
          font-size: 27px;
        }

        .register-heading p {
          margin: 7px 0 0;
          color: #829ab1;
          font-size: 12px;
        }

        .register-icon {
          width: 60px;
          height: 60px;
          border-radius: 17px;
          background:
            linear-gradient(
              135deg,
              #1976d2,
              #00a884
            );
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 300;
          box-shadow:
            0 10px 22px
            rgba(25,118,210,.2);
        }

        .form-error {
          padding: 13px 16px;
          border-radius: 11px;
          background: #fff0f0;
          border: 1px solid #ffd4d4;
          color: #c92a2a;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .register-form {
          display: grid;
          gap: 18px;
        }

        .form-section {
          background: white;
          border: 1px solid #e2ebf2;
          border-radius: 18px;
          padding: 25px;
          box-shadow:
            0 8px 25px
            rgba(35,70,100,.04);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 900;
          color: #17324d;
          margin-bottom: 22px;
        }

        .section-title span {
          width: 29px;
          height: 29px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eaf4ff;
          color: #1976d2;
          font-size: 9px;
          font-weight: 900;
        }

        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
        }

        .field label {
          color: #486581;
          font-size: 10px;
          font-weight: 900;
          margin-bottom: 7px;
        }

        .field input,
        .field select {
          width: 100%;
          height: 44px;
          border: 1px solid #d7e2e9;
          border-radius: 9px;
          padding: 0 12px;
          outline: none;
          color: #243b53;
          background: #fbfdfe;
          font-size: 12px;
        }

        .field input:focus,
        .field select:focus {
          border-color: #1976d2;
          box-shadow:
            0 0 0 3px
            rgba(25,118,210,.08);
        }

        .field small {
          color: #9fb3c8;
          font-size: 9px;
          margin-top: 5px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 5px 0 20px;
        }

        .cancel-button,
        .create-button {
          border: none;
          border-radius: 10px;
          padding: 13px 20px;
          font-size: 11px;
          font-weight: 900;
        }

        .cancel-button {
          background: white;
          border: 1px solid #d9e4eb;
          color: #627d98;
        }

        .create-button {
          color: white;
          background:
            linear-gradient(
              135deg,
              #1976d2,
              #00a884
            );
          box-shadow:
            0 9px 20px
            rgba(25,118,210,.18);
        }

        .create-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        @media (max-width: 650px) {

          .register-page {
            padding: 18px;
          }

          .register-heading {
            padding: 22px;
          }

          .register-icon {
            display: none;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .cancel-button,
          .create-button {
            width: 100%;
          }

        }

      `}</style>
    </div>
  );
}

export default RegisterProduct;