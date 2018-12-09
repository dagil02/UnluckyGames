'use strict';

//node_modules/.bin/gulp run


function Mapa (game){


    //ATRIBUTOS
    this.game = game;

    this.tile_Map; //recoge el mapa de tiles

    this.layer_background; this.layer_obstaculo_0; this.layer_obstaculo_1; this.layer_obstaculo_2;
    
    
    


    //FUNCIONES 
    //genera aleatorio para recursos y añade al grupo
    this.añadeObjetos = function (enlace, idSprite, nObj){

        var n_Recursos = nObj; var n = 0;
        var objeto = enlace; //recoge el valor por parámetro
 

        while (n < n_Recursos){
            
           var x = Math.floor(Math.random() * 50 );
           var y = Math.floor(Math.random() * 37 );

           //variable auxiliar. 
           var aux = this.game.add.sprite(x, y, 'Casco1');
           
           var col = false; var i = 1;
           while (!col && i < this.tile_Map.layerGroup.length){
               col = this.game.physics.arcade.collide(aux, this.tile_Map.layerGroup.children[i]);
               i++;
           }

           //col = this.TileOcupado(aux, this.tile_Map.layerGroup.children);

           console.log ("BOOL COL: " + col); //MENSAJE EN CONSOLA

           if (!col){ 
               var hijo = -1;
               //this.recurso.physicsBodyType = Phaser.Physics.ARCADE;
               //this.recurso.enableBody = true;
               if (idSprite === 'arbol'){ hijo = 0; }
               else if (idSprite === 'subFusil'){ hijo = 1; }

               if (hijo !== -1){
                   if (hijo === 0){
                    if (this.GrupoObjetos.children[1].x !==  x * 16 && this.GrupoObjetos.children[1].y !==  y * 16 ){
                        this.GrupoObjetos.children[hijo].add(new objeto(this.game, x * 16, y * 16, idSprite));
                        n++;
                    }  
                   }
                   else if (hijo === 1){
                        if (this.GrupoObjetos.children[0].x !==  x * 16 && this.GrupoObjetos.children[1].y !==  y * 16 ){
                            this.GrupoObjetos.children[hijo].add(new objeto(this.game, x * 16, y * 16, idSprite));
                            n++;
                        }  
                    }
                }
                
            }

             
    
           aux.destroy(); //destruye la variable para que no se quede renderizada
                  
        }//fin while   
       
      
        
    }

    //añade el mapa de tiles precargado en el main
    this.añadeTileMap = function (str){
        this.tile_Map = this.game.add.tilemap(str);
    }
    //añade la img de patrones
    this.añadeTileImg = function (str_1, str_2){
        this.tile_Map.addTilesetImage(str_1, str_2); 
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
        }  

    }

    //COMO NO CONSIGO LO DE LAS FUCKING COLISIONES. ACCEDO AL ARRAY DE LA CAPA Y COMPRUEBO SI ESTÁ OCUPADO
    this.TileOcupado = function(variable, nombreCapa) {
       var colision = false; var i = 1;
       //aqui recorre el array de hijos de layerGroup saltándose la capa BackGround
       while (!colision && i < nombreCapa.length){
           colision = nombreCapa[i].layer.data[variable.y][variable.x].index !== -1;
           i++;
       }

       
       return colision;

    }
    //Método que devuelve un array de index correspondiente a cada capa. 
    this.RecogeIndex = function(nombreCapa) {

        var listaIndex = []; //lista auxiliar 
        //función que devuelve un patrón de orden ascendente
        function comparar (a, b){
            return a - b;
        }
        //se recorre las fils/Cols del mapa patrón de tiles
        for  (var y = 0; y < 37; y++){
            for (var x = 0; x < 50; x++){    
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



}


Mapa.prototype.generate = function() {
    
   this.añadeTileMap('mapa');
   this.añadeTileImg('tilesMap', 'tiles');
   

   //Grupos
   this.tile_Map.layerGroup = this.game.add.group(); //capas con los patrones del mapa
   this.GrupoObjetos = this.game.add.group(); //alberga grupos
   this.GrupoRecursos = this.game.add.group(); //arbol = identificador en Preload clase Game
   this.GrupoArmas = this.game.add.group(); //subfusil = identificador
   //GrupoObjetos = [GrupoRecurso, GrupoArmas,...]
   this.GrupoObjetos.add(this.GrupoRecursos);
   this.GrupoObjetos.add(this.GrupoArmas);


   //se crean las capas, se definen como colisiones y se añaden al grupo
   this.añadeLayer();

   console.log ('POSICION TILE '+this.layer_obstaculo_0.layer.data[2][3].x);


   //se require de la clase objeto para genrar sus hijos. 
   var recursosClass = require('./recurso'); //recursos 
   var armasClass = require('./Armas'); //armas
   var recursoIdSprite = 'arbol'; var armasIdSprite = 'subFusil';
   this.añadeObjetos(recursosClass, recursoIdSprite, 50);
   this.añadeObjetos(armasClass, armasIdSprite, 12);
}
/*Mapa.prototype.colisionaObjetos = function(player,item){
    var boundsA = player.getBounds();
    var boundsB = item.getBounds();
  
    if(Phaser.Rectangle.intersects(boundsA, boundsB)){

        delete item;
    }
    item.x ++;
}

Mapa.prototype.compruebaColision = function(player){
    this.GrupoObjetos.array.forEach(this.colisionaObjetos(player,item));
}*/

module.exports = Mapa;
