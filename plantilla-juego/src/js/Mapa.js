'use strict';

//node_modules/.bin/gulp run


function Mapa (game){


    //ATRIBUTOS
    this.game = game;

    this.tile_Map; //recoge el mapa de tiles

    this.layer_background; this.layer_obstaculo_0; this.layer_obstaculo_1; this.layer_obstaculo_2;


    

    //FUNCIONES 
    //genera aleatorio para recursos y añade al grupo
    this.añadeObjetos = function (enlace, idSprite, nObj, g_obj_hijo){

        //constante auxiliar
        var tile_patron_W = this.tile_Map.width; var tile_patron_H = this.tile_Map.height;

        //variables de control 
        var n_Recursos = nObj; var n = 0;
        var objeto = enlace; //recoge el valor por parámetro
       

        while (n < n_Recursos){
            
           var x = Math.floor(Math.random() * tile_patron_W );
           var y = Math.floor(Math.random() * tile_patron_H);

           //variable auxiliar. 
           var tile_W = this.tile_Map.tileWidth; var tile_H = this.tile_Map.tileHeight //recoge w/h del tile
           x = x * tile_W; y = y * tile_H; //recogen worldPosition
           var aux = this.game.add.sprite(x, y, 'Casco1');
           this.game.physics.arcade.enable(aux);
           aux.enableBody = true;
           
           var col = false;
           col = this.TileOcupado(aux, this.tile_Map.layerGroup.children);

           console.log ("BOOL COL: " + col); //MENSAJE EN CONSOLA

           if (!col){ 
               if (!this.AñadeObjetoAux(x, y)){
                g_obj_hijo.add(new objeto(this.game, x, y, idSprite));
                n++;
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
            //this.tile_Map.setCollisionByExclusion((this.RecogeIndex(this.tile_Map.layerGroup.children[i])), true, this.tile_Map.layerGroup.children[i], true);
        }  
    }

    //COMO NO CONSIGO LO DE LAS FUCKING COLISIONES. ACCEDO AL ARRAY DE LA CAPA Y COMPRUEBO SI ESTÁ OCUPADO
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

     //Método que comprueba que no se va a posicionar el objeto encima de otro
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

}


Mapa.prototype.generate = function() {
    
   this.añadeTileMap('mapa');
   this.añadeTileImg('tilesMap', 'tiles');
   

   //Grupos
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

   //se require de la clase objeto para genrar sus hijos. 
   var recursosClass = require('./recurso'); //recursos 
   var armasClass = require('./Armas'); //armas
   var recursoIdSprite = 'arbol'; var armasIdSprite = 'subFusil';
   this.añadeObjetos(recursosClass, recursoIdSprite, 50, this.GrupoRecursos);
   this.añadeObjetos(armasClass, armasIdSprite, 12, this.GrupoArmas);
}

module.exports = Mapa;
