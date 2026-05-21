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

// ============ TV STATIC EFFECT ============
function initTVStatic() {
  const canvas = document.getElementById('heroStaticCanvas');
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let staticBurstActive = 0; // 0 to 1 intensity
  let autoLoopTimeout;
  let isInitialized = true;
  
  // Mouse tracking state
  const mouse = {
    x: -1000,
    y: -1000,
    active: false,
    speedX: 0,
    speedY: 0,
    lastX: 0,
    lastY: 0,
    velocity: 0
  };

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    // 4x downscaling for retro chunky pixels & performance
    canvas.width = Math.floor(rect.width / 4) || 256;
    canvas.height = Math.floor(rect.height / 4) || 144;
  }

  function cleanup() {
    isInitialized = false;
    cancelAnimationFrame(animationFrameId);
    clearTimeout(autoLoopTimeout);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Mouse event listeners
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouse.speedX = x - mouse.lastX;
    mouse.speedY = y - mouse.lastY;
    // Calculate velocity for motion-based tearing
    mouse.velocity = Math.sqrt(mouse.speedX * mouse.speedX + mouse.speedY * mouse.speedY);
    
    mouse.x = x;
    mouse.y = y;
    mouse.lastX = x;
    mouse.lastY = y;
    mouse.active = true;
  });

  hero.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.velocity = 0;
  });

  // Trigger static burst animation
  function triggerStaticBurst() {
    if (!isInitialized) return;
    const media = hero.querySelector('.hero-media');
    if (media) {
      media.classList.add('crt-glitch');
      staticBurstActive = 1.0;
      
      // Set CSS custom property for image resolution recovery over 3s
      document.documentElement.style.setProperty('--static-opacity', '0.22');
      document.documentElement.style.setProperty('--scanlines-opacity', '0.85');
      
      setTimeout(() => {
        if (!isInitialized) return;
        media.classList.remove('crt-glitch');
        // Fade out static and scanlines over 2.5s while image sharpens
        document.documentElement.style.setProperty('--static-opacity', '0');
        document.documentElement.style.setProperty('--scanlines-opacity', '0');
      }, 650);
    }
  }

  // CRT Channel switch click trigger
  hero.addEventListener('click', (e) => {
    // Avoid triggering on links or buttons
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    
    clearTimeout(autoLoopTimeout);
    triggerStaticBurst();
    scheduleNextBurst();
  });

  // Schedule the next automatic burst
  function scheduleNextBurst() {
    if (!isInitialized) return;
    clearTimeout(autoLoopTimeout);
    // 3s static + ~2.5s fade = ~5.5s, schedule next at 6s
    autoLoopTimeout = setTimeout(() => {
      triggerStaticBurst();
      scheduleNextBurst();
    }, 6000);
  }

  // Main rendering loop
  function render() {
    if (!isInitialized) return;
    
    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) {
      animationFrameId = requestAnimationFrame(render);
      return;
    }

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // Decay the static burst intensity
    if (staticBurstActive > 0) {
      staticBurstActive -= 0.035;
      if (staticBurstActive < 0) staticBurstActive = 0;
    }

    // Map mouse position to canvas scale
    const rect = hero.getBoundingClientRect();
    const canvasMouseX = mouse.x * (width / rect.width);
    const canvasMouseY = mouse.y * (height / rect.height);
    
    // Magnetic interference radius (canvas space)
    const distThreshold = 35 + (mouse.velocity * 0.4); 

    // Generate base static noise (grayscale vs chromatic)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const val = Math.random() * 255;
        
        let isNearMouse = false;
        let dist = 0;
        
        if (mouse.active) {
          const dx = x - canvasMouseX;
          const dy = y - canvasMouseY;
          dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < distThreshold) {
            isNearMouse = true;
          }
        }

        if (staticBurstActive > 0.1) {
          // Intense multi-colored glitch burst during channel switch
          data[idx]     = Math.random() * 255;
          data[idx + 1] = Math.random() * 255;
          data[idx + 2] = Math.random() * 255;
          data[idx + 3] = 255;
        } else if (isNearMouse) {
          // Magnetic chromatic aberration near mouse
          const factor = Math.pow(1 - dist / distThreshold, 1.5);
          const valR = Math.random() * 255;
          const valG = Math.random() * 255;
          const valB = Math.random() * 255;
          
          data[idx]     = val * (1 - factor) + valR * factor;
          data[idx + 1] = val * (1 - factor) + valG * factor;
          data[idx + 2] = val * (1 - factor) + valB * factor;
          data[idx + 3] = 255;
        } else {
          // Grayscale base static
          data[idx]     = val;
          data[idx + 1] = val;
          data[idx + 2] = val;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Apply horizontal slice tearing (GPU accelerated shifts via drawImage)
    const glitchChance = 0.08 + (mouse.velocity * 0.015) + (staticBurstActive * 0.6);
    if (Math.random() < glitchChance) {
      const numTears = Math.floor(Math.random() * 4) + 1 + Math.floor(staticBurstActive * 6);
      for (let t = 0; t < numTears; t++) {
        const tearHeight = Math.floor(Math.random() * 20) + 4;
        const tearY = Math.floor(Math.random() * (height - tearHeight));
        // Calculate shift (larger during bursts or high speed mouse movements)
        const maxShift = 20 + Math.floor(mouse.velocity * 0.8) + Math.floor(staticBurstActive * 80);
        const shift = Math.floor((Math.random() - 0.5) * maxShift);
        
        ctx.drawImage(canvas, 0, tearY, width, tearHeight, shift, tearY, width, tearHeight);

        // Chromatic split edge lines
        if (Math.random() > 0.4) {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 0, 100, 0.6)' : 'rgba(0, 255, 255, 0.6)';
          ctx.fillRect(0, tearY + Math.floor(Math.random() * tearHeight), width, 1);
        }
      }
    }

    // Dampen mouse velocity tracking gradually
    if (mouse.velocity > 0) {
      mouse.velocity *= 0.95;
    }

    animationFrameId = requestAnimationFrame(render);
  }

  animationFrameId = requestAnimationFrame(render);
  
  // Start the auto-loop when user is on hero page
  scheduleNextBurst();

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  
  return cleanup;
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderShop('all');
  updateCartUI();
  initReveal();
  initTVStatic();
  console.log('%cLITT NYC™', 'font-size:2rem;font-weight:900;letter-spacing:0.1em;color:#c9a84c;');
  console.log('%cIf You Know, You Know.', 'color:#888;font-size:0.8rem;letter-spacing:0.1em;');
});
