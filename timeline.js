/* eslint-disable linebreak-style */
/* eslint-disable no-console */

var winkNLP = require( '../src/wink-nlp.js' );
var its = require( '../src/its.js' );
var nlp = winkNLP( );
nlp.load( 'en' );
var fs = require( 'fs' );
var text = fs.readFileSync( 'C:/Users/hp/Desktop/Graype/michelleO.txt', 'utf8' ); // eslint-disable-line no-sync
var doc = nlp.readDoc( text );

var year;
var dup = { };
var timeline = [ ];
doc.sentences( )
   .each( ( s, index ) => {
            s.entities( )
             .each( ( e ) => {
               if ( e.out( ).type === '#DATE' ) {
                 if ( e.tokens( ).out( its.shape ).indexOf( 'dddd' ) >= ( 0 ) ) {
                    e.tokens( )
                     .each( ( t ) => {
                       if ( t.out( its.shape ) === 'dddd' )
                         year = t.out( );
                      } );
                     timeline.push( { text: e.out( ).text, type: e.out( ).type, year: year, sid: index } );
                  } else {
                     e.tokens( )
                      .each( ( t ) => {
                        timeline.push( { text: t.out( ) + ' ' + year, type: '#DATE', year: year, sid: index } );
                      } );
                  }
                }
              } );
            } );

timeline.sort(  ( a, b ) => ( a.year - b.year ) );
var t = timeline.filter( ( e ) => {
                              dup[ e.sid ] = 1 + ( dup[ e.sid ] || 0 );
                              return dup[ e.sid ] === 1;
                            } );
t.forEach( ( e ) => {
  console.log( '\x1b[0m\x1b[32m' + e.year + '\x1b[37m\x1b[2m' );
   console.log( doc.sentences( ).itemAt( e.sid ).out( ) );
   console.log( );
} );
// console.log( t );
