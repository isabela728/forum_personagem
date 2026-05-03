document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Só remove a classe se o elemento estiver saindo por baixo da tela
                // Assim, quando rolar pra cima, os itens de cima já estarão visíveis sem animar de novo
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove('active');
                }
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });
});
