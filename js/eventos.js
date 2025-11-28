const logado = localStorage.getItem("logado") || sessionStorage.getItem("logado");

if (logado) {
    const addEventos = document.getElementById('addEvento');
    addEventos.style.visibility = "visible"
}

function toggleForm() {
    const Form = document.getElementById('formEvento');
    const Background = document.getElementById('background');
    if (Form.style.visibility == "hidden") {
        Form.style.visibility = "visible"
        Background.style.display = "inline-block"
    }
    else {
        Form.style.visibility = "hidden"
        Background.style.display = "none"
    }
}

function addEvento() {

    const container = document.getElementById('container');
    const msg = document.getElementById('msgVazio');
    if (msg) {
        msg.remove();
    }

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const date = document.getElementById('data').value;
    const hourStart = document.getElementById('hourStart').value;
    const hourEnd = document.getElementById('hourEnd').value;

    if (!title) {
        alert("O título é obrigatório.");
        return;
    }

    if (!date) {
        alert("A data é obrigatória.");
        return;
    }

    if (hourStart && hourEnd && hourStart >= hourEnd) {
        alert("A hora de início deve ser menor que a hora de término.");
        return;
    }

    const divEvento = document.createElement("div");
    divEvento.classList.add("eventos")

    const h4Title = document.createElement("h4");
    h4Title.textContent = title;

    const pDescription = document.createElement("p");
    pDescription.textContent = description;

    const pDate = document.createElement("p");
    pDate.textContent = `${date}, das ${hourStart} até ${hourEnd}`

    divEvento.appendChild(h4Title);
    divEvento.appendChild(pDescription);
    divEvento.appendChild(pDate);
    container.appendChild(divEvento);

    toggleForm();
}