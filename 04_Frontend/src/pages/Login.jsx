import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary frontend login
    // Backend authentication will be connected later.
    navigate("/");
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
              CIRCULAR • TRANSPARENT • SMART
            </div>

            <h1>
              Give every product
              <br />
              <span>a digital story.</span>
            </h1>

            <p>
              Track the complete journey of an electronic product —
              from registration and ownership to repair,
              refurbishment, reuse and recycling.
            </p>

          </div>

          <div className="feature-grid">

            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <strong>Lifecycle Tracking</strong>
                <small>Every stage in one place</small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">⌁</div>
              <div>
                <strong>QR Connected</strong>
                <small>Scan and access instantly</small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">↻</div>
              <div>
                <strong>Repair & Refurbish</strong>
                <small>Extend product life</small>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">♻</div>
              <div>
                <strong>Circular Economy</strong>
                <small>Support responsible recycling</small>
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
              WELCOME BACK
            </div>

            <h2>Sign in</h2>

            <p>
              Access your product passport workspace.
            </p>

          </div>


          <form onSubmit={handleLogin}>

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
              />

            </div>


            <div className="form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <a href="#forgot">
                  Forgot password?
                </a>

              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />

            </div>


            <div className="form-options">

              <label className="remember-option">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            <button
              type="submit"
              className="login-button"
            >
              <span>Sign in</span>
              <span className="button-arrow">→</span>
            </button>

          </form>


          <div className="divider">
            <span>or</span>
          </div>


          <div className="signup-box">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>


          <div className="security-note">
            🔒 Your product data is securely managed.
          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;