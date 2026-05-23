document.addEventListener('DOMContentLoaded', () => {
    // === CONFIGURACIÓN DE AUDIO Y VOLUMEN ===
    const musica = document.getElementById('musica-fondo');
    if (musica) musica.volume = 0.2;
    
    const btnMusica = document.getElementById('btn-musica');
    
    const sfxConfeti = document.getElementById('sfx-confeti');
    if (sfxConfeti) sfxConfeti.volume = 0.1;

    const sfxBurbuja = document.getElementById('sfx-burbuja');
    if (sfxBurbuja) sfxBurbuja.volume = 0.1; 

    // Control de la música de fondo
    if (btnMusica && musica) {
        btnMusica.addEventListener('click', () => {
            if (musica.paused) {
                musica.play();
                btnMusica.textContent = '||';
                btnMusica.classList.add('reproduciendo');
            } else {
                musica.pause();
                btnMusica.textContent = '🎵';
                btnMusica.classList.remove('reproduciendo');
            }
        });
    }

    // === ELEMENTOS DE LOS MODALES ===
    const modalMuro = document.getElementById('modal-muro');
    const btnCerrarMuro = document.getElementById('cerrar-muro');

    const modalCofre = document.getElementById('modal-cofre');
    const btnCerrarCofre = document.getElementById('cerrar-cofre');

    const modalCarta = document.getElementById('modal-carta');
    const btnCerrarCarta = document.getElementById('cerrar-carta');
    
    const modalJuego = document.getElementById('modal-juego');
    const btnCerrarJuego = document.getElementById('cerrar-juego');
    const btnSi = document.getElementById('btn-si');
    const btnNo = document.getElementById('btn-no');
    const tituloJuego = document.getElementById('titulo-juego');

    const modalConstelacion = document.getElementById('modal-constelacion');
    const btnCerrarConstelacion = document.getElementById('cerrar-constelacion');
    const canvas = document.getElementById('canvas-estrellas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let animationFrameId = null;

    const modalDistancia = document.getElementById('modal-distancia');
    const btnCerrarDistancia = document.getElementById('cerrar-distancia');
    const numKm = document.getElementById('numero-km');
    const fraseDistancia = document.getElementById('frase-distancia');
    const corazonViajero = document.getElementById('corazon-viajero');
    const nodoBenja = document.getElementById('nodo-benja');
    const nodoMoony = document.getElementById('nodo-moony');
    let intervaloKm = null;
    let juegoDistanciaCompletado = false; 

    // Elementos para la Opción 7
    const modalAdicional = document.getElementById('modal-adicional') || document.getElementById('modal-sonidos');
    const btnCerrarAdicional = document.getElementById('cerrar-adicional') || document.getElementById('cerrar-sonidos');

    // === MANEJO DE MENÚ PRINCIPAL (BOTONES DE OPCIÓN) ===
    const botones = document.querySelectorAll('.boton-opcion');
    let escalaSi = 1.0;
    let contadorIntentosNo = 0;
    const maxIntentos = 10; 

    botones.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const opcion = e.currentTarget.getAttribute('data-opcion');

            if (sfxBurbuja) {
                sfxBurbuja.currentTime = 0; 
                sfxBurbuja.play();
            }

            // Opción 1: Muro de Recuerdos
            if (opcion === "1" && modalMuro) modalMuro.classList.add('mostrar');

            // Opción 2: Cofre Secreto (Trivia)
            if (opcion === "2" && modalCofre) {
                document.getElementById('pantalla-candado').style.display = 'block';
                document.getElementById('pantalla-trivia').style.display = 'none';
                document.getElementById('pantalla-premios').style.display = 'none';
                modalCofre.classList.add('mostrar');
            }

            // Opción 3: Carta de Amor
            if (opcion === "3" && modalCarta) {
                modalCarta.classList.add('mostrar');
                setTimeout(() => {
                    if (sfxConfeti) {
                        sfxConfeti.currentTime = 0;
                        sfxConfeti.play();
                    }
                }, 150);

                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 150,
                        spread: 80,
                        origin: { y: 0.6 },
                        zIndex: 3000
                    });
                }
            }

            // Opción 4: Constelación
            if (opcion === "4" && modalConstelacion) {
                modalConstelacion.classList.add('mostrar');
                inicializarCanvasEstrellas();
            }

            // Opción 5: Distancia
            if (opcion === "5" && modalDistancia) {
                modalDistancia.classList.add('mostrar');
                resetearDistanciaCompleto();
            }

            // Opción 6: Pregunta ¿Me amas?
            if (opcion === "6" && modalJuego) {
                escalaSi = 1.0;
                contadorIntentosNo = 0;
                if (tituloJuego) tituloJuego.innerHTML = 'Amor ¿Me amas muxito muxito y para siempre?';
                
                if (btnSi) {
                    btnSi.style.left = '20%';
                    btnSi.style.top = '35%';
                    btnSi.style.transform = 'translate(-50%, -50%) scale(1)';
                }
                
                const contenedor = document.querySelector('.contenedor-juego');
                if (contenedor) {
                    contenedor.style.height = 'auto';
                    contenedor.style.minHeight = '280px';
                }
                
                if (btnNo) {
                    btnNo.style.display = 'inline-block';
                    btnNo.style.opacity = '1';
                    btnNo.style.left = '';
                    btnNo.style.top = '35%';
                    btnNo.style.transform = 'translate(50%, -50%)';
                }
                
                modalJuego.classList.add('mostrar');
            }

            // Opción 7: Escuchar Audio Dedicado
            if (opcion === "7" || e.currentTarget.textContent.includes("Listen here")) {
                if (modalAdicional) {
                    modalAdicional.classList.add('mostrar');
                    
                    setTimeout(() => {
                        if (sfxConfeti) {
                            sfxConfeti.currentTime = 0;
                            sfxConfeti.play();
                        }
                    }, 100);
                    
                    if (typeof confetti === 'function') {
                        confetti({
                            particleCount: 80,
                            spread: 60,
                            origin: { y: 0.6 },
                            colors: ['#ff758f', '#ffe164', '#ffffff'],
                            zIndex: 3000
                        });
                    }
                }
            }
        });
    });

    // === FILTROS EN EL MURO DE RECUERDOS ===
    const botonesFiltro = document.querySelectorAll('.btn-filtro');
    const tarjetasRecuerdo = document.querySelectorAll('.tarjeta-recuerdo');

    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            if (sfxBurbuja) {
                sfxBurbuja.currentTime = 0;
                sfxBurbuja.play();
            }

            botonesFiltro.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');

            const filtroSeleccionado = btn.getAttribute('data-filtro');

            tarjetasRecuerdo.forEach(tarjeta => {
                const categoriaTarjeta = tarjeta.getAttribute('data-categoria');
                if (filtroSeleccionado === 'todos' || filtroSeleccionado === categoriaTarjeta) {
                    tarjeta.style.display = 'block';
                    tarjeta.style.opacity = '0';
                    setTimeout(() => { tarjeta.style.opacity = '1'; }, 50);
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    });

    // === SECCIÓN DE LA TRIVIA DEL COFRE ===
    const bancoPreguntas = [
        { q: "¿Qué día besé a mi lunita por primera vez?", a: "20 de Febrero", o: ["23 de Febrero", "22 de Febrero", "19 de Febrero"] },
        { q: "¿Cuál es mi nombre completo?", a: "Benjamin Alejandro Basualto Vargas", o: ["Benjamin Alejandro Vargas Basualto", "Alejandro Benjamin Basualto Vargos", "Benjamin Alejandro Bosualto Vargos"] },
        { q: "¿Cuál es mi comida favorita?", a: "Arroz Con Huevo Revuelto", o: ["Hamburguesa con papas fritas", "Arroz Con Huevo Frito", "Fideos con Huevo Revuelto"] },
        { q: "¿Cuál es mi anime favorito?", a: "NANA", o: ["AKUDAMA DRIVE", "BLUE LOCK", "JOJOS BIZZARRE ADVENTURE"] },
        { q: "¿Cuál es mi color favorito?", a: "Rojo Carmesí", o: ["Rojo Intenso", "Rojo Cereza", "Rojo Sangre"] },
        { q: "¡Cuál es mi carrera soñada?", a: "Vocalista", o: ["Programador", "Diseñador de Juegos", "Ingeniero en Sonido"] },
        { q: "¿Cuáles son mis mayores miedos?", a: "Arañas, enfermedades y la soledad.", o: ["Alturas, payasos y la oscuridad", "El mar, la muerte y el odio", "Fantasmas, fracasar y los insectos"] },
        { q: "¿Cuál es mi juego favorito históricamente hasta ahora?", a: "Minecraft", o: ["Valorant", "Half Life", "Overwatch"] },
        { q: "¿Qué es lo que más me gusta de una relationship?", a: "Monogamia", o: ["Los Regalos", "Coqueteo", "Pelear todo el día"] },
        { q: "¿Quién es la persona que más amo?", a: "¡¡ Mi lunita !! <3", o: ["Nadie", "Chamber", "A Mi Mismo"] }
    ];

    let preguntasTrivia = [];
    let indicePreguntaActual = 0;
    let triviaBloqueada = false;

    const btnComenzarTrivia = document.getElementById('btn-comenzar-trivia');
    if (btnComenzarTrivia) {
        btnComenzarTrivia.addEventListener('click', () => {
            if (sfxBurbuja) {
                sfxBurbuja.currentTime = 0;
                sfxBurbuja.play();
            }
            iniciarTriviaDesdeCero();
        });
    }

    function iniciarTriviaDesdeCero() {
        preguntasTrivia = [...bancoPreguntas].sort(() => Math.random() - 0.5);
        indicePreguntaActual = 0;
        triviaBloqueada = false;
        document.getElementById('pantalla-candado').style.display = 'none';
        document.getElementById('pantalla-trivia').style.display = 'block';
        mostrarPreguntaCofre();
    }

    function mostrarPreguntaCofre() {
        const item = preguntasTrivia[indicePreguntaActual];
        document.getElementById('numero-pregunta').textContent = indicePreguntaActual + 1;
        const porcentajeProgress = ((indicePreguntaActual) / 10) * 100;
        document.getElementById('barra-trivia-llenado').style.width = `${porcentajeProgress}%`;
        document.getElementById('texto-pregunta').textContent = item.q;
        
        const todasOpciones = [item.a, ...item.o].sort(() => Math.random() - 0.5);
        const contenedorOpciones = document.getElementById('contenedor-opciones');
        contenedorOpciones.innerHTML = '';
        
        todasOpciones.forEach(opcionTexto => {
            const botonOp = document.createElement('button');
            botonOp.className = 'btn-opcion-trivia';
            botonOp.textContent = opcionTexto;
            
            botonOp.addEventListener('click', () => {
                if (triviaBloqueada) return;
                if (sfxBurbuja) {
                    sfxBurbuja.currentTime = 0;
                    sfxBurbuja.play();
                }
                
                if (opcionTexto === item.a) {
                    indicePreguntaActual++;
                    if (indicePreguntaActual >= 10) {
                        finalizarTriviaExito();
                    } else {
                        mostrarPreguntaCofre();
                    }
                } else {
                    triviaBloqueada = true;
                    botonOp.style.backgroundColor = '#ff4d6d';
                    botonOp.style.borderColor = '#c93b55';
                    botonOp.style.color = 'white';
                    setTimeout(() => { iniciarTriviaDesdeCero(); }, 800);
                }
            });
            contenedorOpciones.appendChild(botonOp);
        });
    }

    function finalizarTriviaExito() {
        document.getElementById('barra-trivia-llenado').style.width = '100%';
        document.getElementById('pantalla-trivia').style.display = 'none';
        document.getElementById('pantalla-premios').style.display = 'block';
        
        if (sfxConfeti) {
            sfxConfeti.currentTime = 0;
            sfxConfeti.play();
        }
        const finCofre = Date.now() + 2500;
        (function rafagaCofre() {
            if (typeof confetti === 'function') {
                confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, zIndex: 3000 });
                confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, zIndex: 3000 });
            }
            if (Date.now() < finCofre) requestAnimationFrame(rafagaCofre);
        }());
    }

    // === JUEGO BOTÓN "SÍ" Y "NO" ===
    function moverBotonNo(e) {
        if (e) e.preventDefault(); 
        contadorIntentosNo++;
        escalaSi += 0.20; 
        if (btnSi) btnSi.style.transform = `translate(-50%, -50%) scale(${escalaSi})`;

        const contenedor = document.querySelector('.contenedor-juego');
        if (contenedor && escalaSi > 1.8) {
            contenedor.style.minHeight = `${280 + (escalaSi * 45)}px`;
        }

        if (contadorIntentosNo >= maxIntentos) {
            if (btnNo) btnNo.style.display = 'none';
            if (tituloJuego) tituloJuego.innerHTML = 'Tú me amas. ¿Verdad. . ? . .';
            if (btnSi) {
                btnSi.style.left = '50%';
                btnSi.style.top = '50%';
                btnSi.style.transform = `translate(-50%, -50%) scale(${escalaSi})`;
            }
            return;
        }

        if (contenedor && btnNo) {
            const padding = 25;
            const widthMax = contenedor.clientWidth - btnNo.clientWidth - padding;
            const heightMax = contenedor.clientHeight - btnNo.clientHeight - padding;
            const randomX = Math.floor(Math.random() * (widthMax - padding)) + padding;
            const randomY = Math.floor(Math.random() * (heightMax - padding)) + padding;

            btnNo.style.transform = 'none'; 
            btnNo.style.left = `${randomX}px`;
            btnNo.style.top = `${randomY}px`;
        }
    }

    if (btnNo) {
        btnNo.addEventListener('mouseenter', moverBotonNo);
        btnNo.addEventListener('click', moverBotonNo);
        btnNo.addEventListener('touchstart', moverBotonNo, { passive: false });
    }

    if (btnSi) {
        btnSi.addEventListener('click', () => {
            if (tituloJuego) tituloJuego.innerHTML = 'SABIA QUE SÍ WAAWAWAWAW TE AMO MUCHO MI NIÑAAAAAA';
            if (btnNo) btnNo.style.display = 'none';
            if (sfxConfeti) {
                sfxConfeti.currentTime = 0;
                sfxConfeti.play();
            }

            const duracion = 3000;
            const final = Date.now() + duracion;
            (function marcoConfeti() {
                if (typeof confetti === 'function') {
                    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, zIndex: 3000 });
                    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, zIndex: 3000 });
                }
                if (Date.now() < final) requestAnimationFrame(marcoConfeti);
            }());
        });
    }

    // === CANVAS DE LA CONSTELACIÓN ===
    let estrellas = [];
    let mouse = { x: null, y: null, radio: 45 };
    let recompensaActivada = false; 

    const puntosTexto = [
        [12,28], [14,27], [16,26], [18,25], [20,25], [22,26], [24,27], [26,28],
        [19,29], [19,31], [19,33], [19,35], [19,37], [19,39], [19,41], [19,43],
        [32,38], [34,36], [36,34], [38,34], [40,36], [41,38], [41,40], [39,42], [37,43], [35,43], [33,41], [33,39], [35,39], [37,39], [39,39],
        [47,43], [49,44], [51,44], [53,43], [54,41], [54,38], [52,36], [50,35], [48,36], [46,38], [46,41], [47,43],
        [54,36], [54,39], [54,41], [54,44],
        [59,44], [59,41], [59,38], [59,35],
        [60,33], [62,34], [64,36], [64,39], [64,42], [64,44],
        [65,33], [67,34], [69,36], [69,39], [69,42], [69,44],
        [74,38], [76,36], [78,36], [80,38], [81,41], [80,44], [78,45], [76,45], [74,42], [74,38],
        [16,56], [16,59], [16,62], [16,65], [16,68], [16,71], [16,74], [16,77], [17,79], [19,79],
        [24,64], [24,67], [24,70], [24,73], [25,76], [27,78], [29,78], [31,76], [32,73], [32,70], [32,67], [32,64],
        [32,68], [32,72], [32,75], [32,78],
        [37,78], [37,74], [37,70], [37,66], [37,63],
        [39,61], [41,62], [43,65], [44,68], [44,71], [44,74], [44,78],
        [49,63], [49,66], [49,69], [49,72], [49,75], [49,78],
        [49,57], 
        [55,56], [55,59], [55,62], [55,65], [55,68], [55,71], [55,74], [55,77], [56,78],
        [52,63], [54,63], [56,63], [58,63],
        [63,77], [65,78], [67,78], [69,77], [70,75], [70,72], [68,70], [66,69], [64,70], [62,72], [62,75], [63,77],
        [70,68], [70,71], [70,74], [70,77]
    ];

    let puntosExtendidos = [];
    puntosTexto.forEach(p => {
        puntosExtendidos.push([p[0], p[1]]);
        puntosExtendidos.push([p[0] + 0.3, p[1] - 0.2]);
        puntosExtendidos.push([p[0] - 0.2, p[1] + 0.3]);
    });

    function inicializarCanvasEstrellas() {
        if (!canvas) return;
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        estrellas = [];
        recompensaActivada = false; 

        const msgSecreto = document.getElementById('mensaje-secreto-estrellas');
        if (msgSecreto) msgSecreto.style.display = 'none';
        canvas.style.transition = 'none';
        canvas.style.opacity = '1';
        canvas.style.pointerEvents = 'auto';
        
        puntosExtendidos.forEach((punto) => {
            const destinoX = (punto[0] / 100) * canvas.width;
            const destinoY = (punto[1] / 100) * canvas.height;

            estrellas.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                tx: destinoX,
                ty: destinoY,
                revelada: false, 
                radio: Math.random() * 1.8 + 1.2, 
                baseBrillo: Math.random() * 0.6 + 0.5,
                velocidadBrillo: Math.random() * 0.04 + 0.02,
                anguloBrillo: Math.random() * Math.PI,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        });

        canvas.removeEventListener('mousemove', registrarMouse);
        canvas.removeEventListener('mouseleave', limpiarMouse);
        canvas.removeEventListener('touchmove', registrarToque);
        canvas.removeEventListener('touchend', limpiarMouse);

        canvas.addEventListener('mousemove', registrarMouse);
        canvas.addEventListener('mouseleave', limpiarMouse);
        canvas.addEventListener('touchmove', registrarToque, { passive: true });
        canvas.addEventListener('touchend', limpiarMouse);

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        bucleEstelar();
    }

    function registrarMouse(e) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }

    function registrarToque(e) {
        if (!canvas) return;
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
        }
    }

    function limpiarMouse() {
        mouse.x = null;
        mouse.y = null;
    }

    function bucleEstelar() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let estrellasReveladas = 0;

        estrellas.forEach(estrella => {
            if (mouse.x !== null && mouse.y !== null && !estrella.revelada) {
                let dxMouse = estrella.x - mouse.x;
                let dyMouse = estrella.y - mouse.y;
                let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                
                if (distMouse < mouse.radio) {
                    estrella.revelada = true; 
                }
            }

            if (estrella.revelada) {
                estrellasReveladas++;
                estrella.x += (estrella.tx - estrella.x) * 0.10;
                estrella.y += (estrella.ty - estrella.y) * 0.10;
            } else {
                estrella.x += estrella.vx;
                estrella.y += estrella.vy;

                if (estrella.x < 0 || estrella.x > canvas.width) estrella.vx *= -1;
                if (estrella.y < 0 || estrella.y > canvas.height) estrella.vy *= -1;
            }

            estrella.anguloBrillo += estrella.velocidadBrillo;
            let brilloActual = estrella.baseBrillo + Math.sin(estrella.anguloBrillo) * 0.3;

            ctx.beginPath();
            ctx.arc(estrella.x, estrella.y, estrella.radio, 0, Math.PI * 2);
            
            if (estrella.revelada) {
                ctx.fillStyle = `rgba(255, 225, 100, ${brilloActual})`; 
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${brilloActual * 0.7})`;
            }
            ctx.fill();
        });

        if (estrellas.length > 0 && estrellasReveladas >= estrellas.length * 0.95 && !recompensaActivada) {
            recompensaActivada = true;
            ejecutarMensajeOculto();
        }

        animationFrameId = requestAnimationFrame(bucleEstelar);
    }

    function ejecutarMensajeOculto() {
        if (sfxConfeti) {
            sfxConfeti.currentTime = 0;
            sfxConfeti.play();
        }

        if (canvas) {
            canvas.style.transition = 'opacity 1.2s ease-in-out';
            canvas.style.opacity = '0.2';
            canvas.style.pointerEvents = 'none';
        }

        setTimeout(() => {
            const contenedorMensaje = document.getElementById('mensaje-secreto-estrellas');
            if (contenedorMensaje) {
                contenedorMensaje.style.display = 'flex';
                contenedorMensaje.style.opacity = '0';
                setTimeout(() => { contenedorMensaje.style.opacity = '1'; }, 50);
            }

            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ffe164', '#ffffff', '#ff4d6d'],
                    zIndex: 3000
                });
            }
        }, 600);
    }

    function detenerCanvasEstrellas() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        const msgSecreto = document.getElementById('mensaje-secreto-estrellas');
        if (msgSecreto) msgSecreto.style.display = 'none';
    }


    // === SECCIÓN DE INTERACCIÓN DE DISTANCIA ===
    if (corazonViajero) {
        corazonViajero.style.transition = "left 1.4s cubic-bezier(0.85, 0, 1, 1), transform 1.4s cubic-bezier(0.85, 0, 1, 1)";
    }

    let btnReiniciarDistancia = document.getElementById("btn-reiniciar-distancia");
    if (!btnReiniciarDistancia && fraseDistancia) {
        btnReiniciarDistancia = document.createElement("button");
        btnReiniciarDistancia.id = "btn-reiniciar-distancia";
        btnReiniciarDistancia.innerHTML = "✨ Reiniciar Trayecto ✨";
        
        Object.assign(btnReiniciarDistancia.style, {
            display: "none",
            marginTop: "15px",
            backgroundColor: "#ff758f",
            color: "white",
            border: "2px solid #ff4d6d",
            padding: "8px 18px",
            borderRadius: "15px",
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 0px #c93b55"
        });

        btnReiniciarDistancia.addEventListener("click", resetearDistanciaCompleto);
        fraseDistancia.parentNode.insertBefore(btnReiniciarDistancia, fraseDistancia);
    }

    function iniciarAcercamiento(lado) {
        if (juegoDistanciaCompletado || !numKm || !fraseDistancia) return; 
        
        clearInterval(intervaloKm);
        const kmIniciales = parseInt(numKm.getAttribute('data-km-real')) || 1441;
        let kmActuales = parseInt(numKm.textContent);
        let pasos = 0; 

        if (lado === "benja" && corazonViajero) {
            corazonViajero.style.left = "15%";
            corazonViajero.style.transform = "translate(-50%, -50%) rotate(-25deg) scale(1.3)";
            fraseDistancia.innerHTML = "☀️ ¡VIAJANDO A LOS BRAZOS DE TU SOLCITO MI AMOR! No sueltes el mouse. . .";
        } else if (lado === "moony" && corazonViajero) {
            corazonViajero.style.left = "85%";
            corazonViajero.style.transform = "translate(-50%, -50%) rotate(25deg) scale(1.3)";
            fraseDistancia.innerHTML = "🌙 ¡EL CORAZONCITO VA VOLANDO, MI LUNTA! Aguanta un poco ahí, ¿sí?";
        }

        intervaloKm = setInterval(() => {
            pasos++;
            if (kmActuales > 0) {
                let decremento = Math.ceil((kmIniciales / 200) * (pasos * 0.25)); 
                kmActuales -= decremento;
                if (kmActuales < 0) kmActuales = 0;
                numKm.textContent = kmActuales;
            } else {
                clearInterval(intervaloKm);
                finalizarTrayectoExitoso(lado);
            }
        }, 25); 
    }

    function finalizarTrayectoExitoso(destino) {
        if (juegoDistanciaCompletado || !fraseDistancia) return;
        juegoDistanciaCompletado = true;

        if (destino === "benja") {
            fraseDistancia.innerHTML = "💝 <strong>¡ESO!</strong> Tu corazoncito ha llegado a mí, mi lunita. La distancia no es nadita cuando nuestras almas están conectadas :3";
        } else {
            fraseDistancia.innerHTML = "💝 <strong>¡YESSS!</strong> Tu solcito te ha enviado muchísimo amor, ¡No te preocupes! siempre te llevaré conmigo. . .";
        }

        if (btnReiniciarDistancia) btnReiniciarDistancia.style.display = "inline-block";

        if (sfxConfeti) {
            sfxConfeti.currentTime = 0;
            sfxConfeti.play();
        }
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 60,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#ff4d6d', '#ff758f', '#fff'],
                zIndex: 3000
            });
        }
    }

    function regresarAlCentroSuave() {
        if (juegoDistanciaCompletado || !numKm || !fraseDistancia) return; 
        
        clearInterval(intervaloKm);
        const kmIniciales = numKm.getAttribute('data-km-real') || "1441";
        numKm.textContent = kmIniciales;
        fraseDistancia.textContent = "Si es verdad que nos separa mucha distancia, pero eso no impedirá que mi amor por tí se manifieste de algún modo, aquí a pesar de los kilómetros te puedo enviar amor jeje.";
        
        if (corazonViajero) {
            corazonViajero.style.left = "50%";
            corazonViajero.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)";
        }
    }

    function resetearDistanciaCompleto() {
        juegoDistanciaCompletado = false;
        if (btnReiniciarDistancia) btnReiniciarDistancia.style.display = "none";
        regresarAlCentroSuave();
    }

    if (nodoBenja) {
        nodoBenja.addEventListener('mouseenter', () => iniciarAcercamiento("benja"));
        nodoBenja.addEventListener('mouseleave', regresarAlCentroSuave);
        nodoBenja.addEventListener('touchstart', (e) => { e.preventDefault(); iniciarAcercamiento("benja"); }, { passive: false });
        nodoBenja.addEventListener('touchend', regresarAlCentroSuave);
    }
    if (nodoMoony) {
        nodoMoony.addEventListener('mouseenter', () => iniciarAcercamiento("moony"));
        nodoMoony.addEventListener('mouseleave', regresarAlCentroSuave);
        nodoMoony.addEventListener('touchstart', (e) => { e.preventDefault(); iniciarAcercamiento("moony"); }, { passive: false });
        nodoMoony.addEventListener('touchend', regresarAlCentroSuave);
    }

    // === EVENTOS PARA CERRAR TODOS LOS MODALES ===
    if (btnCerrarMuro) btnCerrarMuro.addEventListener('click', () => modalMuro.classList.remove('mostrar'));
    if (btnCerrarCofre) btnCerrarCofre.addEventListener('click', () => modalCofre.classList.remove('mostrar'));
    if (btnCerrarCarta) btnCerrarCarta.addEventListener('click', () => modalCarta.classList.remove('mostrar'));
    if (btnCerrarJuego) btnCerrarJuego.addEventListener('click', () => modalJuego.classList.remove('mostrar'));
    if (btnCerrarAdicional) btnCerrarAdicional.addEventListener('click', () => modalAdicional.classList.remove('mostrar'));
    
    if (btnCerrarDistancia) {
        btnCerrarDistancia.addEventListener('click', () => {
            modalDistancia.classList.remove('mostrar');
            clearInterval(intervaloKm);
        });
    }

    if (btnCerrarConstelacion) {
        btnCerrarConstelacion.addEventListener('click', () => {
            modalConstelacion.classList.remove('mostrar');
            detenerCanvasEstrellas();
        });
    }
});