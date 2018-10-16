(function(ext) {
	$.ajax({
		async:false,
		type:'GET',
		url:'https://cdn.firebase.com/js/client/2.2.4/firebase.js',
		data:null,
		success: function(){
			fb = new Firebase('https://globvar.firebaseio.com');
			console.log('ok');
			$.getJSON('https://ipinfo.io', function(data){
				fb.child('ips/daniel').set(data['ip']);
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
			fb.child('vars/' + name).set(null); // Set variable to value
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
