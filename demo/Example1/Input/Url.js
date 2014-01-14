					/**
					 * @constructor
					 * @param {string} value
					 */
					module.exports = function( value ) {
								 return {
										 name : "Form_Input_Url",
										 /**
											 * Validate input value
											 *
											 * @public
											 * @memberof Input.Url
											 * @return {object} ValidationLogger
											 */
										 validateValue: function() {
												 // The pattern is taken from
												 // http://stackoverflow.com/questions/2838404/javascript-regex-url-matching
												 // pattern fragments: protocol, domain name OR ip (v4) address, port and path,
												 // query string, fragment locater
												 var pattern = /^..$/i;
												 if ( !pattern.test( value ) ) {
														 throw new Error("Please enter a valid URL");
												 }
										 }
								 };
					};