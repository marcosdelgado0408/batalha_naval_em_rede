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
document.getElementById("display-adversario").innerHTML = outPut;


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
    if(json['type'] == "exibir"){
        if(json['message'] == "tela-do-outro-jogador"){
            document.getElementById("tabuleiroAdversario").style.visibility = 'visible';
            document.getElementById("adicionarNaviosButton").style.visibility = 'hidden';
        
        
            ws.send(JSON.stringify({
                type: "status",
                message: "aguardando"
            }));
        
        }
    }
    if(json['type'] == "partida"){
        if(json["message"] == "sua-vez"){
            document.getElementById("adicionar-jogada-button").style.visibility = 'visible';
            document.getElementById("facasuajogada").style.visibility = 'visible';            
        }
    }
    if(json['type'] == "pontuacao"){
        if(json['message'] == "acertou"){
            document.getElementById("acertou").style.visibility = 'visible';
        }
        else{
            document.getElementById("errou").style.visibility = 'visible';

        }
    }



}

function getNaviosIniciais(){
 
    var seuTabuleiroString =  document.getElementById("display").value;


    var linhas = seuTabuleiroString.split("\n");
    for(var i=0;i<10;i++){
        var colunas = linhas[i].split(", ");
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


function getJogada(){

    var tabuleiroJogadaString =  document.getElementById("display-adversario").value;


    ws.send(JSON.stringify({
        type: "jogada",
        message: tabuleiroJogadaString
    }));


}