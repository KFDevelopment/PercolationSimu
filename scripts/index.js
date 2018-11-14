var gridSize = $("#gridSize").val();
var clickToDrag = false;
var grid = [];
var gridTwoDim = [];
var currentPositionX = 0;
var currentPositionY = 0;

var maxPositionY = 0;

  $(function(){
    redrawGrid(gridSize);

  });

  $("body").on("drag", function(e) {
    e.preventDefault();
  })



  function redrawGrid(gridSize){
    maxPositionY = 0;
    $("#percole,#notPercole").hide();
    grid = [];
    gridTwoDim = [];
    var gridLine = "";
    var globalIndex = 0;
    for(var i = 0; i< gridSize; i++){
      gridTwoDim[i] = [];
      gridLine += "<tr>";
      for (var j = 0; j < gridSize; j++) {
        gridLine += "<td id="+globalIndex+"  onmouseup=\"unClick()\" onmousedown=\"clickCell("+globalIndex+")\" onmouseover=\"enterCell("+globalIndex+")\"></td>";

        //status : 0 => empty, 1=> block, 2 => full
        grid.push({id:globalIndex, x:j, y:i, status:0});
        gridTwoDim[i].push(0);
        globalIndex += 1;

      }
      gridLine += "</tr>";
    }
    $("table").html(gridLine);
  }

  $("#gridSize").on("input", function(){
    gridSize = $("#gridSize").val();
    redrawGrid(gridSize);
  });

function clickCell(id){
    if($("#" + id).hasClass("block")){
      $("#" + id).removeClass("block");
      var cell = grid.find(x => x.id == id);
      cell.status = 0;
      gridTwoDim[cell.y][cell.x] = 0;
    }
    else{
      $("#" + id).addClass("block");
      var index = grid.findIndex(x => x.id == id);
      grid[id].status = 1;
      gridTwoDim[grid[id].y][grid[id].x] = 1;

    }
    clickToDrag = true;
}
function enterCell(id){
  if(clickToDrag){
    var index = grid.findIndex(x => x.id == id);
    grid[id].status = 1;
    gridTwoDim[grid[id].y][grid[id].x] = 1;
    $("#" + id).addClass("block");
  }
}

function unClick(){
  clickToDrag = false;
}

$("#start").on("click", function(){
  findStartCursorPosition();
  console.log("start");
  percole(currentPositionX, currentPositionY);
})

function findStartCursorPosition(){
  var firstValidElem = grid.find(x => x.status == 0);

  $("#" + firstValidElem.id).css("background-color" , "green");

  currentPositionX = firstValidElem.x;
  currentPositionY = firstValidElem.y;

  percole(currentPositionX, currentPositionY);

  var cell = grid.find(x => x.x == currentPositionX && x.y == currentPositionY);
  $("#" + cell.id).css({"background-color" : "red"});

  if(maxPositionY == (gridSize - 1)){
    $("#percole").show();
  }
  else{
    $("#notPercole").show();
  }
}

function percole(positionX, positionY){

  if(positionY > maxPositionY){
    maxPositionY = positionY;
  }

  currentPositionX = positionX;
  currentPositionY = positionY;

  var cell = grid.find(x => x.x == positionX && x.y == positionY);

  if(gridTwoDim[positionY][positionX] == 0){
      gridTwoDim[positionY][positionX] = 2;
      cell.status = 2;
      $("#" + cell.id).addClass("full");
  }



  if((positionX + 1) != gridSize){
    if(gridTwoDim[positionY][positionX + 1] == 0 || positionY == 0){
      percole(positionX + 1, positionY);
    }
  }
  if((positionY + 1) != gridSize && gridTwoDim[positionY][positionX] != 1){
    if(gridTwoDim[positionY + 1][positionX] == 0){
      percole(positionX, positionY + 1);
    }
  }
  if((positionY -1) >= 0){
    if(gridTwoDim[positionY - 1][positionX] == 0){
      percole(positionX, positionY - 1);
    }
  }
  if((positionX - 1) >= 0){
    if(gridTwoDim[positionY][positionX - 1] == 0){
      percole(positionX - 1, positionY);
    }
  }
}

$("#random").on("click", function(){
  redrawGrid(gridSize);
  var nbCell = gridSize * gridSize;
  var randomValue = Math.round($("#randonPercentage").val() * nbCell);
  var i = 0;
  while(i < randomValue){
    var randomNb = Math.floor((Math.random() * nbCell));
    var cell = grid.find(x => x.id == randomNb);
    if(cell.status == 0){
      clickCell(cell.id);
      i += 1;
    }
  }
clickToDrag = false;
})
