import React from "react";
import { Download, FileSpreadsheet } from "lucide-react";

export default function ExportReportButton({ orders = [], transactions = [], storeName = "Comercio" }) {

  const exportOrdersCSV = () => {
    if (!orders || orders.length === 0) {
      alert("No hay pedidos registrados para exportar.");
      return;
    }

    const headers = ["ID Pedido", "Fecha", "Cliente", "Direccion", "Valor ($)", "Comision Envío ($)", "Metodo Pago", "Estado", "Repartidor"];
    const rows = orders.map(p => [
      p.id,
      p.fecha ? new Date(p.fecha).toLocaleString("es-ES") : "",
      `"${(p.cliente || "").replace(/"/g, '""')}"`,
      `"${(p.direccion || "").replace(/"/g, '""')}"`,
      p.valor || 0,
      p.comisionEntrega || 0,
      p.metodoPago || "efectivo",
      p.estado || "pendiente",
      `"${(p.mensajeroNombre || p.mensajeroId || "Sin asignar").replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_Pedidos_${storeName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTransactionsCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("No hay transacciones registradas para exportar.");
      return;
    }

    const headers = ["ID Transaccion", "Fecha", "Tipo", "Descripcion", "Monto ($)", "Repartidor ID"];
    const rows = transactions.map(t => [
      t.id,
      t.fecha ? new Date(t.fecha).toLocaleString("es-ES") : "",
      t.tipo,
      `"${(t.descripcion || "").replace(/"/g, '""')}"`,
      t.monto || 0,
      t.mensajeroId || ""
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_Caja_Finanzas_${storeName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        onClick={exportOrdersCSV}
        title="Exportar listado de pedidos a CSV/Excel"
        style={{
          padding: "8px 14px",
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          color: "#34d399",
          border: "1px solid rgba(52, 211, 153, 0.3)",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "500",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}
      >
        <FileSpreadsheet size={16} />
        Exportar Pedidos (CSV)
      </button>

      <button
        onClick={exportTransactionsCSV}
        title="Exportar arqueo de caja y finanzas a CSV/Excel"
        style={{
          padding: "8px 14px",
          backgroundColor: "rgba(59, 130, 246, 0.15)",
          color: "#60a5fa",
          border: "1px solid rgba(96, 165, 250, 0.3)",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "500",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}
      >
        <Download size={16} />
        Exportar Caja (CSV)
      </button>
    </div>
  );
}
