const net = require('net');
const colors = require('colors')
const server = net.createServer();
const readlineSync = require('readline-sync');
const {spawnSync} = require('child_process');
const sockets = [];
const nameOfUsers = [];

let name;

function isCurrentSocket(allUsers,currentUser){
    if(allUsers === currentUser){
        return true;
    }else{
        return false;
    }
}

function setNameOfUser(Users,currentUser,instruction,callback){
    Users.forEach((user,index) => {
        if(isCurrentSocket(Users[index],currentUser)){
            name = instruction
            nameOfUsers.push(name);
            user.write(`you are welcom to the chat server ${instruction} ! \n\n\r`.cyan);
            user.write(spawnSync('cowsay',['-f','blowfish','salaud']).stdout.toString());
            return;
           
        }
    });
    callback(name);
}

function botSendMessageAllUsers(allUsers,currentUser,message){
    allUsers.forEach((User,index) => {
        if(!isCurrentSocket(allUsers[index],currentUser)){
            User.write(message.rest.bgMagenta+'\n');
        }
    });
}
server.on('connection',(socket) => {
    console.log('new user is connected'.green);
    socket.setEncoding('UTF-8');
    sockets.push(socket);
    setNameOfUser(sockets,socket,readlineSync.question('Enter please your name : '.green),function(name){
            const message = {
                you:'you are now connected',
                rest:`${name} is now connected`
            }
           
            botSendMessageAllUsers(sockets,socket,message);
        });
   
    socket.on('data',function(data){
            sockets.forEach((__,index) => {
                if(isCurrentSocket(sockets[index],socket)){
                    return;
                }
                const getWhoWrite = sockets.indexOf(socket);
                sockets[index].write(`user ${nameOfUsers[getWhoWrite]} write you : `.bgCyan+data);
            });
    });
    
    socket.on('close',() => {
        if(sockets.length===2){
            sockets.splice(sockets.indexOf(socket),1);
            sockets[0].write('Your mate has been disconnected\n\r'.cyan);
        }else{
            sockets.forEach((__,index) => {
                if(isCurrentSocket(sockets[index],socket)){
                    return;
                }
                sockets[index].write('One of you mate has been disconnected\r\n'.cyan);
            });
        }
    });
});

server.listen(3000,function(){
    console.log('server is started');
})