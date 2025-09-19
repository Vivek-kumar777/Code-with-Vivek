// scripts/script.js

// Toggle mobile nav
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.nav-overlay');
  if (menuBtn && nav && overlay) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      overlay.classList.toggle('active');
      const isOpen = nav.classList.contains('active');
      menuBtn.setAttribute('aria-expanded', isOpen.toString());
      menuBtn.textContent = isOpen ? '✕' : 'MENU';
    });

    // Close menu when clicking nav links
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'MENU';
      });
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', () => {
      nav.classList.remove('active');
      overlay.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = 'MENU';
    });
  }

  // Dark mode toggle
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeBtn.textContent = '☀️';
  }
  
  themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // CTA buttons: scroll to contact
  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const contact = document.querySelector('#contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Welcome treat popup
  const treat = document.getElementById('welcome-treat');
  const closeBtn = document.getElementById('close-treat');
  if (treat && closeBtn) {
    treat.style.display = 'flex';
    function hideTreat() { treat.style.display = 'none'; }
    closeBtn.addEventListener('click', hideTreat);
    setTimeout(() => {
      document.addEventListener('click', hideTreat, { once: true });
      document.addEventListener('scroll', hideTreat, { once: true });
      document.addEventListener('keydown', hideTreat, { once: true });
    }, 1000);
  }

});

