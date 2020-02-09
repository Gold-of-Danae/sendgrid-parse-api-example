var inbound = {
  handler: function (request) {
    var envelope;
    var to;
    var payload   = request.payload;

    console.log(payload);

    if (payload.envelope) { envelope = JSON.parse(payload.envelope) };
    if (envelope)         { to = envelope.from; }

    var Email     = sendgrid.Email;
    var email     = new Email({
      to:       "daniellamlatham@gmail.com",
      from:     "inbound@daniellalatham.com",
      subject:  "[Incoming Email] From:" + to + " Subject: " + payload.subject,
      html:     payload.html
    });

    //email.addFile({
    //  filename: 'payload.txt',
    //  content: new Buffer(JSON.stringify(payload))
    //});

    sendgrid.send(email, function(err, json) {
      if (err) { 
        console.error(err);
        request.reply({ success: false, error: {message: err.message} });
      } else {
        request.reply({ success: true });
      }
    });
  }
};

server.addRoute({
  method  : 'POST',
  path    : '/inbound',
  config  : inbound
});
