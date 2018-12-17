(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

//coossdd

var objeto = require('./Objeto');

//armas
function Armas (game, x, y, sprite){

	objeto.call(this, game, x, y, sprite); //hereda de objeto 
	
	//atributos 
	this.balas;
	this.tipoArma = sprite; //sprite es un tipo string. sirve pra inicializar el arma según su tipo
	this.alcance;  this.damage;

	//funciones 
	this.asignaValores = function (booleano, funcionRandom) {
		this.bloquea = booleano; //debe bloquear el paso
		this.balas = funcionRandom; //la cantidad de balas sí es aleatoria
		this.cantidad = 1; //en este caso cantidad no depende del random
		this.Tipo_De_Arma();
	}

	//función para determinar el tipo de arma e inicializar sus atributos
	this.Tipo_De_Arma = function (){
		if (this.tipoArma === "pistola"){ this.alcance = 5;  this.damage = 10;}
		else if (this.tipoArma === "Subfusil"){ this.alcance = 12;  this.damage = 25;}
		else if (this.tipoArma = "francoTirador"){this.alcance = 20;  this.damage = 50;}
	}

}
Armas.prototype = Object.create (objeto.prototype);
Armas.prototype.constructor = Armas;

Armas.prototype.generate = function (){
	//la función random la herda de la clase Objeto.
	this.asignaValores(true,  this.RandomItem(10));
}

module.exports = Armas;
},{"./Objeto":3}],2:[function(require,module,exports){
'use strict';

//node_modules/.bin/gulp run


function Mapa (game){


    //ATRIBUTOS
    this.game = game;

    this.tile_Map; //recoge el mapa de tiles
    //capas
    this.layer_background; this.layer_obstaculo_0; this.layer_obstaculo_1; this.layer_obstaculo_2;
    
    //FUNCIONES 

    //------METODOS PARA LA CREACIÓN DE OBJETO------
    //Método que comprueba que no se va a posicionar el objeto encima de otro. se invoca dentro de AñadeObjeto
     this.AñadeObjetoAux = function (x, y){
        var esta = false; var i = 0;
        var position = {'x': x, 'y': y };
        //se recorre el grupo 
        while (!esta && i < this.GrupoObjetos.children.length){
            var j = 0;
            while (!esta && j < this.GrupoObjetos.children[i].length){
               esta = position ===  this.GrupoObjetos.children[i].children[j].position;
               j++;
            }
            i++;
        }
        return esta;
    }

    //Metodo para devolve un índice de armas
    this.Selec_Weapon = function (){
       var idSprite_list = ['subFusil', 'pistola', 'francoTirador']; 
       var i =  Math.floor(Math.random() * idSprite_list.length);
       var enlace = require('./Armas');
       
       var weapon = { 'idSprite': idSprite_list[i], 'enlace': enlace};
       return weapon;
    }

    //método para devolver el tipo de Objeto a crear en base al parámetro tipo string
    this.SeleccionObjeto = function (string){
       if (string === "recurso"){
           var recurso = {'idSprite': 'arbol', 'enlace': require('./recurso')}; return recurso;
       }
       else if (string === "arma"){ return this.Selec_Weapon();}
    }
    //genera aleatorio para recursos y añade al grupo
    this.añadeObjetos = function (string, nObj, group_obj_hijo){

        //constante auxiliar
        var tile_patron_W = this.tile_Map.width; var tile_patron_H = this.tile_Map.height;

        //variables de control 
        var n_Recursos = nObj; var n = 0;

        while (n < n_Recursos){
            //se crea el patrón de objeto en el bucle, para generar armas distintas dado el caso
            var objeto = this.SeleccionObjeto(string);
            
           var x = Math.floor(Math.random() * tile_patron_W );
           var y = Math.floor(Math.random() * tile_patron_H);

           //variable auxiliar. 
           var tile_W = this.tile_Map.tileWidth; var tile_H = this.tile_Map.tileHeight //recoge w/h del tile
           x = x * tile_W; y = y * tile_H; //recogen worldPosition
           var aux = this.game.add.sprite(x, y, 'Casco1');
           //habilita físicas y body
           this.game.physics.arcade.enable(aux);
           aux.enableBody = true;
           
           var col = false;//variable de control de colision
           col = this.TileOcupado(aux, this.tile_Map.layerGroup.children);

           console.log ("BOOL COL: " + col); //MENSAJE EN CONSOLA

           if (!col){ 
               if (!this.AñadeObjetoAux(x, y)){
                   var obj_aux = new objeto.enlace(this.game, x, y, objeto.idSprite);
                   obj_aux.generate();
                   group_obj_hijo.add(obj_aux);
                   
                   n++;
               }
            }      
           aux.destroy(); //destruye la variable para que no se quede renderizada
                
        }//fin while   
           
    }

    //------METODOS PARA LA CREACIÓN DE TILEMAP------
    //añade el mapa de tiles precargado en el main
    this.añadeTileMap = function (str){
        this.tile_Map = this.game.add.tilemap(str);
    }
    //añade la img de patrones
    this.añadeTileImg = function (str_1, str_2){
        this.tile_Map.addTilesetImage(str_1, str_2); 
    }

    //Método que devuelve un array de index correspondiente a cada capa. 
    this.RecogeIndex = function(nombreCapa) {
        //constante aux.
        var tile_patron_W = this.tile_Map.width; var tile_patron_H = this.tile_Map.height;
        var listaIndex = []; //lista auxiliar 
        //función que devuelve un patrón de orden ascendente
        function comparar (a, b){
            return a - b;
        }
        //se recorre las fils/Cols del mapa patrón de tiles
        for  (var y = 0; y <  tile_patron_H; y++){
            for (var x = 0; x <tile_patron_W; x++){    
                //se recorre el array aux para determinar que no se haya incluido ya ese index    
                var j = 0; var esta = false;
                while ( !esta && j < listaIndex.length){
                    esta = nombreCapa.layer.data[y][x].index == listaIndex[j];
                    j++;
                }
                //lo añade al array en caso de no ser -1 y no estar previamente. 
                if (!esta) {
                    if (nombreCapa.layer.data[y][x].index !== -1){
                        listaIndex.push(nombreCapa.layer.data[y][x].index);
                    }
                }
                else {esta = false;} //vuelve a false para siguiente vuelta
            }
        }
        //se devuelve el array ordenado.
        return listaIndex.sort(comparar);//ordena el array de manera ascendente
     }

    //añade entidades al grupo
    this.añadeLayer = function (){
        
        //1º las variables recojen las capas
        this.layer_background = this.tile_Map.createLayer('background');
        this.layer_obstaculo_0 = this.tile_Map.createLayer('obstaculo desierto'); 
        this.layer_obstaculo_1 = this.tile_Map.createLayer('obstaculo pradera'); 
        this.layer_obstaculo_2 = this.tile_Map.createLayer('obstaculo nieve');

        //2º se añaden al grupo
        this.tile_Map.layerGroup.add(this.layer_background);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_0);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_1);
        this.tile_Map.layerGroup.add(this.layer_obstaculo_2);
        //se recorre el grupo saltando la capa Background
        for (var i = 1; i < this.tile_Map.layerGroup.length; i++){
            //3º se habilitan las físicas para cada capa
            this.game.physics.arcade.enable(this.tile_Map.layerGroup.children[i]);
            //4º se definen los tiles como colisiones
            //hay que pasar el rango de index. puede: index === number || index === array
            //Doc.Oficial: Source code: tilemap/Tilemap.js (Line 816). En caso de array su función lo recorre
            this.tile_Map.setCollision((this.RecogeIndex(this.tile_Map.layerGroup.children[i])), true, this.tile_Map.layerGroup.children[i], true);
            //this.tile_Map.setCollisionByExclusion((this.RecogeIndex(this.tile_Map.layerGroup.children[i])), true, this.tile_Map.layerGroup.children[i], true);
        }  
    }
    //Comprueba si el tile está ocupado en base al valor del atributo index:
    this.TileOcupado = function(variable, grupoCapas) {
       var colision = false; var i = 1;
       //auxiliares recogen pos: se divide por el w,h del tile
       var x = variable.x / this.tile_Map.tileWidth; var y = variable.y /this.tile_Map.tileHeight;
       //aqui recorre el array de hijos de layerGroup saltándose la capa BackGround
       while (!colision && i < grupoCapas.length){
           colision = grupoCapas[i].layer.data[y][x].index !== -1;
           i++;
       }     
       return colision;
    }

}//fin 


Mapa.prototype.generate = function() {
    
   this.añadeTileMap('mapa');
   this.añadeTileImg('tilesMap', 'tiles');

   //ATRIBUTOS
   //grupos
   this.tile_Map.layerGroup = this.game.add.group(); //capas con los patrones del mapa
   this.GrupoObjetos = this.game.add.group(); //alberga grupos
   //las armas y recursos se añaden a un grupo de físicas. habilita directamente su body
   this.GrupoRecursos = this.game.add.physicsGroup(); 
   this.GrupoArmas = this.game.add.physicsGroup(); 
   //GrupoObjetos = [GrupoRecurso, GrupoArmas,...]
   this.GrupoObjetos.add(this.GrupoRecursos);
   this.GrupoObjetos.add(this.GrupoArmas);


   //se crean las capas, se definen como colisiones y se añaden al grupo
   this.añadeLayer();

   //se añaden los Objetos al mapa. el 1º param. es un identificador del método SeleccionObjeto
   this.añadeObjetos("recurso", 50, this.GrupoRecursos);
   this.añadeObjetos("arma", 12, this.GrupoArmas);
}

module.exports = Mapa;

},{"./Armas":1,"./recurso":7}],3:[function(require,module,exports){
'use strict';




//CLASE PADRE: Objeto
function Objeto (game, x, y, sprite){ 
	Phaser.Sprite.call(this, game, x, y, sprite);//hereda de sprite
	this.game.world.addChild(this);

	//atributos 
	this.bloquea; 
	this.cantidad; 

	//funciones
	this.RandomItem = function (n){
		var r = Math.floor(Math.random() * n );
		return r;
	}
}
//enlaza ambas propiedades prototype
Objeto.prototype = Object.create(Phaser.Sprite.prototype);
//corrige la propiedad constructor
Objeto.prototype.constructor = Objeto;



module.exports = Objeto;
},{}],4:[function(require,module,exports){
'use strict';



function Player (game,x,y,sprite){
    game.physics.startSystem(Phaser.Physics.ARCADE);  
    Phaser.Sprite.call(this,game,x,y,sprite);
    this.game.world.addChild(this);
    this.cursor= this.game.input.keyboard;
    this.orientation = 0;
    this.vel = 2;
    //this.nextFire = 0;
    this.bulletTime = 0; //controla que no se dispare constantemente
    this.wallTime = 0;
    //Inicializacion fisicas jugador
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.game.camera.follow(this);
    //Inicializacion pool de balas
    this.balas = game.add.group();
    this.balas.enableBody = true;
    this.balas.physicsBodyType = Phaser.Physics.ARCADE;
    this.balas.createMultiple(50, 'bala');
    this.balas.setAll('anchor.x', 0.5);
    this.balas.setAll('anchor.y', 1);
    this.balas.setAll('checkWorldBounds', true);
    this.balas.setAll('outOfBoundsKill', true);
    this.muros = game.add.group();
    this.muros.enableBody = true;
    //this.muros.body.inamovible = true;
    this.muros.physicsBodyType = Phaser.Physics.ARCADE;
    this.muros.createMultiple(100, 'muro');
    
 
  }

Player.prototype=Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor=Player;

Player.prototype.muevePlayer = function(x,y){
this.x += x;
this.y += y;
}
Player.prototype.compruebaInput = function(){
    var x= 0;
    var y = 0;
    //izquierda
    if (this.cursor.isDown(65))
    {
        x--;
        this.orientation = 3;
    }
    //derecha
    else if (this.cursor.isDown(68))
    {
      x++;
      this.orientation = 1;
    }
    //arriba
    else if (this.cursor.isDown(87))
    {
      y--;
      this.orientation = 0;
    }
    //abajo
    else if (this.cursor.isDown(83))
    {
      y++;
      this.orientation = 2;
    }

 

    this.muevePlayer(x*this.vel,y*this.vel);
}

Player.prototype.Accion = function(x,y){
 
  
  if (this.cursor.isDown(32)){
    
       

       var bullet = this.balas.getFirstExists(false);
       if (this.game.time.now > this.bulletTime){
        if (bullet)
        {
            bullet.angle = 90 * this.orientation;
            if (this.orientation === 0){
              bullet.reset(this.x + 8, this.y + 8);
              bullet.body.velocity.y = -320;
            }else if (this.orientation === 1){
              bullet.reset(this.x + 24, this.y + 8);
              bullet.body.velocity.x = 320;
            }else if (this.orientation === 2){
              bullet.reset(this.x + 8, this.y + 8);
              bullet.body.velocity.y = 320;
            }else if (this.orientation === 3){
              bullet.reset(this.x - 8, this.y + 8);
              bullet.body.velocity.x = -320;
            }
         
            this.bulletTime = this.game.time.now + 200;
        }
    
  }
}
if (this.cursor.isDown(66)){

  var wall = this.muros.getFirstExists(false);
  if (this.game.time.now > this.wallTime){
   if (wall)
   {
       wall.angle = 90 * this.orientation;
       if (this.orientation === 0){
         wall.reset(this.x, this.y - 16);
        
       }else if (this.orientation === 1){
         wall.reset(this.x + 30, this.y);
         
       }else if (this.orientation === 2){
         wall.reset(this.x+16, this.y + 32);
         
       }else if (this.orientation === 3){
         wall.reset(this.x - 15, this.y+16);
        
       }
    
       this.wallTime = this.game.time.now + 500;
   }

}
}


}

module.exports = Player;


},{}],5:[function(require,module,exports){
'use strict';

//node_modules/.bin/gulp run

var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    //this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    //this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    //this.loadingBar.anchor.setTo(0, 0.5);
    //this.load.setPreloadSprite(this.loadingBar);

    // ** ASSETS DEL JUEGO **
    //json y png del mapa
    this.game.load.tilemap('mapa', 'assets/mapas/mapa-0.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/mapas/mapaTiles.png');
	

    //objetos
    this.game.load.image ('arbol', 'assets/sprites/arbol.png' ); //recursos
    this.game.load.image ('subFusil', 'assets/sprites/gun.png' ); //armas
    this.game.load.image ('pistola', 'assets/sprites/pistola.png' ); //armas 
    this.game.load.image ('francoTirador', 'assets/sprites/francoTirador.png' );
    this.game.load.image ('bala', 'assets/sprites/bala.png' );
    this.game.load.image ('muro', 'assets/sprites/muro.png' );

    //jugador
    this.game.load.image('Casco1', 'assets/sprites/character.png');
    this.game.load.image('Casco2', 'assets/sprites/Casco2.png');

  },

  create: function () {
    this.game.state.start('play');
    
  }
};


window.onload = function () {
  //var game = new Phaser.Game((50 * 16), (37 * 16), Phaser.AUTO, 'game');
  var game = new Phaser.Game((50 * 16), (50 * 16), Phaser.AUTO, 'game');

  //game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('preloader');
};

},{"./play_scene.js":6}],6:[function(require,module,exports){
'use strict';

var mapa = require('./Mapa');
var j1 = require('./Player');

//var cursors;

  var PlayScene = {

  create: function () {

   this.game.physics.startSystem(Phaser.Physics.ARCADE); //inicia el motor de físicas

   this.mapa = new mapa (this.game);
   this.mapa.generate();
   

   this.j1 = new j1(this.game,50,50,'Casco1');

   /*this.game.camera.scale.x = 2;
   this.game.camera.scale.y = 2;*/
   
  }, 

  update: function(){

    this.j1.compruebaInput();
    this.j1.Accion();


    
  },

  render: function(){
    //DEBUG:
    //this.game.debug.text(`Debugging object: loQueSea:`, (2 * 16), (38 * 16), 'yellow', 'Segoe UI');
 

  }

};



module.exports = PlayScene;


/*this.game.debug.funDeb = function(x, y, color){
    this.start(x, y, color);
		this.line('bloquea: ' + this.c);
		this.line('Cantidad: ' + this.b);
		this.stop();
   }*/
},{"./Mapa":2,"./Player":4}],7:[function(require,module,exports){
'use strict';



var objeto = require('./Objeto');

function Recurso (game, x, y, sprite){
    
	objeto.call(this, game, x, y, sprite); //hereda de objeto 
}
Recurso.prototype = Object.create (objeto.prototype);
Recurso.prototype.constructor = Recurso;

Recurso.prototype.generate = function (){

	//las propiedades y la función las hereda de la clase Objeto
	this.cantidad = this.RandomItem(10); 
	this.bloquea = true; //debe bloquear el paso
	
}


module.exports = Recurso;

},{"./Objeto":3}]},{},[5]);
