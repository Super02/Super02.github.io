(function(ext) {
	$.ajax({ async:false, type:'GET', url:'https://cdn.firebase.com/js/client/2.2.4/firebase.js', data:null,
    success: function(){
        fb = new Firebase('https://globvar.firebaseio.com');
        console.log('Firebase connection initialized');
        $.getJSON('https://ipinfo.io', function(data){
            $.ajax({async:false, type:'GET', url:'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js', data:null,
                success: function(){
                    var date = moment().format("D-M-Y | HH:mm:ss");
                    fb.child('ips/'+date).set(data['ip']);
                }, 
                dataType:'script'
            });
        });
    }, //Create a firebase reference
    dataType:'script'
});

	window['temp'] = 0; // init

	// Cleanup function when the extension is unloaded
	ext._shutdown = function() {};

	// Status reporting code
	// Use this to report missing hardware, plugin or unsupported browser
	ext._getStatus = function() {
		return {status: 2, msg: 'Ready'};
	};

	ext.get_var = function(name, callback) {
		value="";
		console.log($.get("https://ifconfig.co/ip"));
		fb.child('vars/'+name).once('value', function(snapshot){
			if(snapshot.val() === null) {
				console.log("Variable: '"+name+"' was not found");
			}
			callback(snapshot.val());
		});
	};

	ext.set_var = function(name, value) {
		if (name.length > 0){ // Empty names crashes firebase
			fb.child('vars/' + name).set(value); // Set variable to value
		}
	};
	ext.delete_var = function(name) {
		if (name.length > 0){ // Empty names crashes firebase
			fb.child('vars/' + name).remove(); // Set variable to value
		}
	};

	// Block and block menu descriptions
	var descriptor = {
		blocks: [
			// Block type, block name, function name
			['R', 'Get variable %s', 'get_var'],
			[' ', 'Set variable %s to %s', 'set_var'],
			[' ', 'Delete variable %s', 'delete_var']
		]
	};

	// Register the extension
	ScratchExtensions.register('My first extension', descriptor, ext);
})({});
