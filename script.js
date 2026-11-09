// ===== Данные о товарах =====
const products = [
  { id: 1, name: 'Кроссовки Air Run',   category: 'sneakers', price: 5990, emoji: '👟' },
  { id: 2, name: 'Кроссовки City Walk', category: 'sneakers', price: 4490, emoji: '👟' },
  { id: 3, name: 'Ботинки Timber',      category: 'boots',    price: 8990, emoji: '🥾' },
  { id: 4, name: 'Ботинки Winter Pro',  category: 'boots',    price: 7490, emoji: '🥾' },
  { id: 5, name: 'Туфли Classic',       category: 'shoes',    price: 6490, emoji: '👞' },
  { id: 6, name: 'Туфли Oxford',        category: 'shoes',    price: 7990, emoji: '👞' },
  { id: 7, name: 'Сандалии Summer',     category: 'sandals',  price: 2990, emoji: '🩴' },
  { id: 8, name: 'Сандалии Beach',      category: 'sandals',  price: 2490, emoji: '🩴' }
];

// ===== Корзина =====
let cart = JSON.parse(localStorage.getItem('shoeCart')) || [];

const grid = document.getElementById('productGrid');

function renderProducts(category = 'all') {
  grid.innerHTML = '';
  const filtered = category === 'all'
    ? products
    : products.filter(p => p.category === category);

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-img">${p.emoji}</div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="price">${p.price.toLocaleString('ru-RU')} ₽</p>
        <button class="btn-primary" data-id="${p.id}">В корзину</button>
      </div>`;
    grid.appendChild(card);
  });

  grid.querySelectorAll('button[data-id]').forEach(btn =>
    btn.addEventListener('click', () => addToCart(+btn.dataset.id))
  );
}

// ===== Фильтры =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.category);
  });
});

// ===== Работа с корзиной =====
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('shoeCart', JSON.stringify(cart));
}

// ===== Интерфейс корзины =====
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

function updateCartUI() {
  cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);

  cartItems.innerHTML = '';
  let sum = 0;
  cart.forEach(item => {
    sum += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.emoji} ${item.name} × ${item.qty}</span>
      <span>${(item.price * item.qty).toLocaleString('ru-RU')} ₽
        <button data-minus="${item.id}">−</button>
        <button data-plus="${item.id}">+</button>
        <button data-remove="${item.id}">✕</button>
      </span>`;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = sum.toLocaleString('ru-RU');

  cartItems.querySelectorAll('[data-minus]').forEach(b =>
    b.addEventListener('click', () => changeQty(+b.dataset.minus, -1)));
  cartItems.querySelectorAll('[data-plus]').forEach(b =>
    b.addEventListener('click', () => changeQty(+b.dataset.plus, 1)));
  cartItems.querySelectorAll('[data-remove]').forEach(b =>
    b.addEventListener('click', () => removeItem(+b.dataset.remove)));
}

// ===== Модальное окно =====
const cartModal = document.getElementById('cartModal');
document.getElementById('cartBtn').addEventListener('click', () =>
  cartModal.classList.remove('hidden')
);
document.getElementById('closeCart').addEventListener('click', () =>
  cartModal.classList.add('hidden')
);
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Корзина пуста');
    return;
  }
  alert('Спасибо за заказ! Мы свяжемся с вами.');
  cart = [];
  saveCart();
  updateCartUI();
  cartModal.classList.add('hidden');
});

// ===== Год в футере =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Старт =====
renderProducts();
updateCartUI();