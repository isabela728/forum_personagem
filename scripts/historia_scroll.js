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
    const FRAME_PATH = '../assets/videos/frames_12fps/';

    // Buffer size: how many frames ahead/behind to preload
    const BUFFER_SIZE = 40;

    // ===== STORY TEXT OVERLAYS =====
    // Each entry: { start, end, title, description, position }
    // position: 'center', 'bottom-left', 'bottom-right', 'top-left', 'top-right'
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

    // Build frame URL
    function getFrameSrc(index) {
        return FRAME_PATH + 'frame_' + String(index).padStart(4, '0') + '.jpg';
    }

    // Image cache
    const imageCache = new Map();
    let currentFrameIndex = 1;
    let isReady = false;

    // Set canvas resolution
    function resizeCanvas() {
        canvas.width = window.innerWidth * (window.devicePixelRatio > 1 ? 2 : 1);
        canvas.height = window.innerHeight * (window.devicePixelRatio > 1 ? 2 : 1);
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        drawFrame(currentFrameIndex);
    });

    // Draw a frame on canvas (cover mode)
    function drawFrame(index) {
        const img = imageCache.get(index);
        if (!img || !img.complete || img.naturalWidth === 0) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.naturalWidth / img.naturalHeight;

        let drawW, drawH, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
            drawH = canvas.height;
            drawW = imgRatio * drawH;
            offsetX = (canvas.width - drawW) / 2;
            offsetY = 0;
        } else {
            drawW = canvas.width;
            drawH = drawW / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawH) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }

    // ===== TEXT OVERLAY LOGIC =====
    function updateTextOverlay(frameIndex) {
        let activeText = null;
        let opacity = 0;

        for (const entry of storyTexts) {
            if (frameIndex >= entry.start && frameIndex <= entry.end) {
                activeText = entry;

                // Calculate fade in/out opacity
                const range = entry.end - entry.start;
                const fadeZone = Math.min(40, range * 0.2); // 20% of range or 40 frames
                const progress = frameIndex - entry.start;
                const remaining = entry.end - frameIndex;

                if (progress < fadeZone) {
                    opacity = progress / fadeZone;
                } else if (remaining < fadeZone) {
                    opacity = remaining / fadeZone;
                } else {
                    opacity = 1;
                }
                break;
            }
        }

        if (activeText) {
            textTitle.textContent = activeText.title;
            textDescription.textContent = activeText.description;
            textOverlay.style.opacity = opacity;
            textOverlay.style.visibility = 'visible';

            // Update position class
            textOverlay.className = 'text-overlay text-' + activeText.position;
        } else {
            textOverlay.style.opacity = 0;
            textOverlay.style.visibility = 'hidden';
        }
    }

    // Load a single image and return a promise
    function loadImage(index) {
        if (imageCache.has(index)) return Promise.resolve(imageCache.get(index));
        
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                imageCache.set(index, img);
                resolve(img);
            };
            img.onerror = () => resolve(null);
            img.src = getFrameSrc(index);
        });
    }

    // Preload initial batch (first ~80 frames for a smooth start)
    async function preloadInitial() {
        const initialBatch = 80;
        let loaded = 0;

        const promises = [];
        for (let i = 1; i <= initialBatch; i++) {
            promises.push(
                loadImage(i).then(() => {
                    loaded++;
                    const pct = Math.round((loaded / initialBatch) * 100);
                    loadingBar.style.width = pct + '%';
                    loadingPercent.textContent = pct + '%';
                })
            );
        }

        await Promise.all(promises);

        // Draw first frame
        drawFrame(1);
        updateTextOverlay(1);

        // Hide loading overlay
        loadingOverlay.classList.add('hidden');
        isReady = true;

        // Start background preloading
        backgroundPreload();
    }

    // Background preload: loads frames in chunks
    let preloadingActive = false;
    async function backgroundPreload() {
        if (preloadingActive) return;
        preloadingActive = true;

        const chunkSize = 20;
        for (let i = 1; i <= TOTAL_FRAMES; i += chunkSize) {
            const promises = [];
            for (let j = i; j < Math.min(i + chunkSize, TOTAL_FRAMES + 1); j++) {
                if (!imageCache.has(j)) {
                    promises.push(loadImage(j));
                }
            }
            if (promises.length > 0) {
                await Promise.all(promises);
            }
            // Small yield to keep UI responsive
            await new Promise(r => setTimeout(r, 10));
        }

        preloadingActive = false;
    }

    // On-demand loading for frames near the scroll position
    async function ensureFramesLoaded(centerIndex) {
        const start = Math.max(1, centerIndex - BUFFER_SIZE);
        const end = Math.min(TOTAL_FRAMES, centerIndex + BUFFER_SIZE);
        
        const toLoad = [];
        for (let i = start; i <= end; i++) {
            if (!imageCache.has(i)) {
                toLoad.push(i);
            }
        }

        if (toLoad.length > 0) {
            await Promise.all(toLoad.map(i => loadImage(i)));
        }
    }

    // Calculate which frame to show based on scroll
    function getScrollProgress() {
        const sectionTop = section.offsetTop;
        const scrollableHeight = section.offsetHeight - window.innerHeight;
        const scrollY = window.scrollY - sectionTop;

        let progress = scrollY / scrollableHeight;
        progress = Math.min(Math.max(progress, 0), 1);
        return progress;
    }

    function getFrameFromScroll(progress) {
        return Math.max(1, Math.min(TOTAL_FRAMES, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1));
    }

    // Scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!isReady) return;

        // Hide scroll indicator after scrolling a bit
        if (window.scrollY > 200) {
            scrollIndicator.classList.add('hide');
        } else {
            scrollIndicator.classList.remove('hide');
        }

        if (!ticking) {
            requestAnimationFrame(() => {
                const progress = getScrollProgress();
                const frameIndex = getFrameFromScroll(progress);
                
                // Navbar visibility logic: Show at top (progress < 0.01) or bottom (progress > 0.99)
                if (mainNavbar) {
                    if (progress > 0.01 && progress < 0.99) {
                        mainNavbar.classList.add('navbar-hidden');
                    } else {
                        mainNavbar.classList.remove('navbar-hidden');
                    }
                }
                
                if (frameIndex !== currentFrameIndex) {
                    currentFrameIndex = frameIndex;
                    drawFrame(currentFrameIndex);
                    updateTextOverlay(currentFrameIndex);
                    
                    // Update frame counter
                    frameCounter.textContent = 'Frame ' + currentFrameIndex + ' / ' + TOTAL_FRAMES;

                    // Trigger on-demand loading
                    ensureFramesLoaded(currentFrameIndex);
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });

    // Start
    preloadInitial();
})();
