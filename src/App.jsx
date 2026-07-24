import React, { useState } from "react";
import Navbar from "./components/Navbar";
import SimulatedMap from "./components/SimulatedMap";
import AdminPanel from "./components/AdminPanel";
import CourierPanel from "./components/CourierPanel";
import AccountingPanel from "./components/AccountingPanel";
import LoginScreen from "./components/LoginScreen";

import {
  INITIAL_PRODUCTOS,
  INITIAL_CLIENTES,
  INITIAL_MENSAJEROS,
  INITIAL_PEDIDOS,
  INITIAL_TRANSACCIONES,
  TIENDA_BASE
} from "./utils/mockData";

export default function App() {
  const [userRole, setUserRole] = useState(null); // 'admin' | 'courier' | null
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [activeTab, setActiveTab] = useState("admin");
  const [couriers, setCouriers] = useState(INITIAL_MENSAJEROS);
  const [clients, setClients] = useState(INITIAL_CLIENTES);
  const [products, setProducts] = useState(INITIAL_PRODUCTOS);
  const [orders, setOrders] = useState(INITIAL_PEDIDOS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACCIONES);
  
  // Track selected courier for courier simulator view
  const [selectedCourierId, setSelectedCourierId] = useState(INITIAL_MENSAJEROS[0].id);

  const selectedCourier = couriers.find((c) => c.id === selectedCourierId);
  const setSelectedCourier = (courier) => setSelectedCourierId(courier.id);

  // Helper to check if a courier has other deliveries currently in progress
  const hasActiveDeliveries = (courierId, excludeOrderId = null) => {
    return orders.some(
      (o) =>
        o.mensajeroId === courierId &&
        o.id !== excludeOrderId &&
        o.estado === "en_camino"
    );
  };

  // 0. Create a new client
  const handleCreateClient = (newClient) => {
    const clientId = `c-${Date.now().toString().slice(-4)}`;
    const client = {
      id: clientId,
      ...newClient
    };
    setClients((prev) => [...prev, client]);
  };

  // 0b. Create a new courier (repartidor)
  const handleCreateCourier = (newCourier) => {
    const courierId = `m-${Date.now().toString().slice(-4)}`;
    const courier = {
      id: courierId,
      nombre: newCourier.nombre,
      avatar: newCourier.avatar,
      color: newCourier.color,
      pin: newCourier.pin || "1234",
      estado: "libre",
      comisionAcumulada: 0,
      efectivoEnMano: 0,
      gastosAcumulados: 0,
      lat: TIENDA_BASE.lat,
      lng: TIENDA_BASE.lng
    };
    setCouriers((prev) => [...prev, courier]);
  };

  const handleDeleteCourier = (courierId) => {
    setCouriers((prev) => prev.filter((c) => c.id !== courierId));
  };

  // 0c. Create a new product (artículo de catálogo)
  const handleCreateProduct = (newProduct) => {
    const productId = `p-${Date.now().toString().slice(-4)}`;
    const product = {
      id: productId,
      ...newProduct
    };
    setProducts((prev) => [...prev, product]);
  };

  // 1. Create a new delivery order
  const handleCreateOrder = (newOrder) => {
    const orderId = `ped-${Date.now().toString().slice(-4)}`;
    const order = {
      id: orderId,
      ...newOrder,
      estado: newOrder.mensajeroId ? "pendiente" : "pendiente", // Starts as pending dispatch
      fecha: new Date().toISOString()
    };

    setOrders((prev) => [...prev, order]);

    // If a courier was assigned, update their status if they are not already in delivery
    if (order.mensajeroId) {
      setCouriers((prevCouriers) =>
        prevCouriers.map((c) => {
          if (c.id === order.mensajeroId) {
            // Keep "libre" until order starts its delivery journey ("en_camino"), 
            // or put them in "reparto" if we decide to assign immediately. 
            // We'll follow: status = 'reparto' when order is 'en_camino'
            return c;
          }
          return c;
        })
      );
    }
  };

  // 2. Assign courier to an existing order
  const handleAssignCourier = (orderId, courierId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, mensajeroId: courierId } : o))
    );
  };

  // 3. Update order delivery status and calculate accounting values
  const handleUpdateStatus = (orderId, nextStatus) => {
    let orderToUpdate = orders.find((o) => o.id === orderId);
    if (!orderToUpdate) return;

    const courierId = orderToUpdate.mensajeroId;
    const courier = couriers.find((c) => c.id === courierId);

    // Update order status
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? { ...o, estado: nextStatus } : o))
    );

    // Handle courier status and accounting triggers
    if (nextStatus === "en_camino" && courierId) {
      // Courier is now on dispatch duty
      setCouriers((prevCouriers) =>
        prevCouriers.map((c) =>
          c.id === courierId ? { ...c, estado: "reparto" } : c
        )
      );
    } 
    else if (nextStatus === "entregado" && courierId) {
      // Order completed successfully! Execute financials:
      const val = orderToUpdate.valor;
      const comm = orderToUpdate.comisionEntrega;
      const paymentMethod = orderToUpdate.metodoPago;

      // Update Courier financial balances
      setCouriers((prevCouriers) =>
        prevCouriers.map((c) => {
          if (c.id === courierId) {
            // 1. If cash, courier collects full amount (price + commission) in hand
            const cashIncrement = paymentMethod === "efectivo" ? val : 0;
            // 2. Courier earns the commission
            const newComision = c.comisionAcumulada + comm;
            
            // Check if they have other active orders, if not they go back to 'libre'
            const isStillBusy = hasActiveDeliveries(courierId, orderId);
            const nextCourierStatus = isStillBusy ? "reparto" : "libre";

            return {
              ...c,
              comisionAcumulada: newComision,
              efectivoEnMano: c.efectivoEnMano + cashIncrement,
              estado: nextCourierStatus
            };
          }
          return c;
        })
      );

      // Create Ledger transactions:
      const newTransactions = [];
      const txTimestamp = new Date().toISOString();

      if (paymentMethod === "efectivo") {
        // Cash payment collected by courier, pending store settlement
        newTransactions.push({
          id: `tx-${Date.now().toString().slice(-4)}-a`,
          tipo: "ingreso_tienda",
          monto: val,
          descripcion: `Venta Pedido #${orderId.substring(4)} (Efectivo cobrado por ${courier?.nombre || 'mensajero'})`,
          fecha: txTimestamp,
          mensajeroId: courierId
        });
      } else {
        // Card payment goes directly to shop vault
        newTransactions.push({
          id: `tx-${Date.now().toString().slice(-4)}-a`,
          tipo: "ingreso_tienda",
          monto: val,
          descripcion: `Venta Pedido #${orderId.substring(4)} (Pago tarjeta online)`,
          fecha: txTimestamp,
          mensajeroId: courierId
        });
      }

      // Record commission liability
      newTransactions.push({
        id: `tx-${Date.now().toString().slice(-4)}-b`,
        tipo: "pago_comision",
        monto: -comm,
        descripcion: `Comisión devengada por entrega #${orderId.substring(4)}`,
        fecha: txTimestamp,
        mensajeroId: courierId
      });

      setTransactions((prev) => [...prev, ...newTransactions]);
    } 
    else if (nextStatus === "cancelado") {
      // Order cancelled
      if (courierId) {
        setCouriers((prevCouriers) =>
          prevCouriers.map((c) => {
            if (c.id === courierId) {
              const isStillBusy = hasActiveDeliveries(courierId, orderId);
              return { ...c, estado: isStillBusy ? "reparto" : "libre" };
            }
            return c;
          })
        );
      }
    }
  };

  // 4. Log travel expense from courier view
  const handleAddExpense = (courierId, amount, description) => {
    const courier = couriers.find((c) => c.id === courierId);
    if (!courier) return;

    // Update Courier Balances (Expenses reduce their net payout/commission in ledger)
    setCouriers((prevCouriers) =>
      prevCouriers.map((c) => {
        if (c.id === courierId) {
          return {
            ...c,
            gastosAcumulados: c.gastosAcumulados + amount,
            comisionAcumulada: c.comisionAcumulada - amount // Direct deduction
          };
        }
        return c;
      })
    );

    // Record expense in general transactions
    const txId = `tx-exp-${Date.now().toString().slice(-3)}`;
    setTransactions((prev) => [
      ...prev,
      {
        id: txId,
        tipo: "gasto_combustible",
        monto: -amount,
        descripcion: `Gasto: ${description} - ${courier.nombre}`,
        fecha: new Date().toISOString(),
        mensajeroId: courierId
      }
    ]);
  };

  // 5. Reconcile / Settle boxes (Liquidación de caja)
  const handleSettleCourier = (courierId) => {
    const courier = couriers.find((c) => c.id === courierId);
    if (!courier) return;

    const cash = courier.efectivoEnMano;
    const comm = courier.comisionAcumulada;
    
    // Net cash exchange: what courier pays the shop
    // Courier held 'cash' from sales. Courier is owed 'comm' in commission.
    // Courier hands over 'cash - comm' to the shop.
    // If negative, shop pays courier.
    const netExchange = cash - comm;

    // Log settlement transaction
    const txId = `tx-liq-${Date.now().toString().slice(-3)}`;
    setTransactions((prev) => [
      ...prev,
      {
        id: txId,
        tipo: "liquidacion_caja",
        monto: netExchange, // Positive if shop receives cash, negative if shop pays out
        descripcion: `Liquidación de Caja - ${courier.nombre} (Entregado: $${cash} / Comisiones: $${comm})`,
        fecha: new Date().toISOString(),
        mensajeroId: courierId
      }
    ]);

    // Reset balances for courier
    setCouriers((prevCouriers) =>
      prevCouriers.map((c) => {
        if (c.id === courierId) {
          return {
            ...c,
            efectivoEnMano: 0,
            comisionAcumulada: 0,
            gastosAcumulados: 0
          };
        }
        return c;
      })
    );
  };

  const handleLogin = (role, courierId = null) => {
    setUserRole(role);
    if (role === "courier" && courierId) {
      setSelectedCourierId(courierId);
      setActiveTab("courier");
    } else if (role === "admin") {
      setActiveTab("admin");
    }
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  const handleChangeCourierPin = (courierId, newPin) => {
    setCouriers((prev) =>
      prev.map((c) => (c.id === courierId ? { ...c, pin: newPin } : c))
    );
  };

  if (userRole === null) {
    return (
      <LoginScreen
        couriers={couriers}
        adminPassword={adminPassword}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="app-container">
      <Navbar
        userRole={userRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCourier={selectedCourier}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {/* Render Map permanently above panels or as part of layouts for premium dashboard feeling */}
        <SimulatedMap
          couriers={couriers}
          orders={orders}
          setCouriers={setCouriers}
        />

        {userRole === "admin" && activeTab === "admin" && (
          <AdminPanel
            orders={orders}
            couriers={couriers}
            clients={clients}
            products={products}
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
            onCreateOrder={handleCreateOrder}
            onCreateClient={handleCreateClient}
            onCreateCourier={handleCreateCourier}
            onDeleteCourier={handleDeleteCourier}
            onCreateProduct={handleCreateProduct}
            onAssignCourier={handleAssignCourier}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {userRole === "courier" && (
          <CourierPanel
            selectedCourier={selectedCourier}
            orders={orders}
            onUpdateStatus={handleUpdateStatus}
            onAddExpense={handleAddExpense}
            onChangePin={handleChangeCourierPin}
          />
        )}

        {userRole === "admin" && activeTab === "accounting" && (
          <AccountingPanel
            orders={orders}
            couriers={couriers}
            transactions={transactions}
            onSettleCourier={handleSettleCourier}
          />
        )}
      </main>
    </div>
  );
}
