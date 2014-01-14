/*jshint -W068 */
/*jshint multistr: true */
var Parser = require( "../lib/Parser" ),
		fixture = require( "./inc/fixture" );

require( "should" );

describe( "Parser.findFirstImportCall", function () {
  var parser;
  beforeEach(function(){
    parser = new Parser();
  });

  it("must find the first import instruction", function () {
		var tree =	fixture.getJson( "Parser/case1.json" );
		parser.iterateSyntaxTreeForImportCall( tree, parser.findFirstImportCall )
				.importToken.should.eql( { path: "./Form/Input/Tel", range: [ 174, 201 ] } );
  });
});
describe( "Parser.findEveryImportCall", function () {
  var parser;
  beforeEach(function(){
    parser = new Parser();
  });

  it("must find all the import instructions", function () {
		var tree =	fixture.getJson( "Parser/case2.json" ),
				ranges = parser.iterateSyntaxTreeForImportCall( tree, parser.findEveryImportCall ).importCalls;
		ranges.length.should.eql( 2 );
		ranges[ 0 ].value.should.eql( "case1" );
		ranges[ 1 ].value.should.eql( "case2" );
  });
});


