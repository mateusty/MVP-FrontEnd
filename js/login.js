    document.getElementById("formLogin").addEventListener("submit", function(e) {
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("password").value.trim();
        const lembrar = document.getElementById("checkbox").checked;

        if ( !email || !senha ) {
            e.preventDefault();
            alert("Por favor, preencha o E-mail e a Senha.");
            return;
        }

        if (lembrar) {
            localStorage.setItem("logado", "true");
        } 
        else {
            sessionStorage.setItem("logado", "true");
        }

    });