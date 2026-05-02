function initLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingBar = document.getElementById('loadingBar');
    const loadingPercent = document.getElementById('loadingPercent');

    if (!loadingOverlay) return;

    let progress = 0;
    
    // Animação simulada de carregamento (vai até 90%)
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress > 90) progress = 90;
        
        updateUI(progress);
    }, 100);

    function updateUI(val) {
        if (loadingBar) loadingBar.style.width = val + '%';
        if (loadingPercent) loadingPercent.textContent = val + '%';
    }

    // Quando todos os recursos (imagens, modelos 3D, etc) estiverem 100% carregados
    function finishLoading() {
        clearInterval(interval);
        
        // Acelera de 90 para 100%
        let finishInterval = setInterval(() => {
            progress += 4;
            if (progress >= 100) {
                progress = 100;
                updateUI(progress);
                clearInterval(finishInterval);
                
                // Pequeno delay para o usuário ler "100%"
                setTimeout(() => {
                    loadingOverlay.classList.add('hidden');
                }, 300);
            } else {
                updateUI(progress);
            }
        }, 20);
    }

    if (document.readyState === 'complete') {
        finishLoading();
    } else {
        window.addEventListener('load', finishLoading);
    }
}

// Inicializa assim que possível
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoading);
} else {
    initLoading();
}
