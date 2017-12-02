import nipple from 'nipplejs'
import css from '../css/style.css'

(function() {

    /**
     * Rodi is the object that contains actions that Rodi can do (not all of them yet)
     */

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

    // debugger to the console
    var debug = console.log.bind(console)

    // Error Handler for the Fetch Promise
    var errHandler = function (error) {
        debug('Request failed', error)
    }

    // Return selectors
    var sId = function (sel) {
        return document.getElementById(sel);
    }

    // Basic configurations for Nipplejs
    var options = {
        zone: sId('zone_joystick'),
        mode: 'static',
        size: 200,
        position: {
            left: '50%',
            top: '50%'
        },
        color: 'blue'
    }

    // Creates the Nipple (Joystick) based on the options
    var joystick = nipple.create(options)

    /**
     * Creates the object that is used for the frontend mapping, see: https://codepen.io/YoannM/pen/gapmMG
     */

    var elDebug = sId('debug');
    var elDump = elDebug.querySelector('.dump');
    var els = {
        position: {
            x: elDebug.querySelector('.position .x .data'),
            y: elDebug.querySelector('.position .y .data')
        },
        force: elDebug.querySelector('.force .data'),
        // pressure: elDebug.querySelector('.pressure .data'),
        distance: elDebug.querySelector('.distance .data'),
        angle: {
            radian: elDebug.querySelector('.angle .radian .data'),
            degree: elDebug.querySelector('.angle .degree .data')
        },
        direction: {
            x: elDebug.querySelector('.direction .x .data'),
            y: elDebug.querySelector('.direction .y .data'),
            angle: elDebug.querySelector('.direction .angle .data')
        }
    }

    /**
     * Prints Nipple data on the frontend based on the events , see more on: https://codepen.io/YoannM/pen/gapmMG
     */

    var print = function (obj) {
        function parseObj(sub, el) {
            for (var i in sub) {
                if (typeof sub[i] === 'object' && el) {
                    parseObj(sub[i], el[i]);
                } else if (el && el[i]) {
                    el[i].innerHTML = sub[i];
                }
            }
        }
        setTimeout(function () {
            parseObj(obj, els);
        }, 0);
    }

    var nbEvents = 0
    var dump = function (evt) {
        setTimeout(function () {
            if (elDump.children.length > 4) {
                elDump.removeChild(elDump.firstChild);
            }
            var newEvent = document.createElement('div');
            newEvent.innerHTML = '#' + nbEvents + ' : <span class="data">' +
                evt + '</span>';
            elDump.appendChild(newEvent);
            nbEvents += 1;
        }, 0);
    }

    /**
     * Basic Handlers for Nipple that triggers RoDI actions based on the events
     */

    var startStopHandler = function (event, data) {
        debug("event", event.type)
        dump(event.type)
        print(data)

        if (event.type === 'start') {
            rodi.frontView()
        }
        if (event.type === 'end') {
            rodi.stop()
            rodi.stopBlink()
        }
    }

    var dirHandler = function (event) {
        dump(event.type);
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

    /**
     * Bind Nipple and start watching for events
     */

    var bindJoystick = function () {
        joystick
            .on('start end', startStopHandler)
            .on('dir:up dir:left dir:down dir:right', dirHandler)
            .on('move', function(event, data) {
                print(data);
            })
    }

    bindJoystick()

})( nipple )
