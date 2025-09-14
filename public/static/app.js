// GEORGE BURGERS - Aplicación del Menú Digital

let menuData = {};
let ingredientesExtra = [];
let cart = [];
let currentItem = null;

// Cargar datos del menú al iniciar
async function loadMenuData() {
  try {
    const response = await fetch('/api/menu');
    const data = await response.json();
    menuData = data.menu;
    ingredientesExtra = data.extras;
    console.log('Datos del menú cargados:', menuData);
  } catch (error) {
    console.error('Error cargando datos del menú:', error);
  }
}

// Mostrar categoría específica
function showCategory(category) {
  const menuContent = document.getElementById('menu-content');
  const items = menuData[category] || [];
  
  // Actualizar botones de categoría
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('ring-2', 'ring-white');
  });
  event.target.classList.add('ring-2', 'ring-white');
  
  if (items.length === 0) {
    menuContent.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
        <p class="text-xl text-gray-600">No hay elementos en esta categoría</p>
      </div>
    `;
    return;
  }

  const categoryTitles = {
    hamburguesas: 'Hamburguesas',
    hotdogs: 'Hot-Dogs',
    sincronizadas: 'Sincronizadas',
    tortas: 'Tortas',
    burros: 'Burros'
  };

  const categoryColors = {
    hamburguesas: 'from-red-500 to-red-600',
    hotdogs: 'from-orange-500 to-orange-600',
    sincronizadas: 'from-green-500 to-green-600',
    tortas: 'from-blue-500 to-blue-600',
    burros: 'from-purple-500 to-purple-600'
  };

  menuContent.innerHTML = `
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-center bg-gradient-to-r ${categoryColors[category]} bg-clip-text text-transparent mb-8">
        ${categoryTitles[category]}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${items.map(item => `
          <div class="menu-item bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div class="p-6">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-xl font-bold text-gray-800 leading-tight">${item.name}</h3>
                <span class="text-2xl font-bold text-red-600 ml-4">$${item.price}</span>
              </div>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">${item.ingredients.replace(/\+/g, ' • ')}</p>
              <div class="flex gap-2">
                <button onclick="addToCart('${item.name}', ${item.price}, '${item.ingredients}', false)" 
                        class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  <i class="fas fa-plus mr-2"></i>Agregar
                </button>
                <button onclick="showExtrasModal('${item.name}', ${item.price}, '${item.ingredients}')" 
                        class="bg-yellow-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                  <i class="fas fa-cog mr-1"></i>Extras
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Mostrar modal de ingredientes extra
function showExtrasModal(name, price, ingredients) {
  currentItem = { name, price, ingredients };
  
  const modal = document.getElementById('extras-modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-content');
  
  title.textContent = `Personalizar: ${name}`;
  
  content.innerHTML = `
    <div class="mb-4 p-4 bg-gray-50 rounded-lg">
      <p class="text-sm text-gray-600 mb-2">Ingredientes base:</p>
      <p class="font-semibold">${ingredients.replace(/\+/g, ' • ')}</p>
      <p class="text-lg font-bold text-red-600 mt-2">Precio base: $${price}</p>
    </div>
    
    <div class="mb-6">
      <h4 class="font-bold text-lg mb-3 text-gray-800">
        <i class="fas fa-plus-circle text-green-600 mr-2"></i>
        Ingredientes Extra
      </h4>
      <div class="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
        ${ingredientesExtra.map(extra => `
          <label class="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <div class="flex items-center">
              <input type="checkbox" class="extra-checkbox mr-3 w-4 h-4" 
                     value="${extra.name}" data-price="${extra.price}">
              <span class="font-medium">${extra.name}</span>
            </div>
            <span class="text-green-600 font-bold">+$${extra.price}</span>
          </label>
        `).join('')}
      </div>
    </div>
    
    <div class="mb-4">
      <label class="block text-sm font-bold text-gray-700 mb-2">Cantidad:</label>
      <div class="flex items-center gap-3">
        <button onclick="updateQuantity(-1)" class="bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors">
          <i class="fas fa-minus"></i>
        </button>
        <span id="quantity-display" class="text-xl font-bold w-8 text-center">1</span>
        <button onclick="updateQuantity(1)" class="bg-green-500 text-white w-8 h-8 rounded-full hover:bg-green-600 transition-colors">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
    
    <div class="flex justify-between items-center pt-4 border-t">
      <div>
        <span class="text-sm text-gray-600">Total: </span>
        <span id="total-price" class="text-xl font-bold text-red-600">$${price}</span>
      </div>
      <button onclick="addCustomItemToCart()" class="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors">
        <i class="fas fa-shopping-cart mr-2"></i>
        Agregar al Carrito
      </button>
    </div>
  `;
  
  modal.classList.remove('hidden');
  modal.querySelector('.bg-white').classList.add('modal-enter');
  
  // Actualizar precio cuando cambien los extras
  updateExtrasPrice();
  
  // Event listeners para checkboxes
  document.querySelectorAll('.extra-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', updateExtrasPrice);
  });
}

// Actualizar cantidad en el modal
let currentQuantity = 1;
function updateQuantity(change) {
  currentQuantity = Math.max(1, currentQuantity + change);
  document.getElementById('quantity-display').textContent = currentQuantity;
  updateExtrasPrice();
}

// Actualizar precio con extras
function updateExtrasPrice() {
  if (!currentItem) return;
  
  let totalPrice = currentItem.price;
  
  document.querySelectorAll('.extra-checkbox:checked').forEach(checkbox => {
    totalPrice += parseInt(checkbox.dataset.price);
  });
  
  totalPrice *= currentQuantity;
  document.getElementById('total-price').textContent = `$${totalPrice}`;
}

// Cerrar modal
function closeExtrasModal() {
  document.getElementById('extras-modal').classList.add('hidden');
  currentItem = null;
  currentQuantity = 1;
}

// Agregar item personalizado al carrito
function addCustomItemToCart() {
  const selectedExtras = [];
  document.querySelectorAll('.extra-checkbox:checked').forEach(checkbox => {
    selectedExtras.push(checkbox.value);
  });
  
  addToCart(currentItem.name, currentItem.price, currentItem.ingredients, true, selectedExtras, currentQuantity);
  closeExtrasModal();
}

// Agregar al carrito
function addToCart(name, basePrice, ingredients, hasExtras = false, extras = [], quantity = 1) {
  const cartItem = {
    id: Date.now() + Math.random(),
    name,
    basePrice,
    ingredients,
    extras,
    quantity,
    hasExtras
  };
  
  cart.push(cartItem);
  updateCartDisplay();
  
  // Mostrar mensaje de confirmación
  showNotification(`${name} agregado al carrito`, 'success');
}

// Actualizar display del carrito
function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center text-gray-500 py-8">
        <i class="fas fa-shopping-basket text-3xl mb-2"></i>
        <p>Tu carrito está vacío</p>
      </div>
    `;
    cartTotal.textContent = '$0';
    checkoutBtn.disabled = true;
    return;
  }
  
  let total = 0;
  
  cartItems.innerHTML = cart.map(item => {
    let itemTotal = item.basePrice;
    
    // Calcular precio de extras
    if (item.extras && item.extras.length > 0) {
      item.extras.forEach(extraName => {
        const extra = ingredientesExtra.find(e => e.name === extraName);
        if (extra) itemTotal += extra.price;
      });
    }
    
    itemTotal *= item.quantity;
    total += itemTotal;
    
    return `
      <div class="cart-item p-3 rounded-lg border">
        <div class="flex justify-between items-start mb-2">
          <h4 class="font-semibold text-sm">${item.name}</h4>
          <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p class="text-xs text-gray-600 mb-2">${item.ingredients.replace(/\+/g, ' • ')}</p>
        ${item.extras && item.extras.length > 0 ? `
          <p class="text-xs text-green-600 mb-2">
            <i class="fas fa-plus mr-1"></i>
            ${item.extras.join(', ')}
          </p>
        ` : ''}
        <div class="flex justify-between items-center">
          <span class="text-xs">Cantidad: ${item.quantity}</span>
          <span class="font-bold text-red-600">$${itemTotal}</span>
        </div>
      </div>
    `;
  }).join('');
  
  cartTotal.textContent = `$${total}`;
  checkoutBtn.disabled = false;
}

// Remover del carrito
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCartDisplay();
  showNotification('Producto eliminado del carrito', 'info');
}

// Mostrar notificación
function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };
  
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-check-circle mr-2"></i>
      ${message}
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Mostrar notificación
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Ocultar después de 3 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Realizar pedido (simulado)
document.addEventListener('DOMContentLoaded', function() {
  // Cargar datos del menú
  loadMenuData();
  
  // Event listener para el botón de checkout
  document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) return;
    
    const total = document.getElementById('cart-total').textContent;
    
    if (confirm(`¿Confirmar pedido por ${total}?`)) {
      // Aquí iría la lógica para procesar el pedido
      alert(`¡Pedido confirmado por ${total}! 
      
Tiempo estimado de entrega: 15-20 minutos.
¡Gracias por elegir GEORGE BURGERS!`);
      
      // Limpiar carrito
      cart = [];
      updateCartDisplay();
    }
  });
  
  // Mostrar hamburguesas por defecto
  setTimeout(() => {
    const hamburgueasBtn = document.querySelector('.category-btn');
    if (hamburgueasBtn) {
      hamburgueasBtn.click();
    }
  }, 500);
});

// Cerrar modal al hacer clic fuera
document.getElementById('extras-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeExtrasModal();
  }
});