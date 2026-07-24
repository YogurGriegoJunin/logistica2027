import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  TrendingUp,
  DollarSign,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Layers,
  CheckCircle,
  FileText,
  AlertCircle
} from "lucide-react";

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AccountingPanel({
  orders,
  couriers,
  transactions,
  onSettleCourier
}) {
  const [settleCourierId, setSettleCourierId] = useState("");
  const [settleSuccessMsg, setSettleSuccessMsg] = useState("");

  // Calculate totals
  const totalSales = orders
    .filter(o => o.estado === "entregado")
    .reduce((sum, o) => sum + o.valor, 0);

  const totalCommissions = couriers.reduce((sum, c) => sum + c.comisionAcumulada, 0);
  const totalCashInCirculation = couriers.reduce((sum, c) => sum + c.efectivoEnMano, 0);
  const totalExpenses = couriers.reduce((sum, c) => sum + c.gastosAcumulados, 0);

  // Card sales vs cash sales
  const cardSales = orders
    .filter(o => o.estado === "entregado" && o.metodoPago === "tarjeta")
    .reduce((sum, o) => sum + o.valor, 0);

  // Net Profit: Store Sales minus commissions paid/owed and expenses
  const netStoreProfit = totalSales - orders.filter(o => o.estado === "entregado").reduce((sum, o) => sum + o.comisionEntrega, 0) - totalExpenses;

  // Store Vault Balance (Card sales + Liquidated cash from couriers)
  // Reconstructed from transaction ledger
  const storeVault = transactions
    .filter(tx => tx.tipo === "ingreso_tienda" && !tx.descripcion.includes("Pendiente"))
    .reduce((sum, tx) => sum + tx.monto, 0) + 
    transactions.filter(tx => tx.tipo === "liquidacion_caja" || tx.tipo === "pago_comision" || tx.tipo === "gasto_combustible").reduce((sum, tx) => sum + tx.monto, 0);

  // Handlers for settlement
  const handleSettleSubmit = (e) => {
    e.preventDefault();
    if (!settleCourierId) return;

    const courier = couriers.find(c => c.id === settleCourierId);
    if (!courier) return;

    if (courier.efectivoEnMano === 0 && courier.comisionAcumulada === 0) {
      alert("El mensajero no tiene saldos pendientes para liquidar.");
      return;
    }

    onSettleCourier(courier.id);
    
    // Calculate details for receipt
    const diff = courier.efectivoEnMano - courier.comisionAcumulada;
    if (diff > 0) {
      setSettleSuccessMsg(`Caja liquidada con éxito. El mensajero ${courier.nombre} entregó $${diff.toLocaleString()} en efectivo a la tienda.`);
    } else if (diff < 0) {
      setSettleSuccessMsg(`Caja liquidada con éxito. La tienda pagó $${Math.abs(diff).toLocaleString()} en comisiones a ${courier.nombre}.`);
    } else {
      setSettleSuccessMsg(`Caja liquidada con éxito. Saldos reconciliados de forma exacta.`);
    }

    setSettleCourierId("");
    setTimeout(() => setSettleSuccessMsg(""), 6000);
  };

  const activeSettleCourier = couriers.find(c => c.id === settleCourierId);
  let settleDetails = null;
  if (activeSettleCourier) {
    const cash = activeSettleCourier.efectivoEnMano;
    const comm = activeSettleCourier.comisionAcumulada;
    const net = cash - comm;
    settleDetails = { cash, comm, net };
  }

  // Chart 1: Profit distribution (Tienda vs Mensajeros vs Gastos)
  const distributionData = {
    labels: ["Utilidad Tienda", "Comisión Mensajeros", "Gastos de Viaje"],
    datasets: [
      {
        data: [
          Math.max(0, netStoreProfit),
          orders.filter(o => o.estado === "entregado").reduce((sum, o) => sum + o.comisionEntrega, 0),
          totalExpenses
        ],
        backgroundColor: [
          "rgba(139, 92, 246, 0.7)",  // Violeta
          "rgba(16, 185, 129, 0.7)",  // Verde esmeralda
          "rgba(239, 68, 68, 0.7)"    // Rojo
        ],
        borderColor: [
          "var(--primary)",
          "var(--success)",
          "var(--danger)"
        ],
        borderWidth: 1.5
      }
    ]
  };

  // Chart 2: Courier balance comparison (Carlos vs Sofía vs Miguel)
  const courierData = {
    labels: couriers.map(c => c.nombre.split(" ")[0]),
    datasets: [
      {
        label: "Efectivo Recaudado",
        data: couriers.map(c => c.efectivoEnMano),
        backgroundColor: "rgba(16, 185, 129, 0.6)",
        borderColor: "var(--success)",
        borderWidth: 1
      },
      {
        label: "Comisiones Acumuladas",
        data: couriers.map(c => c.comisionAcumulada),
        backgroundColor: "rgba(139, 92, 246, 0.6)",
        borderColor: "var(--primary)",
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            family: "Outfit"
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "rgba(255, 255, 255, 0.5)" },
        grid: { color: "rgba(255,255,255,0.05)" }
      },
      y: {
        ticks: { color: "rgba(255, 255, 255, 0.5)" },
        grid: { color: "rgba(255,255,255,0.05)" }
      }
    }
  };

  return (
    <div style={styles.container} className="animated-fade-in">
      {/* Finanzas KPIs */}
      <div className="kpi-grid">
        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Ventas Totales</span>
            <div className="kpi-icon" style={{ backgroundColor: "rgba(139, 92, 246, 0.15)" }}>
              <TrendingUp size={20} color="var(--primary)" />
            </div>
          </div>
          <div>
            <div className="kpi-value">${totalSales.toLocaleString()}</div>
            <div className="kpi-footer">Pedidos completados entregados</div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Caja Tienda</span>
            <div className="kpi-icon" style={{ backgroundColor: "var(--success-bg)" }}>
              <DollarSign size={20} color="var(--success)" />
            </div>
          </div>
          <div>
            <div className="kpi-value">${storeVault.toLocaleString()}</div>
            <div className="kpi-footer">Liquidado + Tarjetas online</div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Efectivo en Calle</span>
            <div className="kpi-icon" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}>
              <Wallet size={20} color="var(--warning)" />
            </div>
          </div>
          <div>
            <div className="kpi-value">${totalCashInCirculation.toLocaleString()}</div>
            <div className="kpi-footer">En mano de los repartidores</div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Utilidad Neta</span>
            <div className="kpi-icon" style={{ backgroundColor: "rgba(236, 72, 153, 0.15)" }}>
              <Layers size={20} color="var(--secondary)" />
            </div>
          </div>
          <div>
            <div className="kpi-value">${netStoreProfit.toLocaleString()}</div>
            <div className="kpi-footer">Ventas - Comisiones - Gastos</div>
          </div>
        </div>
      </div>

      {/* Gráficos y Liquidación */}
      <div style={styles.chartSectionGrid}>
        {/* Gráficos Financieros */}
        <div className="glass-card" style={styles.chartCard}>
          <div style={styles.sectionHeader}>
            <FileText size={18} color="var(--primary)" />
            <h3>Análisis Financiero</h3>
          </div>
          <div style={styles.chartsRow}>
            <div style={styles.chartContainer}>
              <h4 style={styles.chartTitle}>Distribución de Utilidades</h4>
              <div style={{ height: "180px", position: "relative" }}>
                <Pie data={distributionData} options={{ ...chartOptions, scales: {} }} />
              </div>
            </div>
            <div style={styles.chartContainer}>
              <h4 style={styles.chartTitle}>Cierre Mensajero</h4>
              <div style={{ height: "180px", position: "relative" }}>
                <Bar data={courierData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Liquidación de Caja */}
        <div className="glass-card" style={styles.settleCard}>
          <div style={styles.sectionHeader}>
            <CheckCircle size={18} color="var(--success)" />
            <h3>Liquidar Caja del Mensajero</h3>
          </div>

          {settleSuccessMsg && (
            <div style={styles.successToast} className="animated-fade-in">
              <CheckCircle size={16} />
              <span>{settleSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSettleSubmit} style={styles.settleForm}>
            <div className="form-group">
              <label>Seleccionar Mensajero</label>
              <select
                className="input-field"
                value={settleCourierId}
                onChange={(e) => {
                  setSettleCourierId(e.target.value);
                  setSettleSuccessMsg("");
                }}
                required
              >
                <option value="">-- Seleccionar --</option>
                {couriers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} (Efec: ${c.efectivoEnMano} / Com: ${c.comisionAcumulada})
                  </option>
                ))}
              </select>
            </div>

            {settleDetails && (
              <div style={styles.detailsBlock} className="animated-fade-in">
                <div style={styles.detailRow}>
                  <span>Efectivo recaudado en mano:</span>
                  <span style={{ fontWeight: "600" }}>${settleDetails.cash.toLocaleString()}</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Comisiones ganadas:</span>
                  <span style={{ color: "var(--primary-hover)", fontWeight: "600" }}>
                    -${settleDetails.comm.toLocaleString()}
                  </span>
                </div>
                <hr style={styles.divider} />
                <div style={styles.detailRow}>
                  <span style={{ fontWeight: "bold" }}>
                    {settleDetails.net >= 0 ? "Neto a Entregar a Tienda:" : "Neto a Pagar al Repartidor:"}
                  </span>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: settleDetails.net >= 0 ? "var(--success)" : "var(--secondary)"
                    }}
                  >
                    ${Math.abs(settleDetails.net).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-success"
              style={{ width: "100%" }}
              disabled={!settleCourierId || (settleDetails && settleDetails.cash === 0 && settleDetails.comm === 0)}
            >
              Confirmar Liquidación de Caja
            </button>
          </form>
        </div>
      </div>

      {/* Historial General de Transacciones */}
      <div className="glass-card">
        <div style={styles.sectionHeader}>
          <Layers size={18} color="var(--text-muted)" />
          <h3>Libro de Transacciones Contables</h3>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha / Hora</th>
                <th>Concepto / Descripción</th>
                <th>Tipo</th>
                <th>Mensajero</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "var(--text-dark)", padding: "2rem" }}>
                    Sin transacciones registradas.
                  </td>
                </tr>
              ) : (
                transactions.slice().reverse().map((tx) => {
                  const courier = couriers.find(c => c.id === tx.mensajeroId);
                  
                  // Color indicators for transaction amounts
                  let amountColor = "#fff";
                  let amountPrefix = "";
                  if (tx.monto > 0) {
                    amountColor = "var(--success)";
                    amountPrefix = "+";
                  } else if (tx.monto < 0) {
                    amountColor = "var(--danger)";
                  }

                  return (
                    <tr key={tx.id}>
                      <td style={{ fontWeight: "bold", fontSize: "0.82rem", color: "var(--text-dark)" }}>
                        {tx.id}
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        {new Date(tx.fecha).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: "500" }}>{tx.descripcion}</td>
                      <td>
                        <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "600", color: "var(--text-muted)" }}>
                          {tx.tipo.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        {courier ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <span className="avatar" style={{ width: "24px", height: "24px", fontSize: "0.65rem", backgroundColor: courier.color }}>
                              {courier.avatar}
                            </span>
                            <span style={{ fontSize: "0.82rem" }}>{courier.nombre.split(" ")[0]}</span>
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-dark)", fontSize: "0.82rem" }}>Sistema / General</span>
                        )}
                      </td>
                      <td style={{ fontWeight: "700", color: amountColor }}>
                        {amountPrefix}${tx.monto.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
  chartSectionGrid: {
    display: "grid",
    gridTemplateColumns: "1.8fr 1fr",
    gap: "2rem"
  },
  chartCard: {
    padding: "1.5rem"
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "0.75rem"
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem"
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  chartTitle: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    textAlign: "center",
    marginBottom: "0.5rem"
  },
  settleCard: {
    padding: "1.5rem"
  },
  settleForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  detailsBlock: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border-color)",
    padding: "1rem",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.88rem"
  },
  divider: {
    border: "none",
    borderBottom: "1px solid var(--border-color)",
    margin: "0.5rem 0"
  },
  successToast: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    background: "var(--success-bg)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    color: "var(--success)",
    fontSize: "0.85rem",
    marginBottom: "1rem"
  }
};

// Responsive override for layouts
if (typeof window !== "undefined" && window.innerWidth <= 1024) {
  styles.chartSectionGrid = {
    display: "flex",
    flexDirection: "column",
    gap: "2rem"
  };
  styles.chartsRow = {
    display: "flex",
    flexDirection: "column",
    gap: "2rem"
  };
}
