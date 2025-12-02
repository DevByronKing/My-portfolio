/* src/scripts/main.js - ATUALIZADO */

// 1. SCROLL REVEAL (Animação ao rolar)
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 2. CURSOR PERSONALIZADO (Glow)
const cursor = document.getElementById('custom-cursor');
const cursorBlur = document.getElementById('custom-cursor-blur');

if (cursor && cursorBlur) {
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
        cursorBlur.animate({ transform: `translate(${clientX}px, ${clientY}px)` }, { duration: 800, fill: "forwards" });
    });
}

// 3. EFEITO PARALLAX NO FUNDO
const spaceBg = document.querySelector('.space-bg');
const planet1 = document.querySelector('.planet-1');
const planet2 = document.querySelector('.planet-2');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (spaceBg) spaceBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    if (planet1) planet1.style.transform = `translateY(${scrollY * 0.5}px)`;
    if (planet2) planet2.style.transform = `translateY(${scrollY * 0.2}px)`;
});

// 4. LÓGICA DO MENU SIDEBAR
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const mainContent = document.getElementById('main-content');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

function toggleMenu() {
    menuToggle.classList.toggle('open');
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('open');
    mainContent.style.transform = sidebar.classList.contains('open') ? 'translateX(-100px)' : 'translateX(0)';
}

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
    sidebarOverlay.addEventListener('click', toggleMenu);
    sidebarLinks.forEach(link => link.addEventListener('click', toggleMenu));
}

// 5. PRELOADER
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
    }
});