const checkbox = document.getElementById('alterar')
const  menuPrincipal = document.getElementById('menuPrincipal')

function visibilidadeCheckbox() {
    const aberto = checkbox.checked;
    checkbox.setAttribute('aria-expanded',aberto);
    if (aberto){
        menuPrincipal.hidden = false
        checkbox.setAttribute('aria-expanded', 'true');
    }
    else {
      menuPrincipal.hidden =  true
       checkbox.setAttribute('aria-expanded', 'false');
    }
   
}