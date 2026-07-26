import React, { useEffect, useRef, useState } from "react";
import { TIENDA_BASE } from "../utils/mockData";
import { Navigation, MapPin, Store } from "lucide-react";

export default function SimulatedMap({ couriers, orders, setCouriers, storeBase }) {
  const canvasRef = useRef(null);
  const [hoveredEntity, setHoveredEntity] = useState(null);

  const activeBase = storeBase || TIENDA_BASE;

  // Dynamic Map boundaries centered around custom store base
  const minLat = activeBase.lat - 0.02;
  const maxLat = activeBase.lat + 0.02;
  const minLng = activeBase.lng - 0.02;
  const maxLng = activeBase.lng + 0.02;

  // Convert lat/lng to canvas X/Y
  const getCanvasCoords = (lat, lng, width, height) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    // Flip Y because canvas origin is top-left, and higher latitude is north (upwards)
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
    return { x, y };
  };

  useEffect(() => {
    let animationId;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Simulation loop
    const animate = () => {
      // Clear canvas with a dark grid pattern
      ctx.fillStyle = "#0c0f16";
      ctx.fillRect(0, 0, width, height);

      // Draw futuristic grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw stylized city "roads" (neon tracks)
      ctx.strokeStyle = "rgba(139, 92, 246, 0.05)";
      ctx.lineWidth = 2;
      // Let's draw some roads centered at the hub
      const hubCoords = getCanvasCoords(TIENDA_BASE.lat, TIENDA_BASE.lng, width, height);
      
      // Radial ring roads
      ctx.beginPath();
      ctx.arc(hubCoords.x, hubCoords.y, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hubCoords.x, hubCoords.y, 160, 0, Math.PI * 2);
      ctx.stroke();

      // Main cross roads
      ctx.beginPath();
      ctx.moveTo(0, hubCoords.y);
      ctx.lineTo(width, hubCoords.y);
      ctx.moveTo(hubCoords.x, 0);
      ctx.lineTo(hubCoords.x, height);
      ctx.stroke();

      // Draw active delivery destinations and paths
      orders.forEach((order) => {
        if (order.estado === "en_camino" || order.estado === "pendiente") {
          const destCoords = getCanvasCoords(order.lat, order.lng, width, height);
          
          // Draw delivery path if courier is assigned
          if (order.mensajeroId && order.estado === "en_camino") {
            const courier = couriers.find(c => c.id === order.mensajeroId);
            if (courier) {
              ctx.setLineDash([4, 6]);
              ctx.strokeStyle = courier.color + "77"; // semi-transparent
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(hubCoords.x, hubCoords.y);
              ctx.lineTo(destCoords.x, destCoords.y);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }

          // Draw target node (destination)
          ctx.beginPath();
          ctx.arc(destCoords.x, destCoords.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = order.estado === "en_camino" ? "rgba(139, 92, 246, 0.2)" : "rgba(245, 158, 11, 0.2)";
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(destCoords.x, destCoords.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = order.estado === "en_camino" ? "#8b5cf6" : "#f59e0b";
          ctx.fill();
        }
      });

      // Draw Tienda Base (Central Dispatch Hub)
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(139, 92, 246, 0.5)";
      ctx.beginPath();
      ctx.arc(hubCoords.x, hubCoords.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#8b5cf6";
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(hubCoords.x, hubCoords.y, 6, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Couriers and animate their movement towards targets
      let updatedCouriers = [];
      let stateChanged = false;

      couriers.forEach((courier) => {
        let currentLat = courier.lat;
        let currentLng = courier.lng;

        // If the courier is out on delivery ("reparto"), they should move towards their order destination
        const activeOrder = orders.find(o => o.mensajeroId === courier.id && o.estado === "en_camino");
        
        if (activeOrder) {
          const targetLat = activeOrder.lat;
          const targetLng = activeOrder.lng;
          
          // Distance in lat/lng
          const dLat = targetLat - currentLat;
          const dLng = targetLng - currentLng;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);

          // If they haven't arrived, move them closer
          if (dist > 0.0001) {
            // Speed factor
            const speed = 0.00018; 
            currentLat += (dLat / dist) * speed;
            currentLng += (dLng / dist) * speed;
            stateChanged = true;
          }
        } else {
          // If they have no active delivery, they head back to the central hub
          const dLat = TIENDA_BASE.lat - currentLat;
          const dLng = TIENDA_BASE.lng - currentLng;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);
          if (dist > 0.0001) {
            const speed = 0.00012;
            currentLat += (dLat / dist) * speed;
            currentLng += (dLng / dist) * speed;
            stateChanged = true;
          }
        }

        const coords = getCanvasCoords(currentLat, currentLng, width, height);

        // Draw Courier Marker
        ctx.shadowBlur = 10;
        ctx.shadowColor = courier.color;
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = courier.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 8, 0, Math.PI * 2);
        ctx.stroke();

        // Draw avatar initials text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(courier.avatar, coords.x, coords.y);

        updatedCouriers.push({
          ...courier,
          lat: currentLat,
          lng: currentLng
        });
      });

      // Avoid infinite triggers in React, only update parent state occasionally when positions change
      if (stateChanged && typeof setCouriers === "function") {
        setCouriers(updatedCouriers);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [couriers, orders, setCouriers]);

  return (
    <div className="glass-card" style={styles.container}>
      <div style={styles.cardHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Navigation size={20} color="var(--primary)" />
          <h3>Mapa de Despachos en Vivo</h3>
        </div>
        <div style={styles.statusChips}>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${TIENDA_BASE.lat},${TIENDA_BASE.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...styles.chip,
              color: "#60A5FA",
              borderColor: "rgba(59, 130, 246, 0.3)",
              background: "rgba(59, 130, 246, 0.1)",
              textDecoration: "none",
              fontWeight: "600"
            }}
          >
            <MapPin size={12} color="#60A5FA" /> Google Maps
          </a>
          <span style={styles.chip}><span style={{ ...styles.dot, backgroundColor: "#8b5cf6" }} /> Base Central</span>
          <span style={styles.chip}><span style={{ ...styles.dot, backgroundColor: "#f59e0b" }} /> Pendientes</span>
        </div>
      </div>
      
      <div className="map-canvas-container">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        
        <div className="map-legend">
          <div className="legend-item">
            <Store size={12} color="#8b5cf6" />
            <span>Tienda Central</span>
          </div>
          {couriers.map(c => (
            <div key={c.id} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: c.color }} />
              <span>{c.nombre} ({c.estado === "reparto" ? "En viaje" : "Libre"})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  statusChips: {
    display: "flex",
    gap: "0.8rem"
  },
  chip: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    background: "rgba(255,255,255,0.03)",
    padding: "0.25rem 0.6rem",
    borderRadius: "6px",
    border: "1px solid var(--border-color)"
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%"
  }
};
