/* src/scripts/main.js - VERSÃO SUPERNOVA COM DELAY ESTENDIDO */

// 0. CONSOLE SECRETO
console.log(
    "%c H. BARBOSA %c SYSTEM ONLINE ",
    "background: #7c3aed; color: white; font-weight: bold; padding: 4px; border-radius: 3px 0 0 3px;",
    "background: #1e1e2e; color: #a6accd; padding: 4px; border-radius: 0 3px 3px 0;"
);
console.log(
    "%c⚠ DETECÇÃO DE SINAL EXTERNO.\n%cAnalisando perfil... Visitante identificado.\nSe você procura inteligência de dados além do convencional, iniciou a conexão correta.\n\n📡 Contato: byronkingdev@gmail.com",
    "color: #fbbf24; font-family: monospace; font-size: 12px;",
    "color: #94a3b8; font-family: sans-serif; line-height: 1.5;"
);

// 1. GERENCIAMENTO DA SUPERNOVA (PRELOADER)
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Agora esperamos 5 SEGUNDOS (5000ms) para criar suspense
        // O visitante verá o núcleo pulsando e os anéis girando antes do colapso
        setTimeout(() => {
            // Ativa a animação de explosão (flash de luz) definida no CSS
            preloader.classList.add('loading-finished');
            
            // A animação de explosão dura 1.2s no CSS. 
            // Esperamos ela terminar exatamente para remover o elemento da tela.
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1200); 
        }, 5000); // <-- AQUI ESTÁ A MUDANÇA: 500ms -> 5000ms
    }
});

// 2. STARFIELD PROCEDURAL & WARP SPEED
const canvas = document.getElementById('starfield');
let isWarpSpeed = false;

if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    const numStars = 800;

    class Star {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = (Math.random() - 0.5) * width;
            this.y = (Math.random() - 0.5) * height;
            // Se inicial, espalha em profundidade. Se não, começa lá no fundo (z = width)
            this.z = initial ? Math.random() * width : width;
            this.size = Math.random();
        }

        update() {
            // Velocidade dinâmica: 80 em Warp, 2 normal
            const speed = isWarpSpeed ? 80 : 2; 
            this.z -= speed;

            // Se passar da tela (z < 1), recicla a estrela
            if (this.z <= 1) {
                this.reset();
                this.z = width;
            }
        }

        draw() {
            // Projeção 3D: x = x_real / z
            const x = (this.x / this.z) * width + width / 2;
            const y = (this.y / this.z) * height + height / 2;

            // Escala baseada na proximidade (quanto menor z, maior o objeto)
            const scale = (1 - this.z / width);
            const r = this.size * scale * (isWarpSpeed ? 4 : 2);

            if (x < 0 || x > width || y < 0 || y > height) return;

            ctx.beginPath();
            
            if (isWarpSpeed) {
                // Efeito de Rastro (Warp)
                const prevScale = (1 - (this.z + 100) / width);
                const prevX = (this.x / (this.z + 100)) * width + width / 2;
                const prevY = (this.y / (this.z + 100)) * height + height / 2;
                
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `rgba(168, 85, 247, ${scale})`; 
                ctx.lineWidth = r;
                ctx.stroke();
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
        // Rastro suave
        ctx.fillStyle = isWarpSpeed ? 'rgba(2, 4, 10, 0.3)' : '#02040a';
        ctx.fillRect(0, 0, width, height);
        
        stars.forEach(star => { star.update(); star.draw(); });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    initStars();
}

// 3. KONAMI CODE (Ativador do Warp)
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
        
        // Notificação Visual
        const notification = document.createElement('div');
        notification.innerHTML = "WARP DRIVE <span style='color:white'>ENGAGED</span>";
        notification.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); color:#a855f7; font-family:monospace; font-size:clamp(2rem, 5vw, 4rem); font-weight:bold; z-index:9999; pointer-events:none; text-shadow:0 0 30px #a855f7; white-space:nowrap; letter-spacing: 0.1em;";
        document.body.appendChild(notification);
        
        // Animação da notificação
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