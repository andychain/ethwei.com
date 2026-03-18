// Apply theme immediately
var root = document.documentElement;
var saved = localStorage.getItem('ethwei-theme') || 'dark';
root.setAttribute('data-theme', saved);

// Wait for full page load
window.addEventListener('load', function () {

  // Theme toggle
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('ethwei-theme', next);
    });
  }

  // Hamburger
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.style.display = isOpen ? 'block' : 'none';
    });
  }

  // Language switcher
  var switcher = document.getElementById('langSwitcher');
  var langBtn = document.getElementById('langBtn');
  var dropdown = document.getElementById('langDropdown');
  if (langBtn && dropdown) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = switcher.classList.toggle('open');
      dropdown.style.display = isOpen ? 'block' : 'none';
    });
    document.addEventListener('click', function () {
      switcher.classList.remove('open');
      dropdown.style.display = 'none';
    });
  }

  // Search modal
  var modal = document.getElementById('searchModal');
  var trigger = document.getElementById('searchTrigger');
  var closeBtn = document.getElementById('searchClose');
  var backdrop = document.getElementById('searchBackdrop');
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');

  function openSearch() {
    modal.style.display = 'flex';
    if (input) input.focus();
  }
  function closeSearch() {
    modal.style.display = 'none';
    if (input) input.value = '';
    if (results) results.innerHTML = '<p class="search-hint">Type to search units, conversions, and more.</p>';
  }

  if (trigger) trigger.addEventListener('click', openSearch);
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  if (backdrop) backdrop.addEventListener('click', closeSearch);

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') closeSearch();
  });

  if (input) {
    input.addEventListener('input', async function () {
      var q = input.value.trim();
      if (!q) {
        results.innerHTML = '<p class="search-hint">Type to search units, conversions, and more.</p>';
        return;
      }
      try {
        if (!window.__pagefind__) {
          window.__pagefind__ = await import('/pagefind/pagefind.js');
          await window.__pagefind__.init();
        }
        var search = await window.__pagefind__.search(q);
        var data = await Promise.all(search.results.slice(0, 6).map(function(r) { return r.data(); }));
        results.innerHTML = data.length
          ? data.map(function(r) {
              return '<a class="search-result-item" href="' + r.url + '"><div class="result-title">' + (r.meta && r.meta.title ? r.meta.title : 'Page') + '</div><div class="result-excerpt">' + r.excerpt + '</div></a>';
            }).join('')
          : '<p class="search-hint">No results found.</p>';
      } catch(e) {
        results.innerHTML = '<p class="search-hint">Search unavailable.</p>';
      }
    });
  }

});
