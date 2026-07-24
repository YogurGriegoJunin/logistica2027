import React, { useState } from "react";
import { Wallet, Fuel, CheckCircle, Navigation, Play, User, RefreshCw } from "lucide-react";
import { hashPassword } from "../utils/security";

export default function CourierPanel({
  selectedCourier,
  orders,
  onUpdateStatus,
  onAddExpense,
  onChangePin
}) {
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");

  // Change PIN states
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinSuccessMsg, setPinSuccessMsg] = useState("");
  const [pinErrorMsg, setPinErrorMsg] = useState("");

  if (!selectedCourier) {
    return (
      <div className="glass-card animated-fade-in" style={styles.noCourier}>
        <User size={48} color="var(--text-dark)" />
        <h3>Ningún Mensajero Seleccionado</h3>
        <p>Por favor, selecciona un mensajero en la esquina superior derecha para simular su panel.</p>
      </div>
    );
  }

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseAmount || !expenseDesc) return;

    onAddExpense(
      selectedCourier.id,
      parseFloat(expenseAmount),
      expenseDesc
    );

    setExpenseAmount("");
    setExpenseDesc("");
  };

  const handleUpdatePin = async (e) => {
    e.preventDefault();
    setPinSuccessMsg("");
    setPinErrorMsg("");

    try {
      const oldHash = await hashPassword(oldPin);
      if (oldHash !== selectedCourier.pinHash) {
        setPinErrorMsg("El PIN actual es incorrecto.");
        return;
      }

      if (newPin !== confirmPin) {
        setPinErrorMsg("El nuevo PIN y la confirmación no coinciden.");
        return;
      }

      if (newPin.length !== 4) {
        setPinErrorMsg("El PIN debe tener exactamente 4 dígitos.");
        return;
      }

      const newPinHash = await hashPassword(newPin);
      onChangePin(selectedCourier.id, newPinHash);
      setPinSuccessMsg("PIN actualizado con éxito.");
      setOldPin("");
      setNewPin("");
      setConfirmPin("");

      setTimeout(() => {
        setPinSuccessMsg("");
      }, 4000);
    } catch (err) {
      console.error(err);
      setPinErrorMsg("Error al actualizar el PIN.");
    }
  };

  // Find orders assigned to this courier that are active (pending or en_camino)
  const assignedOrders = orders.filter(
    (o) => o.mensajeroId === selectedCourier.id && o.estado !== "cancelado"
  );
  const activeDeliveries = assignedOrders.filter(
    (o) => o.estado !== "entregado"
  );
  const completedDeliveries = assignedOrders.filter(
    (o) => o.estado === "entregado"
  );

  return (
    <div style={styles.container} className="animated-fade-in">
      {/* Resumen del Mensajero */}
      <div style={styles.profileHeader} className="glass-card">
        <div style={styles.profileMeta}>
          <div
            className="avatar"
            style={{
              ...styles.profileAvatar,
              backgroundColor: selectedCourier.color
            }}
          >
            {selectedCourier.avatar}
          </div>
          <div>
            <h2 style={styles.profileName}>{selectedCourier.nombre}</h2>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span className={`badge badge-${selectedCourier.estado}`}>
                {selectedCourier.estado === "libre" ? "Libre / Disponible" : "En Reparto"}
              </span>
            </div>
          </div>
        </div>

        {/* Billetera Contable */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Comisión Acumulada</span>
            <span style={{ ...styles.statVal, color: "var(--primary-hover)" }}>
              ${selectedCourier.comisionAcumulada.toLocaleString()}
            </span>
            <span style={styles.statDesc}>Por cobrar / liquidar</span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statLabel}>Efectivo en Mano</span>
            <span style={{ ...styles.statVal, color: "var(--success)" }}>
              ${selectedCourier.efectivoEnMano.toLocaleString()}
            </span>
            <span style={styles.statDesc}>Cobrado en efectivo</span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statLabel}>Gastos Registrados</span>
            <span style={{ ...styles.statVal, color: "var(--danger)" }}>
              ${selectedCourier.gastosAcumulados.toLocaleString()}
            </span>
            <span style={styles.statDesc}>Combustible / repuestos</span>
          </div>
        </div>
      </div>

      <div style={styles.splitGrid}>
        {/* Entregas Asignadas */}
        <div className="glass-card" style={styles.deliveriesCard}>
          <div style={styles.sectionHeader}>
            <Navigation size={18} color="var(--primary)" />
            <h3>Tareas Asignadas ({activeDeliveries.length})</h3>
          </div>

          <div style={styles.deliveryList}>
            {activeDeliveries.length === 0 ? (
              <div style={styles.emptyList}>
                <CheckCircle size={32} color="var(--success)" style={{ marginBottom: "0.5rem" }} />
                <p style={{ color: "var(--text-muted)" }}>¡Al día! No tienes entregas pendientes.</p>
              </div>
            ) : (
              activeDeliveries.map((order) => (
                <div key={order.id} style={styles.orderItem} className="glass-card">
                  <div style={styles.orderMeta}>
                    <span style={styles.orderId}>Pedido #{order.id.substring(4) || order.id}</span>
                    <span className={`badge badge-${order.estado}`}>
                      {order.estado === "pendiente" ? "Listo para salir" : "En camino"}
                    </span>
                  </div>
                  
                  <div style={styles.orderBody}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Cliente:</span>
                      <span style={styles.detailValue}>{order.cliente}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Dirección:</span>
                      <span style={styles.detailValue}>{order.direccion}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Valor Pedido:</span>
                      <span style={{ ...styles.detailValue, fontWeight: "bold" }}>
                        ${order.valor.toLocaleString()}
                      </span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Método Pago:</span>
                      <span style={{ ...styles.detailValue, textTransform: "capitalize" }}>
                        {order.metodoPago}
                      </span>
                    </div>
                    {order.articulos && order.articulos.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", gridColumn: "1 / -1", marginTop: "0.25rem", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "0.4rem" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: "600", color: "var(--text-muted)" }}>Artículos del Pedido:</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", paddingLeft: "0.4rem" }}>
                          {order.articulos.map((item, idx) => (
                            <div key={idx} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.85)" }}>
                              • {item.cantidad}x {item.nombre} (${item.precio.toLocaleString()})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Tu Ganancia:</span>
                      <span style={{ ...styles.detailValue, color: "var(--success)", fontWeight: "bold" }}>
                        +${order.comisionEntrega.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div style={styles.orderActions}>
                    {order.estado === "pendiente" ? (
                      <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={() => onUpdateStatus(order.id, "en_camino")}
                      >
                        <Play size={16} />
                        Iniciar Viaje (En camino)
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        style={{ width: "100%" }}
                        onClick={() => onUpdateStatus(order.id, "entregado")}
                      >
                        <CheckCircle size={16} />
                        Marcar como Entregado
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={styles.rightColumn}>
          {/* Registrar Gasto */}
          <div className="glass-card" style={styles.expenseCard}>
            <div style={styles.sectionHeader}>
              <Fuel size={18} color="var(--danger)" />
              <h3>Registrar Gasto del Viaje</h3>
            </div>
            <form onSubmit={handleExpenseSubmit} style={styles.form}>
              <div className="form-group">
                <label>Monto del Gasto ($)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Ej. 1500"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción / Concepto</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Combustible Motocicleta"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-danger" style={{ width: "100%" }}>
                <Wallet size={16} />
                Guardar Gasto
              </button>
            </form>
          </div>

          {/* Seguridad (Cambiar PIN) */}
          <div className="glass-card" style={styles.expenseCard}>
            <div style={styles.sectionHeader}>
              <Wallet size={18} color="var(--primary)" />
              <h3>Seguridad (Cambiar PIN)</h3>
            </div>

            {pinSuccessMsg && (
              <div style={{ display: "flex", gap: "0.5rem", background: "var(--success-bg)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "0.5rem 0.75rem", borderRadius: "10px", color: "var(--success)", fontSize: "0.82rem", marginBottom: "0.75rem" }} className="animated-fade-in">
                <span>{pinSuccessMsg}</span>
              </div>
            )}

            {pinErrorMsg && (
              <div style={{ display: "flex", gap: "0.5rem", background: "var(--danger-bg)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "0.5rem 0.75rem", borderRadius: "10px", color: "var(--danger)", fontSize: "0.82rem", marginBottom: "0.75rem" }} className="animated-fade-in">
                <span>{pinErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePin} style={styles.form}>
              <div className="form-group">
                <label>PIN Actual</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="PIN actual..."
                  maxLength="4"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value.replace(/[^0-9]/g, ""))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nuevo PIN (4 dígitos)</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="PIN nuevo..."
                  maxLength="4"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ""))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirmar Nuevo PIN</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Repite PIN nuevo..."
                  maxLength="4"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ""))}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                Guardar Nuevo PIN
              </button>
            </form>
          </div>

          {/* Historial de Entregas Completadas */}
          <div className="glass-card" style={styles.historyCard}>
            <div style={styles.sectionHeader}>
              <RefreshCw size={16} color="var(--text-muted)" />
              <h3>Historial Reciente ({completedDeliveries.length})</h3>
            </div>
            
            <div style={styles.historyList}>
              {completedDeliveries.length === 0 ? (
                <p style={{ color: "var(--text-dark)", fontSize: "0.85rem", textAlign: "center" }}>
                  Aún no has completado entregas hoy.
                </p>
              ) : (
                completedDeliveries.slice(-4).reverse().map(order => (
                  <div key={order.id} style={styles.historyItem}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "0.85rem" }}>{order.direccion}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cliente: {order.cliente}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "var(--success)", fontWeight: "600", fontSize: "0.85rem" }}>
                        +${order.comisionEntrega}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-dark)" }}>
                        {order.metodoPago === "efectivo" ? "Cobrado efectivo" : "Tarjeta"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem"
  },
  noCourier: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 2rem",
    textAlign: "center",
    gap: "1rem"
  },
  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "2rem"
  },
  profileMeta: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem"
  },
  profileAvatar: {
    width: "60px",
    height: "60px",
    fontSize: "1.4rem",
    borderRadius: "16px"
  },
  profileName: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "0.25rem"
  },
  statsGrid: {
    display: "flex",
    gap: "1.5rem"
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border-color)",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    minWidth: "160px",
    display: "flex",
    flexDirection: "column"
  },
  statLabel: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.25rem"
  },
  statVal: {
    fontSize: "1.35rem",
    fontWeight: "700",
    marginBottom: "0.15rem"
  },
  statDesc: {
    fontSize: "0.68rem",
    color: "var(--text-dark)"
  },
  splitGrid: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr",
    gap: "2rem"
  },
  deliveriesCard: {
    minHeight: "400px"
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "0.75rem"
  },
  deliveryList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem"
  },
  emptyList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "250px"
  },
  orderItem: {
    padding: "1.25rem",
    border: "1px solid rgba(255, 255, 255, 0.04)"
  },
  orderMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem"
  },
  orderId: {
    fontSize: "0.9rem",
    fontWeight: "700",
    color: "var(--text-muted)"
  },
  orderBody: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "0.75rem",
    marginBottom: "1.25rem",
    background: "rgba(255, 255, 255, 0.01)",
    padding: "0.75rem",
    borderRadius: "8px"
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem"
  },
  detailLabel: {
    color: "var(--text-muted)"
  },
  detailValue: {
    color: "#fff"
  },
  orderActions: {
    display: "flex"
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem"
  },
  expenseCard: {
    padding: "1.5rem"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  historyCard: {
    padding: "1.5rem"
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem"
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.6rem 0",
    borderBottom: "1px solid var(--border-color)"
  }
};

// Responsive override for grids
if (typeof window !== "undefined" && window.innerWidth <= 1024) {
  styles.profileHeader = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "1.5rem"
  };
  styles.statsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    width: "100%",
    gap: "1rem"
  };
  styles.splitGrid = {
    display: "flex",
    flexDirection: "column",
    gap: "2rem"
  };
}
