import React, { useState, useEffect, useRef } from "react";
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

import { DEFAULT_ADMIN_HASH } from "./utils/security";
import { fetchStoreFromCloud, pushStoreToCloud, DEFAULT_CLOUD_BLOB_ID } from "./utils/cloudSync";

export default function App() {
  const [userRole, setUserRole] = useState(() => {
    try {
      return localStorage.getItem("rapiconta_user_role") || null;
    } catch (e) {
      return null;
    }
  });
  const [adminPasswordHash, setAdminPasswordHash] = useState(() => {
    return localStorage.getItem("rapiconta_admin_pass_hash") || DEFAULT_ADMIN_HASH;
  });
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem("rapiconta_active_tab") || "admin";
    } catch (e) {
      return "admin";
    }
  });

  const [couriers, setCouriers] = useState(() => {
    try {
      const saved = localStorage.getItem("rapiconta_couriers");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_MENSAJEROS;
  });

  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem("rapiconta_clients");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_CLIENTES;
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("rapiconta_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_PRODUCTOS;
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("rapiconta_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return INITIAL_PEDIDOS;
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("rapiconta_transactions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return INITIAL_TRANSACCIONES;
  });

  const [storeBase, setStoreBase] = useState(() => {
    try {
      const saved = localStorage.getItem("rapiconta_store_base");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return TIENDA_BASE;
  });

  const handleUpdateStoreBase = (newBase) => {
    setStoreBase(newBase);
    try {
      localStorage.setItem("rapiconta_store_base", JSON.stringify(newBase));
    } catch (e) {}
    triggerCloudPush({ storeBase: newBase });
  };

  const DEFAULT_BUSINESS_LIST = [
    {
      id: "yogur-junin",
      name: "Yogur Griego Junín - Base Central",
      cloudSyncId: DEFAULT_CLOUD_BLOB_ID,
      adminHash: DEFAULT_ADMIN_HASH,
      storeBase: TIENDA_BASE
    }
  ];

  const [businesses, setBusinesses] = useState(() => {
    try {
      const saved = localStorage.getItem("rapiconta_business_list");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed.some((b) => b.id === "yogur-junin")) {
            return [...DEFAULT_BUSINESS_LIST, ...parsed];
          }
          return parsed;
        }
      }
    } catch (e) {}
    return DEFAULT_BUSINESS_LIST;
  });

  const [activeBusinessId, setActiveBusinessId] = useState(() => {
    try {
      return localStorage.getItem("rapiconta_active_business_id") || "yogur-junin";
    } catch (e) {
      return "yogur-junin";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("rapiconta_business_list", JSON.stringify(businesses));
    } catch (e) {}
  }, [businesses]);

  const handleSwitchBusiness = (bizId) => {
    const biz = businesses.find((b) => b.id === bizId);
    if (!biz) return;

    setActiveBusinessId(biz.id);
    try {
      localStorage.setItem("rapiconta_active_business_id", biz.id);
      localStorage.setItem("rapiconta_cloud_sync_id", biz.cloudSyncId);

      // Force session logout so user must authenticate into the selected business
      localStorage.removeItem("rapiconta_user_role");
      localStorage.removeItem("rapiconta_selected_courier_id");

      if (biz.id === "yogur-junin") {
        localStorage.setItem("rapiconta_admin_pass_hash", DEFAULT_ADMIN_HASH);
        localStorage.setItem("rapiconta_store_base", JSON.stringify(TIENDA_BASE));
        localStorage.setItem("rapiconta_couriers", JSON.stringify(INITIAL_MENSAJEROS));
        localStorage.setItem("rapiconta_clients", JSON.stringify(INITIAL_CLIENTES));
        localStorage.setItem("rapiconta_products", JSON.stringify(INITIAL_PRODUCTOS));
        localStorage.setItem("rapiconta_orders", JSON.stringify(INITIAL_PEDIDOS));
        localStorage.setItem("rapiconta_transactions", JSON.stringify(INITIAL_TRANSACCIONES));
      } else {
        if (biz.adminHash) {
          localStorage.setItem("rapiconta_admin_pass_hash", biz.adminHash);
        }
        if (biz.storeBase) {
          localStorage.setItem("rapiconta_store_base", JSON.stringify(biz.storeBase));
        }
      }
    } catch (e) {}

    window.location.reload();
  };

  const handleCreateNewBusinessInApp = (newBizObj) => {
    // Seed new business with initial operational catalog & sample couriers
    const seededBizPayload = {
      storeBase: newBizObj.storeBase,
      adminPasswordHash: newBizObj.adminHash,
      couriers: INITIAL_MENSAJEROS,
      clients: INITIAL_CLIENTES,
      products: INITIAL_PRODUCTOS,
      orders: [],
      transactions: []
    };

    pushStoreToCloud(seededBizPayload, newBizObj.cloudSyncId);

    setBusinesses((prev) => {
      const filtered = prev.filter((b) => b.id !== newBizObj.id);
      const updated = [...filtered, newBizObj];
      try {
        localStorage.setItem("rapiconta_business_list", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };
  const [cloudSyncId] = useState(() => {
    try {
      return localStorage.getItem("rapiconta_cloud_sync_id") || DEFAULT_CLOUD_BLOB_ID;
    } catch (e) {
      return DEFAULT_CLOUD_BLOB_ID;
    }
  });
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const lastCloudUpdatedAtRef = useRef(null);
  const isSyncingFromCloudRef = useRef(false);
  const cloudPushDebounceRef = useRef(null);

  // Background Cloud Sync Pulling (Every 5 seconds)
  useEffect(() => {
    let isMounted = true;

    const pullFromCloud = async () => {
      const cloudData = await fetchStoreFromCloud(cloudSyncId);
      if (!isMounted || !cloudData) return;

      if (cloudData.updatedAt && cloudData.updatedAt !== lastCloudUpdatedAtRef.current) {
        lastCloudUpdatedAtRef.current = cloudData.updatedAt;
        isSyncingFromCloudRef.current = true;

        if (cloudData.storeBase) setStoreBase(cloudData.storeBase);
        if (cloudData.adminPasswordHash) setAdminPasswordHash(cloudData.adminPasswordHash);

        if (Array.isArray(cloudData.couriers) && cloudData.couriers.length > 0) {
          setCouriers(cloudData.couriers);
        } else if (activeBusinessId === "yogur-junin") {
          setCouriers(INITIAL_MENSAJEROS);
        }

        if (Array.isArray(cloudData.clients) && cloudData.clients.length > 0) {
          setClients(cloudData.clients);
        } else if (activeBusinessId === "yogur-junin") {
          setClients(INITIAL_CLIENTES);
        }

        if (Array.isArray(cloudData.products) && cloudData.products.length > 0) {
          setProducts(cloudData.products);
        } else if (activeBusinessId === "yogur-junin") {
          setProducts(INITIAL_PRODUCTOS);
        }

        if (Array.isArray(cloudData.orders) && cloudData.orders.length > 0) {
          setOrders(cloudData.orders);
        } else if (activeBusinessId === "yogur-junin") {
          setOrders(INITIAL_PEDIDOS);
        }

        if (Array.isArray(cloudData.transactions) && cloudData.transactions.length > 0) {
          setTransactions(cloudData.transactions);
        } else if (activeBusinessId === "yogur-junin") {
          setTransactions(INITIAL_TRANSACCIONES);
        }

        setTimeout(() => {
          isSyncingFromCloudRef.current = false;
        }, 1000);
      }
    };

    pullFromCloud();
    const interval = setInterval(pullFromCloud, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [cloudSyncId]);

  // Helper to push updated states to Cloud (Guarded & Debounced)
  const triggerCloudPush = (overrideState = {}) => {
    if (isSyncingFromCloudRef.current) return;

    if (cloudPushDebounceRef.current) {
      clearTimeout(cloudPushDebounceRef.current);
    }

    cloudPushDebounceRef.current = setTimeout(async () => {
      setIsCloudSyncing(true);
      const storePayload = {
        storeBase: overrideState.storeBase || storeBase,
        adminPasswordHash: overrideState.adminPasswordHash || adminPasswordHash,
        couriers: overrideState.couriers || couriers,
        clients: overrideState.clients || clients,
        products: overrideState.products || products,
        orders: overrideState.orders || orders,
        transactions: overrideState.transactions || transactions
      };

      await pushStoreToCloud(storePayload, cloudSyncId);
      setIsCloudSyncing(false);
    }, 1500);
  };

  // Persist states to localStorage & push to Cloud whenever they change locally
  useEffect(() => {
    try {
      localStorage.setItem("rapiconta_admin_pass_hash", adminPasswordHash);
    } catch (e) {}
    triggerCloudPush({ adminPasswordHash });
  }, [adminPasswordHash]);

  useEffect(() => {
    try {
      localStorage.setItem("rapiconta_couriers", JSON.stringify(couriers));
    } catch (e) {}
    triggerCloudPush({ couriers });
  }, [couriers]);

  useEffect(() => {
    try {
      localStorage.setItem("rapiconta_clients", JSON.stringify(clients));
    } catch (e) {}
    triggerCloudPush({ clients });
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem("rapiconta_products", JSON.stringify(products));
    } catch (e) {}
    triggerCloudPush({ products });
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem("rapiconta_orders", JSON.stringify(orders));
    } catch (e) {}
    triggerCloudPush({ orders });
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("rapiconta_transactions", JSON.stringify(transactions));
    } catch (e) {}
    triggerCloudPush({ transactions });
  }, [transactions]);
  
  // Track selected courier for courier simulator view
  const [selectedCourierId, setSelectedCourierId] = useState(() => {
    try {
      return localStorage.getItem("rapiconta_selected_courier_id") || INITIAL_MENSAJEROS[0]?.id || "m1";
    } catch (e) {
      return INITIAL_MENSAJEROS[0]?.id || "m1";
    }
  });

  useEffect(() => {
    try {
      if (userRole) {
        localStorage.setItem("rapiconta_user_role", userRole);
      } else {
        localStorage.removeItem("rapiconta_user_role");
      }
    } catch (e) {}
  }, [userRole]);

  useEffect(() => {
    try {
      if (activeTab) {
        localStorage.setItem("rapiconta_active_tab", activeTab);
      }
    } catch (e) {}
  }, [activeTab]);

  useEffect(() => {
    try {
      if (selectedCourierId) {
        localStorage.setItem("rapiconta_selected_courier_id", selectedCourierId);
      }
    } catch (e) {}
  }, [selectedCourierId]);

  const selectedCourier = couriers.find((c) => c.id === selectedCourierId) || couriers[0];
  const setSelectedCourier = (courier) => setSelectedCourierId(courier?.id || "m1");

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

  const handleDeleteClient = (clientId) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
  };

  // 0b. Create a new courier (repartidor)
  const handleCreateCourier = (newCourier) => {
    const courierId = `m-${Date.now().toString().slice(-4)}`;
    const courier = {
      id: courierId,
      nombre: newCourier.nombre,
      avatar: newCourier.avatar,
      color: newCourier.color,
      pinHash: newCourier.pinHash,
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

  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleRestoreBackup = (data) => {
    if (data.adminPasswordHash) setAdminPasswordHash(data.adminPasswordHash);
    if (Array.isArray(data.couriers)) setCouriers(data.couriers);
    if (Array.isArray(data.clients)) setClients(data.clients);
    if (Array.isArray(data.products)) setProducts(data.products);
    if (Array.isArray(data.orders)) setOrders(data.orders);
    if (Array.isArray(data.transactions)) setTransactions(data.transactions);
  };

  const handleResetFactory = () => {
    if (
      window.confirm(
        "¿Seguro que deseas restablecer la aplicación a los datos de fábrica? Se borrarán las personalizaciones locales."
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
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
    try {
      localStorage.setItem("rapiconta_user_role", role);
    } catch (e) {}

    if (role === "courier" && courierId) {
      setSelectedCourierId(courierId);
      setActiveTab("courier");
      try {
        localStorage.setItem("rapiconta_active_tab", "courier");
        localStorage.setItem("rapiconta_selected_courier_id", courierId);
      } catch (e) {}
    } else if (role === "admin") {
      setActiveTab("admin");
      try {
        localStorage.setItem("rapiconta_active_tab", "admin");
      } catch (e) {}
    }
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  const handleChangeCourierPin = (courierId, newPinHash) => {
    setCouriers((prev) =>
      prev.map((c) => (c.id === courierId ? { ...c, pinHash: newPinHash } : c))
    );
  };

  if (userRole === null) {
    return (
      <LoginScreen
        couriers={couriers}
        adminPasswordHash={adminPasswordHash}
        onLogin={handleLogin}
        storeBase={storeBase}
        onUpdateStoreBase={handleUpdateStoreBase}
        businesses={businesses}
        activeBusinessId={activeBusinessId}
        onSwitchBusiness={handleSwitchBusiness}
        onRegisterBusiness={handleCreateNewBusinessInApp}
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
        isSyncing={isCloudSyncing}
        onManualSync={() => triggerCloudPush()}
        businesses={businesses}
        activeBusinessId={activeBusinessId}
        onSwitchBusiness={handleSwitchBusiness}
      />

      <main className="main-content">
        {/* Render Map permanently above panels or as part of layouts for premium dashboard feeling */}
        <SimulatedMap
          couriers={couriers}
          orders={orders}
          setCouriers={setCouriers}
          storeBase={storeBase}
        />

        {userRole === "admin" && activeTab !== "accounting" && (
          <AdminPanel
            orders={orders}
            couriers={couriers}
            clients={clients}
            products={products}
            transactions={transactions}
            adminPasswordHash={adminPasswordHash}
            setAdminPasswordHash={setAdminPasswordHash}
            storeBase={storeBase}
            onUpdateStoreBase={handleUpdateStoreBase}
            onRestoreBackup={handleRestoreBackup}
            onResetFactory={handleResetFactory}
            onCreateOrder={handleCreateOrder}
            onCreateClient={handleCreateClient}
            onDeleteClient={handleDeleteClient}
            onCreateCourier={handleCreateCourier}
            onDeleteCourier={handleDeleteCourier}
            onCreateProduct={handleCreateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAssignCourier={handleAssignCourier}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {userRole === "courier" && (
          <CourierPanel
            selectedCourier={selectedCourier}
            orders={orders}
            storeBase={storeBase}
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
