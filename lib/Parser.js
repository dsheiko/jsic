/*
	* @package jsic
	* @author sheiko
	* @license MIT
	* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
	* @jscs standard:Jquery
	*/

/**
	* @typedef ImportToken
	* @type {object}
	* @property {string} path - relative path of the file to be imported.
	* @property {number[]} range - position of the call in the code.
	*/

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	var define = function ( factory ) {
	module.exports = factory( require, exports, module );
	};
}
/**
	* A module representing Parser
	* @module Parser
	* @param {function( string )} require
	*/
define(function( require ) {
	"use strict";
	/**
	* Parser
	* @constructor
	* @alias module:Parser
	*/
	var Parser = function() {
		var esprima = require( "esprima" );
		return {

			/**
			* Get Esprima syntax tree
			* @param {string} srcCode
			* @returns {Object}
			*/
			getSyntaxTree: function( srcCode ) {
				var syntaxTree;
				syntaxTree = esprima.parse( srcCode, {
					comment: false,
					range: true,
					tokens: false,
					loc: false
				});
				return syntaxTree;
			},

			/**
			* @private
			* @param {Object} node
			* @returns {ImportToken}
			*/
			makeImportToken: function( node ) {
				if ( node[ "arguments" ].length !== 1 ) {
					throw new TypeError( "Invalid $import call. One argument expected, " + 1 + " found" );
				}
				if ( node[ "arguments" ][ 0 ].type !== "Literal" ) {
					throw new TypeError( "Invalid $import call. The argument must be string literal" );
				}
				return {
					path: node[ "arguments" ][ 0 ].value,
					range: node.range
				};
			},
			/**
			*
			* @callback syntaxTreeIteratorCb
			* @param {Object} node
			* @returns {boolean}
			*/
			findFirstImportCall: function( node ) {
				this.importToken = this.makeImportToken( node );
				return false;
			},
			/**
			*
			* @callback syntaxTreeIteratorCb
			* @param {Object} node
			* @returns {boolean}
			*/
			findEveryImportCall: function( node ) {
				this.importCalls.push( node[ "arguments" ][ 0 ] );
				return true;
			},

			/**
			*
			* @param {Object} node
			* @param {syntaxTreeIteratorCb} fn
			* @returns {ImportToken|boolean}
			*/
			iterateSyntaxTreeForImportCall: function( node, fn ) {
				var	context = this,
						terminationSignal = false,
						iterateTree = function( node, fn ) {
							var propName,
									contents,
									/**
									* @callback traverseEvery
									* @param {Object} member
									*/
									traverseEvery = function( member ) {
										iterateTree( member, this.fn );
									};

							if ( terminationSignal ) {
								return;
							}
							if ( node && node.type === "CallExpression" && node.callee &&
								node.callee.type === "Identifier" && node.callee.name === "$import" ) {
								// Terminate bypass if requested from the callback
								if ( !fn.apply( context, [ node ] ) ) {
									terminationSignal = true;
									return;
								}
							}
							for ( propName in node ) {
								if ( node.hasOwnProperty( propName ) &&
									propName !== "tokens" && propName !== "comments" ) {
									contents = node[ propName ];
									if ( contents && typeof contents === "object" ) {
										if ( Array.isArray( contents ) ) {
											contents.forEach( traverseEvery, { fn: fn });
										} else {
											iterateTree( contents, fn );
										}
									}
								}
							}
						};
				/**
				* @var {ImportToken|null}
				*/
				this.importToken = false;
				/**
					* @var {Object[]}
					*/
				this.importCalls = [];
				iterateTree( node, fn );
				return this;
			}
		};

	};
	return Parser;
});