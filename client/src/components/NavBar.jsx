import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getSession, logout } from "../services/authService";
import { supabase } from "../lib/supabaseClient";

// ─── Inline styles (scoped to Navbar) ────────────────────────────────────────
const S = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    width: "100%",
    background: "rgba(10, 10, 14, 0.82)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    height: "62px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoMark: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#f5f5f0",
    letterSpacing: "-0.3px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  link: (active) => ({
    textDecoration: "none",
    color: active ? "#f5f5f0" : "#9a9a96",
    fontSize: "14px",
    fontWeight: active ? "600" : "400",
    padding: "6px 12px",
    borderRadius: "8px",
    background: active ? "rgba(255,255,255,0.08)" : "transparent",
    transition: "all 0.15s ease",
    cursor: "pointer",
    border: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap",
  }),
  btnPrimary: {
    textDecoration: "none",
    color: "#0a0a0e",
    fontSize: "14px",
    fontWeight: "600",
    padding: "7px 16px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.15s ease",
    display: "inline-block",
  },
  divider: {
    width: "1px",
    height: "20px",
    background: "rgba(255,255,255,0.1)",
    margin: "0 4px",
  },
  dropdownItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: active ? "#f5f5f0" : "#9a9a96",
    fontSize: "13.5px",
    fontWeight: active ? "600" : "400",
    padding: "9px 12px",
    borderRadius: "8px",
    background: active ? "rgba(255,255,255,0.07)" : "transparent",
    transition: "all 0.12s ease",
    cursor: "pointer",
    border: "none",
    width: "100%",
    textAlign: "left",
    whiteSpace: "nowrap",
  }),
  dropdownDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.07)",
    margin: "4px 0",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#ff6b6b",
    fontSize: "13.5px",
    fontWeight: "500",
    padding: "9px 12px",
    borderRadius: "8px",
    background: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    transition: "background 0.12s ease",
  },
  // Mobile hamburger
  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: "5px",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: "4px",
  },
  bar: {
    width: "22px",
    height: "2px",
    background: "#f5f5f0",
    borderRadius: "2px",
    transition: "all 0.2s ease",
  },
  mobileMenu: (open) => ({
    display: open ? "flex" : "none",
    flexDirection: "column",
    gap: "4px",
    padding: "12px 16px 16px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(10, 10, 14, 0.97)",
  }),
};

// ─── Icon helpers ─────────────────────────────────────────────────────────────
const Icon = {
  user: "👤",
  history: "📋",
  logout: "→",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ── Bootstrap session & subscribe to auth changes ─────────────────────────
  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setLoadingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ── Close mobile menu on route change ────────────────────────────────────
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Keyframe injected once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .nav-link:hover { color: #f5f5f0 !important; background: rgba(255,255,255,0.06) !important; }
        .nav-btn-primary:hover { opacity: 0.88; }
        .dropdown-item:hover { color: #f5f5f0 !important; background: rgba(255,255,255,0.07) !important; }
        .logout-btn:hover { background: rgba(255,107,107,0.1) !important; }

        @media (max-width: 640px) {
          .nav-desktop-links { display: none !important; }
          .nav-hamburger      { display: flex !important; }
        }
      `}</style>

      <nav style={S.nav}>
        <div style={S.inner}>
          {/* Logo */}
          <Link to="/" style={S.logo}>
            <span style={S.logoMark}>☁️</span>
            <span style={S.logoText}>Nuvem Lanches</span>
          </Link>

          {/* Desktop links */}
          {!loadingSession && (
            <div className="nav-desktop-links" style={S.links}>
              {session ? (
                <>
                  {/* Perfil */}
                  <Link
                    to="/perfil"
                    className="nav-link"
                    style={S.link(isActive("/perfil"))}
                  >
                    {Icon.user} Perfil
                  </Link>

                  {/* Histórico de Pedidos */}
                  <Link
                    to="/historico"
                    className="nav-link"
                    style={S.link(isActive("/historico"))}
                  >
                    {Icon.history} Meus Pedidos
                  </Link>

                  <div style={S.divider} />

                  {/* Sair */}
                  <button
                    className="nav-link"
                    style={{ ...S.link(false), color: "#ff8a80" }}
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? "Saindo..." : `${Icon.logout} Sair`}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="nav-link"
                    style={S.link(isActive("/login"))}
                  >
                    Login
                  </Link>
                  <Link
                    to="/cadastro"
                    className="nav-btn-primary"
                    style={S.btnPrimary}
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Hamburger (mobile) */}
          <button
            className="nav-hamburger"
            style={S.hamburger}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Abrir menu"
          >
            <span style={{
              ...S.bar,
              transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }} />
            <span style={{
              ...S.bar,
              opacity: mobileOpen ? 0 : 1,
              transform: mobileOpen ? "translateX(-8px)" : "none",
            }} />
            <span style={{
              ...S.bar,
              transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }} />
          </button>
        </div>

        {/* Mobile menu */}
        {!loadingSession && (
          <div style={S.mobileMenu(mobileOpen)}>
            {session ? (
              <>
                <Link to="/perfil" className="dropdown-item" style={S.dropdownItem(isActive("/perfil"))}>
                  {Icon.user} Perfil
                </Link>
                <Link to="/historico" className="dropdown-item" style={S.dropdownItem(isActive("/historico"))}>
                  {Icon.history} Meus Pedidos
                </Link>
                <div style={S.dropdownDivider} />
                <button
                  className="logout-btn"
                  style={S.logoutBtn}
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Saindo..." : "→ Sair"}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="dropdown-item" style={S.dropdownItem(isActive("/login"))}>
                  Login
                </Link>
                <Link
                  to="/cadastro"
                  style={{ ...S.btnPrimary, marginTop: "6px", textAlign: "center" }}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}