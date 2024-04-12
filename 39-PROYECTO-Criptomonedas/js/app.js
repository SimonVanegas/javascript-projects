const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

const obtenerCriptomonedas = criptomonedas => new Promise( resolve =>{
    resolve( criptomonedas )
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomoneda()

    formulario.addEventListener('submit', submitFormulario);
    criptoSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomoneda(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch (url)
        .then( respuesta => respuesta.json() )
        .then( resultado => obtenerCriptomonedas(resultado.Data))
        .then( criptomonedas => selectCriptomonedas(criptomonedas))
};

function leerValor(e){
    objBusqueda [e.target.name] = e.target.value
};

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent= FullName;

        criptoSelect.appendChild(option)
    });
};

function submitFormulario(e){
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son requeridos');
        return;
    }

    consultarAPI();
};

function mostrarAlerta (mensaje){

    const existeError = document.querySelector('.error');
    if(!existeError){
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error')

        divMensaje.textContent= mensaje;

        formulario.appendChild(divMensaje)

        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }

    
};

function consultarAPI(){
    const { moneda, criptomoneda } = objBusqueda;

    const url= `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch (url)
        .then( respuesta => respuesta.json())
        .then( cotizacion => {
        mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda])
        })
};

function mostrarCotizacion(cotizacion){
    limpiarHTML();

    const { PRICE, LOWDAY, HIGHDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `El precio más alto del dia es: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `El precio más bajo del dia es: <span>${LOWDAY}</span>`;

    const utlimasHoras = document.createElement('P');
    utlimasHoras.innerHTML = `Variacion ultimas horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const utlimaActualizacion = document.createElement('P');
    utlimaActualizacion.innerHTML = `Ultima actualizacion: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(utlimasHoras);
    resultado.appendChild(utlimaActualizacion);
}

function limpiarHTML(){
    while(resultado.lastChild){
        resultado.lastChild.remove()
    }
    
}

function mostrarSpinner(){
    limpiarHTML()
    const spinner = document.createElement('DIV');
    spinner.classList.add('sk-chase');

    spinner.innerHTML = `   
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `

    resultado.appendChild(spinner)
}