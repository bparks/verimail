Verimail
========

Goals
-----

The goals of the project are as follows:
 * It has to be dead simple. I'd say that it has to be so simple that unit
   tests aren't necessary (i.e., that if something is broken, it is
   immediately obviou what it is), but unit tests should happen...soon.
 * It has to work with the existing SMTP standard (or, if that is
   impossible, it must deviate from the SMTP standard as little as
   possible)
 * It must not purport to stop all SPAM (some SPAM is a result of unauthorized
   use of a sending address, others undesired mail received, still others a
   result of compromised machines; verimail only guards against the first)
 * It must accomodate mail servers that neither expect nor use a verimail
   service either during the sending or the receiving of an SMTP conversation

Documentation
-------------

Verimail is a very simple protocol. It receives a TCP connection, responds to
a single message, and immediately closes the connection. The message format is:

   <user> <payload>

where the payload is an encrypted (assymetric encryption, using the public key)
message consisting of the following fields:

   <sending_fqdn> <recieving_fqdn> <nonce>

The nonce is ONLY used to baffle any attempt to reverse-engineer the key from
repeated SMTP conversations. The receiving FQDN is the FQDN of the recipient
email address, NOT the canonical fqdn of the receiving server. The sending
FQDN is whatever the sending server wants to say it is, as the sending server
both generates the payload and validates it against the verimail config rules.

Roadmap
-------

1. Build a server that provides for a completely unsecured conversation. (done)
2. Build a server that secures the "payload"
3. Build a server that verifies that **this server** is sending an authorized
   message
4. Build modules/plugins for common mail servers, including, in order of
   priority, postfix, sendmail, and Exchange.

Support
-------

Join #verimail on Freenode (IRC)

Contributing
------------

Since this project is young, discuss your proposed effort in #verimail FIRST.
Then submit a pull request.

The source code is at http://github.com/bparks/verimail