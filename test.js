/* test.js for verimail
//
// Copyright (c) 2013 Synapse Software
// Authors: Brian Parks
// Licensed under the GNU GPL v. 3. Most importantly, modifications must be released to
//     the community under an equivalent or less-restrictive license
*/

console.log('Starting verimail 0.0.1');
console.log('Copyright (c) 2013 Synapse Software');

var config = require('./config');

var net = require('net'),
    ursa = require('ursa'),
    fs = require('fs');

var rsaPublic = fs.readFileSync("rsa.public", 'ascii'),
    pubkey = ursa.createPublicKey(rsaPublic, "utf8");

[
	["bparks", "localhost localhost nonce", "YES"],
	["bparks", "mail.synapsesoftware.net localhost nonce", "YES"],
	["jdoe", "localhost localhost nonce", "NO"]
].forEach(function(value, index) {
	var encrypted = pubkey.encrypt(value[1], 'utf8', 'hex'),
	    client = net.connect({port: 2026}, function() {
	    	client.write(value[0] + ' ' + encrypted + "\r\n");
	    }).on('data', function(data) {
	    	if (data.toString().trim() == value[2])
	    		console.log("Test " + (index+1) + ": Success");
	    	else
	    		console.log("Test " + (index+1) + ": Failed. Expected " + value[2] + ", got " + data.toString().trim());
	    });
});