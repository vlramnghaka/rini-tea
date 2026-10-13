let menuItems = [];
let selectedCategory = 'All';

document.addEventListener('DOMContentLoaded', () => {
  fetchMenuItems();
  setupSearchAndFilters();
  setupModalEvents();
});

// Fetch menu data from menu.json
async function fetchMenuItems() {
  try {
    const response = await fetch('menu.json');
    menuItems = await response.json();
    renderMenu(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
  }
}

// Render menu items as cards
function renderMenu(items) {
  const container = document.getElementById('menu-grid');
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No menu items found.</p>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" onerror="this.src='favicon.svg'">
      <div class="menu-card-body">
        <div class="menu-card-title">${item.name}</div>
        <div class="menu-card-price">₹ ${item.price}/${item.pack}</div>
      </div>
    `;
    card.addEventListener('click', () => openModal(item));
    container.appendChild(card);
  });
}

// Setup live search & category filters
function setupSearchAndFilters() {
  const searchBar = document.getElementById('search-bar');
  const filterBtns = document.querySelectorAll('.filter-btn');

  searchBar.addEventListener('input', () => {
    filterData();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      selectedCategory = e.target.dataset.category;
      filterData();
    });
  });
}

// Filter menu items by search keyword & active category
function filterData() {
  const query = document.getElementById('search-bar').value.toLowerCase().trim();

  const filtered = menuItems.filter(item => {
    const matchesCategory = (selectedCategory === 'All') || (item.category === selectedCategory);
    const matchesSearch = item.name.toLowerCase().includes(query) ||
                          item.description.toLowerCase().includes(query) ||
                          item['description-en'].toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  renderMenu(filtered);
}

// Modal dialog functionality
function openModal(item) {
  const modal = document.getElementById('item-modal');
  
  document.getElementById('modal-img').src = item.img;
  document.getElementById('modal-img').onerror = function() { this.src = 'favicon.svg'; };
  document.getElementById('modal-name').textContent = item.name;
  document.getElementById('modal-category').textContent = item.category;
  document.getElementById('modal-price').textContent = `₹ ${item.price}/${item.pack}`;
  document.getElementById('modal-desc-mizo').textContent = item.description || 'N/A';
  document.getElementById('modal-desc-en').textContent = item['description-en'] || 'N/A';

  modal.style.display = 'flex';
}

function setupModalEvents() {
  const modal = document.getElementById('item-modal');
  const closeBtn = document.getElementById('close-modal');

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}