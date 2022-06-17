const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 3000}); 

let clients = [];


let remainingPlayers = [];

let remainingTables = [];

const players = new Map();

let matches = [];

let twoPlayers = [];

let waitingPlayers = 0;

function newMatch(){

    twoPlayers.push(remainingPlayers.pop());
    twoPlayers.push(remainingPlayers.pop());

    player2Match = twoPlayers[0];
    player1Match = twoPlayers[1];


    matchId = Math.floor(Math.random() * 100);
    
    match = {
        id: matchId,
        player1: player1Match,
        player2: player2Match
    }
    
    for(match in matches){
        if(match.matchId == matchId){
            match = {
                id:  Math.floor(Math.random() * 100),
                player1: player1Match,
                player2: player2Match
            }  
            matches.push(match);
            return;
        }
    }
    
    matches.push(match);

}


function setarPrimeiroPlayerParaJogar(){
    twoPlayers[1].send(JSON.stringify({
        type: 'partida',
        message: 'sua-vez'
    }));


}


function transformarTabuleiro(tabuleiro){

    
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


    console.log("TABULEIIIRO: " + tabuleiro);
    var linhas = tabuleiro.split("\n");
    for(var i=0;i<10;i++){
        var colunas = linhas[i].split(", ");
        for(var j=0;j<10;j++){
            seuTabuleiro[i][j] = colunas[j];
        }
    }

    return seuTabuleiro;
}



// ws is a single connection to the server side
wss.on("connection", ws => { // quando alguem se conecta
    console.log("novo cliente conectado");
    clients.push(ws);


    ws.on("message", data => {
        

        const json = JSON.parse(data);
               
        console.log('cliente mandou: ' + json['type']);

        

        
        if(json['type'] == "playerName"){ // jogador mandando procurar partida

            player = {
                name: json['message'],
                table: "",
                status: "",
                pontuacao: 0
            }

            players.set(ws, player);            


            remainingPlayers.push(ws); // colocar os players na lista de espera para fzr a partida
            
            console.log(remainingPlayers.length)

            if(remainingPlayers.length % 2 == 0){ // inicie a partida
                for (const client of clients) {
                    client.send(JSON.stringify({
                        type: 'status',
                        message: 'iniciando-partida'
                    }));
                }

                newMatch();

                console.log(matches);
            }
            else{ // não existem players suficientes pra começar uma partida
                for (const client of clients) {
                    client.send(JSON.stringify({
                        type: 'status',
                        message: 'aguardando'
                    }));
                }
            }

        }

        if(json['type'] == "playerTable"){

            player = {
                name: players.get(ws).name,
                table: json['message'],
                status: "",
                pontuacao: 0
            }
    
            players.set(ws, player);
        
            console.log("nome: " + players.get(ws).name);
            console.log("tabela: " + players.get(ws).table);
            
           
            remainingTables.push(player); // tive que colocar o remaining table, pois o outro remaining nao armazenava as tabelas

            ws.send(JSON.stringify({
                type: 'exibir',
                message: 'tela-do-outro-jogador'
            }));
        }

        if(json['type'] == "status"){
            if(json['message'] == "aguardando"){
                players.get(ws).status = "aguardando";
                waitingPlayers++;

                // console.log(players.get(ws));

            }

        }

        if(json['type'] == "jogada"){
            let jogada = json['message'];

            // jogada vinda do player1
            if(!(twoPlayers[0] == ws)){ // twoplayers[0] -> player 2
                
                tabPlayer2 = transformarTabuleiro(remainingTables[1].table);

                jogadaPlayer1 = transformarTabuleiro(jogada); //transformando de string para matriz


                for(var i=0;i<10;i++){
                    for(var j=0;j<10;j++){
                        if(jogadaPlayer1[i][j] == 1){ // caso ele tenha marcado o 1 lá
                            if(tabPlayer2[i][j] == 1){ // caso ele tenha acertado o navio
                                players.get(ws).pontuacao += 1;
                                console.log("player 1 acertooou");
                                ws.send(JSON.stringify({
                                    type: 'pontuacao',
                                    message: 'acertou'
                                }));
                                return;                            
                            }
                        } 
                    }
                }
                
                ws.send(JSON.stringify({
                    type: 'pontuacao',
                    message: 'errou'
                })); 
            }
            // jogada vinda do player 2
            else{
               
                tabPlayer1 = transformarTabuleiro(remainingTables[0].table);
               
                jogadaPlayer2 = transformarTabuleiro(jogada);

                for(var i=0;i<10;i++){
                    for(var j=0;j<10;j++){
                        if(jogadaPlayer2[i][j] == 1){
                            if(tabPlayer1[i][j] == 1){
                                player.get(ws).pontuacao += 1;
                                console.log("player 2 acerrtou");
                                ws.send(JSON.stringify({
                                    type: 'pontuacao',
                                    message: 'acertou'
                                }));  
                                return;
                            }
                        }
                    }
                }
                ws.send(JSON.stringify({
                    type: 'pontuacao',
                    message: 'errou'
                })); 
            }


        }


        
        if(waitingPlayers == 2){
            setarPrimeiroPlayerParaJogar();            
            waitingPlayers = 0;
        }



    });



    ws.on("close", () => {
        console.log("cliente se desconectou");
        clients.pop(ws);
        remainingPlayers.pop(ws);
    });



});