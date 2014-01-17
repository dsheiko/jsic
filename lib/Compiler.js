/*
	* @package jsic
	* @author sheiko
	* @license MIT
	* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
	* @jscs standard:Jquery
	*/

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	var define = function ( factory ) {
	module.exports = factory( require, exports, module );
	};
}
/**
	* A module representing Compiler
	* @module Compiler
	*/
define(function() {
	"use strict";
	/**
		* Compiler
		* @constructor
		* @alias module:Compiler
		* @param {Parser} parser
		* @param {Dependency} dependency
		*/
	var Compiler = function( parser, dependency ) {

		var
		/**
		* @private
		* @var {number}
		*/
		importCount = 0,
		/**
		* @private
		* @var {importTokenCache[]}
		*/
		importTokenCache = [];

		return {
			/**
			* @param {string} srcCode
			* @param {string} pathArg
			* @returns {Object}
			*/
			run: function( srcCode, pathArg ) {
				var nextMatch = function() {
						var serialized,
								it,
								tree;

						try {
							tree = parser.getSyntaxTree( srcCode );
						} catch( e ) {
							if ( importCount ) {
								console.error( "Could not build a valid JavaScript" );
							} else {
								console.error( "Apparently your source code " +
									"('" + pathArg + "') isn't valid EcmaScript (" + e.message + "). " );
							}
							process.exit( 1 );
						}
						it = parser.iterateSyntaxTreeForImportCall( tree, parser.findFirstImportCall );

						if ( !it.importToken ) {
							return false;
						}

						serialized = JSON.stringify( it.importToken );

						if ( importTokenCache.indexOf( serialized ) !== -1 ) {
							return false;
						}

						importTokenCache.push( serialized );
						depToken = it.importToken;

						return true;
					},
					depToken;

				while( nextMatch() ) {

					importCount++;
					dependency.read( depToken.path );
					dependency.normalizePaths( parser );
					dependency.normalize( parser );
					srcCode = this.resolve( srcCode, depToken.range, dependency.srcCode );
				}
				console.log( importCount + " dependency(ies) resolved" );
				return srcCode;
			},
			/**
			*
			* @param {string} srcCode
			* @param {number[]} range
			* @param {string} depCode
			* @returns {string}
			*/
			resolve: function( srcCode, range, depCode ) {
				var re = /;\s*$/;
				return srcCode.substr( 0, range[ 0 ] ) + depCode.replace( re, "" ) + srcCode.substr( range[ 1 ] );
			}
		};
	};

	return Compiler;

});