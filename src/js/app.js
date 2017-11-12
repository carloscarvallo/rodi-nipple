import nipple from 'nipplejs'

(function() {

    var rodi = {
        url: 'http://192.168.4.1:1234/',
        blinkUri: '1',
        moveUri: '3',
        seeUri: '5',
        blink: function (milliSec) {
            fetch(this.url + this.blinkUri + `/${milliSec}`)
                .then(() => { })
                .catch(errHandler)
        },
        stopBlink: function () {
            fetch(this.url + this.blinkUri + '/0')
                .then(() => { })
                .catch(errHandler)
        },
        forward: function () {
            fetch(this.url + this.moveUri + '/100/100')
                .then(() => { })
                .catch(errHandler)
        },
        back: function () {
            fetch(this.url + this.moveUri + '/-100/-100')
                .then(() => { })
                .catch(errHandler)
        },
        right: function () {
            fetch(this.url + this.moveUri + '/100/-100')
                .then(() => { })
                .catch(errHandler)
        },
        left: function () {
            fetch(this.url + this.moveUri + '/-100/100')
                .then(() => { })
                .catch(errHandler)
        },
        stop: function () {
            fetch(this.url + this.moveUri + '/0/0')
                .then(() => { })
                .catch(errHandler)
        },
        frontView: function () {
            fetch(this.url + this.seeUri)
                .then(function (response) {
                    return response.text();
                })
                .then(function (text) {
                    debug('Request successful', text);
                })
                .catch(errHandler);
        }
    }
    
    var debug = console.log.bind(console)

    var errHandler = function (error) {
        debug('Request failed', error)
    }

    var eId = document.getElementById('zone_joystick')

    var options = {
        zone: eId,
        mode: 'static',
        size: 200,
        position: {
            left: '50%',
            top: '50%'
        },
        color: 'blue'
    }

    var joystick = nipple.create(options)


    var startStopHandler = function (event) {
        debug("event", event.type)
        if (event.type === 'start') {
            rodi.frontView()
        }
        if (event.type === 'end') {
            rodi.stop()
            rodi.stopBlink()
        }
    }

    var dirHandler = function (event) {
        debug("event", event.type)
        if (event.type == 'dir:up') {
            rodi.forward()
            rodi.stopBlink()
        }

        if (event.type == 'dir:right') {
            rodi.right()
            rodi.blink(500)
        }

        if (event.type == 'dir:left') {
            rodi.left()
            rodi.blink(500)
        }

        if (event.type == 'dir:down') {
            rodi.back()
            rodi.blink(500)
        }
    }

    var bindJoystick = function () {
        joystick
            .on('start end', startStopHandler)
            .on('dir:up dir:left dir:down dir:right', dirHandler)
    }

    bindJoystick()

})( nipple )
