;(function () {
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s))

  const PRODUCTS = [
    { id: 1, name: 'HydraGlow Serum', category: 'Skincare', price: 28, rating: 4.8, image: 'assets/images/prod-serum.jpg' },
    { id: 2, name: 'Velvet Finish Foundation', category: 'Makeup', price: 32, rating: 4.6, image: 'assets/images/prod-foundation.jpg' },
    { id: 3, name: 'Rose Cloud Blush', category: 'Makeup', price: 18, rating: 4.7, image: 'assets/images/prod-blush.jpg' },
    { id: 4, name: 'Silk Repair Hair Oil', category: 'Haircare', price: 22, rating: 4.5, image: 'assets/images/prod-hairoil.jpg' },
    { id: 5, name: 'Noir Eau de Parfum', category: 'Fragrance', price: 54, rating: 4.4, image: 'assets/images/prod-noir-perfume.jpg' },
    { id: 6, name: 'Pure Balance Cleanser', category: 'Skincare', price: 16, rating: 4.3, image: 'assets/images/prod-cleanser.jpg' },
    { id: 7, name: 'Luxe Lip Tint', category: 'Makeup', price: 14, rating: 4.2, image: 'assets/images/prod-liptint.jpg' },
    { id: 8, name: 'Radiance Day Cream', category: 'Skincare', price: 24, rating: 4.6, image: 'assets/images/prod-daycream.jpg' },
    { id: 9, name: 'Amber Musk', category: 'Fragrance', price: 49, rating: 4.1, image: 'assets/images/prod-ambermusk.jpg' },
    { id: 10, name: 'Curl Define Cream', category: 'Haircare', price: 19, rating: 4.0, image: 'assets/images/prod-curlcream.jpg' },
    { id: 11, name: 'Glow Drops Highlighter', category: 'Makeup', price: 20, rating: 4.4, image: 'assets/images/prod-highlighter.jpg' },
    { id: 12, name: 'Calm Night Mask', category: 'Skincare', price: 26, rating: 4.9, image: 'assets/images/prod-nightmask.jpg' }
  ]
  window.PRODUCTS = PRODUCTS

  function toast(msg) {
    let t = document.createElement('div')
    t.textContent = msg
    t.className = 'fixed bottom-5 right-5 px-4 py-3 rounded-xl bg-ink text-white shadow-lg text-sm z-[60]'
    document.body.appendChild(t)
    setTimeout(() => t.remove(), 2500)
  }

  function getCart() {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
  }
  function setCart(c) {
    localStorage.setItem('cart', JSON.stringify(c))
    updateCartCount()
  }
  function addToCart(p) {
    const cart = getCart()
    cart.push({ id: p.id, qty: 1 })
    setCart(cart)
    toast('Added to cart')
  }
  function updateCartCount() {
    const el = $('#cartCount')
    if (el) el.textContent = String(getCart().length)
  }

  function renderBestsellers() {
    const wrap = $('#bestsellers')
    if (!wrap) return
    const items = PRODUCTS.slice(0, 8)
    wrap.innerHTML = items.map(i => `
      <div class="group rounded-2xl border border-rose-100 bg-white p-3">
        <div class="relative">
          <img src="${i.image}" alt="${i.name}" class="h-48 w-full object-cover rounded-xl">
          <button data-id="${i.id}" class="add-cart absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-ink/90 text-white text-xs">Add</button>
        </div>
        <div class="mt-3">
          <div class="font-medium">${i.name}</div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-ink/60">${i.category}</span>
            <span class="font-semibold">$${i.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `).join('')
    $$('.add-cart', wrap).forEach(b => b.addEventListener('click', e => {
      const id = Number(e.currentTarget.getAttribute('data-id'))
      const p = PRODUCTS.find(x => x.id === id)
      if (p) addToCart(p)
    }))
  }

  function renderProductsPage() {
    const grid = $('#productGrid')
    if (!grid) return
    const count = $('#productsCount')
    const search = $('#searchInput')
    const sortSel = $('#sortSelect')
    const cats = $$('.cat')
    const min = $('#priceMin')
    const max = $('#priceMax')
    const applyPrice = $('#applyPrice')

    let filtered = [...PRODUCTS]
    const fromHash = decodeURIComponent(location.hash.replace('#', ''))
    if (fromHash) {
      cats.forEach(c => { if (c.value === fromHash) c.checked = true })
    }
    function applyFilters() {
      const q = (search?.value || '').trim().toLowerCase()
      const selCats = cats.filter(c => c.checked).map(c => c.value)
      const minV = Number(min.value || 0)
      const maxV = Number(max.value || 0)
      filtered = PRODUCTS.filter(p => {
        const byQ = !q || p.name.toLowerCase().includes(q)
        const byC = selCats.length === 0 || selCats.includes(p.category)
        const byMin = !minV || p.price >= minV
        const byMax = !maxV || p.price <= maxV
        return byQ && byC && byMin && byMax
      })
      const sort = sortSel?.value || 'featured'
      if (sort === 'price-asc') filtered.sort((a,b)=>a.price-b.price)
      if (sort === 'price-desc') filtered.sort((a,b)=>b.price-a.price)
      if (sort === 'rating-desc') filtered.sort((a,b)=>b.rating-a.rating)
      render()
    }
    function render() {
      if (count) count.textContent = `${filtered.length} products`
      grid.innerHTML = filtered.map(i => `
        <div class="rounded-2xl border border-rose-100 bg-white p-3 hover:shadow-md transition">
          <img src="${i.image}" alt="${i.name}" class="h-52 w-full object-cover rounded-xl">
          <div class="mt-3">
            <div class="font-medium">${i.name}</div>
            <div class="flex items-center justify-between text-sm mt-1">
              <span class="text-ink/60">${i.category}</span>
              <span class="font-semibold">$${i.price.toFixed(2)}</span>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <div class="text-xs text-ink/60">★ ${i.rating.toFixed(1)}</div>
              <button data-id="${i.id}" class="add-cart px-3 py-2 rounded-lg bg-primary text-white text-sm">Add to Cart</button>
            </div>
          </div>
        </div>
      `).join('')
      $$('.add-cart', grid).forEach(b => b.addEventListener('click', e => {
        const id = Number(e.currentTarget.getAttribute('data-id'))
        const p = PRODUCTS.find(x => x.id === id)
        if (p) addToCart(p)
      }))
    }
    search?.addEventListener('input', applyFilters)
    sortSel?.addEventListener('change', applyFilters)
    cats.forEach(c => c.addEventListener('change', applyFilters))
    applyPrice?.addEventListener('click', applyFilters)
    applyFilters()
  }

  function contactPage() {
    const form = $('#contactForm')
    if (!form) return
    const stars = $$('.star')
    const ratingValue = $('#ratingValue')
    const list = $('#feedbackList')
    function fillStars(v) {
      stars.forEach((s, i) => s.classList.toggle('bg-rose-100', i < v))
    }
    stars.forEach(s => s.addEventListener('click', e => {
      const v = Number(e.currentTarget.getAttribute('data-value'))
      ratingValue.value = String(v)
      fillStars(v)
    }))
    function getFeedbacks() {
      try { return JSON.parse(localStorage.getItem('feedbacks') || '[]') } catch { return [] }
    }
    function setFeedbacks(f) { localStorage.setItem('feedbacks', JSON.stringify(f)) }
    function renderList() {
      const all = getFeedbacks().slice(-6).reverse()
      list.innerHTML = all.map(f => `
        <div class="p-4 rounded-2xl border border-rose-100 bg-white">
          <div class="font-semibold">${f.name}</div>
          <div class="text-xs text-ink/60">${f.email}</div>
          <div class="mt-2 text-sm">${f.message}</div>
          <div class="mt-2 text-xs text-ink/60">Rating: ${'★'.repeat(f.rating)}</div>
        </div>
      `).join('')
    }
    renderList()
    form.addEventListener('submit', e => {
      e.preventDefault()
      const data = {
        name: $('#contactName').value.trim(),
        email: $('#contactEmail').value.trim(),
        message: $('#contactMessage').value.trim(),
        rating: Number($('#ratingValue').value || 5)
      }
      if (!data.name || !data.email || !data.message) return
      const all = getFeedbacks()
      all.push({ ...data, ts: Date.now() })
      setFeedbacks(all)
      renderList()
      form.reset()
      $('#ratingValue').value = '5'
      fillStars(5)
      toast('Thanks for your feedback')
    })
  }

  function authPage() {
    const loginForm = $('#loginForm')
    const signupForm = $('#signupForm')
    if (!loginForm && !signupForm) return
    function getUsers() {
      try { return JSON.parse(localStorage.getItem('users') || '[]') } catch { return [] }
    }
    function setUsers(u) { localStorage.setItem('users', JSON.stringify(u)) }
    loginForm?.addEventListener('submit', e => {
      e.preventDefault()
      const email = $('#loginEmail').value.trim().toLowerCase()
      const pwd = $('#loginPassword').value
      const u = getUsers().find(x => x.email === email && x.password === pwd)
      if (u) {
        localStorage.setItem('currentUser', JSON.stringify({ name: u.name, email: u.email }))
        toast('Welcome back')
        setTimeout(()=>location.href='index.html', 700)
      } else {
        toast('Invalid credentials')
      }
    })
    signupForm?.addEventListener('submit', e => {
      e.preventDefault()
      const name = $('#signupName').value.trim()
      const email = $('#signupEmail').value.trim().toLowerCase()
      const pwd = $('#signupPassword').value
      if (!name || !email || pwd.length < 6) { toast('Please complete the form'); return }
      const users = getUsers()
      if (users.some(u => u.email === email)) { toast('Email already registered'); return }
      users.push({ name, email, password: pwd })
      setUsers(users)
      toast('Account created')
      setTimeout(()=>location.href='index.html', 700)
    })
  }

  function layout() {
    $('#year') && ($('#year').textContent = String(new Date().getFullYear()))
    const btn = $('#mobileMenuBtn')
    const menu = $('#mobileMenu')
    btn && menu && btn.addEventListener('click', ()=> menu.classList.toggle('hidden'))
    updateCartCount()
  }

  document.addEventListener('DOMContentLoaded', () => {
    layout()
    renderBestsellers()
    renderProductsPage()
    contactPage()
    authPage()
    const nf = $('#newsletterForm')
    nf && nf.addEventListener('submit', e => {
      e.preventDefault()
      const v = $('#newsletterEmail').value.trim()
      if (!v) return
      try {
        const s = JSON.parse(localStorage.getItem('subscribers') || '[]')
        s.push({ email: v, ts: Date.now() })
        localStorage.setItem('subscribers', JSON.stringify(s))
      } catch {}
      $('#newsletterEmail').value = ''
      toast('Subscribed')
    })
  })
})()
