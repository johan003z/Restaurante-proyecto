let pedido = [];

// 🔁 ORDEN POR DÍA
function obtenerFechaHoy(){
    return new Date().toISOString().split("T")[0];
}

function inicializarOrden(){
    let fechaGuardada = localStorage.getItem("fechaOrden");
    let fechaHoy = obtenerFechaHoy();

    if(fechaGuardada !== fechaHoy){
        localStorage.setItem("fechaOrden", fechaHoy);
        localStorage.setItem("numeroOrden", 1);
    }

    return parseInt(localStorage.getItem("numeroOrden")) || 1;
}

let numeroOrden = inicializarOrden();

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("orden").innerText = "Orden #" + numeroOrden;
});

// MENÚ
const productos = {
    entradas: [
        {codigo: "E01", nombre: "Nuggets", precio: 8},
        {codigo: "E02", nombre: "Aros de cebolla", precio: 7}
    ],
    fuertes: [
        {codigo: "F01", nombre: "Hamburguesa", precio: 15},
        {codigo: "F02", nombre: "Pizza", precio: 18},
        {codigo: "F03", nombre: "Perro caliente", precio: 12}
    ],
    postres: [
        {codigo: "P01", nombre: "Helado", precio: 6},
        {codigo: "P02", nombre: "Brownie", precio: 7}
    ],
    bebidas: [
        {codigo: "B01", nombre: "Gaseosa", precio: 5},
        {codigo: "B02", nombre: "Jugo", precio: 6}
    ],
    extras: [
        {codigo: "X01", nombre: "Papas grandes", precio: 8},
        {codigo: "X02", nombre: "Queso extra", precio: 3}
    ]
};

// MOSTRAR CATEGORÍA
function mostrarCategoria(cat){
    let menu = document.getElementById("menu");
    menu.innerHTML = "";

    productos[cat].forEach(p => {
        let div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <b>${p.nombre}</b><br>
            Código: ${p.codigo}<br>
            $${p.precio}
        `;
        div.onclick = () => agregar(p);
        menu.appendChild(div);
    });
}

// AGREGAR
function agregar(prod){
    let item = pedido.find(p => p.codigo === prod.codigo);

    if(item){
        item.cantidad++;
    } else {
        pedido.push({...prod, cantidad:1});
    }

    render();
}

// ➕➖
function aumentar(codigo){
    let item = pedido.find(p => p.codigo === codigo);
    if(item){ item.cantidad++; render(); }
}

function disminuir(codigo){
    let item = pedido.find(p => p.codigo === codigo);

    if(item){
        item.cantidad--;
        if(item.cantidad <= 0){
            pedido = pedido.filter(p => p.codigo !== codigo);
        }
        render();
    }
}

function cambiarCantidad(codigo, valor){
    let item = pedido.find(p => p.codigo === codigo);
    let cantidad = parseInt(valor);

    if(!cantidad || cantidad < 1){
        disminuir(codigo);
        return;
    }

    item.cantidad = cantidad;
    render();
}

// RENDER
function render(){
    let lista = document.getElementById("lista");
    let total = 0;

    lista.innerHTML = "";

    pedido.forEach(item => {
        let div = document.createElement("div");
        div.className = "pedido-item";

        div.innerHTML = `
            <div>
                <b>${item.nombre}</b><br>
                <small>${item.codigo}</small>
            </div>

            <div style="display:flex; gap:8px; align-items:center;">
                <button onclick="disminuir('${item.codigo}')">➖</button>
                
                <input type="number" min="1" value="${item.cantidad}" 
                onchange="cambiarCantidad('${item.codigo}', this.value)"
                style="width:60px; text-align:center;">

                <button onclick="aumentar('${item.codigo}')">➕</button>
            </div>

            <div>$${item.precio * item.cantidad}</div>
        `;

        lista.appendChild(div);

        total += item.precio * item.cantidad;
    });

    document.getElementById("total").innerText = "Total: $" + total;
}

// VALIDAR MESA
function validarMesa(){
    let mesa = parseInt(document.getElementById("mesa").value);

    if(!mesa || mesa < 1){
        alert("Mesa inválida");
        return null;
    }

    return mesa;
}

// ENVIAR
function enviarPedido(){
    let mesa = validarMesa();

    if(!mesa || pedido.length === 0){
        alert("Faltan datos");
        return;
    }

    alert(`Pedido #${numeroOrden} enviado a cocina 🔥`);

    numeroOrden++;
    localStorage.setItem("numeroOrden", numeroOrden);

    document.getElementById("orden").innerText = "Orden #" + numeroOrden;

    limpiarPedido();
}

// FACTURA
function generarFactura(){
    let mesa = validarMesa();
    if(!mesa || pedido.length === 0){
        alert("No hay pedido");
        return;
    }

    let total = 0;

    let ticket = document.createElement("div");
    ticket.className = "ticket";

    let html = `
        <h3>RESTAURANTE</h3>
        <p>Mesa: ${mesa}</p>
        <p>Orden: ${numeroOrden}</p>
        <hr>
    `;

    pedido.forEach(item => {
        total += item.precio * item.cantidad;
        html += `
            <div class="ticket-item">
                <span>${item.codigo} x${item.cantidad}</span>
                <span>$${item.precio * item.cantidad}</span>
            </div>
        `;
    });

    html += `
        <hr>
        <h3>Total: $${total}</h3>
        <p>Gracias por su compra</p>
    `;

    ticket.innerHTML = html;

    document.body.appendChild(ticket);
    window.print();
    document.body.removeChild(ticket);

    limpiarPedido();
}

// LIMPIAR
function limpiarPedido(){
    pedido = [];
    render();
}