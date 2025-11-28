/* src/scripts/main.js */

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
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        cursorBlur.animate({
            left: e.clientX + 'px',
            top: e.clientY + 'px'
        }, { duration: 500, fill: "forwards" });
    });
}


// 3. BACKGROUND DE PARTÍCULAS (Constelação)
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;
    const numberOfParticles = 80; // Quantidade de nós

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.fillStyle = '#7c3aed'; // Roxo
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            // Conexões (Linhas)
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(124, 58, 237, ${1 - distance / 100})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });
}


// 4. CHATBOT IA (Lógica Simples)
const chatToggle = document.getElementById('chat-toggle');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

if (chatToggle) {
    chatToggle.addEventListener('click', () => {
        chatBox.classList.toggle('hidden');
        chatBox.classList.toggle('flex');
    });

    const knowledgeBase = {
        "python": "Tenho experiência sólida em Python, usando bibliotecas como Pandas, NumPy e Scikit-learn para análise de dados e ML.",
        "experiência": "Trabalhei na SEDUC automatizando processos (redução de 62% no tempo) e na Serede com análise de dados operacionais.",
        "contato": "Você pode me chamar no WhatsApp (91) 981646532 ou enviar email para byronkingdev@gmail.com.",
        "skills": "Minhas principais skills são Python, SQL, Machine Learning, Power BI e automação de processos.",
        "default": "Sou uma IA treinada no perfil do Luiz. Pergunte sobre 'Python', 'Experiência' ou 'Skills'."
    };

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `p-2 rounded-lg text-sm max-w-[80%] ${sender === 'user' ? 'bg-purple-600 ml-auto text-white' : 'bg-slate-700 text-slate-200'}`;
        div.innerText = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatSend.addEventListener('click', () => {
        const text = chatInput.value.toLowerCase();
        if (!text) return;
        
        addMessage(chatInput.value, 'user');
        chatInput.value = '';

        setTimeout(() => {
            let response = knowledgeBase.default;
            for (const key in knowledgeBase) {
                if (text.includes(key)) response = knowledgeBase[key];
            }
            addMessage(response, 'bot');
        }, 600);
    });
}