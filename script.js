let cadastro = false;

    const elTitulo = document.getElementById("titulo");
    const elBotao = document.getElementById("botao-envio");
    const elToggle = document.getElementById("toggle");
    const elToggleSpan = elToggle.querySelector("span");
    const elToggleP = elToggle.querySelector("p");
    const elMensagem = document.getElementById("mensagem");
    const elSenhaInput = document.getElementById("senha");
    const elToggleSenha = document.getElementById("toggle-senha");
    const elIconSenha = elToggleSenha.querySelector("i");
    
    elToggleSenha.onclick = () => {
        if (elSenhaInput.type === "password") {
            elSenhaInput.type = "text";
            elIconSenha.className = "bi bi-eye-slash";
            elToggleSenha.setAttribute("aria-label", "Ocultar senha");
        } else {
            elSenhaInput.type = "password";
            elIconSenha.className = "bi bi-eye";
            elToggleSenha.setAttribute("aria-label", "Mostrar senha");
        }
    };
    
    elToggle.onclick = () => {
        cadastro = !cadastro;
        
        elTitulo.innerText = cadastro ? "Cadastro" : "Login";
        document.getElementById("texto-botao").innerText = cadastro ? "Cadastrar" : "Entrar";
        elToggleSpan.innerText = cadastro ? "Faça Login!" : "Cadastre-se!";
        elToggleP.innerHTML = cadastro ? "Já tem conta? <span class=\"text-danger text-decoration-underline cursor-pointer\" role=\"button\">Faça Login!</span>" : "Não tem conta? <span class=\"text-danger text-decoration-underline cursor-pointer\" role=\"button\">Cadastre-se!</span>";
        
        elMensagem.innerHTML = "";
    };
    
    document.getElementById("form-login").onsubmit = (e) => {
        e.preventDefault();
        let email = document.getElementById("email").value;
        let senha = document.getElementById("senha").value;
        elMensagem.innerHTML = "";
        if (!email.includes("@") || !email.includes(".")) {
            elMensagem.innerHTML = "<div class='text-danger fw-bold'>Email Inválido!</div>";
            return;
        }
        if (senha.length < 4) {
            elMensagem.innerHTML = "<div class='text-danger fw-bold'>Senha muito curta!</div>";
            return;
        }
        if (cadastro) {
            localStorage.setItem(email, senha);
            elMensagem.innerHTML = "<div class='text-success fw-bold'>Cadastrado com sucesso!</div>";
        } else {
            let salva = localStorage.getItem(email);
            if (salva === senha) {
                localStorage.setItem('userLogado', email); // Salva quem logou
                window.location.href = 'home.html';
            } else {
                elMensagem.innerHTML = "<div class='text-danger fw-bold'>Dados Incorretos!</div>";
            }
        }
        document.getElementById("form-login").reset();
    }