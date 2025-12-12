/* src/scripts/main.js - VERSÃO DEFINITIVA COM SFX E PARTÍCULAS */

// 0. CONSOLE
console.log(
    "%c H. BARBOSA %c SYSTEM ONLINE ",
    "background: #7c3aed; color: white; font-weight: bold; padding: 4px; border-radius: 3px 0 0 3px;",
    "background: #1e1e2e; color: #a6accd; padding: 4px; border-radius: 0 3px 3px 0;"
);

// --- SFX ENGINE (Sons via CDN) ---
const SFX = {
    // Usando sons curtos e otimizados de UI sci-fi
    explosion: new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_5b36934509.mp3'), // Som de impacto profundo
    warp: new Audio('https://cdn.pixabay.com/audio/2022/03/24/audio_73e726880c.mp3'),     // Som de aceleração

    play(sound) {
        sound.volume = 0.4; // Volume agradável
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Áudio bloqueado pelo navegador (normal sem interação)"));
    }
};

// 1. GERENCIAMENTO DA SUPERNOVA (PRELOADER)
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Mantém os 5 segundos de tensão inicial
        setTimeout(() => {
            // Dispara a implosão visual
            preloader.classList.add('loading-finished');

            // Tenta tocar o som da explosão (pode ser bloqueado se o user não clicou na página ainda)
            // Dica: A maioria dos navegadores bloqueia audio autoplay.
            // O som funcionará melhor se o usuário já tiver interagido, mas tentamos mesmo assim.
            SFX.play(SFX.explosion);

            // Dispara as partículas da explosão
            createExplosionParticles();

            // Remove o preloader após o flash
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 2000);
        }, 2000);
    }
});

// --- SISTEMA DE PARTÍCULAS (EXPLOSÃO) ---
function createExplosionParticles() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999'; // Acima de tudo
    document.body.appendChild(container);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Cria 50 partículas
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = Math.random() * 4 + 2 + 'px'; // Tamanho variável
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = Math.random() > 0.5 ? '#fff' : '#a855f7'; // Branco ou Roxo
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 10px ' + particle.style.backgroundColor;

        container.appendChild(particle);

        // Animação individual com física simples
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 200 + 100; // Velocidade da explosão
        const tx = Math.cos(angle) * window.innerWidth * 0.8;
        const ty = Math.sin(angle) * window.innerHeight * 0.8;

        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
        ], {
            duration: Math.random() * 1000 + 500, // 0.5s a 1.5s
            easing: 'cubic-bezier(0, .9, .57, 1)', // Sai rápido, desacelera
            fill: 'forwards'
        });
    }

    // Limpa o container depois que as partículas somem
    setTimeout(() => {
        container.remove();
    }, 2000);
}

// 2. STARFIELD PROCEDURAL (Com correção de erro de raio negativo)
const canvas = document.getElementById('starfield');
let isWarpSpeed = false;

if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    // Otimização mobile: reduz estrelas em dispositivos menores
    const isMobile = window.innerWidth < 768;
    const numStars = isMobile ? 200 : 800;

    class Star {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = (Math.random() - 0.5) * width;
            this.y = (Math.random() - 0.5) * height;
            this.z = initial ? Math.random() * width : width;
            this.size = Math.random();
        }

        update() {
            const speed = isWarpSpeed ? 80 : 2;
            this.z -= speed;

            if (this.z <= 1) {
                this.reset();
                this.z = width;
            }
        }

        draw() {
            // Se z for 0 ou negativo (muito perto ou erro), evita divisão por zero
            if (this.z <= 0) return;

            // Projeção 3D: x = x_real / z
            const x = (this.x / this.z) * width + width / 2;
            const y = (this.y / this.z) * height + height / 2;

            // Escala baseada na proximidade (quanto menor z, maior o objeto)
            let scale = (1 - this.z / width);

            // FIX: Evita erro de raio negativo se a tela for redimensionada e z > width
            if (scale < 0) scale = 0;

            const r = this.size * scale * (isWarpSpeed ? 4 : 2);

            if (x < 0 || x > width || y < 0 || y > height) return;

            ctx.beginPath();

            if (isWarpSpeed) {
                // Efeito de Rastro (Warp)
                const prevScale = (1 - (this.z + 100) / width);
                // Segurança extra para o traço também
                if (prevScale > 0) {
                    const prevX = (this.x / (this.z + 100)) * width + width / 2;
                    const prevY = (this.y / (this.z + 100)) * height + height / 2;

                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(x, y);
                    ctx.strokeStyle = `rgba(168, 85, 247, ${scale})`;
                    ctx.lineWidth = r;
                    ctx.stroke();
                }
            } else {
                // Estrela normal
                ctx.fillStyle = `rgba(255, 255, 255, ${scale})`;
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function initStars() {
        resize();
        stars = [];
        for (let i = 0; i < numStars; i++) stars.push(new Star());
        animate();
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function animate() {
        ctx.fillStyle = isWarpSpeed ? 'rgba(2, 4, 10, 0.3)' : '#02040a';
        ctx.fillRect(0, 0, width, height);

        stars.forEach(star => { star.update(); star.draw(); });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    initStars();
}

// 3. KONAMI CODE
const konamiCode = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
];
let konamiIndex = 0;

document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            triggerWarpDrive();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function triggerWarpDrive() {
    isWarpSpeed = !isWarpSpeed;
    const body = document.body;

    if (isWarpSpeed) {
        body.classList.add("warp-active");
        SFX.play(SFX.warp); // Toca o som de dobra espacial!

        const notification = document.createElement('div');
        notification.innerHTML = "WARP DRIVE <span style='color:white'>ENGAGED</span>";
        notification.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); color:#a855f7; font-family:monospace; font-size:clamp(2rem, 5vw, 4rem); font-weight:bold; z-index:9999; pointer-events:none; text-shadow:0 0 30px #a855f7; white-space:nowrap; letter-spacing: 0.1em;";
        document.body.appendChild(notification);

        notification.animate([
            { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' },
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1.1)', offset: 0.1 },
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1)', offset: 0.8 },
            { opacity: 0, transform: 'translate(-50%, -50%) scale(1.5)' }
        ], { duration: 2500, fill: 'forwards' });

        setTimeout(() => notification.remove(), 2500);
    } else {
        body.classList.remove("warp-active");
    }
}

// 4. SCROLL REVEAL & CURSOR
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
const cursor = document.getElementById('custom-cursor');
const cursorBlur = document.getElementById('custom-cursor-blur');

if (cursor && cursorBlur) {
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
        cursorBlur.animate({ left: `${clientX}px`, top: `${clientY}px` }, { duration: 500, fill: "forwards" });
    });
}

// 5. MENU MOBILE & SIDEBAR
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const mainContent = document.getElementById('main-content');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

function toggleMenu() {
    if (!menuToggle || !sidebar) return;
    menuToggle.classList.toggle('open');
    sidebar.classList.toggle('open');
    if (sidebarOverlay) sidebarOverlay.classList.toggle('open');

    if (mainContent) {
        const isOpen = sidebar.classList.contains('open');
        mainContent.style.transform = isOpen ? 'translateX(-50px) scale(0.95) perspective(1000px) rotateY(2deg)' : '';
        mainContent.style.filter = isOpen ? 'blur(3px) brightness(0.5)' : '';
        mainContent.style.pointerEvents = isOpen ? 'none' : 'auto';
    }
}

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleMenu);
    sidebarLinks.forEach(link => link.addEventListener('click', toggleMenu));
}