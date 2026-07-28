import React, { useState } from "react";
import { Printer, X, Check, Copy, FileText } from "lucide-react";
import { printThermalReceipt, generateThermalTicketText } from "../utils/thermalPrinter";

export default function ThermalTicketModal({ pedido, tienda, onClose }) {
  const [ticketWidth, setTicketWidth] = useState("58mm");
  const [copied, setCopied] = useState(false);

  if (!pedido) return null;

  const rawText = generateThermalTicketText(pedido, tienda);

  const handlePrint = () => {
    printThermalReceipt(pedido, tienda, ticketWidth);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.75)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "16px"
    }}>
      <div className="modal-content" style={{
        backgroundColor: "#1e293b",
        color: "#f8fafc",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "460px",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #334155",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to right, #1e293b, #0f172a)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              color: "#818cf8",
              padding: "8px",
              borderRadius: "10px",
              display: "flex"
            }}>
              <Printer size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Imprimir Comanda Térmica</h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>Pedido #{pedido.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #334155", backgroundColor: "#0f172a" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>
            Ancho de Impresora Térmica (ESC/POS):
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setTicketWidth("58mm")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: ticketWidth === "58mm" ? "2px solid #6366f1" : "1px solid #334155",
                backgroundColor: ticketWidth === "58mm" ? "rgba(99, 102, 241, 0.2)" : "#1e293b",
                color: ticketWidth === "58mm" ? "#a5b4fc" : "#94a3b8",
                fontWeight: ticketWidth === "58mm" ? "600" : "normal",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              58 mm (Estándar Móvil)
            </button>
            <button
              type="button"
              onClick={() => setTicketWidth("80mm")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: ticketWidth === "80mm" ? "2px solid #6366f1" : "1px solid #334155",
                backgroundColor: ticketWidth === "80mm" ? "rgba(99, 102, 241, 0.2)" : "#1e293b",
                color: ticketWidth === "80mm" ? "#a5b4fc" : "#94a3b8",
                fontWeight: ticketWidth === "80mm" ? "600" : "normal",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              80 mm (POS Mostrador)
            </button>
          </div>
        </div>

        {/* Ticket Preview Simulation */}
        <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1, backgroundColor: "#090d16" }}>
          <div style={{
            backgroundColor: "#fff",
            color: "#000",
            fontFamily: "Courier New, monospace",
            fontSize: ticketWidth === "80mm" ? "13px" : "11px",
            padding: "16px 12px",
            borderRadius: "6px",
            maxWidth: ticketWidth === "80mm" ? "320px" : "240px",
            margin: "0 auto",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)",
            lineHeight: "1.3",
            whiteSpace: "pre-wrap"
          }}>
            {rawText}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid #334155",
          display: "flex",
          gap: "10px",
          backgroundColor: "#1e293b"
        }}>
          <button
            type="button"
            onClick={handleCopyText}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "#334155",
              color: "#f8fafc",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px"
            }}
          >
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            {copied ? "¡Copiado!" : "Copiar Texto"}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "8px",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
            }}
          >
            <Printer size={18} />
            Imprimir Comanda ({ticketWidth})
          </button>
        </div>
      </div>
    </div>
  );
}
