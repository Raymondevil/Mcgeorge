import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

app.use(renderer)
app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

// Datos del menú
const menuData = {
  hamburguesas: [
    { name: "Asadera", ingredients: "Carne+Q.Asadero", price: 63 },
    { name: "Especial", ingredients: "Carne+Carnes Frías", price: 63 },
    { name: "Doble", ingredients: "Carne+Jamón+Q.Amarillo", price: 60 },
    { name: "Champiqueso", ingredients: "Carne+Champiñón+Q.Asadero", price: 76 },
    { name: "Petra", ingredients: "Carne+Q.Asadero+Tocino", price: 78 },
    { name: "Campechana", ingredients: "Asadera+Jamón+Q.Amarillo", price: 73 },
    { name: "Ejecutiva", ingredients: "Carne+Carnes Frías+Salchicha", price: 95 },
    { name: "Española", ingredients: "Carne+Q.Asadero+Salchicha", price: 95 },
    { name: "Embajadora", ingredients: "Carne+Carnes Frías+Q.Asadero+Salchicha", price: 108 },
    { name: "Americana", ingredients: "Doble Carne+Doble Q.Amarillo", price: 100 },
    { name: "Choriqueso", ingredients: "Chorizo+Q.Asadero", price: 45 },
    { name: "Ranchera", ingredients: "Carne+Chorizo+Q.Asadero", price: 76 },
    { name: "Hawaiana", ingredients: "Carne+Piña+Q.Asadero", price: 76 },
    { name: "Hawaiana Especial", ingredients: "Carne+Piña+Q.Asadero+Carnes Frías", price: 89 },
    { name: "Especial Asadera", ingredients: "Carne+Q.Asadero+Carnes Frías", price: 76 },
    { name: "Ahumada", ingredients: "Chuleta", price: 50 },
    { name: "Ahumada Especial", ingredients: "Chuleta+Carnes Frías", price: 63 },
    { name: "Mexicana", ingredients: "Chuleta+Carne", price: 84 },
    { name: "Norteña", ingredients: "Carne+Chuleta+Q.Asadero", price: 97 },
    { name: "Italiana", ingredients: "Chuleta+Q.Asadero", price: 63 },
    { name: "Extravagante", ingredients: "Carne+Chuleta+Q.Asadero+Carnes Frías", price: 110 },
    { name: "Descarnada", ingredients: "Carnes Frías+Q.Amarillo", price: 48 },
    { name: "Descarnada Asadero", ingredients: "Carnes Frías+Q.Amarillo+Q.Asadero", price: 61 },
    { name: "Sencilla", ingredients: "Carne de Res", price: 50 },
    { name: "Big Sencilla", ingredients: "2 Carnes de Res", price: 84 },
    { name: "Costeña", ingredients: "Camarón+Q.Asadero+Tocino+Ch.Morrón+Sal.Inglesa", price: 96 },
    { name: "Super Costeña", ingredients: "Camarón+Q.Asadero+Carne de Res+Tocino+Ch.Morrón", price: 130 },
    { name: "La Popotiña", ingredients: "Carne de Pierna+Tocino+Chile Morrón+Q.Asadero", price: 82 },
    { name: "Grosera", ingredients: "Salchicha para Asar+Q.Asadero+Tocino", price: 60 },
    { name: "Super Grosera", ingredients: "Salchicha para Asar+Q.Asadero+Tocino+Carne de Res", price: 94 }
  ],
  hotdogs: [
    { name: "Dogo de Pavo", ingredients: "Salchicha de Pavo", price: 50 },
    { name: "Grosero", ingredients: "Salchicha para Asar+Q.Asadero+Tocino Rebanado", price: 60 },
    { name: "Asadero", ingredients: "Salchicha+Q.Asadero", price: 73 },
    { name: "Big Grosero", ingredients: "Grosero+Carnes Frías", price: 76 },
    { name: "Choriqueso", ingredients: "Salchicha+Chorizo+Q.Asadero", price: 76 },
    { name: "Champiqueso", ingredients: "Salchicha+Champiñones+Q.Asadero", price: 63 },
    { name: "Campechano", ingredients: "Asadero+Jamón+Q.Amarillo", price: 73 },
    { name: "Especial", ingredients: "Salchicha+C.Frías", price: 63 },
    { name: "Hawaiano", ingredients: "Salchicha+Q.Asadero+Piña", price: 76 },
    { name: "Hawaiano Especial", ingredients: "Salchicha+Q.Asadero+Piña+C.Frías", price: 89 },
    { name: "Doble", ingredients: "Salchicha+Jamón+Q.Amarillo", price: 60 },
    { name: "Descarnado", ingredients: "Jamón+Pastel+Q.de Puerco+Mortadela+Salami", price: 48 },
    { name: "de Pierna", ingredients: "Salchicha de Pierna", price: 48 }
  ],
  sincronizadas: [
    { name: "Sincronizada Sencilla", ingredients: "T.Harina+Jamón+Q.Asadero+Q.Amarillo", price: 51 },
    { name: "Sincronizada Especial", ingredients: "T.Harina+Jamón+Q.Asadero+Q.Amarillo+Pierna", price: 81 },
    { name: "Sincronizada Super", ingredients: "T.Harina+Jamón+Q.Asadero+Q.Amarillo+Champiñones", price: 64 },
    { name: "Sincronizada Matona", ingredients: "T.Harina+Jamón+Q.Asadero+Q.Amarillo+Pierna+Salchicha Grosera", price: 125 },
    { name: "Sincronizada Costeña", ingredients: "T.Harina+Jamón+Q.Asadero+Q.Amarillo+Camarón+Pierna", price: 125 }
  ],
  tortas: [
    { name: "Torta Sencilla", ingredients: "Telera+Pierna", price: 50 },
    { name: "Torta Especial", ingredients: "Carnes Frías+Pierna", price: 63 },
    { name: "Torta Asadera", ingredients: "Pierna+Q.Asadero", price: 63 },
    { name: "Torta Cubana", ingredients: "Jamón+Q.Asadero+Salchicha+Pierna", price: 101 }
  ],
  burros: [
    { name: "Burro Sencillo", ingredients: "Carne de Pierna", price: 50 },
    { name: "Burro Asadero", ingredients: "Carne de Pierna+Q.Asadero", price: 63 },
    { name: "Burro Especial", ingredients: "Carne de Pierna+Carnes Frías", price: 63 },
    { name: "Burro Costeño", ingredients: "Carne de Pierna+Camarón+Q.Asadero", price: 106 }
  ]
}

const ingredientesExtra = [
  { name: "Carne Extra", price: 15 },
  { name: "Queso Asadero", price: 8 },
  { name: "Queso Amarillo", price: 8 },
  { name: "Tocino", price: 12 },
  { name: "Jamón", price: 10 },
  { name: "Champiñones", price: 10 },
  { name: "Piña", price: 8 },
  { name: "Chorizo", price: 12 },
  { name: "Camarón", price: 25 },
  { name: "Chile Morrón", price: 6 },
  { name: "Carnes Frías", price: 10 },
  { name: "Salchicha", price: 12 }
]

// API para obtener datos del menú
app.get('/api/menu', (c) => {
  return c.json({ menu: menuData, extras: ingredientesExtra })
})

// API para calcular total del pedido
app.post('/api/calculate-order', async (c) => {
  const { items } = await c.req.json()
  
  let total = 0
  const orderDetails = []
  
  for (const item of items) {
    let itemTotal = item.basePrice
    const extras = []
    
    if (item.extras && item.extras.length > 0) {
      for (const extra of item.extras) {
        const extraItem = ingredientesExtra.find(e => e.name === extra)
        if (extraItem) {
          itemTotal += extraItem.price
          extras.push({ name: extra, price: extraItem.price })
        }
      }
    }
    
    itemTotal *= item.quantity
    total += itemTotal
    
    orderDetails.push({
      name: item.name,
      quantity: item.quantity,
      basePrice: item.basePrice,
      extras: extras,
      subtotal: itemTotal
    })
  }
  
  return c.json({ orderDetails, total })
})

app.get('/', (c) => {
  return c.render(
    <div>
      {/* Header */}
      <header class="bg-red-600 text-white shadow-lg">
        <div class="container mx-auto px-4 py-6">
          <div class="text-center">
            <h1 class="text-4xl font-bold mb-2">
              <i class="fas fa-hamburger mr-3"></i>
              GEORGE BURGERS
            </h1>
            <p class="text-xl">¡El mejor sabor de la ciudad!</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav class="bg-yellow-400 shadow-md sticky top-0 z-40">
        <div class="container mx-auto px-4">
          <div class="flex justify-center space-x-1 py-3">
            <button onclick="showCategory('hamburguesas')" class="category-btn bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              <i class="fas fa-hamburger mr-2"></i>Hamburguesas
            </button>
            <button onclick="showCategory('hotdogs')" class="category-btn bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              <i class="fas fa-hotdog mr-2"></i>Hot-Dogs
            </button>
            <button onclick="showCategory('sincronizadas')" class="category-btn bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              <i class="fas fa-cheese mr-2"></i>Sincronizadas
            </button>
            <button onclick="showCategory('tortas')" class="category-btn bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              <i class="fas fa-bread-slice mr-2"></i>Tortas
            </button>
            <button onclick="showCategory('burros')" class="category-btn bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              <i class="fas fa-burrito mr-2"></i>Burros
            </button>
          </div>
        </div>
      </nav>

      <div class="container mx-auto px-4 py-8">
        <div class="flex gap-8">
          {/* Menu Items */}
          <div class="flex-1">
            <div id="menu-content">
              <div class="text-center py-12">
                <i class="fas fa-utensils text-6xl text-gray-400 mb-4"></i>
                <p class="text-xl text-gray-600">Selecciona una categoría para ver nuestro delicioso menú</p>
              </div>
            </div>
          </div>

          {/* Cart Sidebar */}
          <div class="w-80 bg-white rounded-lg shadow-lg p-6 h-fit sticky top-24">
            <h3 class="text-xl font-bold mb-4 text-center border-b pb-2">
              <i class="fas fa-shopping-cart mr-2 text-red-600"></i>
              Tu Pedido
            </h3>
            <div id="cart-items" class="space-y-3 mb-4 min-h-20">
              <div class="text-center text-gray-500 py-8">
                <i class="fas fa-shopping-basket text-3xl mb-2"></i>
                <p>Tu carrito está vacío</p>
              </div>
            </div>
            <div class="border-t pt-4">
              <div class="flex justify-between items-center mb-4">
                <span class="text-lg font-bold">Total:</span>
                <span id="cart-total" class="text-2xl font-bold text-red-600">$0</span>
              </div>
              <button id="checkout-btn" class="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:bg-gray-400" disabled>
                <i class="fas fa-credit-card mr-2"></i>
                Realizar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for extras */}
      <div id="extras-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 id="modal-title" class="text-xl font-bold"></h3>
            <button onclick="closeExtrasModal()" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          <div id="modal-content"></div>
        </div>
      </div>

      <script src="/static/app.js"></script>
    </div>,
    { title: 'GEORGE BURGERS - Menú Digital' }
  )
})

export default app
