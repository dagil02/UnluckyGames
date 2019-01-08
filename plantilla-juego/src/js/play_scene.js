"use strict";

var mapa = require("./Mapa");
var player = require("./Player");

//var cursors;

var PlayScene = {
  create: function () {
    // ************** CONSTANTES Y VARIABLES DE GAME **********************
    //World
    this.game.world.setBounds(0, 0, 800, 592);
    this.game.camera.setBoundsToWorld();
    this.hud = this.game.add.sprite(800, 208, "hud2");
    this.hud.x = 0;
    this.hud.y = 592;
    //atributos gestión escalar
    this.previousScale = 1; //por defecto
    this.previousWorld_W = this.game.world.bounds.width;
    this.previousWorld_H = this.game.world.bounds.height;
    this.boolScale = false;

    //Input
    this.inputAux = this.game.input.keyboard;
    //zoom: scale*2; scale*1
    this.key1 = Phaser.KeyCode.ONE;
    this.key2 = Phaser.KeyCode.TWO;
    //pausa
    this.key3 = Phaser.KeyCode.ESC;
    //reanuda juego
    this.key4 = Phaser.KeyCode.ENTER;
    //Vuelta al menu
    this.key5 = Phaser.KeyCode.SPACEBAR;
    //Variables que controlan la pausa
    this.pause = false; //bool de control
    this.menuPause; //se genera un sprite

    //Musica
    this.MusicaFondo = this.game.add.audio("AudioJuego", 0.05, true);
    this.MusicaFondo.play();

    //fin del juego
    this.endGame = false;

    //LOGICA TURNOS
    //numero de jugadores en partida
    this.numPlayers = this.game.numPlayers; //se va reduciendo con cada muerte
    this.turno = 0; //variable
    this.auxTurno = 0;
    this.pasaBool = false;
    //TEXTOS
    //texto de transicion
    this.text1;


    //******************************************************************* */

    //******************* GENERACION DE ELEM DE JUEGO *******************
    //JUGADORES

    this.playerGroup = this.game.add.group();
    //desierto; niveve; praderaTop; praderaButton
    this.playerPos = [
      { x: 128, y: 96, 'name': 'player_1' },
      { x: 640, y: 512, 'name': 'player_2'},
      { x: 688, y: 64, 'name': 'player_3' },
      { x: 32, y: 560, 'name': 'player_4' }
    ];
    //se crean los jugadores y se meten en el grupo
    var numAparecidos = [];
    for (var i = 0; i < this.numPlayers; i++) {
      //genera un aleatorio para colocar a los jugadores
      //el doble bucle anidado interno evita que el random repita posición para dos o más jugadores.
      var esta = true;
      var r;
      while (esta) {
        r = Math.floor(Math.random() * 4);
        var bool = false;
        var j = 0;
        while (!bool && j < numAparecidos.length) {
          bool = r === numAparecidos[j];
          j++;
        }
        if (bool) {
          r = Math.floor(Math.random() * 4);
        } else {
          esta = false;
          numAparecidos.push(r);
        }
      }
      var rPos = this.playerPos[r];
      this.playerGroup.add(new player(this.game, rPos.x, rPos.y, rPos.name)); 
    }
    //contador de pasos y vida. CONSTANTE
    this.playerWalkCont = 40;
    this.playerLife = 200;
    //por cada miembro del grupo se actualiza su contador
    var i = this.numPlayers;
    this.playerGroup.forEach(element => {
      element.walkCont = this.playerWalkCont;
      element.life = this.playerLife;
      element.name = i;
      i++;
    });
    //se hacen fijos los body de los jugadores fuera de turno
    for (var i = 0; i < this.playerGroup.length; i++) {
      if (i !== this.turno) {
        this.playerGroup.children[i].body.immovable = true;
      }
    }

    //MAPA Y RECURSOS
    this.mapa = new mapa(this.game);
    this.mapa.generate(this.playerGroup);

    //la variable recoge los grupos de físicas de obj. parametro en this.checkInput()
    this.objGr = this.mapa.GrupoObjetos;

    this.game.world.bringToTop(this.playerGroup);

    //se construye el hud
    this.gameHUD();
    this.game.world.bringToTop(this.GrupoTextos);
  },

  //************ */RENDER Y UPDATE ********************
  update: function () {
    if (!this.endGame) {
      if (!this.pause) {
        //paraliza el juego mientras se cambia de turno
        if (!this.pasaBool) {
          this.checkPlayerLife();
          this.compruebaTurno();
          this.playerGroup.children[this.turno].bulletUpdate(this);
          this.checkInput(); //gestiona el input de cada jugador en su turno
          //this.playerGroup.children[this.turno].updateTexture();

        }
      } else {
        //La barra espaciadora manda al menu inicial
        if (this.inputAux.isDown(this.key5)) {
          this.pause = false;
          this.game.state.start("Menu");
          //la tecla enter reanuda el juego
        } else if (this.inputAux.isDown(this.key4)) {
          this.pause = false;
          this.endPause();
        }
      }
    } else {
      this.game.state.start("CreditScene");

    }
  },

  render: function () {
    this.renderHUD();
    this.game.world.bringToTop(this.GrupoTextos);

  },
  //*********************************************************************************************** */

  //GESTION DEL ESCALADO DEL TILEMAP Y SPRITES  ****************
  zoomTo: function (scale) {
    //escalar
    var auxScale = this.previousScale; //auxiliar para recoger el escalar previo
    this.boolScale = this.previousScale === 2;
    this.previousScale = scale;
    //mundo
    //se opera para garantizar una correcta redimension de los límites del área de juego
    var auxW = this.previousWorld_W / auxScale;
    var auxH = this.previousWorld_H / auxScale;
    this.previousWorld_W = auxW * scale;
    this.previousWorld_H = auxH * scale;
    //cámara
    var auxCamera_H = this.hud.height + this.previousWorld_H; //eje: worldH 1184 + 208 = 1392; así permite a la cam sobrepasar los límites del mundo

    //se invoca a los método de los gameObjects
    this.mapa.resizeLayer(scale);
    //this.playerGroup.children[0].resizePlayer(scale);
    this.playerGroup.forEach(element => {
      element.resizePlayer(scale);
    });
    //gestión del mundo para permitir rendrizado del hud fuera de los límites. así el jugador puede llegar al linde sin ser obstaculizado por el z-depth
    this.game.world.setBounds(0, 0, this.previousWorld_W, this.previousWorld_H);

    this.game.camera.bounds.setTo(0, 0, this.previousWorld_W, auxCamera_H);
    if (!this.boolScale) {
      this.HudScale();
    }
    //gestion de la camara
    this.game.camera.follow(this.playerGroup.children[this.turno]);

  },

  HudScale: function () {
    if (this.game.camera.x > 0 || this.game.camera.y > 0) {
      if (this.game.camera.x > 0) {
        this.hud.x = this.game.camera.x;
      }
      if (this.game.camera.y > 0) {
        this.hud.y = 592 + this.game.camera.y;
      }
    } else {
      this.hud.x = 0;
      this.hud.y = 592;
    }

    this.hud.fixedToCamera = true;
    this.game.world.bringToTop(this.hud);

  },

  //********* */GESTION DEL INPUT ************
  checkInput: function () {
    if (this.inputAux.isDown(this.key1)) {
      this.zoomTo(2);
    } else if (this.inputAux.isDown(this.key2)) {
      this.zoomTo(1);
    } else {
      this.playerGroup.children[this.turno].checkInput(this.mapa, this.objGr);
    }
    //la tecla esc activa el menu de pausa
    if (this.inputAux.isDown(this.key3)) {
      this.pause = true;
      this.startPause();
    }
  },

  //*********** */GESTION DE LOS MENUS Y ESTADOS ***************

  startPause: function () {
    //crea un nuevo objeto tipo spirte
    this.menuPause = this.game.add.sprite(0, 0, "Pausa");
    this.menuPause.fixedToCamera = true;
    //valores de renderizado del menuPause
    this.menuPause.alpha = 0.7;
    this.MusicaFondo.pause(); //se pausa la música
  },
  endPause: function () {
    //destruye le sprite
    this.menuPause.destroy();
    this.MusicaFondo.play(); //reanuda la música
  },

  //********************** */GESTIÓN DE TURNOS ***************************
  //Pasa el turno al siguiente
  pasaTurno: function () {

    this.text1.destroy(); //se destruye el bitMapText

    //incrementa el turno del jugador de manera cíclica al sobrepasar el máx.
    this.turno = (this.turno + 1) % this.numPlayers;

    this.zoomTo(2);

    //un nuevo texto antes de omenzar
    this.text1 = this.game.add.bitmapText(this.game.camera.x + 180, this.game.camera.y + 270, "fuente2", "READY PLAYER?", 32);
    this.text1.width = 450; this.text1.height = 90;
    this.text1.fixedToCamera = true;


    //se crea un evento de n seg dónde se amplia la cámara para identificar al siguiente jugador
    this.game.time.events.add(2000, this.pasaTurnoAux, this);
  },

  //segunda parte del método pasa turno. es llamado después del intervalo de tiempo
  pasaTurnoAux: function () {

    this.text1.destroy();
    this.pasaBool = false; //el buleano desInterrumpe el ciclo del update

    //actualiza el contador de pasos según la constante
    this.playerGroup.children[this.turno].walkCont = this.playerWalkCont;
    this.playerGroup.children[this.turno].body.immovable = false;
    for (var i = 0; i < this.playerGroup.length; i++) {
      if (i !== this.turno) {
        this.playerGroup.children[i].body.immovable = true;
      }
    }

    //se renderiza para no dejar los valores  del HUD en blanco 
    this.renderHUD();
    this.game.world.bringToTop(this.GrupoTextos);
  },

  compruebaTurno: function () {
    if (this.playerGroup.children[this.turno].walkCont <= 0) {
      this.pasaBool = true;
      this.LooserText();
    }
  },

  LooserText: function () {
    //asegura que la escala sea la de por defecto
    this.zoomTo(1);

    //Texto precargado. bitmapFont
    this.text1 = this.game.add.bitmapText(0, 300, "fuente1", 'GET READY NEXT LOOSER', 48);
    //se definen físicas para que el texto se mueva hacia el centro de la pantalla
    this.game.physics.arcade.enable(this.text1);
    this.text1.body.velocity.x += 60;
    this.text1.collideWorldBounds = true;
    this.text1.body.bounce.set(1);
    //se establece un evento de tiempo, a los tres segundos se destruye el texto y se inicia el siguiente turno
    this.game.time.events.add(2200, this.pasaTurno, this);
  },


  //**************GESTION VIDA Y ESTADO FIN DE JUEGO  */
  checkPlayerLife: function () {
    this.playerGroup.forEach(element => {
      if (element.life <= 0) {
        element.destroy();
        this.numPlayers--;
        this.turno = this.turno % this.numPlayers;
        if (this.numPlayers === 1) {
          this.PlayerWin();
        }
      }
    });
  },

  //implementar victoria ¡¡¡¡¡¡¡¡¡¡
  PlayerWin: function () {
    this.game.state.start("VictoryScene");
  },

  /** HEADS UP DISPLAY */

  //Textos que se renderizarán en el HUD 
  gameHUD: function () {

    var X = 250; var X2 = 600;
    var Y = 125; var Y2 = 155;
    //player - life
    this.hudPosPlayer = { 'x': this.hud.x + X, 'y': this.hud.y + 38 };
    this.hudPosLife = { 'x': this.hud.x + X, 'y': this.hud.y + 66 };
    //pasos - recursos
    this.hudPosWalks = { 'x': this.hud.x + X, 'y': this.hud.y + Y };
    this.hudPosResources = { 'x': this.hud.x + X, 'y': this.hud.y + Y2 };
    //weapon - alcance - daño
    this.hudPosWeapon = { 'x': this.hud.x + X2, 'y': this.hud.y + 55 };
    this.hudPosScope = { 'x': this.hud.x + X2, 'y': this.hud.y + Y };
    this.hudPosDamage = { 'x': this.hud.x + X2, 'y': this.hud.y + Y2 };

    var style = { font: "24px Calibri", fill: "#fff", tabs: [164, 120] };
    var style2 = { font: "18px Calibri", fill: "#fff", tabs: [164, 120] };

    var aux1;
    var aux2;
    var aux3;
    if (this.playerGroup.children[this.turno].currentWeapon) {

      aux1 = this.playerGroup.children[this.turno].currentWeapon.tipoArma;
      aux2 = this.playerGroup.children[this.turno].currentWeapon.weaponDamage;
      aux3 = this.playerGroup.children[this.turno].currentWeapon.alcance;

      style2 = { font: "24px Calibri", fill: "#fff", tabs: [164, 120] };
    }
    else { aux1 = "Hazte un tirachinas"; aux2 = "Fulminalo con la mirada"; aux3 = "El horizonte"; }
    //plasyer - life
    this.texPlayer = this.game.add.text(this.hudPosPlayer.x, this.hudPosPlayer.y, this.turno + 1, style);
    this.texLife = this.game.add.text(this.hudPosLife.x, this.hudPosLife.y, this.playerGroup.children[this.turno].life, style);
    //walks - resources
    this.texWalks = this.game.add.text(this.hudPosWalks.x, this.hudPosWalks.y, this.playerGroup.children[this.turno].walkCont, style);
    this.textResources = this.game.add.text(this.hudPosResources.x, this.hudPosResources.y, this.playerGroup.children[this.turno].resources, style);
    //arma - alcance - daño
    this.textWeapon = this.game.add.text(this.hudPosWeapon.x, this.hudPosWeapon.y, aux1, style2);
    this.texScope = this.game.add.text(this.hudPosScope.x, this.hudPosScope.y, aux3, style2);
    this.textDamage = this.game.add.text(this.hudPosDamage.x, this.hudPosDamage.y, aux2, style2);

    //grupo para renderizar 
    this.GrupoTextos = this.game.add.group();
    this.GrupoTextos.add(this.texPlayer); this.GrupoTextos.add(this.texLife); this.GrupoTextos.add(this.texWalks); this.GrupoTextos.add(this.textResources);
    this.GrupoTextos.add(this.textWeapon); this.GrupoTextos.add(this.texScope); this.GrupoTextos.add(this.textDamage);

    //tienen que seguir a la cámara para no desplazarse cuando se escala el hud
    this.GrupoTextos.forEach(element => {
      element.fixedToCamera = true;
    });

  },

  //Se ejectua en el Render de PlayScene para actualizar textos
  renderHUD: function () {

    var aux1; var aux2; var aux3; var style2;
    if (this.playerGroup.children[this.turno].currentWeapon) {

        aux2 = this.playerGroup.children[this.turno].currentWeapon.weaponDamage;
        aux3 = this.playerGroup.children[this.turno].currentWeapon.alcance;     
        style2 = { font: "24px Calibri", fill: "#fff", tabs: [164, 120] };

      if (this.playerGroup.children[this.turno].currentWeapon.balas_Cont === 0){
        aux1 = "Sin balas";
        style2 = { font: "18px Calibri", fill: "#fff", tabs: [164, 120] };
      }
      else {
        aux1 = this.playerGroup.children[this.turno].currentWeapon.tipoArma;
      }
    }
    else {
      aux1 = "Hazte un tirachinas"; aux2 = "El horizonte"; aux3 = "Donde alcance tu vista";
    }
    this.texPlayer.setText(this.turno + 1);
    this.texLife.setText(this.playerGroup.children[this.turno].life);
    this.texWalks.setText(this.playerGroup.children[this.turno].walkCont);
    this.textResources.setText(this.playerGroup.children[this.turno].resources);
    this.textWeapon.setText(aux1);
    this.texScope.setText(aux3);
    this.textDamage.setText(aux2);
  },

};

module.exports = PlayScene;