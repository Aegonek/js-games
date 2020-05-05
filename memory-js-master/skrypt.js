setInterval(function(){time()},1000);
let sec = -1;
let maxSec;
let board;
let score = 0;

function time() {
    if(sec>-1){
        $('#time-counter').html(++sec);
        if (sec >= maxSec) {
            end("defeat");      
        }
    }
}

function end(outcome) {
    if (outcome == "defeat") {
        alert(`Twój czas się skończył. Uzyskałeś ${score} punktów`);
    } else if (outcome = "victory") {
        alert(`Gratulacje! Znalazłeś wszystkie kombinacje w czasie ${sec} sekund`);
    }
    sec = -1;
    clearTimeout(time);
    $("#restart-button").css("display", "initial");
}

function getId(strId) {
    arr = new Array(2);
    arr[0]=strId.substring(3, strId.indexOf('_'));
    arr[1]=strId.substring(strId.indexOf('_')+1, strId.length);
    return arr 
}

function GameBoard(n,m) {
    this.n = n;
    this.m = m;

    score = 0;

    //n*m%2==0

    picBoard = new Array(n);
    last = -1;

    accepTab = new Array(n*m/2);
    for (var i=0; i<accepTab.length; i++){
        accepTab[i] = 0;
    }

    for (var i=0; i<picBoard.length; i++){
        picBoard[i] = new Array(m);
        for (var j=0; j<picBoard[i].length; j++){
            picBoard[i][j] = new Picture(accepTab);
        }
    }
    for(var i=0; i<n; i++){
        $("#board").append("<div class=row id=row"+i+"> ");
        for(var j=0; j<m; j++){
            $("#board #row"+i).append("<span class=col id=col"+i+"_"+j+">X");
            $("#col"+i+"_"+j).bind("click", function() {
                show(this);
            });
        } 
    }
}

function Picture(accept) {
    this.val;
    do{
        rand = Math.floor(Math.random() * accept.length);
    }while(accept[rand]==2);
    accept[rand]++;
    this.val = rand;
}

function getPicture(id) {
    return picBoard[id[0]][id[1]].val
}

function show(obj){
    val = getPicture(getId(obj.id));
    $(obj).html(val);
    if(last==-1){
        last = val;
        lastId = getId(obj.id);
        LAST_OBJECT = obj;
    } else {
        if(last==val && LAST_OBJECT != obj){
            score++;
            $('#score').html(score);
            if (score == (board.n * board.m / 2)) {
                end("victory");
            }
        } else {
            setTimeout(function(){
                $(obj).html("X");
                $("#col"+lastId[0]+"_"+lastId[1]).html("X");
            }, 1000);    
        }
        last=-1;
    } 
}

function restartGame() {
    $("#board").empty();

    let rowNum = Number($(`#row-count-input`).html());
    let colNum = Number($(`#column-count-input`).html());
    let maxTimeInput = Number($(`#max-sec-input`).html());
    if (rowNum * colNum % 2 == 0 && Number.isInteger(maxTimeInput)) {
        maxSec = maxTimeInput;
        $("#max-time-showed").html(maxSec);
        board = new GameBoard(rowNum, colNum);
        sec = 0;
        $("#restart-button").css("display", "none");
    }
    else if (!Number.isInteger(maxTimeInput)) {
        window.alert("Czas na ukończenie gry musi być liczbą całkowitą");
    }
    else {
        window.alert("Iloczyn wierszy i kolumn musi być podzielny przez dwa. Zapisz go liczbą, np. 2");
    }

}

$().ready(function() {
    $("#start-button").bind("click", function() {
        let rowNum = Number($(`#row-count-input`).val());
        let colNum = Number($(`#column-count-input`).val());
        let maxTimeInput = Number($(`#max-sec-input`).val());
        if (rowNum * colNum % 2 == 0 && Number.isInteger(maxTimeInput)) {
            maxSec = maxTimeInput;
            $("#max-time-showed").html(maxSec);
            board = new GameBoard(rowNum, colNum);
            sec = 0;
            $("#start-button").unbind("click");
            $("#start-button").css("display", "none");
        }
        else if (!Number.isInteger(maxTimeInput)) {
            window.alert("Czas na ukończenie gry musi być liczbą całkowitą");
        }
        else {
            window.alert("Iloczyn wierszy i kolumn musi być podzielny przez dwa. Zapisz go liczbą, np. 2");
        }
    });

    $("#restart-button").bind("click", function() {
        $("#board").remove();

        let _div = document.createElement("div");
        _div.id = "board";
        $("#appendable").append(_div);

        let rowNum = Number($(`#row-count-input`).html());
        let colNum = Number($(`#column-count-input`).html());
        maxTimeInput = Number($(`#max-sec-input`).html());
        if (rowNum * colNum % 2 == 0 && Number.isInteger(maxTimeInput)) {
            sec = 0;
            maxSec = maxTimeInput;
            $("#max-time-showed").html(maxSec);
            board = new GameBoard(rowNum, colNum);
            $("#restart-button").css("display", "none");
        }
        else if (!Number.isInteger(maxTimeInput)) {
            window.alert("Czas na ukończenie gry musi być liczbą całkowitą");
        }
        else {
            window.alert("Iloczyn wierszy i kolumn musi być podzielny przez dwa. Zapisz go liczbą, np. 2");
        }
    })
});


