import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Temporary frontend registration
    // Backend registration will be connected later.
    navigate("/login");
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <section className="login-visual">

        <div className="visual-overlay"></div>

        <div className="visual-content">

          <div className="brand-logo">
            <div className="logo-circle">♻</div>

            <div>
              <div className="brand-name">
                DIGITAL PRODUCT
              </div>

              <div className="brand-subtitle">
                PASSPORT
              </div>
            </div>
          </div>

          <div className="hero-text">

            <div className="small-label">
              JOIN THE CIRCULAR JOURNEY
            </div>

            <h1>
              Make products
              <br />
              <span>more responsible.</span>
            </h1>

            <p>
              Create your account and start tracking product
              ownership, repairs, refurbishment, reuse and
              end-of-life information.
            </p>

          </div>

          <div className="feature-grid">

            <div className="feature-item">
              <div className="feature-icon">📦</div>
              <div>
                <strong>Product Identity</strong>
                <small>Keep product information organized</small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📷</div>
              <div>
                <strong>QR Access</strong>
                <small>Connect products digitally</small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🔧</div>
              <div>
                <strong>Repair History</strong>
                <small>Record important service events</small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">♻</div>
              <div>
                <strong>End of Life</strong>
                <small>Support responsible recovery</small>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* RIGHT SIDE */}
      <section className="login-panel">

        <div className="login-card">

          <div className="mobile-brand">
            <div className="logo-circle">♻</div>
            <span>Digital Product Passport</span>
          </div>

          <div className="login-heading">

            <div className="welcome-label">
              GET STARTED
            </div>

            <h2>Create account</h2>

            <p>
              Create your DPP workspace in a few simple steps.
            </p>

          </div>


          <form onSubmit={handleRegister}>

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="register-email">
                Email Address
              </label>

              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                required
              />

            </div>


            <label className="remember-option register-terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the platform terms and privacy policy.
              </span>

            </label>


            <button
              type="submit"
              className="login-button"
            >
              <span>Create Account</span>
              <span className="button-arrow">→</span>
            </button>

          </form>


          <div className="divider">
            <span>or</span>
          </div>


          <div className="signup-box">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>


          <div className="security-note">
            🔒 Your account information is securely managed.
          </div>

        </div>

      </section>

    </div>
  );
}

export default Register;