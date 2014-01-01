/** Configuration */
//port = 26;
exports.port = 2026;
exports.passphrase = '';
exports.permittedHosts = [
	'mail.synapsesoftware.net',
	'localhost', // It's probably a bad idea NOT to have localhost in this list...
	'127.0.0.1'  // Same with the local IP
	// NOTE WELL that failing to use the actual remote IP on the recipient server side
	// essentially makes all of this checking useless -- why WOULDN'T an imposter just
	// use 'mail.targetdomain.tld' as its HELO?
];
exports.rules = {
	'bparks' : {
		permittedHosts: null, //Use global permittedHosts (false)
		allowUnauthorizedMail: false //If it doesn't pass validation, give NO (default)
	},
	'*' : { //Rules for all other names
		permittedHosts: false //Nobody can send mail as these addresses
	}
}
/** End configuration */