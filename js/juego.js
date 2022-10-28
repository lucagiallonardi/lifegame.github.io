var canvas;
var ctx; //contexto
var fps = 30; //fotogramas por segundo

var canvasX = 450; //hancho de canvas
var canvasY = 450; //alto de canvas

var tileX, tileY; //modificadores del tamaño de los pixeles

//variables relacionadas con el tablero de juego
var tablero;
var filas = 150;
var columnas = 150;

var blanco = "#FF00FF";
var negro = "#000000";


function creaArray2D(f,c){
  var obj = new Array(c);
  for(y=0; y<f; y++){
    obj[y]= new Array(c);
  }

  return obj;
}

//OBJETO agente o turnita
var Agente = function(x,y,estado){

this.x = x;
this.y = y;
this.estado = estado; //vivo = 1 muerto = 2
this.estadoProx = this.estado;  //estado en el siguiente ciclo

this.vecinos = []; //guardamos el listado de vecinos

//metodo que añade los vecinos del objeto actual
this.addVecinos = function (){
  var xVecino;
  var yVecino;

for(i=-1; i<2; i++){
  for(j=-1;j<2;j++){

    xVecino = (this.x + j + columnas) % columnas;
    yVecino = (this.y + i + filas) % filas;

//descartamos el agente actual, yo no puedo ser mi propio vecinos
if(i!=0 || j!=0){
  this.vecinos.push(tablero[yVecino][xVecino]);
     }
    }
   }
  }

this.dibuja = function(){
  var color;
if(this.estado == 1 ){
color = blanco;
}
  else{
    color = negro;
  }
ctx.fillStyle = color;
ctx.fillRect(this.x * tileX, this.y*tileY, tileX, tileY);

}


//programamos las leyes de conway
this.nuevoCiclo = function(){
  var suma = 0;

//calculamos la cantidad de vecinos vivos
  for(i=0;i<this.vecinos.length;i++){
    suma += this.vecinos[i].estado;
  }

//aplicamos las normas --> si tiene menos de 2 vecinos muere, si tiene 2 queda igual, si tiene 3 se reproduce y si tiene mas de 3 muere
this.estadoProx = this.estado; //por defecto lo dejamos igual

//MUERTE: tiene menos de 2 o mas de 3 addVecinos
if(suma<2 || suma>3){
  this.estadoProx = 0;
}

//VIDA/REPRODUCCION: tiene exactamente 3 vecinos
if(suma==3){
  this.estadoProx = 1;
}
}

//MUTACION
this.mutacion = function(){
  this.estado = this.estadoProx;
}

}
 function inicializaTablero(obj){

   var estado;

   for(y=0; y<filas; y++){
     for(x=0; x<columnas; x++){
       estado = Math.floor(Math.random()*2);
       obj[y][x]=new Agente(x,y,estado);
     }
   }

   for(y=0; y<filas; y++){
     for(x=0; x<columnas; x++){
       obj[y][x].addVecinos();
     }
   }
}


function inicializa(){

  //asociamos el canvas
 canvas = document.getElementById('pantalla');
 ctx  = canvas.getContext("2d");

//ajustamos el tamaño del canvas
 canvas.width = canvasX;
 canvas.height = canvasY;

 //calculamos tamaño de los tiles
  tileX = Math.floor (canvasX/filas);
  tileY = Math.floor (canvasY/columnas);

  //creamos el tablero
  tablero = creaArray2D(filas, columnas);

//inicializa el tablero
  inicializaTablero(tablero);

  //ejecutamos el bucle pricipal
  setInterval(function(){principal();}, 1000/fps)
}

function borraCanvas(){
  canvas.width = canvas.width;
  canvas.height = canvas.height;
}


function dibujaTablero(obj){

  //DIBUJA LOS AGENTES
for(y=0; y<filas; y++){
  for(x=0; x<columnas; x++){
    obj[y][x].dibuja();
  }
}

//CALCULA EL SIGUIENTE ciclo
for(y=0;y<filas;y++){
  for(x=0;x<columnas;x++){
    obj[y][x].nuevoCiclo();
  }
}



//APLICA LA MUTACION
for(y=0;y<filas;y++){
  for(x=0;x<columnas;x++){
    obj[y][x].mutacion();
  }
}

}

function principal (){
  borraCanvas();
  dibujaTablero(tablero);
}