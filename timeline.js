/* eslint-disable linebreak-style */
/* eslint-disable no-console */

var winkNLP = require( 'wink-nlp' );
var model = require( 'wink-eng-lite-model' );
var its = require( 'wink-nlp/src/its.js' );
var nlp = winkNLP( model );
var fs = require( 'fs' );
var text = fs.readFileSync( 'michelleO.txt', 'utf8' ); // eslint-disable-line no-sync
var doc = nlp.readDoc( text );

var year;
var dup = {};
var timeline = [];
doc.sentences()
   .each( ( sentence, index ) => {
     sentence.entities()
             .filter( ( entity ) => ( entity.out().type === '#DATE' ) )
             .each( ( entity ) => {
               let yearIndex = entity.tokens().out( its.shape ).indexOf( 'dddd' );
               if ( yearIndex >= 0 ) {
                 year = entity.tokens().itemAt( yearIndex ).out();
                 timeline.push( { text: entity.out().text, year: year, sid: index } );
               } else {
                  timeline.push( { text: entity.out().text + ' ' + year, year: year, sid: index } );
               }
             } ); // each( ( entity )...
    } ); // each( ( sentence, index )...

timeline.sort( ( a, b ) => ( a.year - b.year ) );
timeline = timeline.filter( ( date ) => {
                     dup[ date.sid ] = 1 + ( dup[ date.sid ] || 0 );
                     return dup[ date.sid ] === 1;
                   } ); // filter( ( date )...
// -- wink-nlp code ends here --

// Print Date and corresponding sentence on console
timeline.forEach( ( date ) => {
           console.log( '\x1b[0m\x1b[32m' + date.year + '\x1b[37m\x1b[2m' );
           console.log( doc.sentences().itemAt( date.sid ).out() );
           console.log();
        } );

// Markup Date and money entities and return JSON
// var finalEvents = [];
// timeline.forEach( ( date ) => {
//            var event = nlp.readDoc( doc.sentences().itemAt( date.sid ).out() );
//            event.entities()
//                 .each( ( entity ) => {
//                   if ( entity.out().type === '#DATE'|| entity.out().type === '#MONEY' ) {
//                     entity.markup( '<em>', '</em>' );
//                   }
//                 } );
//            finalEvents.push( {text: event.markedUpText(), year: date.year})
//         } );
// console.log(JSON.stringify(finalEvents, null, 2));

// Print with marked entities on console
// timeline.forEach( ( date ) => {
//             var event = nlp.readDoc( doc.sentences().itemAt( date.sid ).out() );
//             event.entities()
//                  .each( ( entity ) => {
//                    if ( entity.out( ).type === '#DATE'|| entity.out( ).type === '#MONEY' ) {
//                       entity.markup( '<em>', '</em>' );
//                    }
//                   } );
//             console.log( '\x1b[0m\x1b[32m' + date.year + '\x1b[37m\x1b[2m' );
//             console.log( event.markedUpText() );
//             console.log();
//             } );
