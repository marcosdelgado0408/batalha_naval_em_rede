const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 3000}); 

let clients = [];

let players = {};

let remainingPlayers = [];


let match = {
    id: "",
    player1: "", // nome do jogador 
    player2: "" // nome do outro jogador
}


function onConnection(ws, req) {
    clients.push(ws);
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    ws.on('close', (reasonCode, description) => onClose(ws, reasonCode, description));
    ws.send(JSON.stringify({
        type: 'connection',
        data: 'Bem vindo'
    }))
    console.log(`onConnection`);
}


function newMatch(){
    remainingPlayers.pop();
    remainingPlayers.pop();



}






// ws is a single connection to the server side
wss.on("connection", ws => { // quando alguem se conecta
    console.log("novo cliente conectado");
    clients.push(ws);



    ws.on("message", data => {
        

        const json = JSON.parse(data);
               
        console.log('cliente mandou: ' + json['type']);
        
        if(json['type'] == "playerName"){ // jogador mandando procurar partida
            players[ws]= json['message'];
            remainingPlayers.push(ws);
            
            console.log(remainingPlayers.length)

            if(remainingPlayers.length % 2 == 0){ // inicie a partida
                for (const client of clients) {
                    client.send(JSON.stringify({
                        type: 'status',
                        message: 'iniciando-partida'
                    }));
                }

                newMatch();

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
            //TODO
        }


    });



    ws.on("close", () => {
        console.log("cliente se desconectou");
        clients.pop(ws);
        remainingPlayers.pop(ws);
    });



});