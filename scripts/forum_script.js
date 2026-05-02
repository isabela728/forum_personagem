function enviar_opiniao() {
    const textarea = document.getElementById('responseText');
    if (!textarea) return;

    const opiniao = textarea.value.trim();

    if (opiniao === "") {
        alert("Por favor, escreva algo antes de enviar!");
        return;
    }

    const container = document.getElementById('respostas-container');
    if (!container) return;

    // Recuperar o usuário logado
    const userEmail = localStorage.getItem('userLogado') || "Visitante Anônimo";

    // Criar o elemento da nova resposta
    const novaResposta = document.createElement('div');
    novaResposta.className = 'mb-5';
    novaResposta.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-person-circle text-secondary" style="font-size: 30px;"></i>
            <p class="m-0 ms-2 mb-1">${userEmail}</p>
        </div>
        <p>${opiniao}</p>
    `;

    // Adicionar ao container
    container.appendChild(novaResposta);
    
    // Limpar o campo
    textarea.value = ""; 
    
    // Rolar para a nova resposta
    novaResposta.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Torna global para funcionar com o onclick do HTML
window.enviar_opiniao = enviar_opiniao;



function enviar_opiniao2() {
    const textarea = document.getElementById('responseText2');
    if (!textarea) return;

    const opiniao = textarea.value.trim();

    if (opiniao === "") {
        alert("Por favor, escreva algo antes de enviar!");
        return;
    }

    const container = document.getElementById('respostas-container2');
    if (!container) return;

    // Recuperar o usuário logado
    const userEmail = localStorage.getItem('userLogado') || "Visitante Anônimo";

    // Criar o elemento da nova resposta
    const novaResposta2 = document.createElement('div');
    novaResposta2.className = 'mb-5';
    novaResposta2.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-person-circle text-secondary" style="font-size: 30px;"></i>
            <p class="m-0 ms-2 mb-1">${userEmail}</p>
        </div>
        <p>${opiniao}</p>
    `;

    // Adicionar ao container
    container.appendChild(novaResposta2);
    
    // Limpar o campo
    textarea.value = ""; 
    
    // Rolar para a nova resposta
    novaResposta2.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

window.enviar_opiniao2 = enviar_opiniao2;
