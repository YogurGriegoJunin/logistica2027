import React, { useState } from "react";
import { Store, Check, Rocket, ShieldCheck, Zap, X, CreditCard, ChevronRight } from "lucide-react";

export default function MerchantOnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    plan: "pro", // 'basico', 'pro', 'enterprise'
    moneda: "$",
    impresoraTermica: true,
    anchoTicket: "58mm"
  });

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && !formData.nombre.trim()) {
      alert("Por favor ingresa el nombre de tu comercio.");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "16px"
    }}>
      <div className="modal-content" style={{
        backgroundColor: "#1e293b",
        color: "#f8fafc",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "560px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              padding: "10px",
              borderRadius: "12px",
              display: "flex"
            }}>
              <Rocket size={24} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>Registrar Nuevo Comercio</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "rgba(255, 255, 255, 0.85)" }}>
                Paso {step} de 3 — Configuración Express de tu Plataforma SaaS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleNext} style={{ padding: "24px" }}>
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4 style={{ margin: 0, fontSize: "16px", color: "#818cf8" }}>1. Datos de tu Negocio / Comercio</h4>
              
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>
                  Nombre del Comercio / Local *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Hamburguesería San Martín"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    color: "#fff",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>
                  Dirección Base de Despacho
                </label>
                <input
                  type="text"
                  placeholder="Ej. Av. Rivadavia 1234, Centro"
                  value={formData.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    color: "#fff",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>
                  Teléfono / WhatsApp de Contacto
                </label>
                <input
                  type="text"
                  placeholder="Ej. +54 9 11 5555 4444"
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    color: "#fff",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4 style={{ margin: 0, fontSize: "16px", color: "#818cf8" }}>2. Selecciona tu Plan de Suscripción Mensual</h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
                Todos los planes incluyen 14 días de prueba gratis. Cancela en cualquier momento.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* Plan Básico */}
                <div
                  onClick={() => handleChange("plan", "basico")}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: formData.plan === "basico" ? "2px solid #6366f1" : "1px solid #334155",
                    backgroundColor: formData.plan === "basico" ? "rgba(99, 102, 241, 0.1)" : "#0f172a",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "15px", color: "#fff" }}>Plan Básico — $29 / mes</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>Hasta 3 repartidores, mapas en vivo, arqueo de caja.</div>
                  </div>
                  {formData.plan === "basico" && <Check size={20} color="#818cf8" />}
                </div>

                {/* Plan Pro */}
                <div
                  onClick={() => handleChange("plan", "pro")}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: formData.plan === "pro" ? "2px solid #6366f1" : "1px solid #334155",
                    backgroundColor: formData.plan === "pro" ? "rgba(99, 102, 241, 0.15)" : "#0f172a",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative"
                  }}
                >
                  <div>
                    <span style={{
                      backgroundColor: "#6366f1",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: "bold",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      marginRight: "6px"
                    }}>Recomendado</span>
                    <div style={{ fontWeight: "600", fontSize: "15px", color: "#fff", display: "inline" }}>Plan Pro — $49 / mes</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                      Repartidores ilimitados, Impresión Térmica de tickets, Notificaciones por WhatsApp.
                    </div>
                  </div>
                  {formData.plan === "pro" && <Check size={20} color="#818cf8" />}
                </div>

                {/* Plan Enterprise */}
                <div
                  onClick={() => handleChange("plan", "enterprise")}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: formData.plan === "enterprise" ? "2px solid #6366f1" : "1px solid #334155",
                    backgroundColor: formData.plan === "enterprise" ? "rgba(99, 102, 241, 0.1)" : "#0f172a",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "15px", color: "#fff" }}>Plan Enterprise — $89 / mes</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>Multi-sucursal, exportación contable masiva, soporte prioritario 24/7.</div>
                  </div>
                  {formData.plan === "enterprise" && <Check size={20} color="#818cf8" />}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4 style={{ margin: 0, fontSize: "16px", color: "#818cf8" }}>3. Configuración Hardware & Opciones</h4>

              <div style={{
                backgroundColor: "#0f172a",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #334155"
              }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.impresoraTermica}
                    onChange={(e) => handleChange("impresoraTermica", e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#6366f1" }}
                  />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>Habilitar Impresoras Térmicas de Tickets</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>Imprime comandas directamente desde el panel al despachar.</div>
                  </div>
                </label>
              </div>

              {formData.impresoraTermica && (
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>
                    Ancho predeterminado de ticket impreso:
                  </label>
                  <select
                    value={formData.anchoTicket}
                    onChange={(e) => handleChange("anchoTicket", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      color: "#fff",
                      fontSize: "14px"
                    }}
                  >
                    <option value="58mm">58 mm (Impresora térmica de mano / Bluetooth)</option>
                    <option value="80mm">80 mm (Impresora térmica de mostrador POS)</option>
                  </select>
                </div>
              )}

              <div style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "12px",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#6ee7b7",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <ShieldCheck size={18} />
                ¡Tu prueba gratuita de 14 días iniciará inmediatamente al hacer clic en Comenzar!
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #334155"
          }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  backgroundColor: "#334155",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Anterior
              </button>
            ) : <div />}

            <button
              type="submit"
              style={{
                padding: "10px 24px",
                borderRadius: "10px",
                backgroundColor: "#6366f1",
                color: "#ffffff",
                border: "none",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)"
              }}
            >
              {step === 3 ? "¡Comenzar Mi Comercio!" : "Siguiente"}
              <ChevronRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
