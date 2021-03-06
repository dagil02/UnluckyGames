"use strict";

//jugador tiene un contador de pasos que determina el final del turno.
//los pasos decrementan cuando recoge recursos "árboles" y cuando destruye muros.
//los pasos decrementan en base a un escalar dependiendo del tipo de arma que lleva

function Player(game, x, y, sprite) {
  Phaser.Sprite.call(this, game, x, y, sprite); //hereda de sprite

  this.nameTex = sprite;
  this.nameLeft; this.nameGun; this.nameGunLeft;
  if (sprite === 'player_1'){
    this.nameLeft = 'player_1_left'; this.nameGun = 'player_1_Gun'; this.nameGunLeft = 'player_1_Gun_left';
  }
  else if (sprite === 'player_2'){
    this.nameLeft = 'player_2_left'; this.nameGun = 'player_2_Gun'; this.nameGunLeft = 'player_2_Gun_left';
  }
  else if (sprite === 'player_3'){
    this.nameLeft = 'player_3_left'; this.nameGun = 'player_3_Gun'; this.nameGunLeft = 'player_3_Gun_left';
  }
  else {
    this.nameLeft = 'player_4_left'; this.nameGun = 'player_4_Gun'; this.nameGunLeft = 'player_4_Gun_left';
  }

  //ATTRIBUTE
  this.game = game;
  this.game.world.addChild(this);

  this.life = 100; //contador de vida 
  this.name;

  this.numeroPos;



  //gestion cambio textura
  this.changeTex = false;

  //gestion del turno
  this.walkCont; //los pasos se resetean con cada turno.
  this.walk_WallScale = 4;
  this.walk_ResourceScale = 3;
  //walk_WeaponScale se recoge del atributo currentWeapon. dado que su valor depende del arma

  //input
  this.inputAux = this.game.input.keyboard;
  //deslpazamiento: izq, arrib, derch, abajo.
  this.key1 = Phaser.KeyCode.A;
  this.key2 = Phaser.KeyCode.W;
  this.key3 = Phaser.KeyCode.D;
  this.key4 = Phaser.KeyCode.S;
  //objetos: pick and drop
  this.key5 = Phaser.KeyCode.P; //recoger arma o recurso
  this.key7 = Phaser.KeyCode.U; //soltar arma
  //builds
  this.key6 = Phaser.KeyCode.O;
  //shots
  this.key8 = Phaser.KeyCode.SPACEBAR;

  this.orientation = 0;
  this.velMove = 200; //controla el tiempo de desplazamiento
  this.timeMove = 0;

  //recoge la prox pos de player y la divide por la escala actual.
  //siempre obtendremos un valor de +-16 (tile: 16x16)
  this.POSPREVIA;

  //scale
  this.auxScale = 1; //1 por defecto. función Prototype resizePlayer

  //shot and build
  this.resources = 0; //contador de recursos
  this.wallGroup = this.game.add.group();
  this.bulletGroup = this.game.add.group();

  //weapon
  this.currentWeapon;

  //physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.collideWorldBounds = true;
  this.body.bounce.setTo(1, 1);
  this.body.x = this.x;
  this.body.y = this.y;

  //efectos de sonido
  this.SonidoDisparo = this.game.add.audio('Disparo',1,false);
  this.SonidoPasos = this.game.add.audio('Pasos',0.1,false);
  this.SonidoMuros = this.game.add.audio('Muro',0.5,false);
}


Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//redimensiona los objetos según parámetro.
Player.prototype.resizePlayer = function(scale) {
  var aux = this.auxScale; //aux recoge el último escalar
  this.auxScale = scale; //el atributo de la clase recoge el nuevo escalar
  this.scale.setTo(scale);
  this.x = this.x / aux;
  this.x = this.x * scale;
  this.y = this.y / aux;
  this.y = this.y * scale;

  //redimensiona los objetos en la mochila
  this.wallGroup.forEach(element => {
    element.resizeObject(scale);
  });
};

Player.prototype.checkInput = function (mapa, obj) {
  //desplazamiento y orientacion
  if (
    this.inputAux.isDown(this.key1) ||
    this.inputAux.isDown(this.key2) ||
    this.inputAux.isDown(this.key3) ||
    this.inputAux.isDown(this.key4)
  ) {
    this.checkMove(mapa);
    //objetos: recoger y soltar
  } else if (
    this.inputAux.isDown(this.key5) ||
    this.inputAux.isDown(this.key6)
  ) {
    if (this.inputAux.isDown(this.key5)) {
      mapa.playerPickUpObject(this);
    } else {
      this.buildWall(mapa);
    }
  } else if (this.inputAux.isDown(this.key7)) {
    if (this.currentWeapon){
      mapa.playerDropObject(this);
    }
  
  }
  else if (this.inputAux.isDown(this.key8)) {
    this.shotBullet();
  }
};

//gestiona el input por desplazamiento
//el movimiento se realiza por tile: incrementa/decrem. en base al w/h actual del sprite
Player.prototype.checkMove = function(mapa) {
  //recogen la posición según input
  var pos = { x: 0, y: 0 };
  var posPrevia = { x: 0, y: 0 };

  //define la llamada a movePlayer()
  var boolcheck = false;

  //worldBounds
  var x = this.game.world.bounds.width - this.width * 2; //lím. derch
  var y = this.game.world.bounds.height - this.height * 2; //lím inferior

  //arriba W
  if (this.inputAux.isDown(this.key2)) {
    this.orientation = 0;
    if (this.body.y >= this.height) {
      pos.y -= this.width;
      posPrevia.y -= this.height / this.auxScale;
      boolcheck = true;
    }
  }
  //derecha D
  else if (this.inputAux.isDown(this.key3)) {
    this.orientation = 1;
    if (this.body.x <= x) {
      pos.x += this.width;
      posPrevia.x += this.width / this.auxScale;
      boolcheck = true;
    }
  }

  //abajo S
  else if (this.inputAux.isDown(this.key4)) {
    this.orientation = 2;
    if (this.body.y <= y) {
      pos.y += this.width;
      posPrevia.y += this.height / this.auxScale;
      boolcheck = true;
    }
  }
  //izquierda A
  else if (this.inputAux.isDown(this.key1)) {
    this.orientation = 3;
    if (this.body.x >= this.width) {
      pos.x -= this.width;
      posPrevia.x -= this.width / this.auxScale;
      boolcheck = true;
    }
  }

 
  //si existe entrada de teclado
  if (boolcheck) {
    //la variable de ámbito local simula la siguiente pos en base al escalar y lo pasa al atributo de la clase
    posPrevia.x = this.body.x + posPrevia.x;
    posPrevia.y = this.body.y + posPrevia.y;
    this.POSPREVIA = posPrevia; //comunica con class: Map mediante parámetro en método this.compruebaColision(...)

    this.movePlayer(mapa, pos);
    boolcheck = false;
  }
};

Player.prototype.movePlayer = function(mapa, posT) {
  //recogen el valor actual antes del cambio
  var X = this.body.x;
  var Y = this.body.y;

  //simula el siguiente paso
  this.body.x += posT.x;
  this.body.y += posT.y;

  //si existe colision no modifica la pos actual
  if (this.compruebaColision(mapa)) {
    this.body.x = X;
    this.body.y = Y;
  } else {
    //gestiona un timeCounter para regular la velocidad de desplazamiento
    //y decrementa los pasos le jugador
    
    if (this.game.time.now > this.timeMove) {

      //movimiento hacia la izquierda
      if (this.orientation === 3){

        if (!this.changeTex){
          this.changeTex = true;
          this.frame = 0;
          if (this.currentWeapon){this.loadTexture(this.nameGunLeft);}
          else {this.loadTexture(this.nameLeft)} 
        }
      }
      if (this.orientation === 1){
        if (this.changeTex){
          this.changeTex = false;
          if (this.currentWeapon){this.loadTexture(this.nameGun);}
          else {this.loadTexture(this.nameTex);}
          this.frame = 0;
        }
      }
      this.frame = (this.frame + 1) % 8;
      this.SonidoPasos.play();
      this.walkCont--;
      this.timeMove = this.game.time.now + this.velMove;
    } else {
      this.body.x = X;
      this.body.y = Y;
    }
  }
};

Player.prototype.compruebaColision = function(mapa) {
  var bool = false;
  //primero verifica que no choque con un recurso o arma
  bool = mapa.PlayerObjectCheckCollision(this);
  //si no existe colision con objs llama a la función de la class: Map
  if (!bool) {
    //this.POSPREVIA se usará en caso de que auxScale === 2
    bool = mapa.playerCheckLayerCollision(this) || this.game.physics.arcade.collide (this, mapa.plyGroup.children) ;
  }

  return bool;
};

//jugador manda la orden a class: mapa. en caso de devolver true, decrementa los recursos en mochila y reactiva el timer
Player.prototype.buildWall = function(mapa) {
  //siempre que existan existencias en la mochila
  if (this.resources > 0) {
    //controla el tiempo de creación
    if (this.game.time.now > this.timeMove) {
      if (mapa.añadeWall(this)) {
        this.SonidoMuros.play();
        this.resources--;
        this.timeMove = this.game.time.now + this.velMove;
      }
    }
  }
};

//construeye la bala y ésta establece su propia lógica en base a los atributos de player
Player.prototype.shotBullet = function() {
  //1º comprueba que el jugador esté armado
  if (this.currentWeapon) {
    //2º que el tiemerCount alcance el límite fijado
    if (this.game.time.now > this.timeMove) {
      //3º que el arma tenga balas en la recamara. Shot: devuelve true y decrementa las balas en la recamara
      if (this.currentWeapon.Shot()) {
        //se genera la bala y se establece su lógica de movimiento
        this.SonidoDisparo.play();
        var bullet = require("./Bala");
        var shot = new bullet(this.game, this.x, this.y, "bala");
        shot.generate(this);
        shot.move();//establece la lógica mov
        this.bulletGroup.add(shot);
        this.game.world.bringToTop(this.bulletGroup);
       
        this.timeMove = this.game.time.now + this.velMove;
      }
    }
  }
};

//comunica con class: PlayScene y Mapa y gestiona la destrucción de la bala y sus llamadas según colisión
Player.prototype.bulletUpdate = function (playScene) {
  if (this.bulletGroup.length > 0) {
    this.bulletGroup.forEach(element => {
      if (element.limiteAlcance() || playScene.mapa.PlayerObjectCheckCollision(element)) {
        element.destroy();
      }
      else {
        var XY = {'x': this.game.math.roundTo(element.x /element.width, 0), 'y':this.game.math.roundTo(element.y /element.height, 0)};
        if (playScene.mapa.TileOcupado(XY, playScene.mapa.tile_Map.layerGroup.children)){
          element.destroy();
        }
        else {
          this.CheckPlayerBulletVsPlayer(playScene);}
      }
    });
  }
};

Player.prototype.CheckPlayerBulletVsPlayer = function (playScene){

  var bool = false;
  var i = 0;
  bool = this.game.physics.arcade.collide(this.bulletGroup.children, playScene.playerGroup.children, this.PlayerPain);
};

Player.prototype.PlayerPain = function (bala, player){
  player.life -= bala.bulletDamage;
  bala.destroy();
  console.log ("vida jugador: " + player.life);
}

Player.prototype.updateTexture = function(){

  if (this.currentWeapon){
    if (this.orientation === 1){
      this.loadTexture(this.nameGun);
    }
    else{
      this.loadTexture(this.nameGunLeft);
    }
  }
};



module.exports = Player;


