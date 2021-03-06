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
  this.plyGroup;

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
    if (!esta) {
      if (aux.name !== "bullet" && aux.name !== 'wall'){
        esta = this.game.physics.arcade.collide(aux, this.plyGroup.children);
      }
     
    }

    return esta;
  };

  //Metodo para devolve un índice de armas
  this.Selec_Weapon = function() {
    var idSprite_list = ["SUBFUSIL", "GUN", "SNIPER"];
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

  //Grupo de jugadores 
  this.plyGroup = plGr;
  //se añaden los Objetos al mapa. el 1º param. es un identificador del método SeleccionObjeto
  this.añadeObjetos("recurso", 40, this.GrupoRecursos);
  this.añadeObjetos("arma", 25, this.GrupoArmas);

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
  console.log ("HIT");
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

  if (( (XY.x >= 0 && XY.x < this.tile_Map.width) && (XY.y >=  0 && XY.y < this.tile_Map.height))) {
    bool = this.TileOcupado(XY, this.tile_Map.layerGroup.children);
  }
  else {
    bool = true;}

   if (!bool){bool = this.game.physics.arcade.collide(wall, this.plyGroup.children);}

  console.log ("WALL COLLISION PLAYER" + bool);

  //en caso de no haber colision comprueba que no exista con armas, recursos o muros
  if (!bool && !this.AñadeObjetoAux(wall)) {
    this.wallGroup.add(wall);
    player.walkCont--; //construir muros decrementa los pasos en 1
    return true;
  } 
  else {
    wall.destroy();
    return false;
  }
};

//recibe mensaje de class: Player. busca el arma en la orientación y colision con player
Mapa.prototype.armedPlayer = function(player, weapon) {
  //si el jugador no está armado hasta los dientes
  if (!player.currentWeapon) {
    player.currentWeapon = weapon; //el atributo recoge los valores del arma para gestionarlos desde class: Player
    if (player.orientation === 3){player.loadTexture(player.nameGunLeft);}
    else {player.loadTexture(player.nameGun);}
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

  bool = false;

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


  if (( (XY.x >= 0 && XY.x < this.tile_Map.width) && (XY.y >=  0 && XY.y < this.tile_Map.height))) {
    bool = this.TileOcupado(XY, this.tile_Map.layerGroup.children);
  }
  else {bool = true;}

  if (!bool){ bool = this.game.physics.arcade.collide(weaPON, this.plyGroup.children);}

  //en caso de no haber colision comprueba que no exista con armas, recursos o muros
  if (!bool && !this.AñadeObjetoAux(weaPON)) {
    weaPON.balas_Cont = weapon.balas_Cont;
    weapon.destroy();
    this.GrupoArmas.add(weaPON);
    this.game.world.bringToTop(this.GrupoArmas);
    if (player.orientation === 3){
      player.loadTexture(player.nameLeft);
    }else {
      player.loadTexture(player.nameTex);
    }
  } 
  
  else {
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

