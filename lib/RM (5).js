'use strict';
var  Project = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.cost = obj.cost;
		this.name = obj.name;
        this.deadline = obj.deadline;
        this.clients = obj.clients;
	} else {
	    this.cost = "";
		this.name = "";
        this.deadline = "";
        this.clients = [];

	}
};
var  Projectf = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.cost = obj.cost;
		this.name = obj.name;
        this.deadline = obj.deadline;
        this.clients = obj.clients;
        this.i = obj.i;
	} else {
	    this.cost = "";
		this.name = "";
        this.deadline = "";
        this.clients = [];
        this.i = new BigNumber(0);

	}
};

var Client = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.phone = obj.phone;
		this.name = obj.name;
        this.mail = obj.mail;
        this.source = obj.source;
        this.goal = obj.goal;
        this.tasks = obj.tasks;

	} else {
	    this.phone = "";
	    this.name = "";
        this.mail = "";
        this.source = "";
        this.goal = "";
        this.tasks = [];

	}
};

var Task = function(text) {
	if (text) {
		var obj = JSON.parse(text);
        this.name = obj.name;
        this.status = obj.status;
        this.desc = obj.desc;
	} else {
        this.name = "";
        this.status = false;
        this.desc = "";
	
	}
};



var Memory = function () {

};

Memory.prototype = {
	init: function () {
        var arr = [];
        LocalContractStorage.put("table", arr);	
        
    },
    createProject: function (name,deadline,cost) {
        var from = Blockchain.transaction.from;
        var arr = LocalContractStorage.get(from);
        	  if (!arr){
                arr = [];
                var project = new Projectf();
         project.name = name;
         project.cost = cost;
         project.deadline = deadline;
         project.i = new BigNumber(0);
         project.clients = [];
         arr.push(project);
         LocalContractStorage.set(from, arr);
         return arr;
                
              } else {
                
         var project = new Project();
         project.name = name;
         project.cost = cost;
         project.deadline = deadline;
         project.clients = [];
         arr.push(project);
         LocalContractStorage.set(from, arr);
         return arr;
              }
    }, 
	addClient: function (indexP,name,phone,mail,source,goal) {
        var from = Blockchain.transaction.from;
        var arr = LocalContractStorage.get(from);
        	  if (!arr){
                throw new Error("You dont have any project");
              } 
         var inc = new BigNumber(arr[0].i);
         arr[0].i = inc.plus(1);
         var arr2 = arr[indexP].clients;       
         var client = new Client();
         client.name = name;
         client.phone = phone;
         client.mail = mail;
         client.source = source;
         client.goal = goal;
         arr2.push(client);
         
         LocalContractStorage.set(from, arr);
         return arr;
    }, 
    
    read: function () {
     var from = Blockchain.transaction.from;
     var arr = LocalContractStorage.get(from);
     if (!arr || arr.length == 0){
           throw new Error("You dont have any project");
          } 
          
     return arr;
    },
    readcl: function () {
        var from = Blockchain.transaction.from;
        var arr = LocalContractStorage.get(from);
        var arr2 = [];
        if (!arr || arr.length == 0){
              throw new Error("You dont have any project");
             } 
             for(var i = 0; i <(arr.length); i++){
                 arr2.push(arr[i].clients);
             }
             
        return arr2;
       },
    getProjectByDL: function () {
        var from = Blockchain.transaction.from;
        var arr = LocalContractStorage.get(from);
        if (!arr || arr.length == 0){
              throw new Error("You dont have any project");
             } 
             arr.sort(function compareAge(personA, personB) {
                return personA.deadline - personB.deadline;
              })
         return arr;
       },
       getProjectByPR: function () {
        var from = Blockchain.transaction.from;
        var arr = LocalContractStorage.get(from);
        if (!arr || arr.length == 0){
              throw new Error("You dont have any project");
             } 
             arr.sort(function compareAge(personA, personB) {
                return  personB.cost - personA.cost;
              })
         return arr;
       },
       getTasks: function () {
        var from = Blockchain.transaction.from;
        var arr = LocalContractStorage.get(from);
        var arr2 = [];
        if (!arr || arr.length == 0){
              throw new Error("You dont have any project");
             } 
             for(var i = 0; i <(arr.length); i++){
                for(var k = 0; k <(arr[i].clients.length); k++){
                    for(var x = 0; x <(arr[i].clients[k].tasks.length); x++){
                 arr2.push(arr[i].clients[k].tasks[x]);
                }
            }
             }
             
        return arr2;
       },
     remove: function (indexP,i) {
        var from = Blockchain.transaction.from;
        var arr = LocalContractStorage.get(from);
        
        if (!arr || arr.length == 0){
              throw new Error("You dont have any project");
             } 
             var inc = new BigNumber(arr[0].i);
             arr[0].i = inc.plus(1);
        var arr2 = arr[indexP].clients; 
        arr2.splice(i, 1);
        LocalContractStorage.set(from, arr);
        return arr;
       },
       addTask: function (indexP,i,_task,desc) {
        var from = Blockchain.transaction.from;
        var arr = LocalContractStorage.get(from);
        
        if (!arr || arr.length == 0){
              throw new Error("You dont have any project");
             } 
             var inc = new BigNumber(arr[0].i);
         arr[0].i = inc.plus(1);
      var arr2 = arr[indexP].clients; 

      var  tasks = arr2[i].tasks;
        if (!tasks){
            tasks = [];
          } 
        var task = new Task(); 
        task.name = _task;
        task.status = false; 
        task.desc = desc;
        tasks.push(task);
        LocalContractStorage.set(from, arr);
        return arr;
       },

       completeTask: function (indexP,i,it) {
        var from = Blockchain.transaction.from;
        var arr = LocalContractStorage.get(from);
       
        if (!arr || arr.length == 0){
              throw new Error("You dont have any client");
             } 
             var inc = new BigNumber(arr[0].i);
         arr[0].i = inc.plus(1);
      var arr2 = arr[indexP].clients; 
      var  tasks = arr2[i].tasks;
        if (!tasks){
            throw new Error("You dont have any task");
          }
        tasks[it].status = true; 
        LocalContractStorage.set(from, arr);
        return arr;
       },
       readi: function (indexP,i,it) {
        var from = Blockchain.transaction.from;
        var arr = LocalContractStorage.get(from);
        if (!arr || arr.length == 0){
            throw new Error("You dont have any client");
           } 
        return arr[0].i;
       },
    
	
};
module.exports = Memory;
