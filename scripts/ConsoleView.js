define(function (require) {
    'use strict';

    var EventEmitter = require('../bower_components/EventEmitter.js/EventEmitter');


    function ConsoleView (element) {

        this.element = element;

        this.eventEmitter = new EventEmitter();

        this.messagesElement = element.querySelector('ul');

        this.inputElement = element.querySelector('input');

        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.init();
    }


    ConsoleView.EVENT = {
        INPUT_APPENDED: 'inputappended'
    };


    ConsoleView.prototype.init = function () {
        this.inputElement.addEventListener('keydown', this.handleKeyDown);
    };


    ConsoleView.prototype.appendInput = function (message) {
        var messageElement = document.createElement('li');
        messageElement.innerHTML = '&gt; ' + message;
        this.messagesElement.appendChild(messageElement);
        this.eventEmitter.emit(ConsoleView.EVENT.INPUT_APPENDED, this, message);
    };


    ConsoleView.prototype.appendOutput = function (message) {
        var messageElement = document.createElement('li');
        messageElement.innerHTML = '&lt; ' + message;
        this.messagesElement.appendChild(messageElement);
    };


    ConsoleView.prototype.handleKeyDown = function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        var value = this.inputElement.value.trim();
        if (value === '') {
            return;
        }
        this.inputElement.value = '';
        this.appendInput(value);
    };


    return ConsoleView;
});