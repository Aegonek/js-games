let sec = 0;
let checked = 0;
let checkable = 0;
let boardSize;
let mineQuantity;
let board;
let timeInterval;

function time() {
    if(sec>-1) {
        $("#time").html(sec++);
    }
}

function generateGame() {
    boardSize = Number($("#boardSize").val());
    mineQuantity = Number($("#mineQuantity").val());
    let table = document.createElement("table");
    for (let i=0; i<boardSize; i++){
        let row = table.insertRow();
        for (let j=0; j<boardSize; j++) {
            let cell = row.insertCell();
            $(cell).attr("id", `${i}_${j}`);
            $(cell).on("click", function() {
                flag(this); });
            $(cell).on("dblclick", function() {
                uncover(this); });
        }
    }
    $("body")[0].appendChild(table);

    board = new Array(boardSize);
    for (var i=0; i<board.length; i++){
        board[i] = new Array(boardSize);
        for (var j=0; j<board[i].length; j++){
            board[i][j]=0;
        }
    }
    spawnMines();
    countNeighbours();
    checkable = Math.pow(boardSize, 2) - mineQuantity;

    $("#settingsP").css("display", "none");
    $("#startButton").css("display", "none");

    timeInterval = setInterval(function(){time()}, 1000);
}

function spawnMines() {
    var tmp = 0;
    while(tmp<mineQuantity){
        var r = Math.floor((Math.random()*boardSize));
        var c = Math.floor((Math.random()*boardSize));
        if(board[r][c]!=-1){
            board[r][c]=-1;
            tmp++;
        }
    } 
}

function countNeighbours() {
    for (var i=0; i<board.length; i++){
        for (var j=0; j<board[i].length; j++){
           if(board[i][j]!=-1){
                board[i][j] = function(r,c) {
                    var count=0;

                    for(var i=r-1; i<=r+1; i++){
                        for(var j=c-1; j<=c+1; j++){
                            if(i>-1 && i<board.length && j>-1 && j<board[i].length){
                                if(board[i][j]==-1){
                                    count++;
                                }
                            }
                        }
                    }
                    return count;
                }(i,j);
            }
        }
    }
}

function flag(obj) {
    var id = obj.id;
    var idR = id.substring(0, id.indexOf('_')); 
    var idC = id.substring(id.indexOf('_')+1, id.length);

    $('#'+id).html('x');
    $('#'+id).removeClass();
    $('#'+id).addClass('black');
}

function uncover(obj) {
    var id = obj.id;
    var idR = id.substring(0, id.indexOf('_')); 
    var idC = id.substring(id.indexOf('_')+1, id.length);

    $('#'+id).html(board[idR][idC]);
    
    $('#'+id).removeClass();
    if(board[idR][idC]==-1){
        $('#'+id).addClass('mine');
    } else if(board[idR][idC]==0){
        $('#'+id).addClass('emptyN');
        checked += 1;
        if (checked == checkable) {
            endGame("Wygrałeś grę. Mam nadzieję że się cieszysz.");
        }
        uncoverAdjacent(obj, [{row: idR, column: idC}]);
    } else {
        checked += 1;
        if (checked == checkable) {
            endGame("Wygrałeś grę. Mam nadzieję że się cieszysz.");
        }
        $('#'+id).addClass('empty');
    }

    if(board[idR][idC]==-1){
        endGame("You lost");
    }
}

function uncoverAdjacent(obj, checkedFields=[]) {
    var id = obj.id;
    var idR = Number(id.substring(0, id.indexOf('_'))); 
    var idC = Number(id.substring(id.indexOf('_')+1, id.length));

    for (let field of [{row: idR-1, column: idC}, 
            {row: idR+1, column: idC},
            {row: idR, column: idC-1}, 
            {row: idR, column: idC+1}]) {
        if (checkedFields.filter(elem => elem.row == field.row && elem.column == field.column).length == 0 &&
            field.row>=0 && field.row<board.length &&
            field.column>=0 && field.column<board[field.row].length) {
            checkedFields.push(field);
            if (board[field.row][field.column] > 0) {
                fieldId = `${field.row}_${field.column}`;
                $(`#${fieldId}`).html(board[field.row][field.column]);
                $(`#${fieldId}`).addClass('empty');
                checked += 1;
                if (checked == checkable) {
                    endGame("Wygrałeś grę. Mam nadzieję że się cieszysz.");
                }
            }
            else if (board[field.row][field.column] == 0) {
                fieldId = `${field.row}_${field.column}`;
                $(`#${fieldId}`).html(board[field.row][field.column]);
                $(`#${fieldId}`).addClass('emptyN');
                checked += 1;
                if (checked == checkable) {
                    endGame("Wygrałeś grę. Mam nadzieję że się cieszysz.");
                }
                uncoverAdjacent(document.getElementById(`${field.row}_${field.column}`), checkedFields);
            }
        }
    }
}

function endGame(message) {
    clearInterval(timeInterval);
    alert(message);
    for (var i=0; i<board.length; i++){
        for (var j=0; j<board[i].length; j++){
            if (board[i][j] == -1) {
                $(`#${i}_${j}`).addClass('mine');
                $(`#${i}_${j}`).html("-1");
            }

            $(`#${i}_${j}`).off();
        }
    }

    $("#settingsP").css("display", "initial");
    // $("#startButton").css("display", "none");

    let button = document.createElement("button");
    button.id = "restartButton";
    button.innerHTML = "Restart game";
    $("#options").append(button);
    $(button).on("click", function() {
        restartGame();
    });
}

function restartGame() {
    alert("I'm restarting game");

    $("table").remove();
    sec = 0;
    checked = 0;
    generateGame();
    $("#restartButton").remove();
}

// timeInterval = setInterval(function(){time()}, 1000);