(function() {
    const canvas = document.getElementById('scrollCanvas');
    const ctx = canvas.getContext('2d');
    const section = document.getElementById('scrollSection');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingBar = document.getElementById('loadingBar');
    const loadingPercent = document.getElementById('loadingPercent');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const frameCounter = document.getElementById('frameCounter');
    const textOverlay = document.getElementById('textOverlay');
    const textTitle = document.getElementById('textTitle');
    const textDescription = document.getElementById('textDescription');
    const mainNavbar = document.getElementById('mainNavbar');

    const TOTAL_FRAMES = 2485;
    const isGitHubPages = window.location.hostname.includes('github.io');
    const FRAME_PATH = isGitHubPages ? '../assets/videos/frames_12fps/webp85/' : '../assets/videos/frames_12fps/';
    const FRAME_EXT = isGitHubPages ? '.webp' : '.jpg';
    
    // Limite de memória para não travar o PC no localhost
    const CACHE_LIMIT = isGitHubPages ? 2485 : 400; 
    const BUFFER_SIZE = 100;

    const storyTexts = [
        {
            start: -20,
            end: 30,
            title: 'GOD OF WAR III',
            description: '"A medida de um homem é o que ele faz com o poder." — Platão',
            position: 'overlay-center'
        },
        {
            start: 80,
            end: 180,
            title: 'O INÍCIO DA LENDA',
            description: 'Nos tempos antigos, os deuses do Olimpo governavam a Grécia com poder absoluto. Mas uma lenda surgiu para tomar seu lugar entre eles.',
            position: 'bottom-left'
        },
        {
            start: 200,
            end: 350,
            title: 'O FANTASMA DE ESPARTA',
            description: 'Kratos, um guerreiro espartano, era assombrado por visões de sua família. Nem as mãos da morte podiam derrotá-lo.',
            position: 'bottom-left'
        },
        {
            start: 560,
            end: 680,
            title: 'O PACTO COM ARES',
            description: 'À beira da derrota, Kratos clamou ao deus da guerra Ares. Em troca de poder devastador, entregou sua alma — e sem saber, selou o destino de sua própria família.',
            position: 'bottom-right'
        },
        {
            start: 680,
            end: 770,
            title: 'AS LÂMINAS DO CAOS',
            description: 'Ares forjou as Lâminas do Caos, correntes fundidas nos braços de Kratos. Armas que nunca poderiam ser removidas — um lembrete eterno de seu pacto sombrio.',
            position: 'bottom-left'
        },
        {
            start: 770,
            end: 870,
            title: 'TRAGÉDIA E FÚRIA',
            description: 'Kratos caminhava pelo interior dos templos gregos, destruindo tudo em seu caminho. Sua fúria não conhecia limites enquanto buscava libertar-se da maldição dos deuses.',
            position: 'bottom-right'
        },
        {
            start: 850,
            end: 1000,
            title: 'SANGUE E REDENÇÃO',
            description: 'Manchado pelo sangue de incontáveis batalhas, Kratos descobriu que havia assassinado sua própria esposa e filha — uma armadilha de Ares. Suas cinzas foram grudadas em sua pele, tornando-o o Fantasma de Esparta.',
            position: 'overlay-center'
        },
        {
            start: 1030,
            end: 1200,
            title: 'SERVO DOS DEUSES',
            description: 'Por dez anos, Kratos serviu os deuses do Olimpo em busca de perdão. Cada missão mais brutal que a anterior, mas os pesadelos nunca cessavam.',
            position: 'bottom-left'
        },
        {
            start: 1180,
            end: 1436,
            title: 'A QUEDA DE ARES',
            description: 'Com a Caixa de Pandora em mãos, Kratos enfrentou Ares em uma batalha épica. O deus da guerra caiu, e Kratos tomou seu lugar no Olimpo como o novo Deus da Guerra.',
            position: 'bottom-right'
        },
        {
            start: 1460,
            end: 1630,
            title: 'DEUS DA GUERRA',
            description: 'Sentado no trono do Olimpo, Kratos liderava seus exércitos espartanos. Mas os outros deuses o temiam e conspiravam contra ele, pois sua sede de vingança era insaciável.',
            position: 'overlay-center'
        },
        {
            start: 1700,
            end: 1990,
            title: 'TRAIÇÃO DE ZEUS',
            description: 'Zeus, rei dos deuses e pai de Kratos, traiu seu próprio filho. Com medo de uma profecia que previa a queda do Olimpo, Zeus drenou os poderes de Kratos e o matou com a Lâmina do Olimpo, gerando assim sua icônica cicatriz.',
            position: 'bottom-left'
        },
        {
            start: 2025,
            end: 2110,
            title: 'ESCAPE DO HADES',
            description: 'Mas Kratos recusou a morte. Escapando do submundo com a ajuda do titã Gaia, ele jurou vingança contra todos os deuses do Olimpo — começando por Zeus.',
            position: 'bottom-right'
        },
        {
            start: 2110,
            end: 2200,
            title: 'A ESCALADA DO OLIMPO',
            description: 'Montado nas costas de Gaia, Kratos liderou os Titãs em um assalto ao Monte Olimpo. A Grande Guerra entre Titãs e Deuses recomeçou, e o mundo tremeu sob seus passos.',
            position: 'overlay-center'
        },
        {
            start: 2200,
            end: 2300,
            title: 'DESTRUIÇÃO DOS DEUSES',
            description: 'Um por um, os deuses caíram diante de Kratos. Poseidon, Hades, Hélio, Hermes, Hércules, Hefesto — nenhum foi poupado da fúria do Fantasma de Esparta.',
            position: 'bottom-left'
        },
        {
            start: 2250,
            end: 2390,
            title: 'O FIM DO OLIMPO',
            description: 'Com o Olimpo em ruínas e a Grécia devastada por pragas e catástrofes, Kratos finalmente confrontou Zeus. A batalha final entre pai e filho determinou o destino de toda a civilização.',
            position: 'bottom-right'
        },
        {
            start: 2350,
            end: 2485,
            title: 'ESPERANÇA',
            description: 'Ao derrotar Zeus, Kratos escolheu libertar o poder da Esperança para a humanidade em vez de mantê-lo para si. Um sacrifício final que marcou o fim de uma era — e o começo de uma nova jornada.',
            position: 'overlay-center'
        }
    ];

    function getFrameSrc(index) {
        return FRAME_PATH + 'frame_' + String(index).padStart(4, '0') + FRAME_EXT;
    }

    const imageCache = new Map();
    const loadingPromises = new Map();
    let currentFrameIndex = 1;
    let isReady = false;

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawFrame(index) {
        const img = imageCache.get(index);
        if (!img || !img.complete) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;
        let dW, dH, oX, oY;
        if (imgRatio > canvasRatio) { dH = canvas.height; dW = imgRatio * dH; oX = (canvas.width - dW) / 2; oY = 0; }
        else { dW = canvas.width; dH = dW / imgRatio; oX = 0; oY = (canvas.height - dH) / 2; }
        ctx.drawImage(img, oX, oY, dW, dH);
    }

    function updateTextOverlay(index) {
        let active = null;
        for (const t of storyTexts) { if (index >= t.start && index <= t.end) { active = t; break; } }
        if (active) {
            textTitle.textContent = active.title;
            textDescription.textContent = active.description;
            textOverlay.style.opacity = 1;
            textOverlay.style.visibility = 'visible';
            textOverlay.className = 'text-overlay text-' + active.position;
        } else {
            textOverlay.style.opacity = 0;
            textOverlay.style.visibility = 'hidden';
        }
    }

    function loadImage(index) {
        if (imageCache.has(index)) return Promise.resolve(imageCache.get(index));
        if (loadingPromises.has(index)) return loadingPromises.get(index);
        const p = new Promise((res) => {
            const img = new Image();
            img.onload = () => {
                if (imageCache.size >= CACHE_LIMIT) {
                    let furthest = -1, maxD = -1;
                    for (const k of imageCache.keys()) {
                        let d = Math.abs(k - currentFrameIndex);
                        if (d > maxD) { maxD = d; furthest = k; }
                    }
                    if (furthest !== -1) imageCache.delete(furthest);
                }
                imageCache.set(index, img);
                loadingPromises.delete(index);
                res(img);
            };
            img.onerror = () => { loadingPromises.delete(index); res(null); };
            img.src = getFrameSrc(index);
        });
        loadingPromises.set(index, p);
        return p;
    }

    async function preloadInitial() {
        for (let i = 1; i <= 50; i++) await loadImage(i);
        drawFrame(1);
        updateTextOverlay(1);
        loadingOverlay.classList.add('hidden');
        isReady = true;
        backgroundPreload();
    }

    async function backgroundPreload() {
        for (let i = 1; i <= TOTAL_FRAMES; i += 10) {
            const batch = [];
            for (let j = i; j < i + 10 && j <= TOTAL_FRAMES; j++) batch.push(loadImage(j));
            await Promise.all(batch);
            await new Promise(r => setTimeout(r, 50));
        }
    }

    async function ensureFrames(center) {
        const batch = [];
        for (let i = center - 10; i <= center + 10; i++) {
            if (i >= 1 && i <= TOTAL_FRAMES && !imageCache.has(i)) batch.push(loadImage(i));
        }
        await Promise.all(batch);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!isReady || ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const top = section.offsetTop;
            const height = section.offsetHeight - window.innerHeight;
            let prog = (window.scrollY - top) / height;
            prog = Math.max(0, Math.min(1, prog));
            const idx = Math.max(1, Math.min(TOTAL_FRAMES, Math.floor(prog * (TOTAL_FRAMES - 1)) + 1));
            
            if (idx !== currentFrameIndex) {
                currentFrameIndex = idx;
                drawFrame(idx);
                updateTextOverlay(idx);
                frameCounter.textContent = 'Frame ' + idx + ' / ' + TOTAL_FRAMES;
                ensureFrames(idx);
            }
            
            if (mainNavbar) {
                if (prog > 0.01 && prog < 0.99) mainNavbar.classList.add('navbar-hidden');
                else mainNavbar.classList.remove('navbar-hidden');
            }
            ticking = false;
        });
    });

    preloadInitial();
})();
