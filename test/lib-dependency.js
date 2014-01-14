/*jshint -W068 */
/*jshint multistr: true */
var Dependency = require( "../lib/Dependency" ),
		fixture = require( "./inc/fixture" );

require( "should" );



describe( "Dependency", function () {
  var dependency;

  beforeEach(function(){
    dependency = new Dependency();
  });

  it("must remove module wrapper and the doc comment", function () {
		var code = fixture.getText( "Dependency/case1.js" ),
				tree =	fixture.getJson( "Dependency/case1.json" ),
				parserStub = {
					getSyntaxTree: function() {
						return tree;
					}
				};
		dependency.srcCode = code;
		dependency.isModuleExport( tree.body[ 0 ] ).should.be.ok;
		dependency.normalize( parserStub );
		dependency.srcCode.should.eql( "function( value ) {\n }" );
  });

	it("if no wrapper it still must be ok", function () {
		var code = fixture.getText( "Dependency/case2.js" ),
				tree =	fixture.getJson( "Dependency/case2.json" ),
				parserStub = {
					getSyntaxTree: function() {
						return tree;
					}
				};
		dependency.srcCode = code;
		dependency.isModuleExport( tree.body[ 0 ] ).should.not.be.ok;
		dependency.normalize( parserStub );
		dependency.srcCode.should.eql( "var a = 1" );
  });

});


