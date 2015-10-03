define(function (require) {
    'use strict';

    // Models
    var PlayerModel = require('PlayerModel');

    // Views
    var ConsoleView = require('ConsoleView');

    // Stores
    var EventStore = require('stores/EventStore');


    function AdventureGame () {

        this.consoleView = new ConsoleView(document.querySelector('.js-consoleView'));

        this.playerModel = new PlayerModel();

        this.handleConsoleInputAppended = this.handleConsoleInputAppended.bind(this);

        this.init();
    }


    var _random = function (x, y, modifier) {
        x = (x * 17 & 0xff) + 1;
        y = (y * 11 & 0xff) + 1;
        modifier = (modifier & 0xff) + 1;
        return 0.5 * Math.sin(modifier * x + y) + 0.5;
    };


    AdventureGame.COMMAND = {
        MOVE: 'move'
    };

    AdventureGame.DIRECTION = {
        NORTH: 'north',
        EAST: 'east',
        SOUTH: 'south',
        WEST: 'west'
    };


    AdventureGame.prototype.init = function () {
        this.consoleView.inputElement.focus();
        this.enable();
    };


    AdventureGame.prototype.enable = function () {
        this.consoleView.eventEmitter.on(ConsoleView.EVENT.INPUT_APPENDED, this.handleConsoleInputAppended);
    };


    AdventureGame.prototype.processInput = function (message) {
        var messageParts = message.split(' ');
        var command = messageParts[0];
        switch (command) {

            case AdventureGame.COMMAND.MOVE:
                this.movePlayer(messageParts[1]);
                break;
        }
    };


    AdventureGame.prototype.movePlayer = function (direction) {
        switch (direction) {

            case AdventureGame.DIRECTION.NORTH:
                this.playerModel.y++;
                break;

            case AdventureGame.DIRECTION.EAST:
                this.playerModel.x++;
                break;

            case AdventureGame.DIRECTION.SOUTH:
                this.playerModel.y--;
                break;

            case AdventureGame.DIRECTION.WEST:
                this.playerModel.x--;
                break;
        }

        this.consoleView.appendOutput(_random(this.playerModel.x, this.playerModel.y, 0));
    };


    AdventureGame.prototype.handleConsoleInputAppended = function (target, message) {
        this.processInput(message);
    };


    return AdventureGame;
});
