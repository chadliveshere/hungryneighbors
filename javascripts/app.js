$(document).ready(function(){

  HungryInstagram();

});

var HungryInstagram = function(){

  var token = '2428028216.1677ed0.aeb9b015ffdb4c7abf6fd9845974ec29'; // learn how to obtain it below
  var userid = 2428028216; // User ID - get it in source HTML of your Instagram profile or look at the next example :)
  var num_photos = 4; // how much photos do you want to get

  $.ajax({
  	url: 'https://api.instagram.com/v1/users/' + userid + '/media/recent', // or /users/self/media/recent for Sandbox
  	dataType: 'jsonp',
  	type: 'GET',
  	data: {access_token: token, count: num_photos},
  	success: function(data){
   		console.log(data);
  		for( x in data.data ){

        var formatDate = moment(data.data[x].created_time, 'X').fromNow();

        var instaPhoto = '<div class="thumbnail-image" style="background-image: url('+data.data[x].images.low_resolution.url+')"></div>';
        var instaDate = '<h2 class="thumbnail-category">'+formatDate+'</h2>';
        var instaCaption = '<p class="thumbnail-text thumbnail-text-instagram">'+data.data[x].caption.text+'</p>';
        var instaTemplate = '<li class="column large-3 small-6">'+ instaPhoto + instaDate + instaCaption +'</li>';

        $('[data-instagram=true]').append(instaTemplate);

  		}
  	},
  	error: function(data){
  		console.log(data); // send the error notifications to console
  	}
  });

}