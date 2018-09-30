<!DOCTYPE html>
<html>
    
    <head>
        <meta charset="UTF-8">
        <title>Unlucky Games</title>
        
        <link href="https://fonts.googleapis.com/css?family=Gorditas" rel="stylesheet">
        <!--font-family: 'Gorditas', cursive;-->
    
        <link href="https://fonts.googleapis.com/css?family=Arima+Madurai" rel="stylesheet">
     
        <style type="text/css">
            
            .textoCab{
            font-size: 30px;
            text-align: center;
            font-family: 'Gorditas', cursive; 
            }
            #titulo{
                 font-size: 60px;
            }

            .estiloFuenteGeneral{
                font-family: 'Arima Madurai', cursive;
                font-size: 20px;
            }

            .estiloContenedorText{
            padding-top: 5px;  
            }
            .estiloContenedorText p{  
                margin-left: 20px;
            }
            .estiloContenedorText h2{  
                text-align: center;
            }
            #e {
                color: green; 
                border-bottom: solid 2px;
                margin-left: 10%; margin-right: 10%;}
            #m {
                color: blue; 
                border-bottom: solid 2px;
                margin-left: 10%; margin-right: 10%;}
            #d {
                color: red; 
                border-bottom: solid 2px;
                margin-left: 10%; margin-right: 10%;}
        </style>
    </head>
    
    <body>
        <div class="estiloFuenteGeneral">
            
            <header>
                <group>
                    <p class="textoCab">¿Qué pasaría si trasladásemos los actuales Battle Royale al más puro estilo de juego retro? </p>

                    <p class="textoCab" id="titulo">BATTLEFORT</p>
                </group>
            </header>

        <div class="estiloContenedorText">
            <article>
                <header>
                    <h2>¿Qué es BattleFort?</h2>
                </header>

                <p>Un juego que recoge las mecánicas básicas de juegos como Fornite, y las adapta para disfrutar, de un juego más minimalista, pero sin dejar de brindar esas dinámicas que enganchan tanto. </p>
            </article>
        </div>

        <div class="estiloContenedorText">
            <article>
                <header id="e">
                     <h2>ESTÉTICA</h2>
                </header>
                <p>Un extenso mapa visto desde un plano cenital fijo y dividido en varias regiones (zona boscosa, montañosa, desértica, etc.) servirá como canvas del nivel de juego. </p>
                <p>Los diferentes sprites (personajes, armas, objetos, muros, etc.) se renderizarán en una capa superior y presentarán un estilo minimalista.</p>
            </article>
        </div>
            
        <div class="estiloContenedorText">
            <article>       
                <header id="m">
                     <h2>MECÁNICAS</h2>
                </header>

                <p>La partida se desarrollará por turnos. De manera aleatoria, al principio de cada partida, se designa el jugador que comenzará primero, y el orden de sucesión lo determina el número designado para cada jugador de forma creciente (jugador 1, jugador 2, ...etc.)</p>

                <p>En cada turno, el jugador dispondrá de un contador de pasos y de varias acciones como: recoger/soltar ítem, destruir/construir o atacar. El turno finaliza cuando el jugador agote sus pasos, o cuando efectúe un ataque. </p>
                <p>Ejemplo: Turno del jugador 1: Avanza 2 pasos; recoge ítem “arma”; hay un muro que impide el avance; destruye el muro; avanza 3 pasos; ataca al jugador 2.</p>

                <p>El jugador no podrá avanzar en dirección a una casilla ocupada por un muro, por otro jugador o por un obstáculo. </p>

                <p>Cada jugador podrá destruir muros, y construir otros propios. Y para atacar al rival usará las diferentes armas disponibles en base al rango de alcanza de las mismas.</p>

                <p>Todos los ítems (armas, cofres u objetos) son generados de manera aleatoria en diferentes posiciones al inicio de cada partida. </p>   
            </article>
        </div>


        <div class="estiloContenedorText">
            <article>
                <header id="d">
                     <h2>DINÁMCIAS</h2>
                </header>
                 <p>Gestionando las mecánicas descritas los jugadores deberán crear estrategias de juego para vencer a todos los rivales en partida. Sólo puede quedar uno. </p>

                <p>Los jugadores podrán cercar casillas construyendo muros, y de esa manera preparar emboscadas y acabar con sus rivales sin piedad. </p>
            </article>
        </div>
        
    </div>
        
  </body>
    
</html>