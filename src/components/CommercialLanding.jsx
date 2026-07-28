import React, { useState } from "react";
import {
  Truck,
  CheckCircle2,
  Shield,
  Zap,
  Printer,
  DollarSign,
  TrendingUp,
  Clock,
  Smartphone,
  MapPin,
  FileSpreadsheet,
  ArrowRight,
  Play,
  Star,
  Users,
  Award
} from "lucide-react";

export default function CommercialLanding({ onStartDemo, onOpenOnboarding }) {
  const [numOrdersMonth, setNumOrdersMonth] = useState(300);
  const [avgOrderCost, setAvgOrderCost] = useState(2500);

  // Estimación de ahorro por optimización de logística (15% menos gastos en gasolina y cero pérdidas de efectivo)
  const estimatedSavings = Math.round(numOrdersMonth * avgOrderCost * 0.12);

  return (
    <div style={{
      backgroundColor: "#090d16",
      color: "#f8fafc",
      minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Hero Section */}
      <section style={{
        padding: "80px 24px 60px",
        textAlign: "center",
        maxWidth: "1100px",
        margin: "0 auto",
        position: "relative"
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "rgba(99, 102, 241, 0.15)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          color: "#818cf8",
          padding: "6px 16px",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: "600",
          marginBottom: "24px"
        }}>
          <Zap size={16} /> Software de Logística & Repartos para Comercios
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 5vw, 54px)",
          fontWeight: "800",
          lineHeight: "1.15",
          margin: "0 0 20px",
          background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #818cf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Controla tus Repartidores, Automatiza tus Envíos y Duplica tus Ventas
        </h1>

        <p style={{
          fontSize: "18px",
          color: "#94a3b8",
          maxWidth: "750px",
          margin: "0 auto 36px",
          lineHeight: "1.6"
        }}>
          La solución SaaS todo-en-uno para restaurantes, comercios y tiendas con flota propia o subcontratada.
          Geolocalización en mapa, caja chica, comisiones e **impresión nativa de comandas térmicas**.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "48px"
        }}>
          <button
            onClick={onStartDemo}
            style={{
              padding: "16px 32px",
              borderRadius: "12px",
              backgroundColor: "#6366f1",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5)",
              transition: "transform 0.2s"
            }}
          >
            <Play size={20} /> Probar Demo Interactivo En Vivo
          </button>

          <button
            onClick={onOpenOnboarding}
            style={{
              padding: "16px 32px",
              borderRadius: "12px",
              backgroundColor: "#1e293b",
              color: "#f8fafc",
              fontWeight: "600",
              fontSize: "16px",
              border: "1px solid #334155",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            Crear Mi Comercio Gratis (14 Días) <ArrowRight size={18} />
          </button>
        </div>

        {/* Stats strip */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          backgroundColor: "#1e293b",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.08)"
        }}>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#38bdf8" }}>+40%</div>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>Entregas más rápidas</div>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#34d399" }}>100%</div>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>Control de Efectivo y Caja</div>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#a78bfa" }}>58 / 80mm</div>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>Tickets Térmicos Directos</div>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#f472b6" }}>2 Min</div>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>Configuración Express</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        padding: "60px 24px",
        maxWidth: "1100px",
        margin: "0 auto"
      }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 12px" }}>
            Todo lo que tu Negocio Necesita para Operar como un Gigante
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "16px" }}>
            Diseñado para eliminar el desorden de pedidos en papel y grupos de chat de repartidores.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          {/* Card 1 */}
          <div style={{
            backgroundColor: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #334155"
          }}>
            <div style={{
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              color: "#38bdf8",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Mapa de Geolocalización En Vivo</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.5" }}>
              Visualiza en un mapa interactivo la posición de tus repartidores, los pedidos pendientes y las entregas en curso.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            backgroundColor: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #334155"
          }}>
            <div style={{
              backgroundColor: "rgba(167, 139, 250, 0.15)",
              color: "#a78bfa",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <Printer size={24} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Impresión de Tickets Térmicos</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.5" }}>
              Impresión nativa de comandas para impresoras térmicas de 58mm y 80mm (Bluetooth o USB POS).
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            backgroundColor: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #334155"
          }}>
            <div style={{
              backgroundColor: "rgba(52, 211, 153, 0.15)",
              color: "#34d399",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <DollarSign size={24} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Caja Chica & Arqueo de Efectivo</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.5" }}>
              Liquidación en tiempo real del dinero recolectado en mano por repartidores y pago automático de comisiones.
            </p>
          </div>

          {/* Card 4 */}
          <div style={{
            backgroundColor: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #334155"
          }}>
            <div style={{
              backgroundColor: "rgba(244, 114, 182, 0.15)",
              color: "#f472b6",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <Smartphone size={24} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>App PWA para Repartidores</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.5" }}>
              Tus cadetes reciben alertas, aceptan entregas, registran cobros y gastos de combustible sin instalar aplicaciones pesadas.
            </p>
          </div>

          {/* Card 5 */}
          <div style={{
            backgroundColor: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #334155"
          }}>
            <div style={{
              backgroundColor: "rgba(251, 146, 60, 0.15)",
              color: "#fb923c",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <Clock size={24} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Rastreo para Clientes vía WhatsApp</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.5" }}>
              Envía un mensaje automático al cliente final con el nombre del repartidor y el estado de su envío.
            </p>
          </div>

          {/* Card 6 */}
          <div style={{
            backgroundColor: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #334155"
          }}>
            <div style={{
              backgroundColor: "rgba(129, 140, 248, 0.15)",
              color: "#818cf8",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <FileSpreadsheet size={24} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Reportes Financieros en Excel / CSV</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.5" }}>
              Exportación instantánea de historiales de pedidos, propinas y gastos de combustible para tu contador.
            </p>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section style={{
        padding: "60px 24px",
        backgroundColor: "#0f172a",
        borderTop: "1px solid #1e293b",
        borderBottom: "1px solid #1e293b"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textStyle: "center" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 10px" }}>
              Calcula el Ahorro de tu Comercio
            </h2>
            <p style={{ color: "#94a3b8" }}>Descubre cuánto dinero recuperas al reducir extravíos de dinero y optimizar rutas.</p>
          </div>

          <div style={{
            backgroundColor: "#1e293b",
            padding: "28px",
            borderRadius: "20px",
            border: "1px solid #334155",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "28px"
          }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#cbd5e1", marginBottom: "8px" }}>
                Pedidos de entrega por mes: <strong>{numOrdersMonth} pedidos</strong>
              </label>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={numOrdersMonth}
                onChange={(e) => setNumOrdersMonth(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#6366f1", marginBottom: "20px" }}
              />

              <label style={{ display: "block", fontSize: "14px", color: "#cbd5e1", marginBottom: "8px" }}>
                Valor promedio por pedido: <strong>${avgOrderCost.toLocaleString("es-ES")}</strong>
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={avgOrderCost}
                onChange={(e) => setAvgOrderCost(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#6366f1" }}
              />
            </div>

            <div style={{
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              borderRadius: "14px",
              padding: "20px",
              border: "1px dashed rgba(99, 102, 241, 0.4)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "13px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                Ahorro Operativo Est.
              </div>
              <div style={{ fontSize: "36px", fontWeight: "800", color: "#34d399", margin: "8px 0" }}>
                ${estimatedSavings.toLocaleString("es-ES")} / mes
              </div>
              <div style={{ fontSize: "12px", color: "#cbd5e1" }}>
                ¡El software se paga solo desde la primera semana!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Plans */}
      <section style={{
        padding: "80px 24px",
        maxWidth: "1100px",
        margin: "0 auto"
      }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "700", margin: "0 0 12px" }}>
            Planes de Suscripción Transparentes
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "16px" }}>
            Sin cargos ocultos ni comisiones por venta. Cancela o cambia de plan cuando quieras.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          {/* Plan Básico */}
          <div style={{
            backgroundColor: "#1e293b",
            borderRadius: "20px",
            padding: "32px 24px",
            border: "1px solid #334155",
            display: "flex",
            flexDirection: "column"
          }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "20px" }}>Básico</h3>
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 20px" }}>Ideal para pequeños locales en crecimiento.</p>

            <div style={{ fontSize: "36px", fontWeight: "800", marginBottom: "20px" }}>
              $29 <span style={{ fontSize: "14px", fontWeight: "normal", color: "#94a3b8" }}>/ mes</span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Hasta 3 repartidores simultáneos</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Despacho de pedidos en mapa</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Control de arqueo de caja chica</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> App PWA móvil para cadetes</li>
            </ul>

            <button
              onClick={onOpenOnboarding}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "#334155",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Iniciar Prueba de 14 Días
            </button>
          </div>

          {/* Plan Pro (Destacado) */}
          <div style={{
            backgroundColor: "#1e293b",
            borderRadius: "20px",
            padding: "32px 24px",
            border: "2px solid #6366f1",
            boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.4)",
            display: "flex",
            flexDirection: "column",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: "-14px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#6366f1",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 16px",
              borderRadius: "999px",
              textTransform: "uppercase"
            }}>
              Más Popular
            </div>

            <h3 style={{ margin: "0 0 8px", fontSize: "20px", color: "#a5b4fc" }}>Pro</h3>
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 20px" }}>Para negocios con alto flujo de envíos diarios.</p>

            <div style={{ fontSize: "36px", fontWeight: "800", marginBottom: "20px" }}>
              $49 <span style={{ fontSize: "14px", fontWeight: "normal", color: "#94a3b8" }}>/ mes</span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Repartidores ilimitados</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Impresión Térmica Directa (58/80mm)</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Avisos automáticos de WhatsApp a clientes</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Exportación de reportes Excel / CSV</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Soporte técnico preferencial</li>
            </ul>

            <button
              onClick={onOpenOnboarding}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "#6366f1",
                color: "#ffffff",
                border: "none",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)"
              }}
            >
              Comenzar Prueba Pro Gratis
            </button>
          </div>

          {/* Plan Enterprise */}
          <div style={{
            backgroundColor: "#1e293b",
            borderRadius: "20px",
            padding: "32px 24px",
            border: "1px solid #334155",
            display: "flex",
            flexDirection: "column"
          }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "20px" }}>Enterprise</h3>
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 20px" }}>Para franquicias, cadenas y multi-sucursales.</p>

            <div style={{ fontSize: "36px", fontWeight: "800", marginBottom: "20px" }}>
              $89 <span style={{ fontSize: "14px", fontWeight: "normal", color: "#94a3b8" }}>/ mes</span>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Múltiples sucursales y locales</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Marca blanca personalizada (Logo propio)</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Sincronización multi-dispositivo en la nube</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}><CheckCircle2 size={18} color="#34d399" /> Asesor dedicado de implementación</li>
            </ul>

            <button
              onClick={onOpenOnboarding}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "#334155",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Contactar para Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "40px 24px",
        borderTop: "1px solid #1e293b",
        color: "#64748b",
        fontSize: "14px"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
          <Truck size={20} color="#818cf8" />
          <span style={{ fontWeight: "700", color: "#f8fafc" }}>LogiExpress SaaS</span>
        </div>
        <p style={{ margin: 0 }}>© 2027 LogiExpress Logistics Platform. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
