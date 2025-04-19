// Array proporcionado que no se puede modificar
var posibilidades = ["piedra", "papel", "tijera"];

// Variables globales
let nombreJugador = '';
let partidasTotales = 0;
let partidasJugadas = 0;
let opcionSeleccionada = null; 
let historialPartidas = [];

// Función principal que se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial de la aplicación
    configurarAplicacion();
    
    // Asignar eventos a los botones
    document.querySelector('button').addEventListener('click', comenzarPartida);
    document.querySelectorAll('button')[1].addEventListener('click', realizarTirada);
    document.querySelectorAll('button')[2].addEventListener('click', resetearJuego);
});

// Configuración inicial de la aplicación
function configurarAplicacion() {
    // Obtener todas las imágenes del jugador
    const imagenesJugador = document.querySelectorAll('#jugador img');
    
    // Asignar eventos y configurar imágenes del jugador
    for (let i = 0; i < imagenesJugador.length; i++) {
        if (i < posibilidades.length) {
            // Configurar la imagen correspondiente (sin modificar el array original)
            const opcion = posibilidades[i];
            imagenesJugador[i].src = `img/${opcion}Jugador.png`;
            
            // Asignar evento de clic
            imagenesJugador[i].addEventListener('click', function() {
                seleccionarOpcion(i);
            });
        } else {
            // Ocultar imágenes adicionales si no hay suficientes opciones
            imagenesJugador[i].style.display = 'none';
        }
    }
    
    // Seleccionar la primera opción por defecto
    seleccionarOpcion(0);
}

// Función para comenzar una nueva partida
function comenzarPartida() {
    // Obtener valores de los campos
    const nombreInput = document.querySelector('input[name="nombre"]');
    const partidasInput = document.querySelector('input[name="partidas"]');
    
    // Validar nombre
    const nombre = nombreInput.value.trim();
    let nombreValido = nombre.length > 3 && isNaN(parseInt(nombre[0]));
    
    // Validar número de partidas
    const partidas = parseInt(partidasInput.value);
    let partidasValidas = partidas > 0;
    
    // Aplicar estilos de validación
    nombreInput.classList.toggle('fondoRojo', !nombreValido);
    partidasInput.classList.toggle('fondoRojo', !partidasValidas);

    // Si ambos campos son válidos, comenzar el juego
    if (nombreValido && partidasValidas) {
        nombreJugador = nombre;
        partidasTotales = partidas;
        partidasJugadas = 0;
        
        // Deshabilitar campos de entrada
        nombreInput.disabled = true;
        partidasInput.disabled = true;
        
        // Actualizar contadores
        document.getElementById('actual').textContent = '0';
        document.getElementById('total').textContent = partidasTotales;
    }
}

// Función para seleccionar una opción del jugador
function seleccionarOpcion(indice) {
    // Verificar que el índice sea válido
    if (indice >= 0 && indice < posibilidades.length) {
        opcionSeleccionada = indice;
        const imagenesJugador = document.querySelectorAll('#jugador img');
        
        // Aplicar estilos de selección
        for (let i = 0; i < imagenesJugador.length; i++) {
            if (i === indice) {
                imagenesJugador[i].classList.add('seleccionado');
                imagenesJugador[i].classList.remove('noSeleccionado');
            } else {
                imagenesJugador[i].classList.add('noSeleccionado');
                imagenesJugador[i].classList.remove('seleccionado');
            }
        }
    }
}

// Función para realizar una tirada
function realizarTirada() {
    // Verificar que se pueda jugar
    if (partidasJugadas >= partidasTotales || opcionSeleccionada === null || !nombreJugador) {
        return;
    }
    
    // Generar opción aleatoria para la máquina (usando el array original sin modificarlo)
    const opcionMaquina = Math.floor(Math.random() * posibilidades.length);
    const opcionMaquinaNombre = posibilidades[opcionMaquina];
    const imagenMaquina = document.querySelector('#maquina img');
    imagenMaquina.src = `img/${opcionMaquinaNombre}Ordenador.png`;
    
    // Incrementar contador de partidas jugadas
    partidasJugadas++;
    document.getElementById('actual').textContent = partidasJugadas;
    
    // Determinar el resultado usando el array original
    const resultado = determinarResultado(opcionSeleccionada, opcionMaquina);
    
    // Registrar en el historial
    agregarAlHistorial(resultado);
}

function determinarResultado(jugador, maquina) {
    // jugador y maquina son índices: 0 = piedra, 1 = papel, 2 = tijera

    // Empate
    if (jugador === maquina) {
        return 'empate';
    }

    // Casos donde gana el jugador
    if (
        (jugador === 0 && maquina === 2) || // piedra gana a tijera
        (jugador === 1 && maquina === 0) || // papel gana a piedra
        (jugador === 2 && maquina === 1)    // tijera gana a papel
    ) {
        return 'jugador';
    }

    // Si no es empate ni gana el jugador, gana la máquina
    return 'maquina';
}

// Función para agregar un resultado al historial
function agregarAlHistorial(resultado) {
    let mensaje = '';
    
    switch (resultado) {
        case 'jugador':
            mensaje = `Gana ${nombreJugador}`;
            break;
        case 'maquina':
            mensaje = 'Gana la máquina';
            break;
        case 'empate':
            mensaje = 'Empate';
            break;
        default:
            mensaje = 'Nueva partida';
    }
    
    // Agregar al array de historial
    historialPartidas.push(mensaje);
    
    // Actualizar la lista en el DOM
    const listaHistorial = document.getElementById('historial');
    listaHistorial.innerHTML = '';
    
    for (const item of historialPartidas) {
        const li = document.createElement('li');
        li.textContent = item;
        listaHistorial.appendChild(li);
    }
}

// Función para resetear el juego
function resetearJuego() {
    // Agregar mensaje de nueva partida al historial
    agregarAlHistorial('nueva');
    
    // Habilitar campos de entrada (excepto el nombre)
    document.querySelector('input[name="partidas"]').disabled = false;
    document.querySelector('input[name="partidas"]').value = '0';
    
    // Reiniciar contadores
    partidasJugadas = 0;
    document.getElementById('actual').textContent = '0';
    document.getElementById('total').textContent = '0';
    
    // Reiniciar imagen de la máquina
    document.querySelector('#maquina img').src = 'img/defecto.png';
    
    // Reiniciar selección
    seleccionarOpcion(0);
}