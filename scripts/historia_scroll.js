(function () {
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

    const FRAME_PATH = isGitHubPages
        ? '../assets/videos/frames_12fps/webp85/'
        : '../assets/videos/frames_12fps/';

    const FRAME_EXT = isGitHubPages ? '.webp' : '.jpg';

    /*
        CONFIGURAÇÕES PRINCIPAIS

        CACHE_LIMIT:
        Quantidade máxima de imagens guardadas na memória.

        PRELOAD_BEHIND:
        Quantos frames atrás do atual serão mantidos.

        PRELOAD_AHEAD:
        Quantos frames na frente serão pré-carregados.

        MAX_PARALLEL_LOADS:
        Quantas imagens podem carregar ao mesmo tempo.
        Se colocar muito alto, o navegador trava.
    */
    const CACHE_LIMIT = isGitHubPages ? 260 : 320;
    const PRELOAD_BEHIND = 35;
    const PRELOAD_AHEAD = 70;
    const MAX_PARALLEL_LOADS = 6;

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

    const imageCache = new Map();
    const loadingPromises = new Map();
    const loadQueue = [];

    let activeLoads = 0;
    let currentFrameIndex = 1;
    let lastFrameIndex = 1;
    let lastDrawnFrameIndex = 1;
    let isReady = false;
    let ticking = false;
    let resizeQueued = false;

    function getFrameSrc(index) {
        return FRAME_PATH + 'frame_' + String(index).padStart(4, '0') + FRAME_EXT;
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function resizeCanvas() {
        /*
            DPR alto deixa a imagem mais bonita, mas pesa muito.
            Em animação por scroll, 1.25 já costuma ser suficiente.
        */
        const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);

        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        drawFrameSmart(currentFrameIndex);
    }

    function queueResize() {
        if (resizeQueued) return;

        resizeQueued = true;

        requestAnimationFrame(() => {
            resizeQueued = false;
            resizeCanvas();
        });
    }

    window.addEventListener('resize', queueResize);

    function drawImageCover(img) {
        if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;

        let drawWidth;
        let drawHeight;
        let offsetX;
        let offsetY;

        if (imgRatio > canvasRatio) {
            drawHeight = canvas.height;
            drawWidth = imgRatio * drawHeight;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }


    function drawFrameSmart(index) {
        const exactImage = imageCache.get(index);

        if (exactImage && exactImage.complete) {
            drawImageCover(exactImage);
            lastDrawnFrameIndex = index;
            return;
        }

        /*
            Se o frame exato ainda não carregou, não mostra frame próximo.
            Isso evita aparecer uma imagem errada quando o scroll é muito rápido.
        */
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        requestFrameLoad(index, true);
    }
    function updateTextOverlay(index) {
        let active = null;

        for (const text of storyTexts) {
            if (index >= text.start && index <= text.end) {
                active = text;
                break;
            }
        }

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

    function updateLoading(progress) {
        const percent = Math.round(progress * 100);

        if (loadingBar) loadingBar.style.width = percent + '%';
        if (loadingPercent) loadingPercent.textContent = percent + '%';
    }

    function removeFarthestFrames() {
        while (imageCache.size > CACHE_LIMIT) {
            let farthestIndex = null;
            let farthestDistance = -1;

            for (const index of imageCache.keys()) {
                /*
                    Nunca remove o frame atual nem o último desenhado.
                */
                if (index === currentFrameIndex || index === lastDrawnFrameIndex) continue;

                const distance = Math.abs(index - currentFrameIndex);

                if (distance > farthestDistance) {
                    farthestDistance = distance;
                    farthestIndex = index;
                }
            }

            if (farthestIndex === null) break;

            imageCache.delete(farthestIndex);
        }
    }

    function processQueue() {
        if (activeLoads >= MAX_PARALLEL_LOADS) return;
        if (loadQueue.length === 0) return;

        const item = loadQueue.shift();

        if (!item) return;

        const index = item.index;

        if (imageCache.has(index)) {
            processQueue();
            return;
        }

        if (loadingPromises.has(index)) {
            processQueue();
            return;
        }

        activeLoads++;

        const promise = new Promise((resolve) => {
            const img = new Image();

            /*
                Ajuda o navegador a entender que a imagem será usada logo.
                Nem todo navegador respeita 100%, mas ajuda.
            */
            img.decoding = item.priority ? 'sync' : 'async';
            img.loading = 'eager';

            img.onload = () => {
                imageCache.set(index, img);
                removeFarthestFrames();
                resolve(img);
            };

            img.onerror = () => {
                resolve(null);
            };

            img.src = getFrameSrc(index);
        });

        loadingPromises.set(index, promise);

        promise.finally(() => {
            loadingPromises.delete(index);
            activeLoads--;
            processQueue();
        });

        processQueue();
    }

    function requestFrameLoad(index, priority = false) {
        index = clamp(index, 1, TOTAL_FRAMES);

        if (imageCache.has(index)) return;
        if (loadingPromises.has(index)) return;

        const alreadyQueued = loadQueue.some((item) => item.index === index);

        if (alreadyQueued) return;

        if (priority) {
            loadQueue.unshift({ index, priority: true });
        } else {
            loadQueue.push({ index, priority: false });
        }

        processQueue();
    }

    function requestRangeLoad(start, end, direction) {
        start = clamp(start, 1, TOTAL_FRAMES);
        end = clamp(end, 1, TOTAL_FRAMES);

        if (direction >= 0) {
            for (let i = start; i <= end; i++) {
                requestFrameLoad(i, false);
            }
        } else {
            for (let i = end; i >= start; i--) {
                requestFrameLoad(i, false);
            }
        }
    }

    function smartPreloadAround(index, direction) {
        /*
            Carrega mais frames para frente se o usuário estiver descendo,
            e mais frames para trás se estiver subindo.
        */
        let behind = PRELOAD_BEHIND;
        let ahead = PRELOAD_AHEAD;

        if (direction < 0) {
            behind = PRELOAD_AHEAD;
            ahead = PRELOAD_BEHIND;
        }

        const start = index - behind;
        const end = index + ahead;

        requestRangeLoad(start, end, direction);
    }

    function getScrollProgress() {
        const top = section.offsetTop;
        const height = section.offsetHeight - window.innerHeight;

        if (height <= 0) return 0;

        const progress = (window.scrollY - top) / height;

        return clamp(progress, 0, 1);
    }

    function getFrameFromProgress(progress) {
        return clamp(
            Math.floor(progress * (TOTAL_FRAMES - 1)) + 1,
            1,
            TOTAL_FRAMES
        );
    }

    function updateNavbar(progress) {
        if (!mainNavbar) return;

        if (progress > 0.01 && progress < 0.99) {
            mainNavbar.classList.add('navbar-hidden');
        } else {
            mainNavbar.classList.remove('navbar-hidden');
        }
    }

    function updateFrameCounter(index) {
        if (!frameCounter) return;

        frameCounter.textContent = 'Frame ' + index + ' / ' + TOTAL_FRAMES;
    }

    function updateScrollScene() {
        if (!isReady) return;

        const progress = getScrollProgress();
        const index = getFrameFromProgress(progress);
        const direction = index >= lastFrameIndex ? 1 : -1;

        if (index !== currentFrameIndex) {
            currentFrameIndex = index;

            drawFrameSmart(index);
            updateFrameCounter(index);
            smartPreloadAround(index, direction);

            /*
                O texto continua seguindo o scroll,
                mas a imagem só aparece se o frame exato estiver carregado.
            */
            updateTextOverlay(index);
            lastFrameIndex = index;
        }

        updateNavbar(progress);
    }

    window.addEventListener(
        'scroll',
        () => {
            if (!isReady || ticking) return;

            ticking = true;

            requestAnimationFrame(() => {
                updateScrollScene();
                ticking = false;
            });
        },
        { passive: true }
    );

    async function loadInitialFrames() {
        /*
            Preload inicial pequeno.
            Antes você carregava 50 e depois começava a carregar tudo.
            Aqui carrega só o suficiente para começar suave.
        */
        const initialFrames = [];

        for (let i = 1; i <= 35; i++) {
            initialFrames.push(i);
        }

        let loaded = 0;

        await Promise.all(
            initialFrames.map((index) => {
                return new Promise((resolve) => {
                    const img = new Image();

                    img.decoding = 'async';
                    img.loading = 'eager';

                    img.onload = () => {
                        imageCache.set(index, img);
                        loaded++;
                        updateLoading(loaded / initialFrames.length);
                        resolve(img);
                    };

                    img.onerror = () => {
                        loaded++;
                        updateLoading(loaded / initialFrames.length);
                        resolve(null);
                    };

                    img.src = getFrameSrc(index);
                });
            })
        );
    }

    async function start() {
        resizeCanvas();

        await loadInitialFrames();

        currentFrameIndex = getFrameFromProgress(getScrollProgress());
        lastFrameIndex = currentFrameIndex;

        requestFrameLoad(currentFrameIndex, true);
        smartPreloadAround(currentFrameIndex, 1);

        drawFrameSmart(currentFrameIndex);
        updateTextOverlay(currentFrameIndex);
        updateFrameCounter(currentFrameIndex);
        updateNavbar(getScrollProgress());

        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }

        isReady = true;

        /*
            Faz uma atualização logo depois, caso a página já abra em outro ponto.
        */
        requestAnimationFrame(updateScrollScene);
    }

    start();
})();