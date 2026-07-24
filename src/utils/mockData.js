export const INITIAL_PRODUCTOS = [
  { id: "p1", nombre: "Pizza Margarita", precio: 6000 },
  { id: "p2", nombre: "Hamburguesa Gourmet", precio: 9500 },
  { id: "p3", nombre: "Patatas Fritas Rústicas", precio: 1500 },
  { id: "p4", nombre: "Sushi Combo Premium", precio: 10500 },
  { id: "p5", nombre: "Cerveza Especial", precio: 1700 },
  { id: "p6", nombre: "Tacos Al Pastor (x3)", precio: 6500 },
  { id: "p7", nombre: "Refresco", precio: 1000 },
  { id: "p8", nombre: "Salsa Teriyaki Extra", precio: 1500 }
];

export const INITIAL_CLIENTES = [
  {
    id: "c1",
    nombre: "Alejandro Sanz",
    direccion: "Gran Vía, 32",
    lat: 40.420300,
    lng: -3.702200,
    telefono: "+34 600 111 222"
  },
  {
    id: "c2",
    nombre: "María Pedraza",
    direccion: "Paseo de la Castellana, 110",
    lat: 40.441000,
    lng: -3.691000,
    telefono: "+34 600 333 444"
  },
  {
    id: "c3",
    nombre: "Lucas Vázquez",
    direccion: "Calle Mayor, 15",
    lat: 40.415000,
    lng: -3.707800,
    telefono: "+34 600 555 666"
  },
  {
    id: "c4",
    nombre: "Elena Anaya",
    direccion: "Calle de Atocha, 45",
    lat: 40.411000,
    lng: -3.699000,
    telefono: "+34 600 777 888"
  }
];

export const INITIAL_MENSAJEROS = [
  {
    id: "m1",
    nombre: "Carlos Gómez",
    avatar: "CG",
    estado: "libre", // 'libre', 'reparto', 'inactivo'
    comisionAcumulada: 3800,
    efectivoEnMano: 15400,
    gastosAcumulados: 1200,
    color: "#8B5CF6", // Violeta
    lat: 40.416775,
    lng: -3.703790,
    pinHash: "0ee1289fe47095272532289f0932b32b4965b5719255b48b9f0260336d39cb60"
  },
  {
    id: "m2",
    nombre: "Sofía Rodríguez",
    avatar: "SR",
    estado: "reparto",
    comisionAcumulada: 5200,
    efectivoEnMano: 22000,
    gastosAcumulados: 800,
    color: "#EC4899", // Rosa
    lat: 40.420000,
    lng: -3.695000,
    pinHash: "edee29f882543b956620b26d0ee0e7e9503ab296571dd239121a979101c70e00"
  },
  {
    id: "m3",
    nombre: "Miguel Ángel",
    avatar: "MA",
    estado: "libre",
    comisionAcumulada: 2500,
    efectivoEnMano: 0,
    gastosAcumulados: 500,
    color: "#10B981", // Verde esmeralda
    lat: 40.410000,
    lng: -3.712000,
    pinHash: "110c732049d5a7d656fb154b5dfd4f6c4bb6ed61f5139a0ef4a6c67ef8ec651b"
  }
];

export const INITIAL_PEDIDOS = [
  {
    id: "ped-101",
    cliente: "Alejandro Sanz",
    direccion: "Gran Vía, 32",
    lat: 40.420300,
    lng: -3.702200,
    valor: 15400,
    comisionEntrega: 1800,
    metodoPago: "efectivo",
    estado: "entregado", // 'pendiente', 'en_camino', 'entregado'
    mensajeroId: "m1",
    fecha: new Date(Date.now() - 3600000 * 3).toISOString(), // hace 3 horas
    articulos: [
      { nombre: "Pizza Margarita", cantidad: 2, precio: 6000 },
      { nombre: "Cerveza Especial", cantidad: 2, precio: 1700 }
    ]
  },
  {
    id: "ped-102",
    cliente: "María Pedraza",
    direccion: "Paseo de la Castellana, 110",
    lat: 40.441000,
    lng: -3.691000,
    valor: 22000,
    comisionEntrega: 2500,
    metodoPago: "efectivo",
    estado: "en_camino",
    mensajeroId: "m2",
    fecha: new Date(Date.now() - 3600000 * 1).toISOString(), // hace 1 hora
    articulos: [
      { nombre: "Hamburguesa Gourmet", cantidad: 2, precio: 9500 },
      { nombre: "Patatas Fritas Rústicas", cantidad: 2, precio: 1500 }
    ]
  },
  {
    id: "ped-103",
    cliente: "Lucas Vázquez",
    direccion: "Calle Mayor, 15",
    lat: 40.415000,
    lng: -3.707800,
    valor: 8500,
    comisionEntrega: 1200,
    metodoPago: "tarjeta",
    estado: "pendiente",
    mensajeroId: null,
    fecha: new Date().toISOString(),
    articulos: [
      { nombre: "Tacos Al Pastor (x3)", cantidad: 1, precio: 6500 },
      { nombre: "Refresco", cantidad: 2, precio: 1000 }
    ]
  },
  {
    id: "ped-104",
    cliente: "Elena Anaya",
    direccion: "Calle de Atocha, 45",
    lat: 40.411000,
    lng: -3.699000,
    valor: 12000,
    comisionEntrega: 1500,
    metodoPago: "tarjeta",
    estado: "entregado",
    mensajeroId: "m1",
    fecha: new Date(Date.now() - 3600000 * 5).toISOString(),
    articulos: [
      { nombre: "Sushi Combo Premium", cantidad: 1, precio: 10500 },
      { nombre: "Salsa Teriyaki Extra", cantidad: 1, precio: 1500 }
    ]
  }
];

export const INITIAL_TRANSACCIONES = [
  {
    id: "tx-1",
    tipo: "ingreso_tienda", // 'ingreso_tienda', 'gasto_combustible', 'liquidacion_caja', 'pago_comision'
    monto: 12000,
    descripcion: "Ingreso tienda - Pedido #ped-104 (Tarjeta)",
    fecha: new Date(Date.now() - 3600000 * 5).toISOString(),
    mensajeroId: "m1"
  },
  {
    id: "tx-2",
    tipo: "pago_comision",
    monto: -1500,
    descripcion: "Comisión pagada por entrega #ped-104",
    fecha: new Date(Date.now() - 3600000 * 5).toISOString(),
    mensajeroId: "m1"
  },
  {
    id: "tx-3",
    tipo: "ingreso_tienda",
    monto: 15400,
    descripcion: "Venta Pedido #ped-101 (Pendiente liquidar efectivo)",
    fecha: new Date(Date.now() - 3600000 * 3).toISOString(),
    mensajeroId: "m1"
  },
  {
    id: "tx-4",
    tipo: "pago_comision",
    monto: -1800,
    descripcion: "Comisión devengada por entrega #ped-101",
    fecha: new Date(Date.now() - 3600000 * 3).toISOString(),
    mensajeroId: "m1"
  },
  {
    id: "tx-5",
    tipo: "gasto_combustible",
    monto: -1200,
    descripcion: "Gasto de combustible registrado - Carlos Gómez",
    fecha: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    mensajeroId: "m1"
  }
];

// Ubicación de la tienda base (centro del mapa)
export const TIENDA_BASE = {
  nombre: "Centro de Despacho Central",
  lat: 40.416775,
  lng: -3.703790
};
