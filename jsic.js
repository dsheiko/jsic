var main = require( "./jsic-module" );
try {
 main( process.argv );
} catch ( err ) {
  console.error( err.message || err );
}
