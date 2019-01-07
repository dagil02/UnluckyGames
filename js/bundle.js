(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

/*Se crea el objeto arma y se llama a su método generate()
cuando el jugador recoja el arma, cambiará de estado a: armado (cambio de img)
se desactiva la física del obj, se hace invisible y se aclopa al jugador para utilizar sus 
valores al disparar. Si se cambia el obj o se deja caer, éste recupera física y visibilidad, pero
mantiene los valores actuales (ejem: menos balas en el cargador) */

var objeto = require('./Objeto');

//WEAPONS
function Armas(game, x, y, sprite) {

	objeto.call(this, game, x, y, sprite); //hereda de objeto 
	this.name = "weapon";


	//ATTRIBUTE
	this.balas_Cont; //contador decrementa con cada disparo
	this.balas_image; //la imagen comunica con jugador para crear obj balas
	this.tipoArma = sprite; //sprite es un tipo string. sirve para inicializar el arma según su tipo
	this.alcance;//comunica con jugador y determina si se puede disparar o no
	this.weaponDamage;//damage comunican con jugador y éste con bala para determinar el daño ¡¡existe un atributo de sprite que se llama damage, no llamar así!!
	this.walk_WeaponScale; //será el escalar que resta pasos al jugador con cada disparo

	this.walkContador;

	//METHODS
	this.asignaValores = function (funcionRandom) {
		this.balas_Cont = funcionRandom; //la cantidad de balas sí es aleatoria
		this.cantidad = 1; //en este caso cantidad no depende del random
		this.Tipo_De_Arma();
	}

	//función para determinar el tipo de arma e inicializar sus atributos
	this.Tipo_De_Arma = function () {
		if (this.tipoArma === "pistola") { this.alcance = 5; this.weaponDamage = 10; this.balas_image = 'b_Gun'; this.walk_WeaponScale = 1; this.walkContador = 2;}
		else if (this.tipoArma === "subFusil") { this.alcance = 10; this.weaponDamage = 25; this.balas_image = 'b_Sf'; this.walk_WeaponScale = 3; this.walkContador = 4;}
		else if (this.tipoArma === "francoTirador") { this.alcance = 20; this.weaponDamage = 50; this.balas_image = 'b_Sn'; this.walk_WeaponScale = 6; this.walkContador = 8;}
	}

}
Armas.prototype = Object.create(objeto.prototype);
Armas.prototype.constructor = Armas;

Armas.prototype.generate = function () {
	//la función random la herda de la clase Objeto.
	this.asignaValores(this.RandomItem(10));
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
	this.body.immovable = true;
	this.body.x = this.x; this.body.y = this.y;

};

//comunica con class: Player. como la tiene asociada al atributo currentWeapon, éste hace la llamada
Armas.prototype.Shot = function () {
	if (this.balas_Cont >=1){
		this.balas_Cont--;
		return true;
	}
	else return false;	
}

module.exports = Armas;


},{"./Objeto":7}],2:[function(require,module,exports){
"use strict";

//jugador crea el obj. bala, luego se llama a AsignaValores, y por último a
//su generate para aplicar la lógica

var objeto = require("./Objeto");

function Bala(game, x, y, sprite) {
  objeto.call(this, game, x, y, sprite); //hereda de objeto

  //ATTRIBUTES
  //recibe el valor del arma que porta jugador
  this.vel = 100;
  this.vel_Y = false;
  this.damage = 0;
  this.alcance = 0;
  this.name = 'bullet';
  //recibe el valor de jugador
  this.orientacion;

  this.dir;
}
Bala.prototype = Object.create(objeto.prototype);
Bala.prototype.constructor = Bala;

//METHODS
// determina la dirección de la bala
Bala.prototype.direction = function(player) {
  this.orientation = player.orientation; 
  var dir = { x: 0, y: 0 }; //coordenadas de retorno
  //0:arriba; //el sprite, en 0 grados, apunta hacia arriba
  if (this.orientation === 0) {
    dir.y = -1 * this.height;
    this.alcance = this.y + this.alcance * dir.y; //alcance obtiene la posición donde debe destruirse
    this.vel *= -1;
    this.vel_Y = true;
  } else if (this.orientation === 1) {
    dir.x = 1 * this.width;
    this.alcance = this.x + this.alcance * dir.x;
   
  } //2:abajo;
  else if (this.orientation === 2) {
    dir.y = 1 * this.height;
    this.alcance = this.y + this.alcance * dir.y;
    this.vel_Y = true;
 
  }
  //3:izquierda
  else if (this.orientation === 3) {
    dir.x = -1 * this.width;
    this.vel *= -1;
    this.alcance = this.x + this.alcance * dir.x;
  }
  return dir;
};

Bala.prototype.generate = function(player) {
  //alcance y daño se recogen del atributo currentWeapon
  this.alcance = player.currentWeapon.alcance;
  this.bulletDamage = player.currentWeapon.weaponDamage;

  //physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.collideWorldBounds = true;
  this.body.checkCollision = true;

  //si se crea con la escala aumentada debe redimensionarse
  if (this.auxScale !== player.auxScale) {
    this.resizeObject(player.auxScale);
    //como el método ya diplica una posición presupuesta de 16*16 hay que dividir
    this.x /= player.auxScale;
    this.y /= player.auxScale;
    this.vel *= 2; //duplica la velocidad para regular según escalar
  }
  //se recoge la nueva pos que será un tile por delante del jugador
  this.dir = this.direction(player);
  this.x += this.dir.x;
  this.y += this.dir.y;
};

Bala.prototype.move = function() {
   this.body.x = this.x; this.body.y = this.y;
    if (this.vel_Y) {
    this.body.velocity.y = this.vel;
  } else {
    this.body.velocity.x = this.vel;
  }
};

//de actualizará en el update, si llega al límite sin colsionar con algo se destruirá.

Bala.prototype.limiteAlcance = function() {
  var bool = false;
  //si colisiona con los límites del mapa
  if (this.body.checkWorldBounds()) {
    bool = true;
  } else {
    if (this.orientation === 0) {
      bool = this.y <= this.alcance;
    } else if (this.orientation === 3) {
      bool = this.x <= this.alcance;
    } else if (this.orientation === 1) {
      bool = this.x >= this.alcance;
    } else {
      bool = this.y >= this.alcance;
    }
  }

  return bool;
};

module.exports = Bala;
},{"./Objeto":7}],3:[function(require,module,exports){
'use strict'

var Creditos =  {
    create:function (game) {

        this.game = game;

        this.credti;
        this.cursor = this.game.input.keyboard;
        this.key1 = Phaser.KeyCode.ENTER;

      
        this.credti = game.add.sprite(0, 0, 'FondoCreditos');
        
    },

    update:function (game) {
        if (this.cursor.isDown(this.key1)) {
            this.state.start('Menu');
          }

    },

};
module.exports = Creditos;
},{}],4:[function(require,module,exports){
"use strict";

var introScene = {
  create: function(game) {
    this.game = game;
 
    //this.video = this.game.video.create();
    this.video = this.game.add.video('introScene');
    this.video.addToWorld(450, 400, 0.5, 0.5, 0.5, 0.5);
    this.video.play();

    this.videoOFF = new Phaser.Signal();
    this.video.onComplete = this.videoOFF;
    this.videoOFF.addOnce(this.changeState,this);
    
   

   
  },
  update: function(game) {
  },

  changeState: function (){
    this.state.start("Menu");
  }

};
module.exports = introScene;

//onComplete

},{}],5:[function(require,module,exports){
"use strict";

//node_modules/.bin/gulp run

function Mapa(game) {
  //ATRIBUTOS
  this.game = game;

  this.tile_Map; //recoge el mapa de tiles

  //capas
  this.layer_background;
  this.layer_obstaculo_0;
  this.layer_obstaculo_1;
  this.layer_obstaculo_2;

  //efectos de sonido
  this.SonidoRecurso = this.game.add.audio("Recursos", 1, false);

  //gestion escalar: 1 por defecto. se usa en el método Prototype.LayerResize
  this.auxScale = 1;

  //posciones jugadores
  this.plyGroup = this.game.add.group();

  //FUNCIONES
  //------METODOS PARA LA CREACIÓN DE OBJETO------

  //Método que comprueba que no se va a posicionar el objeto encima de otro. se invoca dentro de AñadeObjeto
  this.AñadeObjetoAux = function(aux) {
    var esta = false;
    //tomará acierto si existe colisión entre objetos (armas/recursos/muros construidos) y posiciones player
    esta =
      this.game.physics.arcade.collide(
        aux,
        this.GrupoObjetos.children[0].children
      ) ||
      this.game.physics.arcade.collide(
        aux,
        this.GrupoObjetos.children[1].children
      ) ||
      this.game.physics.arcade.collide(
        aux,
        this.GrupoObjetos.children[2].children
      );
    //como el método también lo usa la construccion de muros, evita no devolver false en caso de coincidir con una pos inicial de juegador
    //porque este método también se usa después de la creación del mapa
    if (!esta && aux.name !== "wall") {
      esta = this.game.physics.arcade.collide(aux, this.plyGroup.children);
    }

    return esta;
  };

  //Metodo para devolve un índice de armas
  this.Selec_Weapon = function() {
    var idSprite_list = ["subFusil", "pistola", "francoTirador"];
    var i = Math.floor(Math.random() * idSprite_list.length);
    var enlace = require("./Armas");

    var weapon = { idSprite: idSprite_list[i], enlace: enlace };
    return weapon;
  };

  //método para devolver el tipo de Objeto a crear en base al parámetro tipo string
  this.SeleccionObjeto = function(string) {
    if (string === "recurso") {
      var recurso = { idSprite: "arbol", enlace: require("./recurso") };
      return recurso;
    } else if (string === "arma") {
      return this.Selec_Weapon();
    }
  };

  //genera aleatorio para recursos y añade al grupo
  this.añadeObjetos = function(string, nObj, group_obj_hijo) {
    //constante auxiliar
    var tile_patron_W = this.tile_Map.width;
    var tile_patron_H = this.tile_Map.height;

    //variables de control
    var n_Recursos = nObj;
    var n = 0;

    this.choque = 0;
    while (n < n_Recursos) {
      //se crea el patrón de objeto en el bucle, para generar armas distintas dado el caso
      var objeto = this.SeleccionObjeto(string);

      var x = Math.floor(Math.random() * tile_patron_W);
      var y = Math.floor(Math.random() * tile_patron_H);

      //Var aux para Comprobar si el tile está ocupado
      var tile_W = this.tile_Map.tileWidth;
      var tile_H = this.tile_Map.tileHeight; //recoge w/h del tile

      //se genera un nuevo sprite auxiliar
      var aux = this.game.add.sprite(x, y, "arbol");
      //se activan sus físicas
      this.game.physics.enable(aux, Phaser.Physics.ARCADE);
      aux.body.collideWorldBounds = true;
      aux.body.checkCollision = true;
      aux.body.x = aux.x;
      aux.body.y = aux.y;

      var col = false; //variable de control de colision
      col = this.TileOcupado(aux, this.tile_Map.layerGroup.children);
      //recogen worldPosition
      x = x * tile_W;
      y = y * tile_H;
      //aux debe incrementar para comprobar la colision con otros recurso/armas
      aux.body.x = x;
      aux.body.y = y;

      if (!col) {
        if (!this.AñadeObjetoAux(aux)) {
          var obj_aux = new objeto.enlace(this.game, x, y, objeto.idSprite);
          obj_aux.generate();
          group_obj_hijo.add(obj_aux);

          n++;
        }
      }
      aux.destroy(); //destruye la variable para que no se quede renderizada
    } //fin while
  };

  //------METODOS PARA LA CREACIÓN DE TILEMAP------
  //añade el mapa de tiles precargado en el main
  this.añadeTileMap = function(str) {
    this.tile_Map = this.game.add.tilemap(str);
  };
  //añade la img de patrones
  this.añadeTileImg = function(str_1, str_2) {
    this.tile_Map.addTilesetImage(str_1, str_2);
  };

  //Método que devuelve un array de index correspondiente a cada capa.
  this.RecogeIndex = function(nombreCapa) {
    //constante aux.
    var tile_patron_W = this.tile_Map.width;
    var tile_patron_H = this.tile_Map.height;
    var listaIndex = []; //lista auxiliar
    //función que devuelve un patrón de orden ascendente
    function comparar(a, b) {
      return a - b;
    }
    //se recorre las fils/Cols del mapa patrón de tiles
    for (var y = 0; y < tile_patron_H; y++) {
      for (var x = 0; x < tile_patron_W; x++) {
        //se recorre el array aux para determinar que no se haya incluido ya ese index
        var j = 0;
        var esta = false;
        while (!esta && j < listaIndex.length) {
          esta = nombreCapa.layer.data[y][x].index == listaIndex[j];
          j++;
        }
        //lo añade al array en caso de no ser -1 y no estar previamente.
        if (!esta) {
          if (nombreCapa.layer.data[y][x].index !== -1) {
            listaIndex.push(nombreCapa.layer.data[y][x].index);
          }
        } else {
          esta = false;
        } //vuelve a false para siguiente vuelta
      }
    }
    //se devuelve el array ordenado.
    return listaIndex.sort(comparar); //ordena el array de manera ascendente
  };

  //añade entidades al grupo
  this.añadeLayer = function() {
    //1º LAS VAR RECOGEN LAS CAPAS
    this.layer_background = this.tile_Map.createLayer("background");
    this.layer_obstaculo_0 = this.tile_Map.createLayer("obstaculo desierto");
    this.layer_obstaculo_1 = this.tile_Map.createLayer("obstaculo pradera");
    this.layer_obstaculo_2 = this.tile_Map.createLayer("obstaculo nieve");

    //2º SE AÑADEN AL GRUPO
    this.tile_Map.layerGroup.add(this.layer_background);
    this.tile_Map.layerGroup.add(this.layer_obstaculo_0);
    this.tile_Map.layerGroup.add(this.layer_obstaculo_1);
    this.tile_Map.layerGroup.add(this.layer_obstaculo_2);
    //se recorre el grupo saltando la capa Background
    for (var i = 1; i < this.tile_Map.layerGroup.length; i++) {
      //3º SE HABILITA LA FÍSICA PARA CADA CAPA
      /*this.game.physics.enable(
        this.tile_Map.layerGroup.children[i],
        Phaser.Physics.ARCADE
      );*/
      //4º SE DEFINE LAS COLISIONES PARA LOS TILES
      //hay que pasar el rango de index. puede: index === number || index === array
      //Doc.Oficial: Source code: tilemap/Tilemap.js (Line 816). En caso de array su función lo recorre
      this.tile_Map.setCollision(
        this.RecogeIndex(this.tile_Map.layerGroup.children[i]),
        true,
        this.tile_Map.layerGroup.children[i],
        true
      );
      //5º SE HABILITAN LOS ATRIBUTOS DEL PHYSIC.BODY
      //this.tile_Map.layerGroup.children[i].body.collideWorldBounds = true;
      //this.tile_Map.layerGroup.children[i].body.checkCollision = true;

      //this.tile_Map.layerGroup.children[i].body.immovable = true;
      //this.tile_Map.layerGroup.children[i].body.bounce.setTo(1, 1);
    }
  };

  //Comprueba si el tile está ocupado en base al valor del atributo index:
  this.TileOcupado = function(variable, grupoCapas) {
    var colision = false;
    var i = 1;
    //aqui recorre el array de hijos de layerGroup saltándose la capa BackGround
    while (!colision && i < grupoCapas.length) {
      colision = grupoCapas[i].layer.data[variable.y][variable.x].index !== -1;
      i++;
    }
    return colision;
  };
} //cierre constructora

//****** */PROTOTYPE METHODS *******
Mapa.prototype.generate = function(plGr) {
  this.añadeTileMap("mapa");
  this.añadeTileImg("tilesMap", "tiles");

  //ATRIBUTOS
  this.tile_Map.layerGroup = this.game.add.group(); //capas con los patrones del mapa
  this.tile_Map.layerGroup.name = "layersGroup"; //esto permite identificar el objeto en depuración
  this.GrupoObjetos = this.game.add.group(); //alberga grupos
  this.GrupoObjetos.name = "objectsGroup";
  //las armas y recursos se añaden a un grupo de físicas. habilita directamente su body
  this.GrupoRecursos = this.game.add.group();
  this.GrupoRecursos.name = "resourcesGroup";
  this.GrupoArmas = this.game.add.group();
  this.GrupoArmas.name = "weaponsGroup";
  //grupo de muros construidos
  this.wallGroup = this.game.add.group();
  this.wallGroup.name = "wallsGroup";
  //GrupoObjetos = [GrupoRecurso, GrupoArmas, GrupoMuros,...]
  this.GrupoObjetos.add(this.GrupoRecursos);
  this.GrupoObjetos.add(this.GrupoArmas);
  this.GrupoObjetos.add(this.wallGroup);

  //se crean las capas, se definen como colisiones y se añaden al grupo
  this.añadeLayer();

  //posJUGADORES
  this.plyGroup = plGr;
  //se añaden los Objetos al mapa. el 1º param. es un identificador del método SeleccionObjeto
  this.añadeObjetos("recurso", 40, this.GrupoRecursos);
  this.añadeObjetos("arma", 15, this.GrupoArmas);

  this.resizeLayer(1); //por defecto, para ajustar el hud y el mapa al mundo
};

//redimensiona los objetos según parámetro.
Mapa.prototype.resizeLayer = function(scale) {
  var aux = this.auxScale; //aux recoge el último escalar
  this.auxScale = scale; //el atributo de la clase recoge el nuevo escalar

  //T.Map.layer escala en base al parámetro y se redimensiona al mundo
  for (var i = 0; i < this.tile_Map.layerGroup.length; i++) {
    var tiles = this.tile_Map.layerGroup.children[i].setScale(scale, scale);
    this.tile_Map.layerGroup.children[i].resizeWorld();
  }

  //objetos: recuperan dim. según anterior escalar y redimensionan según el nuevo escalar
  //recursos
  this.GrupoObjetos.children[0].children.forEach(element => {
    element.resizeObject(scale);
  });
  //armas
  this.GrupoObjetos.children[1].children.forEach(element => {
    element.resizeObject(scale);
  });
  this.wallGroup.children.forEach(element => {
    element.resizeObject(scale);
  });
};

//recibe mensaje class: Player
Mapa.prototype.playerCheckLayerCollision = function(player) {
  var bool = false;

  //recogen la posición real de body
  var X = player.body.x;
  var Y = player.body.y;
  //si el escalar actual es 2 (32x32) simula una posición según escalar 1 (16x16)
  if (this.auxScale === 2) {
    //de esa manera el body rect the player no sobrepasa los collide del tileMapLayer
    player.body.x = player.POSPREVIA.x;
    player.body.y = player.POSPREVIA.y;
  }
  bool = this.game.physics.arcade.collide(
    player,
    this.tile_Map.layerGroup.children
  );
  //body debe volver a su valor real.
  player.body.x = X;
  player.body.y = Y;
  return bool;
};
//comunica con class: player y devuelve el mensaje de sí el objeto (bala/player) choca con un hijo de Grupo de objetos
Mapa.prototype.PlayerObjectCheckCollision = function(player) {
  var bool = false;
  var i = 0;
  //1º comprueba la colisión con armas y recursos
  while (!bool && i < this.GrupoObjetos.length) {
    bool = this.game.physics.arcade.collide(
      player,
      this.GrupoObjetos.children[i].children,
      this.CallBackCollision
    );
    i++;
  }
  return bool;
};
//método callback invocado desde la función arcade.collide
//solo actuará si el primer parámetro es bala
Mapa.prototype.CallBackCollision = function(obj, colObj) {
  if (obj.name === "bullet") {
    if (colObj.name === "resource" || colObj.name === "wall") {
      colObj.destroy(); //destruye el recurso
    }
  }
};
//comunica con class: player. Jugador manda la orden de construir. y espera true o false
Mapa.prototype.añadeWall = function(player) {
  var bool = false;

  var muro = require("./Muro");
  var wall = new muro(this.game, player.x, player.y, "muro");
  wall.generate(player);

  //se comprueba la colisión con las colisiones constantes del mapa
  var XY = { x: wall.x / wall.width, y: wall.y / wall.height }; //debe recuperar la dimensión para que se ajuste a la matriz del .json
  bool = this.TileOcupado(XY, this.tile_Map.layerGroup.children);

  //en caso de no haber colision comprueba que no exista con armas, recursos o muros
  if (!bool && !this.AñadeObjetoAux(wall)) {
    this.wallGroup.add(wall);
    player.walkCont--; //construir muros decrementa los pasos en 1
    return true;
  } else {
    wall.destroy();
    return false;
  }
};

//recibe mensaje de class: Player. busca el arma en la orientación y colision con player
Mapa.prototype.armedPlayer = function(player, weapon) {
  //si el jugador no está armado hasta los dientes
  if (!player.currentWeapon) {
    player.currentWeapon = weapon; //el atributo recoge los valores del arma para gestionarlos desde class: Player
    weapon.destroy();
  }
};

//recibe mensaje de class: Player. busca y destruye el recurso en orientación y colision
//y sube el contador de recursos de player
Mapa.prototype.playerPickUpObject = function(player) {
  //orientacion: 0 = arr, 1 = der, 2 = abaj, 3 = izq
  var resource = [];
  var i = 0;
  var bool = false;
  while (!bool && i < this.GrupoObjetos.length) {
    if (player.orientation === 0) {
      var Y = player.body.y - player.body.height;
      resource = this.game.physics.arcade.getObjectsAtLocation(
        player.body.x,
        Y,
        this.GrupoObjetos.children[i]
      );
    } else if (player.orientation === 1) {
      var X = player.body.x + player.body.height;
      resource = this.game.physics.arcade.getObjectsAtLocation(
        X,
        player.body.y,
        this.GrupoObjetos.children[i]
      );
    } else if (player.orientation === 2) {
      var Y = player.body.y + player.body.height;
      resource = this.game.physics.arcade.getObjectsAtLocation(
        player.body.x,
        Y,
        this.GrupoObjetos.children[i]
      );
    } else if (player.orientation === 3) {
      var X = player.body.x - player.body.height;
      resource = this.game.physics.arcade.getObjectsAtLocation(
        X,
        player.body.y,
        this.GrupoObjetos.children[i]
      );
    }
    bool = resource.length >= 1;
    i++;
  } //cierre while

  if (resource.length >= 1) {
    if (resource[0].name === "resource") {
      player.resources += resource[0].cantidad;
      this.SonidoRecurso.play();
      resource[0].destroy();
      player.walkCont -= player.walk_ResourceScale;
    } else if (resource[0].name === "wall") {
      this.SonidoRecurso.play();
      resource[0].destroy();
      player.walkCont -= player.walk_WallScale;
    } else if (resource[0].name === "weapon") {
      this.armedPlayer(player, resource[0]);
    }
  }
};
//suelta objeto (arma)
Mapa.prototype.playerDropObject = function(player) {
  //se recoge la pos previa
  var prevPlayer = { x: player.x, y: player.y };
  var XY;

  var weapon = player.currentWeapon;
  //se deshabilita el arma de player para que el body no desplace más tiles con ejerciendo fuerza
  player.currentWeapon = null;

  //se calcula la nueva pos en base a la orientación
  var dir = this.direction(player);
  var auxX = player.x + dir.x;
  var auxY = player.y + dir.y;
  var aux = require("./Armas");
  var weaPON = new aux(this.game, auxX, auxY, weapon.tipoArma);
  //si se crea con la escala aumentada debe redimensionarse
  if (weaPON.auxScale !== player.auxScale) {
    weaPON.resizeObject(player.auxScale);
    //como el método ya duplica una posición presupuesta de 16*16 hay que dividir
    weaPON.x /= player.auxScale;
    weaPON.y /= player.auxScale;  
  }

  weaPON.generate();
  XY = { x: weaPON.x / player.width, y: weaPON.y / player.height }; //debe recuperar la dimensión para que se ajuste a la matriz del .json
 

  var bool = false;
  bool = this.TileOcupado(XY, this.tile_Map.layerGroup.children);

  //en caso de no haber colision comprueba que no exista con armas, recursos o muros
  if (!bool && !this.AñadeObjetoAux(weaPON)) {
    weaPON.balas_Cont = weapon.balas_Cont;
    weapon.destroy();
    this.GrupoArmas.add(weaPON);
    this.game.world.bringToTop(this.GrupoArmas);
  } else {
    player.currentWeapon = weapon;
    weaPON.destroy();
  }
};

Mapa.prototype.direction = function(player) {
  var orientation = player.orientation;
  var width = player.width;
  var height = player.height;
  var dir = { x: 0, y: 0 }; //coordenadas de retorno
  //0:arriba; 1:derecha; 2:abajo; 3:izquierda
  if (orientation === 0) {
    dir.x = 0;
    dir.y = -1 * height;
  } else if (orientation === 1) {
    dir.x = 1 * width;
    dir.y = 0;
  } else if (orientation === 2) {
    dir.x = 0;
    dir.y = 1 * height;
  } else if (orientation === 3) {
    dir.x = -1 * width;
    dir.y = 0;
  }
  return dir;
};

module.exports = Mapa;


/** //reacondiciona las físicas
    /*weapon.body.collideWorldBounds = false;
    weapon.body.immovable = false;
    weapon.body.checkCollision = false;
    //overlapa los sprites
    weapon.position = player.position;
    player.currentWeapon = weapon; //el atributo recoge los valores del arma para gestionarlos desde class: Player
    //weapon.alpha = 0; //lo vuelve invisible*/ 
},{"./Armas":1,"./Muro":6,"./recurso":13}],6:[function(require,module,exports){
"use strict";

var objeto = require("./Objeto");

function Muro(game, x, y, sprite) {
  objeto.call(this, game, x, y, sprite); //hereda de objeto

  //ATTRIBUTES
  this.orientation; //recibe el valor de jugador
  this.name = "wall";
}
Muro.prototype = Object.create(objeto.prototype);
Muro.prototype.constructor = Muro;

/******** PROTOTYPE METHODS *********/
// determina la dirección
//comunica con class: Player. devuelve el valor de la nueva pos
Muro.prototype.direction = function(player) {
  this.orientation = player.orientation;
  var dir = { x: 0, y: 0 }; //coordenadas de retorno
  //0:arriba; 1:derecha; 2:abajo; 3:izquierda
  if (this.orientation === 0) {
    dir.x = 0;
    dir.y = -1 * this.height;
  } else if (this.orientation === 1) {
    dir.x = 1 * this.width;
    dir.y = 0;
  } else if (this.orientation === 2) {
    dir.x = 0;
    dir.y = 1 * this.height;
  } else if (this.orientation === 3) {
    dir.x = -1 * this.width;
    dir.y = 0;
  }
  return dir;
};

//genera la lógica del objeto,
Muro.prototype.generate = function(player) {
  //physics
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.collideWorldBounds = true;
  this.body.immovable = true;
  this.body.checkCollision = true;
  //si se crea con la escala aumentada debe redimensionarse
  if (this.auxScale !== player.auxScale) {
    this.resizeObject(player.auxScale);
    //como el método ya diplica una posición presupuesta de 16*16 hay que dividir
    this.x /= player.auxScale;
    this.y /= player.auxScale;
  }
  //se recoge la nueva pos que será un tile por delante del jugador
  var dir = this.direction(player);
  this.x += dir.x;
  this.y += dir.y;
  this.body.x = this.x;
  this.body.y = this.y;
};

module.exports = Muro;

},{"./Objeto":7}],7:[function(require,module,exports){
'use strict';


//PHATHER CLASS: OBJECT
function Objeto(game, x, y, sprite) {
	Phaser.Sprite.call(this, game, x, y, sprite);//hereda de sprite
	
	this.game.world.addChild(this);

	//ATTRIBUTE
	this.cantidad;
	this.auxScale = 1; //1 por defecto
	this.name = sprite; //el nombre dependerá del tipo de objeto. más para depurar 

	//METHODS
	this.RandomItem = function (n) {
		var r = Math.floor((Math.random() * n )+ 1); //random [1 - n]
		return r;
	}

	//funcion que define la nueva posicion cuando se ejecuta zoom y se reescala el sprite
	//interesa que nazca la superClass, para activarlo con cada shot Bullet. 
	this.resizeObject = function (scale) {
		var aux = this.auxScale; //aux recoge el último escalar
		this.auxScale = scale; //el atributo de la clase recoge el nuevo escalar
		this.scale.setTo(scale);
		this.x = this.x / aux;
		this.x = this.x * scale;
		this.y = this.y / aux;
		this.y = this.y * scale;
	}
}
//enlaza ambas propiedades prototype
Objeto.prototype = Object.create(Phaser.Sprite.prototype);
//corrige la propiedad constructor
Objeto.prototype.constructor = Objeto;



module.exports = Objeto;
},{}],8:[function(require,module,exports){
"use strict";

//jugador tiene un contador de pasos que determina el final del turno.
//los pasos decrementan cuando recoge recursos "árboles" y cuando destruye muros.
//los pasos decrementan en base a un escalar dependiendo del tipo de arma que lleva

function Player(game, x, y, sprite) {
  Phaser.Sprite.call(this, game, x, y, sprite); //hereda de sprite

  //ATTRIBUTE
  this.game.world.addChild(this);

  this.name;
  this.life = 100; //contador de vida 

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
    bool = mapa.playerCheckLayerCollision(this);
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

        this.walkCont -= this.currentWeapon.walkContador;
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
        else {this.CheckPlayerBulletVsPlayer(playScene);}
      }
    });
  }
};

Player.prototype.CheckPlayerBulletVsPlayer = function (playScene){

  var bool = false;
  var i = 0;
  while (!bool && i < this.bulletGroup.length){
  var j = 0;
    while (!bool && j < playScene.playerGroup.length){
      bool = this.game.physics.arcade.collide(this.bulletGroup.children[i], playScene.playerGroup.children[j]);
      j++;
    }
    i++;
  }
  if (bool){
    playScene.playerGroup.children[j - 1].life -= this.bulletGroup.children[i - 1].bulletDamage;
    this.bulletGroup.children[i - 1].destroy();
    console.log (playScene.playerGroup.children[j - 1].life);
  }
};


module.exports = Player;



},{"./Bala":2}],9:[function(require,module,exports){
'use strict'

var SelectPlayers =  {
    
    create:function (game) {
 
        this.game = game;
        this.playersSelection = game.add.sprite(0, 0, 'FondoSelectPlayers');
        
        //2players
        this.B1 = this.game.add.button(50, 400, 'Button1', this.functButton1, this);
        this.B1.onInputOver.add(this.B1funcionUP, this);
        this.B1.onInputOut.add(this.B1funcionOut, this);
        //3 players
        this.B2 = this.game.add.button(300, 400, 'Button2', this.functButton2, this);
        this.B2.onInputOver.add(this.B2funcionUP, this);
        this.B2.onInputOut.add(this.B2funcionOut, this);
        //4 players
        this.B3 = this.game.add.button(550, 400, 'Button3', this.functButton3, this);
        this.B3.onInputOver.add(this.B3funcionUP, this);
        this.B3.onInputOut.add(this.B3funcionOut, this);

        
    },

    update:function (game) {
        

    },
    functButton1: function(game){
        this.game.numPlayers = 2;
        this.state.start('play');
    },
    B1funcionUP: function(){
        this.B1.loadTexture('Button1A');
    },
    B1funcionOut: function(){
        this.B1.loadTexture('Button1');
    },

    functButton2: function(game){
        this.game.numPlayers = 3;
        this.state.start('play');
    },
    B2funcionUP: function(){
        this.B2.loadTexture('Button2A');
    },
    B2funcionOut: function(){
        this.B2.loadTexture('Button2');
    },
    functButton3: function(game){
        this.game.numPlayers = 4;
        this.state.start('play');
    },
    B3funcionUP: function(){
        this.B3.loadTexture('Button3A');
    },
    B3funcionOut: function(){
        this.B3.loadTexture('Button3');
    }
};
module.exports = SelectPlayers;
},{}],10:[function(require,module,exports){
"use strict";

var startScreen = {
  create: function (game) {

    this.game = game;
    this.MainMenu = this.game.add.sprite(0, 0, "Menu");
    this.Music = this.game.add.audio("AudioMenu", 0.4, true);
    this.Music.play();

    //startButton
    this.B1 = this.game.add.button(0, 100, 'startButton', this.actionOnClick, this);
    this.B1.onInputOver.add(this.funcionUP, this);
    this.B1.onInputOut.add(this.funcionOut, this);

    //creditButton
    this.B2 = this.game.add.button(100, 650, 'creditButton', this.actionOnClick2, this);
    this.B2.width = 250;
    this.B2.height = 70;
    this.B2.onInputOver.add(this.b2funcionUP, this);
    this.B2.onInputOut.add(this.b2funcionOut, this);

    
  },

  update: function () {
    
  },

  actionOnClick: function (){

    this.Music.stop();
    this.state.start("SPScene");
  },

  funcionUP: function (){
    this.B1.loadTexture('startButton_animation');
  },

  funcionOut: function(){
    this.B1.loadTexture('startButton');
  },

  actionOnClick2: function (){

    this.Music.stop();
    this.state.start("CreditScene");
  },

  b2funcionUP: function (){
    this.B2.loadTexture('creditButton_animation');
  },

  b2funcionOut: function(){
    this.B2.loadTexture('creditButton');
  }


};
module.exports = startScreen;


},{}],11:[function(require,module,exports){
"use strict";

//node_modules/.bin/gulp run

var PlayScene = require("./play_scene.js");
var Menu = require("./StartScreen.js");
var Creditos = require("./Creditos.js");
var SelectPlayers = require("./SelectPlayers.js");
var IntroScene = require("./IntroScene.js");
var Victoria = require("./victoria.js");

var BootScene = {
  preload: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.setMinMax(800, 592, 1600, 1184);
  },

  create: function() {
    this.game.state.start("preloader");
  }
};

var PreloaderScene = {
  preload: function() {
    //motor de físicas
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // ** ASSETS DEL JUEGO **
    //json y png del mapa
    this.game.load.tilemap(
      "mapa",
      "assets/mapas/mapa-0.json",
      null,
      Phaser.Tilemap.TILED_JSON
    );
    this.game.load.image("tiles", "assets/mapas/mapaTiles.png");

    //hud
    this.game.load.image("hud2", "assets/canvas/hud.png");

    //fuentes
    this.game.load.bitmapFont('fuente1', 'assets/fonts/font.png', 'assets/fonts/font.xml');
    this.game.load.bitmapFont('fuente2', 'assets/fonts/font2.png', 'assets/fonts/font2.xml');
   
    //OBJETOS
    //recursos
    this.game.load.image("arbol", "assets/sprites/arbol.png");
    this.game.load.image("muro", "assets/sprites/muro.png");
    //armas
    this.game.load.image("subFusil", "assets/sprites/gun.png");
    this.game.load.image("pistola", "assets/sprites/pistola.png");
    this.game.load.image("francoTirador", "assets/sprites/francoTirador.png");
    //balas
    this.game.load.image("bala", "assets/sprites/bala.png");

    //JUGADOR
    this.game.load.image("player_1", "assets/sprites/character.png"); //posPlayer.png
    this.game.load.image("posIni", "assets/sprites/posPlayer.png");

    //videos
    this.game.load.video("introScene", "assets/videos/Battlefort_intro.webm");

    //textura de menus
    this.game.load.image("Menu", "assets/sprites/menus/textura_mainMenu.png");
    this.game.load.image("Pausa", "assets/sprites/menus/pausa.png");
    this.game.load.image("FondoCreditos", "assets/sprites/menus/creditos.png");
    this.game.load.image(
      "FondoSelectPlayers",
      "assets/sprites/menus/fondoSelectPlayers.png"
    );
    this.game.load.image("FondoVictoria", "assets/sprites/menus/victoria.png");
    //BOTONES
    //startButton
    this.game.load.image(
      "startButton",
      "assets/sprites/button/startButton.png", 800,50
    ); //startButton
    this.game.load.image(
      "startButton_animation",
      "assets/sprites/button/startButton_check.png"
    ); 
    //creditButton
    this.game.load.image(
      "creditButton",
      "assets/sprites/button/creditButton.png", 800,50
    ); //startButton
    this.game.load.image(
      "creditButton_animation",
      "assets/sprites/button/creditButton_animation.png"
    ); 

    //selectPlayerButton
    //2 players
    this.game.load.image("Button1", "assets/sprites/button/button_2Players.png");
    this.game.load.image("Button1A", "assets/sprites/button/button_2Players_animation.png");
    //3 players
    this.game.load.image("Button2", "assets/sprites/button/button_3Players.png");
    this.game.load.image("Button2A", "assets/sprites/button/button_3Players_animation.png");
    //4 players
    this.game.load.image("Button3", "assets/sprites/button/button_4Players.png");
    this.game.load.image("Button3A", "assets/sprites/button/button_4Players_animation.png");

    //Musica y sonidos
    this.game.load.audio("AudioMenu", [
      "assets/musica/Menu_mp3.mp3",
      "assets/musica/Menu_ogg.ogg"
    ]);
    this.game.load.audio("AudioJuego", [
      "assets/musica/Juego_mp3.mp3",
      "assets/musica/Juego_ogg.ogg"
    ]);
    this.game.load.audio("Disparo", [
      "assets/musica/Disparo_mp3.mp3",
      "assets/musica/Disparo_ogg.ogg"
    ]);
    this.game.load.audio("Recursos", [
      "assets/musica/recursos_mp3.mp3",
      "assets/musica/recursos_ogg.ogg"
    ]);
    this.game.load.audio("Pasos", [
      "assets/musica/Pasos_mp3.mp3",
      "assets/musica/Pasos_ogg.ogg"
    ]);
    this.game.load.audio("Muro", [
      "assets/musica/Muro_mp3.mp3",
      "assets/musica/Muro_ogg.ogg"
    ]);
  },

  create: function() {
    this.game.state.start("Menu"); //introScene
  }
};

window.onload = function() {
  var game = new Phaser.Game(50 * 16, 50 * 16, Phaser.AUTO, "game");
  game.state.add("boot", BootScene);
  game.state.add("preloader", PreloaderScene);
  game.state.add("introScene", IntroScene);
  game.state.add("Menu", Menu);
  game.state.add("SPScene", SelectPlayers);
  game.state.add("play", PlayScene);
  game.state.add("CreditScene", Creditos);
  game.state.add("VictoryScene", Victoria);

  game.state.start("boot");
};

},{"./Creditos.js":3,"./IntroScene.js":4,"./SelectPlayers.js":9,"./StartScreen.js":10,"./play_scene.js":12,"./victoria.js":14}],12:[function(require,module,exports){
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
      { x: 128, y: 96 },
      { x: 640, y: 512 },
      { x: 688, y: 64 },
      { x: 32, y: 560 }
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
      this.playerGroup.add(new player(this.game, rPos.x, rPos.y, "player_1"));
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
    this.menuPause = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY+100,
      "Pausa"
    );
    //valores de renderizado del menuPause
    this.menuPause.alpha = 0.7;
    this.menuPause.anchor.setTo(0.5, 0.5);
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
    this.text1 = this.game.add.bitmapText(this.game.camera.x + 180, this.game.camera.y + 270, 'fuente2', "READY PLAYER?", 32);
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
    this.text1 = this.game.add.bitmapText(0, 300, 'fuente1', 'GET READY NEXT LOOSER', 48);
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

      aux1 = this.playerGroup.children[this.turno].currentWeapon.tipoArma;
      aux2 = this.playerGroup.children[this.turno].currentWeapon.weaponDamage;
      aux3 = this.playerGroup.children[this.turno].currentWeapon.alcance;

      style2 = { font: "24px Calibri", fill: "#fff", tabs: [164, 120] };
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
},{"./Mapa":5,"./Player":8}],13:[function(require,module,exports){
'use strict';


var objeto = require('./Objeto');

function Recurso (game, x, y, sprite){
    
	objeto.call(this, game, x, y, sprite); //hereda de objeto 
	this.name = "resource";

}
Recurso.prototype = Object.create (objeto.prototype);
Recurso.prototype.constructor = Recurso;

Recurso.prototype.generate = function (){

	//las propiedades y la función las hereda de la clase Objeto
	this.cantidad = this.RandomItem(10); 
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
	this.body.immovable = true;	
	this.body.x = this.x; this.body.y = this.y;
	
}


module.exports = Recurso;

},{"./Objeto":7}],14:[function(require,module,exports){
'use strict'

var Victoria =  {
    create:function (game) {

        this.game = game;

        this.victory;
        this.cursor = this.game.input.keyboard;
        this.key1 = Phaser.KeyCode.ENTER;

      
        this.victory = game.add.sprite(0, 0, 'FondoVictoria');
        
    },

    update:function (game) {
        if (this.cursor.isDown(this.key1)) {
            this.state.start('Menu');
          }

    },

};
module.exports = Victoria;
},{}]},{},[11]);
