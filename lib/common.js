// var HttpRequest = require("nebulas").HttpRequest;
// var Neb = require("nebulas").Neb;
// var Account = require("nebulas").Account;
// var Transaction = require("nebulas").Transaction;
// var Unit = require("nebulas").Unit;
// var neb = new Neb();

var NebPay = require("nebpay");   
var nebPay = new NebPay();
var dappAddress = "n1xLEMZ3eAEpvJgsUuSToNsR3zxssqoGuHp";


var vm = new Vue({
  el: '#app',
  data: {   
    workspace: true,
    projects: false,
    clients: false,
    tasks: false,
    search: false,
    total_projects: 0,
    total_cost: 0,    
    total_clients: 0,
    total_tasks: 0,
    tasks_active: 0,
    tasks_completed: 0,
  },
  methods: {  	
  	tabswitch() {  		      
      var target = event.target;            
      if(target.tagName == 'IMG') {
        target = target.parentNode;
      }
      var target_id = target.getAttribute('id');   
      
      switch (target_id) {
        case 'workspace_tab':
          vm.workspace = true;
          vm.projects = false;
          vm.clients = false;
          vm.tasks = false;
          break;
        case 'projects_tab':
          vm.workspace = false;
          vm.projects = true;
          vm.clients = false;
          vm.tasks = false;
          break;
        case 'clients_tab':
          vm.workspace = false;
          vm.projects = false;
          vm.clients = true;
          vm.tasks = false;
          break;
        case 'tasks_tab':
          vm.workspace = false;
          vm.projects = false;
          vm.clients = false;
          vm.tasks = true;
          break;
        default:
          alert( 'Something went wrong, please try again' );
      }
  	},
    morelink() {
       var target = event.target;   
       var target_id = target.getAttribute('id');           
        switch (target_id) {
          case 'more_projects':
          vm.workspace = false;
          vm.projects = true;
          vm.clients = false;
          vm.tasks = false;
          $('.tabs .tab').removeClass('active_tab');
          $('#projects_tab').addClass('active_tab');        
          break;
        case 'more_tasks':
          vm.workspace = false;
          vm.projects = false;
          vm.clients = false;
          vm.tasks = true;
          $('.tabs .tab').removeClass('active_tab');
          $('#tasks_tab').addClass('active_tab');        
          break;
        default:
          alert( 'Something went wrong, please try again' );
        }
    }, 
    moreclients() {      
      vm.workspace = false;
      vm.projects = false;
      vm.clients = true;
      vm.tasks = false;      
      $('.tabs .tab').removeClass('active_tab');
      $('#clients_tab').addClass('active_tab');        
    }, 
    moretasks() {
      vm.workspace = false;
      vm.projects = false;
      vm.clients = false;
      vm.tasks = true;      
      $('.tabs .tab').removeClass('active_tab');
      $('#tasks_tab').addClass('active_tab');        
    }
  }
})

$('.popup').magnificPopup({
  type:'inline',
  fixedContentPos: true, 
  mainClass: 'mfp-fade',      
  showCloseBtn: true,
  closeOnBgClick: false
});   
$('.transaction').magnificPopup({
  type:'inline',
  fixedContentPos: true, 
  mainClass: 'mfp-fade',      
  showCloseBtn: true,
  closeOnBgClick: false
});   

window.onload = function(){         
  if(typeof(webExtensionWallet) === "undefined"){     
        $(".noExtension").show();   
        $(".content").hide();
    }else{
    }
};  


$('.tabs .tab').click(function(){
  $('.tabs .tab').removeClass('active_tab');
  $(this).addClass('active_tab');
});

function listnerTransaction() {
  $('.transaction').trigger('click');
  $('.hash').html('txHash: <p>' + hash_value + '</p>'); 

  interval = setInterval(function reload() {       
      var to = dappAddress;
      var value = 0;
      var callFunction = 'getTasks';
      var callArgs = "[]";    
      nebPay.simulateCall(to, value, callFunction, callArgs, { 
          listener: cbTasks              
      });   
      var callFunction_2 = 'getProjectByDL';
      nebPay.simulateCall(to, value, callFunction_2, callArgs, { 
          listener: cbProjectsDL              
      });   
      var callFunction_3 = 'readcl';
      nebPay.simulateCall(to, value, callFunction_3, callArgs, { 
          listener: cbClients              
      }); 
      $('#transaction button').trigger('click');   
  } , 20000);
}

$(document).ready(function(){  

  // var api = new Neb().api;
  // var txhash = 'a41a142437d4718abf40409ee238cfd84e712fb16dc91468ee790f318bc0814a';
  // neb.api.getTransactionReceipt(txhash, function (err, resp) {
  //     console.log(resp);     
  // });  

  var to = dappAddress;
  var value = 0;
  var callFunction = 'getTasks';
  var callArgs = "[]";    
  nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbTasks              
  });   
  var callFunction_2 = 'getProjectByDL';
  nebPay.simulateCall(to, value, callFunction_2, callArgs, { 
      listener: cbProjectsDL              
  });   
  var callFunction_3 = 'readcl';
  nebPay.simulateCall(to, value, callFunction_3, callArgs, { 
      listener: cbClients              
  });   
   
})

function cbClients(resp) {       
  var result = resp.result;     
  console.log("Clients: " + result);
  result = JSON.parse(result);  
    if (result === ''){           
        $(".errNetwork").show();    
      $(".content").hide();
    } else{             
      try{
        result = JSON.parse(result)
      }catch (err){       
      }
      if (!!result){            
       vm.total_clients = 0;
       var i = 0;

        if (vm.total_projects == 0 || vm.total_clients == 0) {
  $('.column .tasks .add').attr('href', '');
  $('.column .tasks .add').removeClass('popup');
  $('.column .tasks .add').css('opacity', '0.3');
  $('.column .tasks .add').attr('title', 'Before add task you must add project and client');    
} else {
  $('.column .tasks .add').attr('href', '#add_task');
  $('.column .tasks .add').addClass('popup');
  $('.column .tasks .add').css('opacity', '1');
  $('.column .tasks .add').attr('title', '');    
}


       $('#clients').empty();

       $('#workspace .tasks .container').empty();                           
       $('#tasks').empty();

       $('.select_clients select').html('');

       $.each(result,function(index,value){ 
          var project_id = index;          
          var project_arr = result[index];          
          $.each(project_arr,function(index,value){                     
            var client_id = index;
            $('.select_clients select').append('<option data-project="' + project_id + '" value="' + client_id + '">' + project_arr[index].name + '</option>');            
            if (!!project_arr[index].name) {              
              i ++;              
            }            
            $('#clients').append('<div class="client" data-project="' + project_id + '" data-client="' + client_id + '"><h2>' + project_arr[index].name + '</h2><span class="mail"><b>mail:</b> ' + project_arr[index].mail + '</span><span class="phone"><b>phone:</b> ' + project_arr[index].phone + '</span><span class="source"><b>source:</b> ' + project_arr[index].source + '</span><img src="./img/delete.png" class="delete" alt="" /><span><b>goal:</b> ' + project_arr[index].goal + ' </span></div>  ')      
              var tasks_arr = project_arr[index].tasks;
              $.each(tasks_arr,function(index,value){  
                var task_id = index;                       
                if(tasks_arr[index].status == false){                  
                  $('#workspace .tasks .container').append('<div class="task" data-task="' + task_id + '" data-project="' + project_id + '" data-client="' + client_id + '"><h4>' + tasks_arr[index].name + '</h4><p>' + tasks_arr[index].desc + '</p></div>');
                  $('#tasks').append('<div class="task" data-task="' + task_id + '" data-project="' + project_id + '" data-client="' + client_id + '"><h2>' + tasks_arr[index].name + '</h2><span class="description">' + tasks_arr[index].desc + '</span><img src="img/icons8-checkmark-64.png" alt="" class="status disable_status"></div>');
                } else {                  
                  $('#tasks').append('<div class="task" data-task="' + task_id + '" data-project="' + project_id + '" data-client="' + client_id + '"><h2>' + tasks_arr[index].name + '</h2><span class="description">' + tasks_arr[index].desc + '</span><img src="img/icons8-checkmark-64.png" alt="" class="status"></div>');
                }                     
              })                 
          })       
       })
       vm.total_clients = i;   

             // remove: function (indexP,i) 
      $('.delete').click(function(){
        var to = dappAddress;
        var value = 0;
        var callFunction = 'remove';
        var args = [];    
        var proj_id = $(this).parent().attr('data-project');  
        var client_id = $(this).parent().attr('data-client');  
        args.push(proj_id);
        args.push(client_id);  
        var callArgs = JSON.stringify(args);         
        nebPay.call(to, value, callFunction, callArgs, { 
            listener: cbTest            
        });   
      })

       $('#clients').append('<a href="#add_client" class="add_global add popup">+</a>');        
        $('.popup').magnificPopup({
          type:'inline',
          fixedContentPos: true, 
          mainClass: 'mfp-fade',      
          showCloseBtn: true,
          closeOnBgClick: false
        });   

        $('#tasks').append('<a href="#add_task" class="add_global add popup">+</a>');        
        $('.popup').magnificPopup({
          type:'inline',
          fixedContentPos: true, 
          mainClass: 'mfp-fade',      
          showCloseBtn: true,
          closeOnBgClick: false
        });   

      $('.status').click(function(){
        var to = dappAddress;
        var value = 0;
        var callFunction = 'completeTask';
        var project_id = $(this).parent().attr('data-project');
        var client_id = $(this).parent().attr('data-client');
        var task_id =  $(this).parent().attr('data-task');        
        var args = [];
        args.push(project_id);
        args.push(client_id);
        args.push(task_id);        
        var callArgs = JSON.stringify(args);         
        nebPay.call(to, value, callFunction, callArgs, { 
            listener: cbTasks,
            listener: cbTest
        });   
      })

      }
  }    
}

function cbTasks(resp) {      
  var result = resp.result;       
    if (result === ''){           
        $(".errNetwork").show();    
      $(".content").hide();
    } else{             
      try{
        result = JSON.parse(result)
      }catch (err){       
      }
      if (!!result){                            
        var ttl = 0;
        var actv = 0;
        var cmpltd = 0;        
        $.each(result,function(index,value){                     
            ttl++;
            if(result[index].status == false){
              actv++;              
            } else {
              cmpltd++;              
            }      
        })                
        vm.total_tasks = ttl;
        vm.tasks_active = actv;
        vm.tasks_completed = cmpltd;
      }
  }    
}

function cbProjectsDL(resp) {  
  var result = resp.result;         
    if (result === ''){           
      $(".errNetwork").show();    
      $(".content").hide();
    } else{             
      try{
        result = JSON.parse(result)
      }catch (err){       
      }
      if (!!result){            
        if ( result == 'Error: You dont have any project') {
          vm.total_projects = 0;  
        } else {
          vm.total_projects = result.length;        
        }        
        console.log('total proj: ' + result);

         if (vm.total_projects == 0 || vm.total_clients == 0) {
  $('.column .tasks .add').attr('href', '');
  $('.column .tasks .add').removeClass('popup');
  $('.column .tasks .add').css('opacity', '0.3');
  $('.column .tasks .add').attr('title', 'Before add task you must add project and client');    
} else {
  $('.column .tasks .add').attr('href', '#add_task');
  $('.column .tasks .add').addClass('popup');
  $('.column .tasks .add').css('opacity', '1');
  $('.column .tasks .add').attr('title', '');    
}


        vm.total_cost = 0;
        $('#workspace .projects .container').empty();                    
        $('#projects').empty();        
        $('.select_proj select').html('');
        $.each(result,function(index,value){        
            $('.select_proj select').append('<option value="' + index + '">' + result[index].name + '</option>');               
            $('#projects').append('<div class="project" data-id="' + index + '"><h2>' + result[index].name + '</h2><span class="data">to ' + result[index].deadline + '</span><span class="cost">'+ result[index].cost +'$</span></div>')
            $('#workspace .projects .container').append('<div class="project" data-id="' + index + '"><h4>' + result[index].name + '</h4><p>to ' + result[index].deadline + '</p><span class="price">'+ result[index].cost +'$</span></div>')
            vm.total_cost = vm.total_cost + parseInt(result[index].cost);
        })
        $('#projects').append('<a href="#add_project" class="add_global add popup">+</a>');        
        $('.popup').magnificPopup({
          type:'inline',
          fixedContentPos: true, 
          mainClass: 'mfp-fade',      
          showCloseBtn: true,
          closeOnBgClick: false
        });   
      }
  }    
}

$(".select_proj").click(function(){    
    var active_proj_id = $(this).find('option:checked').val();
    $('.select_clients option').show();
    var active_clients = $(".select_clients option").toArray();
    $.each(active_clients,function(index,value){        
      if ($(active_clients[index]).attr('data-project') == active_proj_id) {
      } else {         
        $(active_clients[index]).hide();              
      }
    })
});

// addTask: function (indexP,i,_task,desc) {
$('#add_task .event').click(function(){
  var to = dappAddress;
  var value = 0;
  var callFunction = 'addTask';
  var args = [];
  var description = $('#add_task textarea').val();
  var project_id = $('#add_task .select_proj option:checked').val();
  var client_id = $('#add_task .select_clients option:checked').val();
  var task_name = $('.task_name').val();
  args.push(project_id);
  args.push(client_id);
  args.push(task_name);
  args.push(description);
  var callArgs = JSON.stringify(args);   
  nebPay.call(to, value, callFunction, callArgs, { 
      listener: cbTest
  });   
})

function cbTest(resp) {
  if (vm.total_projects == 0 || vm.total_clients == 0) {
  $('.column .tasks .add').attr('href', '');
  $('.column .tasks .add').removeClass('popup');
  $('.column .tasks .add').css('opacity', '0.3');
  $('.column .tasks .add').attr('title', 'Before add task you must add project and client');    
} else {
  $('.column .tasks .add').attr('href', '#add_task');
  $('.column .tasks .add').addClass('popup');
  $('.column .tasks .add').css('opacity', '1');
  $('.column .tasks .add').attr('title', '');    
}

  console.log('вот он сука: ' + JSON.stringify(resp));
  console.log('вот он сука: ' + JSON.stringify(resp.txhash))
  hash_value = resp.txhash;
  if (resp.txhash == undefined) {
   } else {
    listnerTransaction();    
  }  
}
// addClient: function (indexP,name,phone,mail,source,goal) { 
$('#add_client .event').click(function(){
  var to = dappAddress;
  var value = 0;
  var callFunction = 'addClient';
  var args = [];  
  var project_id = $('#add_client .select_proj option:checked').val();
  var client_name = $('#add_client .name').val();
  var client_phone = $('#add_client .phone').val();  
  var client_mail = $('#add_client .mail').val();  
  var client_source = $('#add_client .source').val();  
  var client_goal = $('#add_client .goal').val();  
  args.push(project_id);
  args.push(client_name);
  args.push(client_phone);
  args.push(client_mail);
  args.push(client_source);
  args.push(client_goal);
  var callArgs = JSON.stringify(args);   
  nebPay.call(to, value, callFunction, callArgs, { 
      listener: cbTest             
  });   
})


// createProject: function (name,deadline,cost)
$('#add_project .event').click(function(){
  var to = dappAddress;
  var value = 0;
  var callFunction = 'createProject';
  var args = [];    
  var proj_name = $('#add_project .name').val();  
  var proj_deadline = $('#add_project .deadline').val();  
  var proj_cost = $('#add_project .cost').val();  
  args.push(proj_name);
  args.push(proj_deadline);
  args.push(proj_cost);  
  var callArgs = JSON.stringify(args);    
  nebPay.call(to, value, callFunction, callArgs, { 
      listener: cbTest
  });   
})


