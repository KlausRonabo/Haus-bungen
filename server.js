var fs = require( 'fs' );
var express = require( 'express' );
var bp = require( 'body-parser' );
var app = express();


var server = app.listen(3000, function() {
  console.log( 'Server gestartet. Port 3000' );
});

// CORS Header
app.use( function( request, response, next ) {
  response.setHeader( 'Access-Control-Allow-Origin', '*' );
  response.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE' );
  next();
});
app.use( express.static( 'files' ) );
app.use( bp.urlencoded({ extended:true })); // POST Daten parsen

// RESTFUL
var getData = function( dataname, callback ) {
  var dataObj;
  fs.readFile( dataname+'.json', function(err,data) {
    try {
      dataObj = JSON.parse( data );
      callback( dataObj[ dataname ] );
    } catch(e) {
      callback( [] );
    }
  });
} // getData
var writeData = function( dataname, dataArray, callback ) {
  var dataObj = {};
  dataObj[ dataname ] = dataArray;
  fs.writeFile( dataname+'.json', JSON.stringify(dataObj), callback );
} // writeData

app.get( '/todos', function( request, response ) {
    getData( 'liste', function( liste ) {
      response.send( {liste:liste } );
    });
});

app.get( '/todos/:id', function( request, response ) {
    var id = request.params.id;
    getData( 'liste', function( liste ) {
      response.send( {liste:[ liste[id] ] } );
    });
});

app.post( '/todos/add', function( request, response ) {
  getData( 'liste', function( todos ) {
    todos.push( request.body );
    writeData( 'liste', todos, function() {
      response.send( {result:true} );
    });
  });
});

app.put( '/todos/:id', function( request, response ) {
  var id = request.params.id;
  getData( 'liste', function( todos ) {
    todos[id] = request.body;
    writeData( 'liste', todos, function() {
      response.send( {result:true} );
    });
  });
});

app.delete( '/todos/:id', function( request, response ) {
  var id = request.params.id;
  getData( 'liste', function( todos ) {
    delete todos[id];
    writeData( 'liste', todos, function() {
      response.send( {result:true} );
    });
  });
});
