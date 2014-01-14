/*
 * @package jscs
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */

var Form = (function( global  ){
	"strict mode";
			var
				 /**
					* Input type custom validators
					* @namespace
					*/
				 Input = {
					/**
					 * @constructor
					 * @param {string} value
					 */
					 Tel: $import( "./Example1/Input/Tel" ),
					/**
					 * @constructor
					 * @param {string} value
					 */
					 Url: $import( "./Example1/Input/Url" )
				 },
				 telInpInstance = new Input.Tel( "" ),
				 urlInpInstance = new Input.Url( "" );

			console.log( telInpInstance.name, urlInpInstance.name ); // Form_Input_Tel Form_Input_Url

}( this ));
