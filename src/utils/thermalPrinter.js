/**
 * Thermal Printer Utility for Logistics Dispatch Tickets (ESC/POS & Web Print API)
 */

export function generateThermalTicketText(pedido, tienda = {}) {
  const lineChar58 = 32;
  const lineChar80 = 48;
  const divider58 = "-".repeat(lineChar58);
  const divider80 = "-".repeat(lineChar80);

  const fechaFormat = pedido.fecha
    ? new Date(pedido.fecha).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : new Date().toLocaleString("es-ES");

  const tiendaNombre = tienda.nombre || "LOGISTICA DE REPARTOS";
  const tiendaDir = tienda.direccion || "Despacho Central";

  let ticketText = `
================================
  ${tiendaNombre.toUpperCase()}
  ${tiendaDir}
================================
TICKET DE DESPACHO / PEDIDO
ID: #${pedido.id}
FECHA: ${fechaFormat}
--------------------------------
CLIENTE: ${pedido.cliente}
DIRECCION: ${pedido.direccion}
TELEFONO: ${pedido.telefono || "N/A"}
--------------------------------
REPARTIDOR: ${pedido.mensajeroNombre || "Sin asignar"}
ESTADO: ${pedido.estado ? pedido.estado.toUpperCase() : "PENDIENTE"}
METODO PAGO: ${(pedido.metodoPago || "efectivo").toUpperCase()}
--------------------------------
ARTICULOS:
`;

  if (Array.isArray(pedido.articulos) && pedido.articulos.length > 0) {
    pedido.articulos.forEach((art) => {
      const cant = art.cantidad || 1;
      const subtotal = (art.precio || 0) * cant;
      ticketText += `${cant}x ${art.nombre}\n   $${subtotal.toLocaleString("es-ES")}\n`;
    });
  } else {
    ticketText += `1x Servicio de Despacho\n   $${(pedido.valor || 0).toLocaleString("es-ES")}\n`;
  }

  ticketText += `--------------------------------
VALOR PEDIDO:     $${(pedido.valor || 0).toLocaleString("es-ES")}
ENVIO / COMISION: $${(pedido.comisionEntrega || 0).toLocaleString("es-ES")}
TOTAL A COBRAR:   $${((pedido.valor || 0) + (pedido.metodoPago === 'efectivo' ? 0 : 0)).toLocaleString("es-ES")}
================================
  ¡Gracias por su preferencia!
  Powered by LogiExpress SaaS
================================
\n\n`;

  return ticketText;
}

export function printThermalReceipt(pedido, tienda = {}, width = "58mm") {
  const printWindow = window.open("", "_blank", "width=400,height=600");
  if (!printWindow) {
    alert("Por favor permite las ventanas emergentes (popups) para imprimir el ticket.");
    return;
  }

  const fechaFormat = pedido.fecha
    ? new Date(pedido.fecha).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : new Date().toLocaleString("es-ES");

  const tiendaNombre = tienda.nombre || "LOGISTICA DE REPARTOS";
  const tiendaDir = tienda.direccion || "Despacho Central";

  const articulosHTML = Array.isArray(pedido.articulos) && pedido.articulos.length > 0
    ? pedido.articulos.map(art => `
        <tr>
          <td>${art.cantidad}x ${art.nombre}</td>
          <td style="text-align: right;">$${((art.precio || 0) * art.cantidad).toLocaleString("es-ES")}</td>
        </tr>
      `).join("")
    : `<tr><td>1x Servicio Despacho</td><td style="text-align: right;">$${(pedido.valor || 0).toLocaleString("es-ES")}</td></tr>`;

  const receiptContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ticket #${pedido.id}</title>
      <style>
        @page {
          size: ${width === "80mm" ? "80mm" : "58mm"} auto;
          margin: 0;
        }
        body {
          font-family: 'Courier New', Courier, monospace;
          width: ${width === "80mm" ? "76mm" : "54mm"};
          margin: 0 auto;
          padding: 8px 4px;
          font-size: ${width === "80mm" ? "13px" : "11px"};
          line-height: 1.3;
          color: #000;
          background: #fff;
        }
        .header {
          text-align: center;
          font-weight: bold;
          border-bottom: 1px dashed #000;
          padding-bottom: 6px;
          margin-bottom: 6px;
        }
        .title {
          font-size: 1.2em;
          text-transform: uppercase;
        }
        .subtitle {
          font-size: 0.85em;
          font-weight: normal;
        }
        .section {
          border-bottom: 1px dashed #000;
          padding: 6px 0;
        }
        .row {
          display: flex;
          justify-content: space-between;
          margin: 2px 0;
        }
        .bold {
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 4px 0;
        }
        td {
          padding: 2px 0;
          vertical-align: top;
        }
        .total-box {
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
          margin-top: 6px;
          padding: 6px 0;
          text-align: right;
          font-size: 1.2em;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 10px;
          font-size: 0.85em;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${tiendaNombre}</div>
        <div class="subtitle">${tiendaDir}</div>
      </div>

      <div class="section">
        <div><strong>TICKET DE DESPACHO #${pedido.id}</strong></div>
        <div>Fecha: ${fechaFormat}</div>
      </div>

      <div class="section">
        <div><strong>CLIENTE:</strong> ${pedido.cliente}</div>
        <div><strong>DIRECCION:</strong> ${pedido.direccion}</div>
        ${pedido.telefono ? `<div><strong>TEL:</strong> ${pedido.telefono}</div>` : ""}
      </div>

      <div class="section">
        <div><strong>REPARTIDOR:</strong> ${pedido.mensajeroNombre || "Sin Asignar"}</div>
        <div><strong>METODO PAGO:</strong> ${(pedido.metodoPago || "efectivo").toUpperCase()}</div>
      </div>

      <div class="section">
        <div><strong>DETALLE DEL PEDIDO:</strong></div>
        <table>
          ${articulosHTML}
        </table>
      </div>

      <div class="row">
        <span>Valor Productos:</span>
        <span>$${(pedido.valor || 0).toLocaleString("es-ES")}</span>
      </div>
      <div class="row">
        <span>Costo de Envío:</span>
        <span>$${(pedido.comisionEntrega || 0).toLocaleString("es-ES")}</span>
      </div>

      <div class="total-box">
        TOTAL: $${((pedido.valor || 0) + (pedido.metodoPago === 'efectivo' ? 0 : 0)).toLocaleString("es-ES")}
      </div>

      <div class="footer">
        <div>¡Gracias por tu compra!</div>
        <div>Software LogiExpress SaaS</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(receiptContent);
  printWindow.document.close();
}
