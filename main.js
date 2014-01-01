/* verimail: A simple server to allow remote mail servers to validate that email addresses
//           are the true origin for a given piece of mail
// Copyright (c) 2013 Synapse Software
// Authors: Brian Parks
// Licensed under the GNU GPL v. 3. Most importantly, modifications must be released to
//     the community under an equivalent or less-restrictive license
*/

console.log('Starting verimail 0.0.1');
console.log('Copyright (c) 2013 Synapse Software');

/** Configuration */
permittedHosts = [
	'mail.synapsesoftware.net',
	'localhost', // It's probably a bad idea NOT to have localhost in this list...
	'127.0.0.1'  // Same with the local IP
	// NOTE WELL that failing to use the actual remote IP on the recipient server side
	// essentially makes all of this checking useless -- why WOULDN'T an imposter just
	// use 'mail.targetdomain.tld' as its HELO?
];
rules = {
	'bparks' : {
		permittedHosts: null, //Use global permittedHosts (false)
		allowUnauthorizedMail: false //If it doesn't pass validation, give NO (default)
	},
	'*' : { //Rules for all other names
		permittedHosts: [] //Nobody can send mail as these addresses
	}
}
/** End configuration */

/** Utilties */
loglevel = { INFO: 'INFO', WARN: 'WARN', DEBUG: 'DEBUG', ERROR: 'ERROR'};

function log_entry(level, message) {
	console.log(Date.now().toString() + " [" + level + "]: " + message);
}
/** End utilities */

var net = require('net');

var server = net.createServer(function(socket) {
	log_entry(loglevel.INFO, "Connection from " + socket.address());

	socket.on('data', function (data) {
		var strData = data.toString().trim();
		log_entry(loglevel.DEBUG, strData);
		var rq = strData.split(' ');
		if (rq[0] == '*') { //This is invalid (could be cheating or just bad)
			log_entry(loglevel.DEBUG, "'*' is not a valid username");
			return socket.end('NO\r\n');
		}
		if (!(rq[0] in rules) && !('*' in rules)) { //If there is no wildcard rule, the answer is NO
			log_entry(loglevel.DEBUG, "No rule for user '"+rq[0]+"' and no wildcard rule");
			return socket.end('NO\r\n');
		}
		var ruleSet = rq[0] in rules ? rules[rq[0]] : rules['*'];

		var allPermittedHosts = permittedHosts ? permittedHosts : [];
		if (('permittedHosts' in ruleSet) && ruleSet['permittedHosts'] && ruleSet['permittedHosts'].length)
			allPermittedHosts.push(ruleSet['permittedHosts']);
		log_entry(loglevel.DEBUG, "Permitted hosts for user '"+rq[0]+"': " + allPermittedHosts);
		log_entry(loglevel.DEBUG, "Looking for '"+rq[1]+"'");
		if (allPermittedHosts.indexOf(rq[1]) < 0) {
			//Sorry. This host is not authorized to send mail for the given user
			if (ruleSet['allowUnauthorizedMail'])
				return socket.end('ALLOW\r\n');
			else
				return socket.end('NO\r\n');
		}
		//Well, none of the checks have found it to be invalid. Must be OK
		return socket.end('YES\r\n');
	});

	//NO - The given machine does not have authority to send mail from this address
	//YES - The given machine has authority to send mail from this address
	//ALLOW - The given email address may occasionally break the rules and send from
	//  machines that don't play by these rules.
	//  (NOTE: 'ALLOW' should not be used as an alternate form of 'NO'. The ONLY
	//	case in which 'ALLOW' should be treated differently from 'YES' is in
	//  SPAM filters: 'YES' should ALWAYS be treated as non-SPAM, while 'ALLOW'
	//  should cause normal SPAM checking)
}).listen(26);