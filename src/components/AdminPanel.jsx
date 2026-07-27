import React, { useState } from "react";
import {
  PlusCircle,
  Truck,
  ClipboardList,
  CreditCard,
  DollarSign,
  UserPlus,
  Users,
  MapPin,
  Phone,
  Trash2,
  ShoppingCart,
  UserCheck,
  Shield,
  Tag,
  Boxes,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  RotateCcw
} from "lucide-react";
import { hashPassword } from "../utils/security";

export default function AdminPanel({
  orders,
  couriers,
  clients = [],
  products = [],
  transactions = [],
  adminPasswordHash,
  setAdminPasswordHash,
  storeBase,
  onUpdateStoreBase,
  onRestoreBackup,
  onResetFactory,
  onCreateOrder,
  onCreateClient,
  onDeleteClient,
  onCreateCourier,
  onDeleteCourier,
  onCreateProduct,
  onDeleteProduct,
  onAssignCourier,
  onUpdateStatus
}) {
  const [adminView, setAdminView] = useState("deliveries"); // 'deliveries' | 'clients' | 'couriers' | 'products' | 'settings'

  // --- Base Location State ---
  const [baseNombre, setBaseNombre] = useState(storeBase?.nombre || "Yogur Griego Junín - Base Central");
  const [baseDireccion, setBaseDireccion] = useState(storeBase?.direccion || "Base Central de Despacho");
  const [baseLat, setBaseLat] = useState(storeBase?.lat ? storeBase.lat.toString() : "-34.5833");
  const [baseLng, setBaseLng] = useState(storeBase?.lng ? storeBase.lng.toString() : "-60.9500");
  const [baseMsg, setBaseMsg] = useState("");

  // --- Order Form State ---
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clienteManual, setClienteManual] = useState("");
  const [direccionManual, setDireccionManual] = useState("");
  const [comisionEntrega, setComisionEntrega] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [mensajeroId, setMensajeroId] = useState("");

  // Items/Cart state inside order creation
  const [cartItems, setCartItems] = useState([]);
  const [selectedCatalogProductId, setSelectedCatalogProductId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState("1");
  const [itemPrice, setItemPrice] = useState("");

  // --- Client Form State ---
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaDireccion, setNuevaDireccion] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");

  // --- Courier Form State ---
  const [courierNombre, setCourierNombre] = useState("");
  const [courierAvatar, setCourierAvatar] = useState("");
  const [courierColor, setCourierColor] = useState("#8B5CF6");
  const [courierPinVal, setCourierPinVal] = useState("");

  // --- Product Form State ---
  const [productoNombre, setProductoNombre] = useState("");
  const [productoPrecio, setProductoPrecio] = useState("");

  // --- Settings Form State ---
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passSuccessMsg, setPassSuccessMsg] = useState("");
  const [passErrorMsg, setPassErrorMsg] = useState("");

  // Handle Client Selection in Order Form
  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
    if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setClienteManual(client.nombre);
        setDireccionManual(client.direccion);
      }
    } else {
      setClienteManual("");
      setDireccionManual("");
    }
  };

  // Handle Product Selection in Order Form
  const handleProductCatalogSelect = (productId) => {
    setSelectedCatalogProductId(productId);
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setItemName(product.nombre);
        setItemPrice(product.precio.toString());
      }
    } else {
      setItemName("");
      setItemPrice("");
    }
  };

  // Add Item to Order Cart
  const handleAddItemToCart = (e) => {
    e.preventDefault();
    if (!itemName || !itemQty || !itemPrice) return;

    const newItem = {
      id: `item-${Date.now()}`,
      nombre: itemName,
      cantidad: parseInt(itemQty),
      precio: parseFloat(itemPrice)
    };

    const newCart = [...cartItems, newItem];
    setCartItems(newCart);

    // Reset Item Fields
    setSelectedCatalogProductId("");
    setItemName("");
    setItemQty("1");
    setItemPrice("");

    // Recalculate suggested commission (10% of new total, min 1000, max 3000)
    const newTotal = newCart.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
    const suggested = Math.max(1000, Math.min(3000, Math.round(newTotal * 0.1)));
    setComisionEntrega(suggested.toString());
  };

  // Remove Item from Order Cart
  const handleRemoveItemFromCart = (itemId) => {
    const newCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(newCart);

    // Recalculate suggested commission
    const newTotal = newCart.reduce((sum, item) => sum + item.cantidad * item.precio, 0);
    if (newTotal > 0) {
      const suggested = Math.max(1000, Math.min(3000, Math.round(newTotal * 0.1)));
      setComisionEntrega(suggested.toString());
    } else {
      setComisionEntrega("");
    }
  };

  // Calculate Running Order Total
  const runningTotal = cartItems.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const finalClient = clienteManual.trim() || "Cliente Mostrador";
    const finalAddress = direccionManual.trim() || "Entrega en Local";

    let finalCart = [...cartItems];

    // If cart is empty but user filled out the item name and price, auto-add it
    if (finalCart.length === 0 && itemName.trim() && itemPrice) {
      finalCart.push({
        id: `item-${Date.now()}`,
        nombre: itemName.trim(),
        cantidad: parseInt(itemQty) || 1,
        precio: parseFloat(itemPrice) || 0
      });
    }

    // If still empty, create a default order item
    if (finalCart.length === 0) {
      finalCart.push({
        id: `item-${Date.now()}`,
        nombre: "Pedido de Reparto",
        cantidad: 1,
        precio: 5000
      });
    }

    const totalVal = finalCart.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

    let comisionVal = parseFloat(comisionEntrega);
    if (isNaN(comisionVal) || comisionVal <= 0) {
      comisionVal = Math.max(1000, Math.min(3000, Math.round(totalVal * 0.1))) || 1000;
    }

    let lat, lng;
    if (selectedClientId) {
      const client = clients.find((c) => c.id === selectedClientId);
      if (client) {
        lat = client.lat;
        lng = client.lng;
      }
    }

    if (!lat || !lng) {
      const centerLat = storeBase?.lat || -34.5833;
      const centerLng = storeBase?.lng || -60.9500;
      lat = centerLat + (Math.random() - 0.5) * 0.035;
      lng = centerLng + (Math.random() - 0.5) * 0.035;
    }

    onCreateOrder({
      cliente: finalClient,
      direccion: finalAddress,
      lat,
      lng,
      valor: totalVal,
      comisionEntrega: comisionVal,
      metodoPago: metodoPago || "efectivo",
      mensajeroId: mensajeroId || null,
      articulos: finalCart.map(({ nombre, cantidad, precio }) => ({ nombre, cantidad, precio }))
    });

    // Reset Form
    setSelectedClientId("");
    setClienteManual("");
    setDireccionManual("");
    setCartItems([]);
    setItemName("");
    setItemQty("1");
    setItemPrice("");
    setSelectedCatalogProductId("");
    setComisionEntrega("");
    setMetodoPago("efectivo");
    setMensajeroId("");
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevaDireccion.trim()) return;

    const centerLat = storeBase?.lat || -34.5833;
    const centerLng = storeBase?.lng || -60.9500;
    const lat = centerLat + (Math.random() - 0.5) * 0.035;
    const lng = centerLng + (Math.random() - 0.5) * 0.035;

    onCreateClient({
      nombre: nuevoNombre.trim(),
      direccion: nuevaDireccion.trim(),
      telefono: nuevoTelefono.trim() || "Sin teléfono",
      lat,
      lng
    });

    setNuevoNombre("");
    setNuevaDireccion("");
    setNuevoTelefono("");
  };

  const handleCourierSubmit = async (e) => {
    e.preventDefault();
    if (!courierNombre.trim()) return;

    const rawPin = courierPinVal.trim() || "1234";
    const pinHash = await hashPassword(rawPin);

    let avatarInitials = courierAvatar.trim().toUpperCase().slice(0, 2);
    if (!avatarInitials) {
      avatarInitials =
        courierNombre
          .trim()
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "RP";
    }

    onCreateCourier({
      nombre: courierNombre.trim(),
      avatar: avatarInitials,
      color: courierColor || "#8B5CF6",
      pinHash
    });

    setCourierNombre("");
    setCourierAvatar("");
    setCourierColor("#8B5CF6");
    setCourierPinVal("");
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productoNombre.trim()) return;

    const priceVal = parseFloat(productoPrecio) || 0;

    onCreateProduct({
      nombre: productoNombre.trim(),
      precio: priceVal
    });

    setProductoNombre("");
    setProductoPrecio("");
  };

  const handleUpdateAdminPass = async (e) => {
    e.preventDefault();
    setPassSuccessMsg("");
    setPassErrorMsg("");

    try {
      const oldHash = await hashPassword(oldPass);
      if (oldHash !== adminPasswordHash) {
        setPassErrorMsg("La contraseña actual es incorrecta.");
        return;
      }

      if (newPass !== confirmPass) {
        setPassErrorMsg("La nueva contraseña y la confirmación no coinciden.");
        return;
      }

      if (newPass.length < 4) {
        setPassErrorMsg("La contraseña debe tener al menos 4 caracteres.");
        return;
      }

      const newHash = await hashPassword(newPass);
      setAdminPasswordHash(newHash);
      setPassSuccessMsg("Contraseña de administrador actualizada con éxito.");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");

      setTimeout(() => {
        setPassSuccessMsg("");
      }, 5000);
    } catch (err) {
      console.error(err);
      setPassErrorMsg("Error al procesar el cambio de contraseña.");
    }
  };

  const handleStoreBaseSubmit = (e) => {
    e.preventDefault();
    const latNum = parseFloat(baseLat) || -34.5833;
    const lngNum = parseFloat(baseLng) || -60.9500;

    onUpdateStoreBase({
      nombre: baseNombre.trim() || "Base Central de Despacho",
      direccion: baseDireccion.trim() || "Base Central",
      lat: latNum,
      lng: lngNum
    });

    setBaseMsg("¡Ubicación de Base Central actualizada con éxito!");
    setTimeout(() => setBaseMsg(""), 4000);
  };

  const handleCaptureGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setBaseLat(pos.coords.latitude.toFixed(6));
          setBaseLng(pos.coords.longitude.toFixed(6));
          setBaseMsg("GPS capturado: " + pos.coords.latitude.toFixed(4) + ", " + pos.coords.longitude.toFixed(4));
          setTimeout(() => setBaseMsg(""), 4000);
        },
        () => {
          alert("No se pudo obtener el GPS actual. Ingresa las coordenadas manualmente.");
        }
      );
    } else {
      alert("Tu navegador no soporta geolocalización GPS.");
    }
  const handleDownloadBackup = () => {
    const backupData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      adminPasswordHash,
      couriers,
      clients,
      products,
      orders,
      transactions
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `RapiConta_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.couriers || !data.clients || !data.products) {
          alert("El archivo JSON no es una copia de seguridad válida de RapiConta.");
          return;
        }
        onRestoreBackup(data);
        alert("¡Copia de seguridad restaurada con éxito!");
      } catch (err) {
        alert("Error al leer el archivo JSON de copia de seguridad.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={styles.container}>
      {/* Sub-Navegación Admin */}
      <div style={styles.subTabs}>
        <button
          className="btn"
          style={{
            ...styles.subTabBtn,
            ...(adminView === "deliveries" ? styles.subTabBtnActive : {})
          }}
          onClick={() => setAdminView("deliveries")}
        >
          <Truck size={16} />
          Despachos y Pedidos
        </button>
        <button
          className="btn"
          style={{
            ...styles.subTabBtn,
            ...(adminView === "clients" ? styles.subTabBtnActive : {})
          }}
          onClick={() => setAdminView("clients")}
        >
          <Users size={16} />
          Directorio de Clientes
        </button>
        <button
          className="btn"
          style={{
            ...styles.subTabBtn,
            ...(adminView === "couriers" ? styles.subTabBtnActive : {})
          }}
          onClick={() => setAdminView("couriers")}
        >
          <UserCheck size={16} />
          Gestión de Repartidores
        </button>
        <button
          className="btn"
          style={{
            ...styles.subTabBtn,
            ...(adminView === "products" ? styles.subTabBtnActive : {})
          }}
          onClick={() => setAdminView("products")}
        >
          <Boxes size={16} />
          Catálogo de Productos
        </button>
        <button
          className="btn"
          style={{
            ...styles.subTabBtn,
            ...(adminView === "settings" ? styles.subTabBtnActive : {})
          }}
          onClick={() => setAdminView("settings")}
        >
          <Shield size={16} />
          Configuración
        </button>
      </div>

      {adminView === "deliveries" && (
        <div style={styles.grid} className="animated-fade-in">
          {/* Formulario de Pedido */}
          <div className="glass-card" style={styles.formCard}>
            <div style={styles.cardHeader}>
              <PlusCircle size={20} color="var(--primary)" />
              <h2>Crear Nuevo Pedido</h2>
            </div>
            
            <form onSubmit={handleOrderSubmit} style={styles.form}>
              <div className="form-group">
                <label>Seleccionar Cliente Registrado</label>
                <select
                  className="input-field"
                  value={selectedClientId}
                  onChange={(e) => handleClientSelect(e.target.value)}
                >
                  <option value="">-- Ingreso Manual / Cliente Nuevo --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.direccion})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nombre del Cliente</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Penélope Cruz"
                  value={clienteManual}
                  onChange={(e) => setClienteManual(e.target.value)}
                  disabled={!!selectedClientId}
                />
              </div>

              <div className="form-group">
                <label>Dirección de Entrega</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Calle de Serrano, 45"
                  value={direccionManual}
                  onChange={(e) => setDireccionManual(e.target.value)}
                  disabled={!!selectedClientId}
                />
              </div>

              {/* Seccion Agregar Articulos */}
              <div style={styles.articlesBuilderSection}>
                <label style={styles.builderTitle}>
                  <ShoppingCart size={14} style={{ display: "inline", marginRight: "3px" }} />
                  Artículos del Pedido
                </label>
                
                {/* Dropdown de catalogo de productos */}
                <div className="form-group" style={{ marginBottom: "0.5rem" }}>
                  <select
                    className="input-field"
                    style={{ fontSize: "0.85rem", padding: "0.5rem" }}
                    value={selectedCatalogProductId}
                    onChange={(e) => handleProductCatalogSelect(e.target.value)}
                  >
                    <option value="">-- Cargar desde Catálogo de Productos --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} (${p.precio.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Inputs para un artículo */}
                <div style={styles.inlineForm}>
                  <input
                    type="text"
                    className="input-field"
                    style={{ flex: 2 }}
                    placeholder="Art. (Ej: Pizza)"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    disabled={!!selectedCatalogProductId}
                  />
                  <input
                    type="number"
                    className="input-field"
                    style={{ flex: 0.8 }}
                    placeholder="Cant."
                    value={itemQty}
                    onChange={(e) => setItemQty(e.target.value)}
                    min="1"
                  />
                  <input
                    type="number"
                    className="input-field"
                    style={{ flex: 1.2 }}
                    placeholder="Precio ($)"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    min="0"
                    disabled={!!selectedCatalogProductId}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={styles.addArticleBtn}
                    onClick={handleAddItemToCart}
                  >
                    +
                  </button>
                </div>

                {/* Carrito Temporal */}
                {cartItems.length > 0 ? (
                  <div style={styles.cartBox}>
                    {cartItems.map((item) => (
                      <div key={item.id} style={styles.cartItem}>
                        <span style={styles.cartItemText}>
                          {item.cantidad}x **{item.nombre}** (${item.precio.toLocaleString()} c/u)
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>
                            ${(item.cantidad * item.precio).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            style={styles.trashBtn}
                            onClick={() => handleRemoveItemFromCart(item.id)}
                          >
                            <Trash2 size={13} color="var(--danger)" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div style={styles.cartTotalRow}>
                      <span>Total de Pedido:</span>
                      <span style={styles.cartTotalVal}>${runningTotal.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div style={styles.emptyCartBox}>
                    Sin artículos agregados. Carga desde el catálogo o ingresa manualmente arriba.
                  </div>
                )}
              </div>

              <div style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Comisión de Reparto ($)</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Autocalculado (10%)"
                    value={comisionEntrega}
                    onChange={(e) => setComisionEntrega(e.target.value)}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label>Método de Pago</label>
                  <select
                    className="input-field"
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  >
                    <option value="efectivo">Efectivo (Cobro en mano)</option>
                    <option value="tarjeta">Tarjeta (Cobro online)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Asignar Mensajero</label>
                <select
                  className="input-field"
                  value={mensajeroId}
                  onChange={(e) => setMensajeroId(e.target.value)}
                >
                  <option value="">-- Sin Asignar (Pendiente) --</option>
                  {couriers.map((courier) => (
                    <option key={courier.id} value={courier.id}>
                      {courier.nombre} ({courier.estado === "reparto" ? "En viaje" : "Libre"})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: "1rem", width: "100%", gap: "0.5rem" }}
              >
                <ClipboardList size={18} />
                Despachar Pedido {runningTotal > 0 ? `($${runningTotal.toLocaleString()})` : ""}
              </button>
            </form>
          </div>

          {/* Lista de Pedidos Activos */}
          <div className="glass-card" style={styles.listCard}>
            <div style={styles.cardHeader}>
              <Truck size={20} color="var(--secondary)" />
              <h2>Monitoreo de Entregas Activas</h2>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente / Destino / Artículos</th>
                    <th>Monto / Pago</th>
                    <th>Mensajero</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(o => o.estado !== "entregado" && o.estado !== "cancelado").length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "var(--text-dark)", padding: "2rem" }}>
                        No hay despachos activos en este momento.
                      </td>
                    </tr>
                  ) : (
                    orders
                      .filter(o => o.estado !== "entregado" && o.estado !== "cancelado")
                      .map((order) => {
                        const assignedCourier = couriers.find(c => c.id === order.mensajeroId);
                        const articlesStr = order.articulos
                          ? order.articulos.map(item => `${item.cantidad}x ${item.nombre}`).join(", ")
                          : "Sin artículos";

                        return (
                          <tr key={order.id}>
                            <td style={{ fontWeight: "bold", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                              #{order.id.substring(4) || order.id}
                            </td>
                            <td>
                              <div style={{ fontWeight: "600" }}>{order.cliente}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>{order.direccion}</div>
                              <div style={styles.articlesSummary}>
                                <strong>Items:</strong> {articlesStr}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: "600" }}>${order.valor.toLocaleString()}</div>
                              <div style={styles.paymentMethod}>
                                {order.metodoPago === "efectivo" ? (
                                  <span style={{ color: "var(--success)" }}><DollarSign size={12} style={{ display: "inline" }} /> Efectivo</span>
                                ) : (
                                  <span style={{ color: "var(--secondary)" }}><CreditCard size={12} style={{ display: "inline" }} /> Tarjeta</span>
                                )}
                              </div>
                            </td>
                            <td>
                              {order.mensajeroId ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <span
                                    className="avatar"
                                    style={{ backgroundColor: assignedCourier?.color || "var(--primary)" }}
                                  >
                                    {assignedCourier?.avatar || "??"}
                                  </span>
                                  <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>
                                    {assignedCourier?.nombre.split(" ")[0]}
                                  </span>
                                </div>
                              ) : (
                                <select
                                  style={styles.inlineSelect}
                                  value=""
                                  onChange={(e) => onAssignCourier(order.id, e.target.value)}
                                >
                                  <option value="">Asignar...</option>
                                  {couriers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.nombre.split(" ")[0]} ({c.estado === "reparto" ? "Rep." : "Lib."})
                                    </option>
                                  ))}
                                </select>
                              )}
                            </td>
                            <td>
                              <span className={`badge badge-${order.estado}`}>
                                {order.estado === "pendiente" ? "Pendiente" : "En Viaje"}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "0.4rem" }}>
                                {order.estado === "pendiente" && order.mensajeroId && (
                                  <button
                                    className="btn btn-secondary"
                                    style={styles.actionBtn}
                                    onClick={() => onUpdateStatus(order.id, "en_camino")}
                                    title="Enviar repartidor"
                                  >
                                    Despachar
                                  </button>
                                )}
                                {order.estado === "en_camino" && (
                                  <button
                                    className="btn btn-success"
                                    style={styles.actionBtn}
                                    onClick={() => onUpdateStatus(order.id, "entregado")}
                                    title="Marcar como entregado"
                                  >
                                    Entregar
                                  </button>
                                )}
                                <button
                                  className="btn btn-danger"
                                  style={{ ...styles.actionBtn, padding: "0.3rem 0.5rem" }}
                                  onClick={() => onUpdateStatus(order.id, "cancelado")}
                                  title="Cancelar pedido"
                                >
                                  Anular
                                </button>
                              </div>
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
      )}

      {adminView === "clients" && (
        <div style={styles.grid} className="animated-fade-in">
          {/* Registrar Cliente */}
          <div className="glass-card" style={styles.formCard}>
            <div style={styles.cardHeader}>
              <UserPlus size={20} color="var(--primary)" />
              <h2>Registrar Cliente</h2>
            </div>
            
            <form onSubmit={handleClientSubmit} style={styles.form}>
              <div className="form-group">
                <label>Nombre del Cliente</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Penélope Cruz"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Dirección Principal</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Calle de Serrano, 45"
                  value={nuevaDireccion}
                  onChange={(e) => setNuevaDireccion(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono de Contacto</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. +34 600 999 888"
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  required
                />
              </div>

              <div style={styles.infoAlert}>
                <MapPin size={16} color="var(--primary)" />
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  El sistema generará coordenadas geográficas estables para mostrar a este cliente en el mapa.
                </span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem", width: "100%" }}>
                <UserPlus size={18} />
                Guardar Cliente
              </button>
            </form>
          </div>

          {/* Directorio de Clientes */}
          <div className="glass-card" style={styles.listCard}>
            <div style={styles.cardHeader}>
              <Users size={20} color="var(--secondary)" />
              <h2>Directorio de Clientes Registrados</h2>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Repartos Totales</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "var(--text-dark)", padding: "2rem" }}>
                        No hay clientes registrados en el directorio.
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => {
                      const completedOrdersCount = orders.filter(
                        (o) => o.cliente.toLowerCase() === client.nombre.toLowerCase() && o.estado === "entregado"
                      ).length;

                      const activeOrdersCount = orders.filter(
                        (o) => o.cliente.toLowerCase() === client.nombre.toLowerCase() && (o.estado === "pendiente" || o.estado === "en_camino")
                      ).length;

                      return (
                        <tr key={client.id}>
                          <td style={{ fontWeight: "bold", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            {client.id}
                          </td>
                          <td style={{ fontWeight: "600" }}>{client.nombre}</td>
                          <td>{client.direccion}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem" }}>
                              <Phone size={12} color="var(--text-muted)" />
                              {client.telefono}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                              <span style={{ fontWeight: "bold", color: "var(--success)" }}>
                                {completedOrdersCount} Entregados
                              </span>
                              {activeOrdersCount > 0 && (
                                <span className="badge badge-reparto" style={{ fontSize: "0.65rem" }}>
                                  {activeOrdersCount} activo
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{ padding: "0.25rem 0.5rem" }}
                              onClick={() => {
                                if (window.confirm(`¿Seguro que deseas eliminar al cliente ${client.nombre}?`)) {
                                  onDeleteClient(client.id);
                                }
                              }}
                              title="Eliminar cliente"
                            >
                              <Trash2 size={13} />
                            </button>
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
      )}

      {adminView === "couriers" && (
        <div style={styles.grid} className="animated-fade-in">
          {/* Registrar Repartidor */}
          <div className="glass-card" style={styles.formCard}>
            <div style={styles.cardHeader}>
              <UserPlus size={20} color="var(--primary)" />
              <h2>Registrar Nuevo Repartidor</h2>
            </div>
            
            <form onSubmit={handleCourierSubmit} style={styles.form}>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Juan Pérez"
                  value={courierNombre}
                  onChange={(e) => setCourierNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Iniciales del Avatar (Máx. 2 letras)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. JP"
                  maxLength="2"
                  value={courierAvatar}
                  onChange={(e) => setCourierAvatar(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>PIN de Acceso (4 dígitos)</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Ej. 1234"
                  maxLength="4"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={courierPinVal}
                  onChange={(e) => setCourierPinVal(e.target.value.replace(/[^0-9]/g, ""))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Color del Vehículo (Identificador en Mapa)</label>
                <div style={styles.colorSelectorRow}>
                  {[
                    { hex: "#8B5CF6", name: "Violeta" },
                    { hex: "#EC4899", name: "Rosa" },
                    { hex: "#10B981", name: "Esmeralda" },
                    { hex: "#F59E0B", name: "Ámbar" },
                    { hex: "#00D8F6", name: "Cian" },
                    { hex: "#3B82F6", name: "Azul" }
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      style={{
                        ...styles.colorDotBtn,
                        backgroundColor: c.hex,
                        border: courierColor === c.hex ? "3px solid #fff" : "1px solid rgba(255,255,255,0.15)",
                        boxShadow: courierColor === c.hex ? `0 0 10px ${c.hex}` : "none"
                      }}
                      onClick={() => setCourierColor(c.hex)}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div style={styles.infoAlert}>
                <Shield size={16} color="var(--primary)" />
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  El nuevo repartidor se creará con saldos contables en $0 y comenzará apostado en la Base Central.
                </span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem", width: "100%" }}>
                <UserPlus size={18} />
                Guardar Repartidor
              </button>
            </form>
          </div>

          {/* Listado de Repartidores */}
          <div className="glass-card" style={styles.listCard}>
            <div style={styles.cardHeader}>
              <Users size={20} color="var(--secondary)" />
              <h2>Estado de la Flota de Repartidores</h2>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Nombre</th>
                    <th>PIN</th>
                    <th>Estado</th>
                    <th>Efectivo en Mano</th>
                    <th>Comisión por Cobrar</th>
                    <th>Gastos</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {couriers.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <span
                          className="avatar"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.avatar}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: "600" }}>{c.nombre}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-dark)" }}>ID: {c.id}</div>
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--success)", fontWeight: "600" }}>
                        •••• Cifrado
                      </td>
                      <td>
                        <span className={`badge badge-${c.estado}`}>
                          {c.estado === "libre" ? "Disponible" : c.estado === "reparto" ? "En Reparto" : "Inactivo"}
                        </span>
                      </td>
                      <td style={{ fontWeight: "600", color: "var(--success)" }}>
                        ${c.efectivoEnMano.toLocaleString()}
                      </td>
                      <td style={{ fontWeight: "600", color: "var(--primary-hover)" }}>
                        ${c.comisionAcumulada.toLocaleString()}
                      </td>
                      <td style={{ color: "var(--danger)" }}>
                        ${c.gastosAcumulados.toLocaleString()}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: "0.25rem 0.5rem" }}
                          onClick={() => {
                            if (window.confirm(`¿Seguro que deseas eliminar al repartidor ${c.nombre}?`)) {
                              onDeleteCourier(c.id);
                            }
                          }}
                          title="Eliminar repartidor"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {adminView === "products" && (
        <div style={styles.grid} className="animated-fade-in">
          {/* Registrar Producto */}
          <div className="glass-card" style={styles.formCard}>
            <div style={styles.cardHeader}>
              <PlusCircle size={20} color="var(--primary)" />
              <h2>Registrar Nuevo Producto</h2>
            </div>
            
            <form onSubmit={handleProductSubmit} style={styles.form}>
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Pizza Margarita"
                  value={productoNombre}
                  onChange={(e) => setProductoNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Precio Unitario ($)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Ej. 6000"
                  value={productoPrecio}
                  onChange={(e) => setProductoPrecio(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div style={styles.infoAlert}>
                <Tag size={16} color="var(--primary)" />
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Los productos guardados aparecerán en el selector rápido al armar el carrito de pedidos.
                </span>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem", width: "100%" }}>
                <PlusCircle size={18} />
                Guardar Producto
              </button>
            </form>
          </div>

          {/* Listado de Productos */}
          <div className="glass-card" style={styles.listCard}>
            <div style={styles.cardHeader}>
              <Boxes size={20} color="var(--secondary)" />
              <h2>Catálogo e Inventario de Productos</h2>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre de Artículo</th>
                    <th>Precio de Venta</th>
                    <th>Unidades Vendidas</th>
                    <th>Ingresos Generados</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "var(--text-dark)", padding: "2rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                          <span>Catálogo de productos vacío. Registra un producto a la izquierda o restablece los datos iniciales.</span>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ fontSize: "0.82rem", gap: "0.4rem" }}
                            onClick={onResetFactory}
                          >
                            <RotateCcw size={15} />
                            Restablecer Datos de Fábrica (Recuperar Yogur y Catálogo)
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => {
                      // Sum quantities of this product in delivered orders
                      const unitsSold = orders
                        .filter((o) => o.estado === "entregado")
                        .flatMap((o) => o.articulos || [])
                        .filter((item) => item.nombre.toLowerCase() === p.nombre.toLowerCase())
                        .reduce((sum, item) => sum + item.cantidad, 0);

                      const totalRevenue = unitsSold * p.precio;

                      return (
                        <tr key={p.id}>
                          <td style={{ fontWeight: "bold", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            {p.id}
                          </td>
                          <td style={{ fontWeight: "600" }}>{p.nombre}</td>
                          <td style={{ fontWeight: "600", color: "#fff" }}>
                            ${p.precio.toLocaleString()}
                          </td>
                          <td>
                            <span style={{ fontWeight: "bold", color: unitsSold > 0 ? "var(--success)" : "var(--text-dark)" }}>
                              {unitsSold} uds.
                            </span>
                          </td>
                          <td style={{ fontWeight: "700", color: totalRevenue > 0 ? "var(--primary-hover)" : "var(--text-dark)" }}>
                            ${totalRevenue.toLocaleString()}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{ padding: "0.25rem 0.5rem" }}
                              onClick={() => {
                                if (window.confirm(`¿Seguro que deseas eliminar el producto ${p.nombre}?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              title="Eliminar producto"
                            >
                              <Trash2 size={13} />
                            </button>
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
      )}

      {adminView === "settings" && (
        <div style={styles.grid} className="animated-fade-in">
          {/* Configuración de Punto de Base Central */}
          <div className="glass-card" style={styles.formCard}>
            <div style={styles.cardHeader}>
              <MapPin size={20} color="var(--primary)" />
              <h2>Punto de Base Central (Origen de Salida)</h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Define el punto exacto en Google Maps desde el cual parten todos los repartidores y pedidos.
            </p>

            {baseMsg && (
              <div style={{ ...styles.infoAlert, background: "var(--success-bg)", borderColor: "rgba(16, 185, 129, 0.2)", marginBottom: "1rem" }}>
                <CheckCircle size={16} style={{ color: "var(--success)" }} />
                <span style={{ color: "var(--success)", fontSize: "0.85rem", fontWeight: "600" }}>{baseMsg}</span>
              </div>
            )}

            <form onSubmit={handleStoreBaseSubmit} style={styles.form}>
              <div className="form-group">
                <label>Nombre del Local / Base</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Yogur Griego Junín - Central"
                  value={baseNombre}
                  onChange={(e) => setBaseNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Dirección Física de la Base</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej. Av. San Martín 150, Junín"
                  value={baseDireccion}
                  onChange={(e) => setBaseDireccion(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Latitud GPS</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="-34.5833"
                    value={baseLat}
                    onChange={(e) => setBaseLat(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Longitud GPS</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="-60.9500"
                    value={baseLng}
                    onChange={(e) => setBaseLng(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: "100%", gap: "0.5rem", justifyContent: "center" }}
                onClick={handleCaptureGPS}
              >
                <MapPin size={16} color="var(--primary)" />
                📍 Usar Mi Ubicación Actual (GPS)
              </button>

              <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem", width: "100%", gap: "0.5rem" }}>
                <CheckCircle size={16} />
                Guardar Punto de Base Central
              </button>
            </form>
          </div>
          {/* Cambiar Contraseña */}
          <div className="glass-card" style={styles.formCard}>
            <div style={styles.cardHeader}>
              <Shield size={20} color="var(--primary)" />
              <h2>Seguridad del Administrador</h2>
            </div>

            {passSuccessMsg && (
              <div style={{ ...styles.infoAlert, background: "var(--success-bg)", borderColor: "rgba(16, 185, 129, 0.2)" }} className="animated-fade-in">
                <CheckCircle size={16} style={{ color: "var(--success)" }} />
                <span style={{ color: "var(--success)", fontSize: "0.85rem", fontWeight: "600", marginLeft: "0.25rem" }}>{passSuccessMsg}</span>
              </div>
            )}

            {passErrorMsg && (
              <div style={{ ...styles.infoAlert, background: "var(--danger-bg)", borderColor: "rgba(239, 68, 68, 0.2)" }} className="animated-fade-in">
                <AlertCircle size={16} style={{ color: "var(--danger)" }} />
                <span style={{ color: "var(--danger)", fontSize: "0.85rem", fontWeight: "600", marginLeft: "0.25rem" }}>{passErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateAdminPass} style={styles.form}>
              <div className="form-group">
                <label>Contraseña Actual</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Introduce contraseña actual..."
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Introduce nueva contraseña..."
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Repite nueva contraseña..."
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem", width: "100%", gap: "0.5rem" }}>
                <Shield size={16} />
                Actualizar Contraseña Admin
              </button>
            </form>
          </div>

          {/* Backup y Restauración */}
          <div className="glass-card" style={styles.listCard}>
            <div style={styles.cardHeader}>
              <Download size={20} color="var(--primary)" />
              <h2>Copia de Seguridad y Restauración</h2>
            </div>
            <p style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
              Exporta una copia completa de tu base de datos (pedidos, clientes, repartidores, catálogo y finanzas) en formato JSON para guardarla en tu computadora o migrar a otro dispositivo.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%", gap: "0.5rem", justifyContent: "center" }}
                onClick={handleDownloadBackup}
              >
                <Download size={16} />
                Descargar Copia de Seguridad (Backup JSON)
              </button>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#fff", display: "block", marginBottom: "0.5rem" }}>
                  Restaurar desde Archivo (.json):
                </label>
                <input
                  type="file"
                  accept=".json"
                  className="input-field"
                  style={{ fontSize: "0.85rem" }}
                  onChange={handleFileRestore}
                />
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ width: "100%", gap: "0.5rem", justifyContent: "center" }}
                  onClick={onResetFactory}
                >
                  <RotateCcw size={16} />
                  Restablecer Datos a Valores de Fábrica
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  },
  subTabs: {
    display: "flex",
    gap: "0.75rem",
    background: "rgba(255, 255, 255, 0.02)",
    padding: "0.4rem",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    width: "fit-content"
  },
  subTabBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    padding: "0.4rem 1rem",
    fontSize: "0.85rem",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem"
  },
  subTabBtnActive: {
    background: "rgba(255, 255, 255, 0.06)",
    color: "#fff",
    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1)"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.6fr",
    gap: "2rem",
    alignItems: "start"
  },
  formCard: {
    padding: "1.5rem"
  },
  listCard: {
    padding: "1.5rem"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "1.5rem",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "0.75rem"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  row: {
    display: "flex",
    gap: "1rem"
  },
  paymentMethod: {
    fontSize: "0.75rem",
    marginTop: "0.15rem",
    fontWeight: "500"
  },
  inlineSelect: {
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    border: "1px solid var(--border-color)",
    borderRadius: "6px",
    padding: "0.3rem 0.5rem",
    fontSize: "0.8rem",
    outline: "none",
    fontFamily: "var(--font-sans)",
    cursor: "pointer"
  },
  actionBtn: {
    padding: "0.3rem 0.75rem",
    fontSize: "0.8rem",
    borderRadius: "6px"
  },
  infoAlert: {
    display: "flex",
    gap: "0.5rem",
    background: "var(--bg-accent)",
    padding: "0.75rem",
    borderRadius: "10px",
    border: "1px solid rgba(139, 92, 246, 0.2)",
    marginTop: "0.5rem",
    marginBottom: "1rem",
    alignItems: "center"
  },
  articlesBuilderSection: {
    background: "rgba(255,255,255,0.01)",
    border: "1px solid var(--border-color)",
    padding: "1rem",
    borderRadius: "12px",
    marginBottom: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem"
  },
  builderTitle: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "var(--text-muted)",
    display: "flex",
    alignItems: "center"
  },
  inlineForm: {
    display: "flex",
    gap: "0.5rem"
  },
  addArticleBtn: {
    padding: "0 0.8rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border-color)",
    color: "#fff"
  },
  cartBox: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    background: "rgba(0, 0, 0, 0.2)",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.03)"
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.82rem",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    paddingBottom: "0.4rem"
  },
  cartItemText: {
    color: "var(--text-main)"
  },
  trashBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.2rem"
  },
  cartTotalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: "0.9rem",
    marginTop: "0.25rem",
    color: "#fff"
  },
  cartTotalVal: {
    color: "var(--primary-hover)"
  },
  emptyCartBox: {
    fontSize: "0.78rem",
    color: "var(--text-dark)",
    textAlign: "center",
    padding: "1rem",
    border: "1px dashed var(--border-color)",
    borderRadius: "8px"
  },
  articlesSummary: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    background: "rgba(255, 255, 255, 0.02)",
    padding: "0.25rem 0.5rem",
    borderRadius: "6px",
    display: "inline-block",
    marginTop: "0.15rem",
    border: "1px solid rgba(255,255,255,0.03)"
  },
  colorSelectorRow: {
    display: "flex",
    gap: "0.6rem",
    marginTop: "0.25rem"
  },
  colorDotBtn: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "var(--transition-smooth)"
  }
};

// Responsive overrides for layout grid
if (typeof window !== "undefined" && window.innerWidth <= 1024) {
  styles.grid = {
    display: "flex",
    flexDirection: "column",
    gap: "2rem"
  };
}
