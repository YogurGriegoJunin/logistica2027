import React from "react";
import { Shield, Truck, DollarSign, Activity, LogOut, Cloud, Sparkles, Store } from "lucide-react";

export default function Navbar({
  userRole,
  activeTab,
  setActiveTab,
  selectedCourier,
  onLogout,
  isSyncing,
  onManualSync,
  onOpenLanding
}) {
  return (
    <header style={styles.header}>
      {/* Brand Logo & Title */}
      <div style={styles.brandContainer}>
        <div style={styles.logoIcon}>
          <Activity size={22} color="#fff" />
        </div>
        <div>
          <h1 style={styles.title}>LogiExpress SaaS</h1>
          <span style={styles.subtitle}>
            {userRole === "admin" ? "Consola de Despacho & Control" : "Portal de Cadetes"}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenLanding}
          style={{
            marginLeft: "12px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))",
            border: "1px solid rgba(168,85,247,0.4)",
            color: "#c084fc",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
          title="Ver Landing Comercial de Ventas y Planes de Suscripción"
        >
          <Sparkles size={13} />
          Portal Ventas / Plan Pro ($49/mo)
        </button>
      </div>

      {/* Conditional Navigation Tabs */}
      {userRole === "admin" && (
        <nav style={styles.nav} className="animated-fade-in">
          <button
            className="btn"
            style={{
              ...styles.navBtn,
              ...(activeTab === "admin" ? styles.navBtnActive : {})
            }}
            onClick={() => setActiveTab("admin")}
          >
            <Shield size={18} />
            Administración & Despacho
          </button>

          <button
            className="btn"
            style={{
              ...styles.navBtn,
              ...(activeTab === "accounting" ? styles.navBtnActive : {})
            }}
            onClick={() => setActiveTab("accounting")}
          >
            <DollarSign size={18} />
            Contabilidad & Caja
          </button>
        </nav>
      )}

      {userRole === "courier" && selectedCourier && (
        <div style={styles.courierBanner} className="animated-fade-in">
          <span
            className="avatar"
            style={{
              width: "28px",
              height: "28px",
              fontSize: "0.75rem",
              backgroundColor: selectedCourier.color
            }}
          >
            {selectedCourier.avatar}
          </span>
          <span style={styles.courierBannerText}>
            Sesión Cadete: <strong>{selectedCourier.nombre}</strong>
          </span>
        </div>
      )}

      {/* Logout Control and Session Status */}
      <div style={styles.rightContainer}>
        <button
          type="button"
          className="btn"
          style={{
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "var(--success)",
            fontSize: "0.78rem",
            padding: "0.3rem 0.6rem",
            gap: "0.35rem",
            display: "flex",
            alignItems: "center"
          }}
          onClick={onManualSync}
          title="Nube Sincronizada en Tiempo Real"
        >
          <Cloud size={14} />
          {isSyncing ? "Sincronizando..." : "Nube Activa"}
        </button>

        <button className="btn btn-secondary" style={styles.logoutBtn} onClick={onLogout}>
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: "var(--nav-height)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1.5rem",
    background: "rgba(10, 14, 23, 0.85)",
    backdropFilter: "var(--glass-blur)",
    WebkitBackdropFilter: "var(--glass-blur)",
    borderBottom: "1px solid var(--border-color)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem"
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)"
  },
  title: {
    fontSize: "1.15rem",
    fontWeight: "800",
    color: "#fff",
    background: "linear-gradient(135deg, #fff, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subtitle: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    display: "block",
    marginTop: "-2px"
  },
  nav: {
    display: "flex",
    gap: "0.75rem"
  },
  navBtn: {
    background: "transparent",
    border: "1px solid transparent",
    color: "var(--text-muted)",
    padding: "0.5rem 1rem",
    fontSize: "0.88rem",
    borderRadius: "10px",
    transition: "var(--transition-smooth)",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  navBtnActive: {
    background: "rgba(255, 255, 255, 0.05)",
    borderColor: "var(--border-color)",
    color: "#fff",
    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1)"
  },
  courierBanner: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    background: "rgba(236, 72, 153, 0.08)",
    border: "1px solid rgba(236, 72, 153, 0.2)",
    padding: "0.35rem 0.8rem",
    borderRadius: "10px"
  },
  courierBannerText: {
    fontSize: "0.85rem",
    color: "var(--text-main)"
  },
  rightContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem"
  },
  logoutBtn: {
    padding: "0.45rem 0.9rem",
    fontSize: "0.82rem",
    borderRadius: "10px",
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "var(--danger)",
    transition: "var(--transition-smooth)",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  }
};
