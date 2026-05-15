// Estrutura de Cardápio (Cestas e Itens Avulsos simulados com LoremFlickr)
const cardapio = {
    prontas: [
        { id: '101', name: 'Cesta Romântica na Cama', desc: 'Croissants, morangos, geleias premium, suco natural e frios selecionados. Ideal para casais.', price: 145.90, img: 'https://loremflickr.com/150/150/breakfast,croissant' },
        { id: '102', name: 'Cesta Clássica', desc: 'Pães artesanais, queijos variados, bolo de laranja, café e suco.', price: 95.00, img: 'https://loremflickr.com/150/150/breakfast,bread' },
        { id: '103', name: 'Manhã Premium', desc: 'Adiciona champanhe, tábua de frios rústica, panquecas americanas e nutella.', price: 219.90, img: 'https://loremflickr.com/150/150/charcuterie,cheese' },
        { id: '104', name: 'Café da Manhã Doce Doce', desc: 'Muffins, donuts, panquecas com mel, iogurte de frutas vermelhas.', price: 89.90, img: 'https://loremflickr.com/150/150/pancakes,syrup' }
    ],
    padaria: [
        { id: '201', name: 'Croissant Recheado de Chocolate', desc: 'Massa folhada derretendo na boca com chocolate belga.', price: 14.50, img: 'https://loremflickr.com/150/150/croissant,chocolate' },
        { id: '202', name: 'Sanduíche Baguete', desc: 'Baguete francesa com salame e queijo brie.', price: 22.00, img: 'https://loremflickr.com/150/150/sandwich' },
        { id: '203', name: 'Muffin de Mirtilo', desc: 'Bolo caseiro macio e repleto de frutas.', price: 12.00, img: 'https://loremflickr.com/150/150/muffin' },
        { id: '204', name: 'Porção de Morangos e Uvas', desc: 'Frutas frescas higienizadas prontas para consumo.', price: 18.00, img: 'https://loremflickr.com/150/150/berries,grapes' }
    ],
    bebidas: [
        { id: '301', name: 'Suco de Laranja Natural', desc: 'Feito na hora, sem açúcar adicionado. (500ml)', price: 14.00, img: 'https://loremflickr.com/150/150/juice,orange' },
        { id: '302', name: 'Café Especial Torra Clara', desc: 'Garrafinha térmica (pequena) com café estilo coado artesanal.', price: 16.50, img: 'https://loremflickr.com/150/150/coffee,latte' },
        { id: '303', name: 'Smoothie de Frutas Vermelhas', desc: 'Bebida super refrescante e densa.', price: 19.90, img: 'https://loremflickr.com/150/150/smoothie' }
    ]
};

// Estado do Carrinho (Sidebar Esquerda)
let cart = {};

// Elementos da UI
const gridProntas = document.getElementById('gridProntas');
const gridPadaria = document.getElementById('gridPadaria');
const gridBebidas = document.getElementById('gridBebidas');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const totalPriceEl = document.getElementById('totalPrice');

// Utilitário p/ formatação Moeda BRL
const formatPrice = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Renderizar Menu Styles iFood
function renderMenuSection(container, itemsArray, isCompact = false) {
    const cardClass = isCompact ? 'menu-card compact-card' : 'menu-card';
    container.innerHTML = itemsArray.map(item => `
        <div class="${cardClass}" onclick="addToCart('${item.id}')">
            <div class="menu-card-text">
                <h3 class="menu-card-title">${item.name}</h3>
                <p class="menu-card-desc">${item.desc}</p>
                <div class="menu-card-price">${formatPrice(item.price)}</div>
            </div>
            <div class="menu-card-img-wrapper">
                <img src="${item.img}" alt="${item.name}">
                <button class="btn-add">+</button>
            </div>
        </div>
    `).join('');
}

// Inicializar Catálogo Principal
function initMenu() {
    renderMenuSection(gridProntas, cardapio.prontas);
    renderMenuSection(gridPadaria, cardapio.padaria, true); // true para compacto na Padaria
    renderMenuSection(gridBebidas, cardapio.bebidas);
}

// ===========================
// LÓGICA DO CARRINHO (SIDEBAR)
// ===========================

// Busca dados totais do item cruzando todos os arrys do cardápio
function getProductData(id) {
    const allProducts = [...cardapio.prontas, ...cardapio.padaria, ...cardapio.bebidas];
    return allProducts.find(product => product.id === id);
}

// Adicionar ou Incrementar ao Carrinho 
window.addToCart = function(id) {
    if (cart[id]) {
        cart[id].qty++;
    } else {
        const productData = getProductData(id);
        cart[id] = { ...productData, qty: 1 };
    }
    renderCart();
};

window.decreaseQty = function(id) {
    if(cart[id].qty > 1) {
        cart[id].qty--;
    } else {
        delete cart[id];
    }
    renderCart();
};

window.increaseQty = function(id) {
    cart[id].qty++;
    renderCart();
};

// Atualizar interface visual do Carrinho
function renderCart() {
    const cartIds = Object.keys(cart);
    
    if (cartIds.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Sua cesta está vazia</p>
                <small>Adicione cestas prontas ou itens avulsos</small>
            </div>
        `;
        totalPriceEl.textContent = "R$ 0,00";
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cartIds.map(id => {
        const item = cart[id];
        total += (item.price * item.qty);
        return `
            <div class="cart-item-card">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-qty" onclick="decreaseQty('${id}')">-</button>
                    <span>${item.qty}</span>
                    <button class="btn-qty" onclick="increaseQty('${id}')">+</button>
                </div>
            </div>
        `;
    }).join('');

    totalPriceEl.textContent = formatPrice(total);
}

// Lógica Visual do NavSticky Categories
const catBtns = document.querySelectorAll('.cat-btn');
catBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        catBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
    });
});

// Init Site
initMenu();
renderCart();

// Integramos Finalização de Pedido com WhatsApp
document.getElementById('btnCheckout').addEventListener('click', () => {
    const cartIds = Object.keys(cart);
    if(cartIds.length === 0) {
        alert("Sua cesta está vazia! Adicione alguns produtos antes de enviar o pedido.");
        return;
    }

    // Construção do Texto do Pedido
    let message = "Olá! Gostaria de fazer o seguinte pedido de Cestas de Café da Manhã:\n\n";
    let total = 0;

    cartIds.forEach(id => {
        const item = cart[id];
        const subtotal = item.price * item.qty;
        total += subtotal;
        message += `• ${item.qty}x ${item.name} - ${formatPrice(subtotal)}\n`;
    });

    message += `\n*TOTAL: ${formatPrice(total)}*\n`;
    message += "\nPor favor, me informe a chave PIX e confirme o tempo de preparo!";

    // Substitua este número pelo seu número real do WhatsApp com DDD Ex: 5511999999999
    const phoneNumber = "5511999999999"; 
    
    // Codifica a mensagem e redireciona
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});
