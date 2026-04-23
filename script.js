/* ===================================================
   LITT NYC™ — script.js
   Cart, filters, animations, nav, search, newsletter
   =================================================== */
'use strict';

// ============ PRODUCT DATA ============
const PRODUCTS = [
  {
    id: 1,
    name: 'BOROUGH BOMBER',
    category: 'outerwear',
    price: 289,
    img: './assets/product_bomber.png',
    badge: 'NEW',
    sizes: ['S','M','L','XL'],
    soldOut: ['XL']
  },
  {
    id: 2,
    name: 'LITT NYC HOODIE',
    category: 'tops',
    price: 145,
    img: './assets/product_hoodie.png',
    badge: 'NEW',
    sizes: ['XS','S','M','L','XL'],
    soldOut: []
  },
  {
    id: 3,
    name: 'NYC CARGO',
    category: 'bottoms',
    price: 198,
    img: './assets/product_cargo.png',
    badge: null,
    sizes: ['28','30','32','34'],
    soldOut: ['34']
  },
  {
    id: 4,
    name: 'LITT NYC CAP',
    category: 'accessories',
    price: 55,
    img: './assets/product_cap.png',
    badge: 'NEW',
    sizes: ['ONE SIZE'],
    soldOut: []
  },
  {
    id: 5,
    name: 'FIVE BOROUGHS TEE',
    category: 'tops',
    price: 88,
    img: './assets/product_tee.png',
    badge: null,
    sizes: ['XS','S','M','L','XL','XXL'],
    soldOut: []
  },
  {
    id: 6,
    name: 'LITT NYC WINDBREAKER',
    category: 'outerwear',
    price: 225,
    img: './assets/product_bomber.png',
    badge: 'LIMITED',
    sizes: ['S','M','L'],
    soldOut: ['S']
  },
  {
    id: 7,
    name: 'BROOKLYN JOGGER',
    category: 'bottoms',
    price: 135,
    img: './assets/product_cargo.png',
    badge: null,
    sizes: ['XS','S','M','L','XL'],
    soldOut: []
  },
  {
    id: 8,
    name: 'FLAME LOGO TEE',
    category: 'tops',
    price: 72,
    img: './assets/product_tee.png',
    badge: null,
    sizes: ['XS','S','M','L','XL'],
    soldOut: []
  }
];

// ============ STATE ============
let cart = JSON.parse(localStorage.getItem('littnyc_cart') || '[]');
let currentFilter = 'all';

// ============ UTILS ============
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function saveCart() {
  localStorage.setItem('littnyc_cart', JSON.stringify(cart));
}

function formatPrice(n) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ============ TOAST ============
let toastTimer;
function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ============ CART ============
function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  $('#cartBadge').textContent = count;
  $('#cartCount').textContent = `(${count})`;
  $('#cartSubtotal').textContent = formatPrice(total);

  // Badge animation
  const badge = $('#cartBadge');
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 300);

  renderCartItems();

  const footer = $('#cartFooter');
  const empty = $('#cartEmpty');
  if (cart.length === 0) {
    empty.style.display = 'flex';
    footer.style.display = 'none';
  } else {
    empty.style.display = 'none';
    footer.style.display = 'flex';
  }
}

function renderCartItems() {
  const container = $('#cartItems');
  container.innerHTML = '';
  cart.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img class="cart-item__img" src="${item.img}" alt="${item.name}" />
      <div>
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">Qty: ${item.qty} — ${formatPrice(item.price * item.qty)}</div>
      </div>
      <button class="cart-item__remove" data-id="${item.id}" aria-label="Remove">✕</button>
    `;
    container.appendChild(div);
  });

  $$('.cart-item__remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      cart = cart.filter((i) => i.id !== Number(btn.dataset.id));
      saveCart();
      updateCartUI();
    });
  });
}

function addToCart(id, name, price) {
  const product = PRODUCTS.find(p => p.id === id) || { img: './assets/product_hoodie.png' };
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1, img: product.img });
  }
  saveCart();
  updateCartUI();
  showToast(`✓ ${name} added to bag`);
}

// ============ OPEN/CLOSE CART ============
function openCart() {
  $('#cartDrawer').classList.add('open');
  $('#cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $('#cartDrawer').classList.remove('open');
  $('#cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

$('#cartBtn').addEventListener('click', openCart);
$('#cartClose').addEventListener('click', closeCart);
$('#cartOverlay').addEventListener('click', closeCart);
$('#cartShopBtn')?.addEventListener('click', () => {
  closeCart();
  document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
});

// ============ SEARCH ============
function openSearch() {
  $('#searchOverlay').classList.add('open');
  setTimeout(() => $('#searchInput').focus(), 100);
  document.body.style.overflow = 'hidden';
}
function closeSearch() {
  $('#searchOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

$('#searchBtn').addEventListener('click', openSearch);
$('#searchClose').addEventListener('click', closeSearch);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSearch();
    closeCart();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
});

// ============ ANNOUNCEMENT BAR ============
$('#announceClose')?.addEventListener('click', () => {
  const bar = $('#announceBar');
  bar.style.maxHeight = bar.offsetHeight + 'px';
  requestAnimationFrame(() => {
    bar.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
    bar.style.maxHeight = '0';
    bar.style.opacity = '0';
    bar.style.overflow = 'hidden';
  });
  setTimeout(() => {
    bar.style.display = 'none';
    $('#navHeader').classList.add('announce-hidden');
  }, 350);
});

// ============ STICKY NAV ============
const navHeader = $('#navHeader');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 80) {
    navHeader.classList.add('scrolled');
  } else {
    navHeader.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// ============ MOBILE HAMBURGER ============
$('#navHamburger').addEventListener('click', () => {
  const menu = $('#mobileMenu');
  const isOpen = menu.classList.toggle('open');
  const spans = $$('#navHamburger span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close mobile menu on link click
$$('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    $('#mobileMenu').classList.remove('open');
    $$('#navHamburger span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ============ HERO IMAGE PARALLAX ============
const heroImg = $('#heroImg');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroImg.style.transform = `scale(1.05) translateY(${y * 0.12}px)`;
  }, { passive: true });
}

// ============ PRODUCT CARD FACTORY ============
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'drop-card';
  card.dataset.category = product.category;
  card.innerHTML = `
    <div class="drop-card__media">
      <img src="${product.img}" alt="${product.name}" class="drop-card__img" loading="lazy" />
      <div class="drop-card__overlay">
        <button class="quick-add-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">QUICK ADD</button>
      </div>
      ${product.badge ? `<div class="drop-card__badges"><span class="badge badge--${product.badge === 'LIMITED' ? 'limited' : 'new'}">${product.badge}</span></div>` : ''}
    </div>
    <div class="drop-card__info">
      <div class="drop-card__category">${product.category.toUpperCase()}</div>
      <h3 class="drop-card__name">${product.name}</h3>
      <div class="drop-card__bottom">
        <span class="drop-card__price">${formatPrice(product.price)}</span>
        <div class="drop-card__sizes">
          ${product.sizes.map(s => `<span class="size-chip${product.soldOut.includes(s) ? ' size-chip--sold' : ''}">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
  return card;
}

// ============ RENDER SHOP GRID ============
function renderShop(filter = 'all') {
  const grid = $('#shopGrid');
  grid.innerHTML = '';
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  filtered.forEach((p, i) => {
    const card = createProductCard(p);
    card.style.animationDelay = `${i * 60}ms`;
    card.classList.add('reveal');
    grid.appendChild(card);
  });
  // Trigger reveal
  setTimeout(() => {
    $$('#shopGrid .reveal').forEach(el => el.classList.add('visible'));
  }, 50);

  // Bind quick add buttons
  grid.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(Number(btn.dataset.id), btn.dataset.name, Number(btn.dataset.price));
    });
  });
}

// ============ FILTERS ============
$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    currentFilter = btn.dataset.filter;
    renderShop(currentFilter);
  });
});

// ============ QUICK ADD (Hero Cards) ============
$$('.quick-add-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(Number(btn.dataset.id), btn.dataset.name, Number(btn.dataset.price));
  });
});

// ============ LOAD MORE ============
$('#loadMoreBtn')?.addEventListener('click', () => {
  showToast('All products loaded — stay tuned for new drops!');
});

// ============ NEWSLETTER ============
$('#newsletterForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $('#emailInput').value.trim();
  if (!email) return;
  const success = $('#formSuccess');
  success.style.display = 'block';
  $('#emailInput').value = '';
  showToast('✓ You\'re on the list!');
  setTimeout(() => { success.style.display = 'none'; }, 5000);
});

// ============ SCROLL REVEAL ============
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

function initReveal() {
  $$('.section-header, .drop-card, .lb-item, .about-text, .about-visual, .press-logo, .newsletter-inner').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

// ============ SMOOTH ANCHOR LINKS ============
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderShop('all');
  updateCartUI();
  initReveal();
  console.log('%cLITT NYC™', 'font-size:2rem;font-weight:900;letter-spacing:0.1em;color:#c9a84c;');
  console.log('%cIf You Know, You Know.', 'color:#888;font-size:0.8rem;letter-spacing:0.1em;');
});
