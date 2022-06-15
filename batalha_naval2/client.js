const ws = new WebSocket("ws://localhost:3000"); // so inicia a conexão quando apertar o botão de procurar a partida

var seuTabuleiro = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]


var tabuleiroInimigo = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]




var outPut = ''


for(var i=0;i<10;i++){
    for(var j=0;j<10;j++){
        outPut += seuTabuleiro[i][j] + ", ";
    }
    outPut += "\n";
}
                  
// console.log(outPut);

document.getElementById("display").innerHTML = outPut;


function sendPlayerName(){
    
    var playerName = document.getElementById("playerName").value;

    
    ws.send(JSON.stringify({
        type: "playerName",
        message: playerName
    }));

    console.log("Nome de player enviado");

}




ws.addEventListener("open", () =>{
    console.log("Abriu a conexão");



    

});



ws.onmessage = (event) =>{
    const json = JSON.parse(event.data);
    console.log('json', json);

    if(json['type'] == "status"){
        if(json['message'] == "iniciando-partida"){
           document.getElementById("inserirNome").style.display = 'none';
           document.getElementById("inicioDePartida").style.visibility = 'visible';
        }
    }


}

function setNavios(){
 
    var seuTabuleiroString =  document.getElementById("display").value;


    var linhas = seuTabuleiroString.split("\n");
    for(var i=0;i<10;i++){
        var colunas = linhas[i].split(", ");
        console.log(colunas);
        for(var j=0;j<10;j++){
            seuTabuleiro[i][j] = colunas[j];
        }
    }


    var outPut = ''


    for(var i=0;i<seuTabuleiro.length;i++){
        for(var j=0;j<seuTabuleiro[i].length;j++){
            outPut += seuTabuleiro[i][j] + ", ";
        }
        outPut += "\n";
    }
                  
    console.log(outPut);

    ws.send(JSON.stringify({
        type: "playerTable",
        message: outPut
    }));




}