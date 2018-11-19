var nrfuart = require('./nrfuart.js');
 
nrfuart.discoverAll(function(ble_uart) {
    // enable disconnect notifications
    ble_uart.on('disconnect', function() {
        console.log('disconnected!');
    });
 
    // connect and setup
    ble_uart.connectAndSetup(function() {
        var writeCount = 0;
 
        console.log('connected!');
 
        ble_uart.readDeviceName(function(devName) {
            console.log('Device name:', devName);
        });
 
        ble_uart.on('data', function(data) {
            console.log('received:', data.toString());
        });
 
        setTimeout(function() {
            var TESTPATT = 'setTime('+(new Date().getTime()/1000).toString()+') \n'
            ble_uart.write(TESTPATT, function() {
                console.log('data sent:', TESTPATT);
                ble_uart.write('incMode()\n');
            });
        }, 3000);
    });
});

