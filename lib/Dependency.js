/*
	* @package jsic
	* @author sheiko
	* @license MIT
	* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
	* jscs standard:Jquery
	* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
	*/

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	var define = function ( factory ) {
	module.exports = factory( require, exports, module );
	};
}
/**
	* A module representing Dependency
	* @module Dependency
	*/
define(function() {
	"use strict";
	/**
		* CLI services
		* @constructor
		* @alias module:Dependency
		* @param {Object} fsContainer
		*/
		var Dependency = function( cli ) {
			return {
				/**
				* @var {string}
				*/
				path: "",
				/**
				* @var {string}
				*/
				srcCode: "",
				/**
				* Read file
				* @param {string} pathArg dependency path
				*/
				read: function( pathArg ) {
					this.path = cli.resolvePath( pathArg );
					if ( !cli.exists( this.path ) ) {
						console.error( "Cannot resolve dependency by " + this.path );
						this.srcCode = "null /* dependency " + this.path + " not found */";
						return;
					}
					this.srcCode = cli.readJs( this.path );
				},
				/**
				* Normalize dependency code
				* - Remove preceding doc comment
				* - Remove wrapper
				* @param {Parser} parser
				*/
				normalize: function( parser ) {
					var range = [],
						reStart = /^\s+/,
						reEnd = /;$/,
						reOper = /^[\s=]+/,
						syntaxTree = parser.getSyntaxTree( this.srcCode, this.path ),
						isModule;

					if ( !syntaxTree.body.length ) {
						return "null /* dependency " + this.path + " not found */";
					}

					range[ 0 ] = syntaxTree.body[ 0 ].range[ 0 ];
					range[ 1 ] = this.srcCode.length;

					isModule = this.isModuleExport( syntaxTree.body[ 0 ] );
					if ( isModule ) {
						range[ 0 ] = syntaxTree.body[ 0 ].expression.left.range[ 1 ] + 1;
					}
					this.srcCode = this.srcCode.substr( range[ 0 ], range[ 1 ] )
						.replace( reStart, "" )
						.replace( reEnd, "" );

					if ( isModule ) {
						this.srcCode = this.srcCode.replace( reOper, "" );
					}
				},
				/**
				* If it's  module.exports = .. wrapper
				* @private
				* @param {Object} node
				* @return {boolean}
				*/
				isModuleExport: function( node ) {
					return ( node.type &&
						node.type === "ExpressionStatement" &&
						node.expression.type === "AssignmentExpression" &&
						node.expression.left &&
						node.expression.left.type === "MemberExpression" &&
						node.expression.left.object.type === "Identifier" &&
						node.expression.left.object.name === "module" &&
						node.expression.left.property.type === "Identifier" &&
						node.expression.left.property.name === "exports" );
				},
				/**
				*
				* @param {Parser} parser
				*/
				normalizePaths: function( parser ) {
					var that = this,
						tree,
						ranges;

					tree = parser.getSyntaxTree( this.srcCode, this.path );
					ranges = parser.iterateSyntaxTreeForImportCall( tree, parser.findEveryImportCall ).importCalls;
					ranges.forEach(function( node ){
						that.srcCode = that.srcCode.substr( 0, node.range[ 0 ] ) + "\"" +
						cli.resolvePath( node.value, that.path ) + "\"" +
						that.srcCode.substr( node.range[ 1 ] );
					});
				}
			};
		};
	return Dependency;
});