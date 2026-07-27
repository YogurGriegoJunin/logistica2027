import React, { useState } from "react";
import { Shield, Truck, ChevronRight, Key, ArrowLeft, AlertCircle, Building, CheckCircle, Sparkles, MapPin, DollarSign, Cloud, Download } from "lucide-react";
import { hashPassword } from "../utils/security";

export default function LoginScreen({
  couriers,
  adminPasswordHash,
  onLogin,
  storeBase,
  onUpdateStoreBase,
  businesses = [],
  activeBusinessId,
  onSwitchBusiness,
  onRegisterBusiness
}) {
  // States: 'select-role' | 'admin-password' | 'select-courier' | 'courier-pin' | 'commercial-info' | 'new-business'
  const [view, setView] = useState("select-role");
  
  // Selected courier state for PIN entry
  const [selectedCourier, setSelectedCourier] = useState(null);
  
  // Passcode values
  const [adminPass, setAdminPass] = useState("");
  const [courierPin, setCourierPin] = useState("");
  
  // New Business registration states
  const [newBizName, setNewBizName] = useState("");
  const [newBizAddress, setNewBizAddress] = useState("");
  const [newBizPass, setNewBizPass] = useState("");
  const [bizSuccessMsg, setBizSuccessMsg] = useState("");
  
  // Error handling
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    const enteredHash = await hashPassword(adminPass);
    if (enteredHash === adminPasswordHash) {
      onLogin("admin");
    } else {
      setErrorMsg("Contraseña de administrador incorrecta.");
      setAdminPass("");
    }
  };

  const handleCourierClick = (courier) => {
    setSelectedCourier(courier);
    setCourierPin("");
    setErrorMsg("");
    setView("courier-pin");
  };

  const handleCourierSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedCourier) return;

    const enteredHash = await hashPassword(courierPin);
    if (enteredHash === selectedCourier.pinHash) {
      onLogin("courier", selectedCourier.id);
    } else {
      setErrorMsg("PIN incorrecto. Revisa e intenta de nuevo.");
      setCourierPin("");
    }
  };

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    if (!newBizName.trim() || !newBizPass) return;

    const bizId = `biz_${Date.now()}`;
    const bizCloudId = `biz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newHash = await hashPassword(newBizPass);

    const newBase = {
      nombre: newBizName.trim(),
      direccion: newBizAddress.trim() || "Base Central",
      lat: -34.5833,
      lng: -60.9500
    };

    const newBizObj = {
      id: bizId,
      name: newBizName.trim(),
      cloudSyncId: bizCloudId,
      adminHash: newHash,
      storeBase: newBase
    };

    if (onRegisterBusiness) {
      onRegisterBusiness(newBizObj);
    }

    setBizSuccessMsg(`¡Empresa "${newBizName.trim()}" registrada con éxito!`);
    setTimeout(() => {
      if (onSwitchBusiness) {
        onSwitchBusiness(bizId);
      }
    }, 1000);
  };

  const goBack = () => {
    setErrorMsg("");
    if (view === "admin-password" || view === "select-courier" || view === "commercial-info" || view === "new-business") {
      setView("select-role");
    } else if (view === "courier-pin") {
      setView("select-courier");
      setSelectedCourier(null);
    }
  };

  return (
    <div style={styles.container} className="app-container">
      <div style={styles.card} className="glass-card animated-fade-in">
        {/* Brand Header */}
        <div style={styles.brand}>
          <div style={styles.logoIcon}>
            <Truck size={28} color="#fff" />
          </div>
          <div>
            <h1 style={styles.brandTitle}>{storeBase?.nombre || "RapiConta Express"}</h1>
            <p style={styles.brandSubtitle}>Plataforma de Gestión de Repartos & Flota</p>
          </div>
        </div>

        {/* Business Selector (Switch between registered businesses) */}
        {businesses.length > 0 && view === "select-role" && (
          <div style={{ marginBottom: "1rem", textAlign: "left", background: "rgba(255,255,255,0.03)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
            <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "0.35rem" }}>
              🏢 Seleccionar Empresa / Cambiar de Negocio:
            </label>
            <select
              className="input-field"
              style={{ fontSize: "0.85rem", padding: "0.45rem", background: "rgba(139, 92, 246, 0.15)", borderColor: "rgba(139, 92, 246, 0.3)", color: "#fff", fontWeight: "600" }}
              value={activeBusinessId}
              onChange={(e) => onSwitchBusiness && onSwitchBusiness(e.target.value)}
            >
              {businesses.map((biz) => (
                <option key={biz.id} value={biz.id} style={{ background: "#111827", color: "#fff" }}>
                  {biz.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div style={styles.errorAlert} className="animated-fade-in">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {view === "select-role" && (
          <div style={styles.content} className="animated-fade-in">
            <h3 style={styles.title}>Selecciona tu Perfil de Acceso</h3>
            
            <div style={styles.rolesGrid}>
              {/* Admin Card */}
              <div
                style={styles.roleCard}
                onClick={() => { setView("admin-password"); setErrorMsg(""); }}
                className="role-card-hover"
              >
                <div style={{ ...styles.roleIconBox, background: "rgba(139, 92, 246, 0.15)" }}>
                  <Shield size={32} color="var(--primary)" />
                </div>
                <div style={styles.roleMeta}>
                  <h4 style={styles.roleTitle}>Portal Administrativo</h4>
                  <p style={styles.roleDesc}>Despacho de pedidos, catálogo de productos, GPS de flota y contabilidad.</p>
                </div>
                <ChevronRight size={20} color="var(--text-dark)" />
              </div>

              {/* Courier Card */}
              <div
                style={styles.roleCard}
                onClick={() => { setView("select-courier"); setErrorMsg(""); }}
                className="role-card-hover"
              >
                <div style={{ ...styles.roleIconBox, background: "rgba(59, 130, 246, 0.15)" }}>
                  <Truck size={32} color="var(--secondary)" />
                </div>
                <div style={styles.roleMeta}>
                  <h4 style={styles.roleTitle}>Dispositivo de Repartidor</h4>
                  <p style={styles.roleDesc}>Ingreso con PIN móvil para iniciar viajes, ver mapas y marcar entregas.</p>
                </div>
                <ChevronRight size={20} color="var(--text-dark)" />
              </div>
            </div>

            {/* B2B Commercial & Multi-Store Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.25rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: "100%", gap: "0.5rem", justifyContent: "center", fontSize: "0.85rem" }}
                onClick={() => setView("new-business")}
              >
                <Building size={16} color="var(--primary)" />
                🏢 Registrar Nuevo Negocio / Empresa
              </button>

              <button
                type="button"
                className="btn"
                style={{
                  width: "100%",
                  gap: "0.5rem",
                  justifyContent: "center",
                  fontSize: "0.82rem",
                  background: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  color: "#FBBF24",
                  fontWeight: "600"
                }}
                onClick={() => setView("commercial-info")}
              >
                <Sparkles size={16} />
                💼 Ver Presentación y Beneficios para Negocios
              </button>
            </div>
          </div>
        )}

        {view === "admin-password" && (
          <div style={styles.content} className="animated-fade-in">
            <div style={styles.challengeHeader}>
              <button style={styles.backArrowBtn} onClick={goBack}>
                <ArrowLeft size={18} />
              </button>
              <h3 style={{ ...styles.title, marginBottom: 0 }}>Acceso de Administrador</h3>
            </div>
            
            <form onSubmit={handleAdminSubmit} style={styles.passForm}>
              <div className="form-group" style={{ textAlign: "left" }}>
                <label>Contraseña de Administrador</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Introduce contraseña..."
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", gap: "0.5rem" }}>
                <Key size={16} />
                Ingresar a Consola
              </button>
            </form>
          </div>
        )}

        {view === "select-courier" && (
          <div style={styles.content} className="animated-fade-in">
            <div style={styles.challengeHeader}>
              <button style={styles.backArrowBtn} onClick={goBack}>
                <ArrowLeft size={18} />
              </button>
              <h3 style={{ ...styles.title, marginBottom: 0 }}>¿Quién está repartiendo hoy?</h3>
            </div>
            <p style={styles.subtitle}>Selecciona tu perfil de repartidor para continuar:</p>

            <div style={styles.couriersGrid}>
              {couriers.map((courier) => (
                <div
                  key={courier.id}
                  style={styles.courierProfileCard}
                  onClick={() => handleCourierClick(courier)}
                  className="role-card-hover"
                >
                  <div
                    className="avatar"
                    style={{
                      ...styles.profileAvatar,
                      backgroundColor: courier.color
                    }}
                  >
                    {courier.avatar}
                  </div>
                  <span style={styles.courierName}>{courier.nombre.split(" ")[0]}</span>
                  <span style={styles.courierStatusChip} className={`badge badge-${courier.estado}`}>
                    {courier.estado === "reparto" ? "En viaje" : "Libre"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "courier-pin" && selectedCourier && (
          <div style={styles.content} className="animated-fade-in">
            <div style={styles.challengeHeader}>
              <button style={styles.backArrowBtn} onClick={goBack}>
                <ArrowLeft size={18} />
              </button>
              <h3 style={{ ...styles.title, marginBottom: 0 }}>PIN de Repartidor</h3>
            </div>

            <div style={styles.focusedCourierAvatarBox}>
              <div
                className="avatar"
                style={{
                  width: "64px",
                  height: "64px",
                  fontSize: "1.5rem",
                  backgroundColor: selectedCourier.color,
                  marginBottom: "0.5rem"
                }}
              >
                {selectedCourier.avatar}
              </div>
              <h4 style={{ color: "#fff", fontWeight: "700" }}>{selectedCourier.nombre}</h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Introduce tu PIN de 4 dígitos para ingresar</p>
            </div>

            <form onSubmit={handleCourierSubmit} style={styles.passForm}>
              <div className="form-group" style={{ textAlign: "left" }}>
                <input
                  type="password"
                  className="input-field"
                  style={styles.pinInputField}
                  placeholder="• • • •"
                  maxLength="4"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={courierPin}
                  onChange={(e) => setCourierPin(e.target.value.replace(/[^0-9]/g, ""))}
                  autoFocus
                  required
                />
              </div>

              <button type="submit" className="btn btn-success" style={{ width: "100%", gap: "0.5rem" }}>
                <Key size={16} />
                Ingresar al Panel
              </button>
            </form>
          </div>
        )}

        {/* Registrar Nuevo Negocio / Empresa */}
        {view === "new-business" && (
          <div style={styles.content} className="animated-fade-in">
            <div style={styles.challengeHeader}>
              <button style={styles.backArrowBtn} onClick={goBack}>
                <ArrowLeft size={18} />
              </button>
              <h3 style={{ ...styles.title, marginBottom: 0 }}>Registrar Nuevo Negocio / Empresa</h3>
            </div>
            <p style={styles.subtitle}>Crea tu propio sistema de despacho de pedidos para tu flota de repartidores:</p>

            {bizSuccessMsg ? (
              <div style={{ ...styles.errorAlert, background: "var(--success-bg)", borderColor: "rgba(16, 185, 129, 0.3)", color: "var(--success)", margin: "1.5rem 0" }}>
                <CheckCircle size={18} />
                <span>{bizSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleCreateBusiness} style={styles.passForm}>
                <div className="form-group" style={{ textAlign: "left" }}>
                  <label>Nombre de tu Empresa / Negocio</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ej. Pizzería Don Benito / Delivery Express"
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                <div className="form-group" style={{ textAlign: "left" }}>
                  <label>Dirección de la Base Central</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ej. Av. San Martín 150, Ciudad"
                    value={newBizAddress}
                    onChange={(e) => setNewBizAddress(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ textAlign: "left" }}>
                  <label>Crear Contraseña de Administrador</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Crea tu clave secreta de admin..."
                    value={newBizPass}
                    onChange={(e) => setNewBizPass(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%", gap: "0.5rem" }}>
                  <Building size={16} />
                  Crear e Inicializar Mi Sistema de Repartos
                </button>
              </form>
            )}
          </div>
        )}

        {/* Presentación Comercial B2B */}
        {view === "commercial-info" && (
          <div style={styles.content} className="animated-fade-in">
            <div style={styles.challengeHeader}>
              <button style={styles.backArrowBtn} onClick={goBack}>
                <ArrowLeft size={18} />
              </button>
              <h3 style={{ ...styles.title, marginBottom: 0 }}>Plataforma B2B para Negocios</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", margin: "1rem 0", textAlign: "left", fontSize: "0.85rem" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--border-color)", display: "flex", gap: "0.6rem" }}>
                <MapPin size={20} color="var(--primary)" style={{ minWidth: "20px" }} />
                <div>
                  <strong style={{ color: "#fff" }}>Rutas y Navegación GPS Google Maps</strong>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.78rem" }}>Guía paso a paso desde el local del negocio hacia cada cliente.</p>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--border-color)", display: "flex", gap: "0.6rem" }}>
                <Truck size={20} color="var(--secondary)" style={{ minWidth: "20px" }} />
                <div>
                  <strong style={{ color: "#fff" }}>App Móvil con PIN para Mensajeros</strong>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.78rem" }}>Tus repartidores ingresan con su PIN propio sin revelar claves administrativas.</p>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--border-color)", display: "flex", gap: "0.6rem" }}>
                <DollarSign size={20} color="var(--success)" style={{ minWidth: "20px" }} />
                <div>
                  <strong style={{ color: "#fff" }}>Control Financiero & Rendición de Efectivo</strong>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.78rem" }}>Auditoría contable automática de comisiones y dinero cobrado en mano.</p>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--border-color)", display: "flex", gap: "0.6rem" }}>
                <Cloud size={20} color="#60A5FA" style={{ minWidth: "20px" }} />
                <div>
                  <strong style={{ color: "#fff" }}>Sincronización Multidispositivo en Tiempo Real</strong>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.78rem" }}>La PC del local y los teléfonos en la calle están conectados por la nube 24/7.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", gap: "0.5rem" }}
              onClick={() => setView("new-business")}
            >
              <Building size={16} />
              Probar / Registrar Mi Negocio Ahora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "1rem"
  },
  card: {
    maxWidth: "580px",
    width: "100%",
    padding: "3rem 2rem",
    textAlign: "center",
    background: "rgba(13, 17, 27, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.08)"
  },
  brand: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "2.5rem"
  },
  logoIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)"
  },
  brandTitle: {
    fontSize: "1.75rem",
    fontWeight: "800",
    color: "#fff",
    textAlign: "left"
  },
  brandSubtitle: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    textAlign: "left",
    marginTop: "-2px"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%"
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "1.5rem"
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    marginBottom: "1.5rem"
  },
  rolesGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    width: "100%"
  },
  roleCard: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
    padding: "1.25rem",
    borderRadius: "14px",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border-color)",
    cursor: "pointer",
    transition: "var(--transition-smooth)",
    textAlign: "left"
  },
  roleIconBox: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  roleMeta: {
    flex: 1
  },
  roleTitle: {
    fontSize: "1.05rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "0.25rem"
  },
  roleDesc: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    lineHeight: "1.4"
  },
  couriersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1.5rem",
    width: "100%",
    marginBottom: "1rem"
  },
  courierProfileCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.6rem",
    padding: "1.25rem 1rem",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border-color)",
    cursor: "pointer",
    transition: "var(--transition-smooth)"
  },
  profileAvatar: {
    width: "52px",
    height: "52px",
    fontSize: "1.2rem",
    borderRadius: "12px"
  },
  courierName: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#fff"
  },
  courierStatusChip: {
    fontSize: "0.65rem",
    padding: "0.15rem 0.4rem"
  },
  backArrowBtn: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border-color)",
    color: "#fff",
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "var(--transition-smooth)"
  },
  challengeHeader: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "1rem",
    marginBottom: "2rem"
  },
  passForm: {
    width: "100%",
    maxWidth: "340px",
    marginTop: "0.5rem"
  },
  hintText: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    marginTop: "0.4rem",
    display: "block"
  },
  errorAlert: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "var(--danger-bg)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    color: "var(--danger)",
    fontSize: "0.85rem",
    marginBottom: "1.5rem",
    width: "100%",
    textAlign: "left"
  },
  focusedCourierAvatarBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "1.5rem",
    textAlign: "center"
  },
  pinInputField: {
    textAlign: "center",
    fontSize: "1.5rem",
    letterSpacing: "0.5rem",
    padding: "0.5rem 1rem"
  }
};
