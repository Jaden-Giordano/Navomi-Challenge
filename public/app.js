var fb_provider = new firebase.auth.FacebookAuthProvider();
var g_provider = new firebase.auth.GoogleAuthProvider();
var tw_provider = new firebase.auth.TwitterAuthProvider();

let storeName = 'firebase:authUser:';
let displayName = 'Random User';
let photoURL = '';

$('#facebook-login').click(function(e) {
	e.preventDefault();
	firebase.auth().signInWithPopup(fb_provider).then(function(result) {
		var token = result.credential.accessToken;
		var user = result.user;

		if (storeName !== 'firebase:authUser:') {
			delete localStorage[storeName];
		}

		storeName = storeName + user.m + ':[DEFAULT]';
		var obj = JSON.parse(localStorage[storeName])
		displayName = obj.displayName;
		if (obj.photoURL)
			photoURL = obj.photoURL;
	});
});

$('#google-login').click(function(e) {
	e.preventDefault();
	firebase.auth().signInWithPopup(g_provider).then(function(result) {
		var token = result.credential.accessToken;
		var user = result.user;

		if (storeName !== 'firebase:authUser:') {
			delete localStorage[storeName];
		}

		storeName = storeName + user.m + ':[DEFAULT]';
		var obj = JSON.parse(localStorage[storeName])
		displayName = obj.displayName;
		if (obj.photoURL)
			photoURL = obj.photoURL;
	});
});

$('#twitter-login').click(function(e) {
	e.preventDefault();
	firebase.auth().signInWithPopup(tw_provider).then(function(result) {
		var token = result.credential.accessToken;
		var user = result.user;

		if (storeName !== 'firebase:authUser:') {
			delete localStorage[storeName];
		}

		storeName = storeName + user.m + ':[DEFAULT]';
		var obj = JSON.parse(localStorage[storeName])
		displayName = obj.displayName;
		if (obj.photoURL)
			photoURL = obj.photoURL;
	});
});

$('#text-form').submit(function(e) {
	e.preventDefault();
	var text = $('#content').val();

	$('#chat-items').append(`
		<li>
			<img src="${photoURL}" width="24px" height="24px" style="border-radius: 50%;" /><span style="color: red">${displayName}: </span><span>${text}</span>
		</li>
	`);
	$('#content').val('');

	$.post('/inform', { content: text }, function(data) {
		$('#chat-items').append(`
			<li>
				<i class="fa fa-grav" style="font-size: 1.5em;" aria-hidden="true"></i><span style="color: blue">Someguy: </span><span>${data.response}</span>
			</li>
		`);
	});
	return false;
});
