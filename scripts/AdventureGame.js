define(function (require) {
    'use strict';

    // Libs
    var tmpl = require('lib/tmpl');

    // Models
    var PlayerModel = require('PlayerModel');

    // Views
    var ConsoleView = require('ConsoleView');

    // Data
    var sceneryData = require('json!../data/scenery.json');
    var eventData = require('json!../data/event.json');

    // Templates
    var inventoryTemplate = tmpl(require('text!../templates/inventory.tmpl'));


    function AdventureGame () {

        this.consoleView = new ConsoleView(document.querySelector('.js-consoleView'));

        this.playerModel = new PlayerModel();

        this.handleConsoleInputAppended = this.handleConsoleInputAppended.bind(this);

        this.init();
    }


    var _random = function (x, y, modifier) {
        x = (x * 23 & 0xff) + 1;
        y = (y * 19 & 0xff) + 1;
        modifier = (modifier * 17 & 0xff) + 1;
        return 0.5 * Math.sin(modifier * x + y) + 0.5;
    };


    AdventureGame.COMMAND = {
        MOVE: 'move',
        NORTH: 'north',
        EAST: 'east',
        SOUTH: 'south',
        WEST: 'west',
        INVENTORY: 'inventory',
        INVENTORY_SHORTHAND: 'i',
        WOO: 'woo',
        ENSLAVE: 'enslave',
        DOMESTICATE: 'domesticate',
        PET: 'pet',
        TALK: 'talk'
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

            case AdventureGame.COMMAND.NORTH:
            case AdventureGame.COMMAND.EAST:
            case AdventureGame.COMMAND.SOUTH:
            case AdventureGame.COMMAND.WEST:
                this.movePlayer(command);
                break;

            case AdventureGame.COMMAND.INVENTORY:
            case AdventureGame.COMMAND.INVENTORY_SHORTHAND:
                this.showInventory();
                break;

        }
    };


    AdventureGame.prototype.showInventory = function () {
        var html = inventoryTemplate({ playerModel: this.playerModel });
        this.consoleView.appendOutput(html);
    };


    AdventureGame.prototype.movePlayer = function (direction) {
        switch (direction) {

            case AdventureGame.DIRECTION.NONE:
                this.consoleView.appendOutput('Please choose a direction: ' + Object.keys(AdventureGame.DIRECTION).map(function (direction) {
                    return AdventureGame.DIRECTION[direction];
                }).join(', '));
                return;

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

        var x = this.playerModel.x;
        var y = this.playerModel.y;
        var prefix = sceneryData.prefixes[Math.floor(_random(x, y, 0) * sceneryData.prefixes.length)];
        var adjective = sceneryData.adjectives[Math.floor(_random(x, y, 1) * sceneryData.adjectives.length)];
        var noun = sceneryData.nouns[Math.floor(_random(x, y, 2) * sceneryData.nouns.length)];
        var eventType = eventData[Math.floor(_random(x, y, 3) * eventData.length)];
        var eventTemplate = eventType.templates[Math.floor(_random(x, y, 4) * eventType.templates.length)];
        var eventText = tmpl(eventTemplate, {
            adjective: eventType.adjectives[Math.floor(_random(x, y, 5) * eventType.adjectives.length)],
            noun: eventType.nouns[Math.floor(_random(x, y, 6) * eventType.nouns.length)]
        });
        this.consoleView.appendOutput([ prefix, adjective, noun ].join(' ') + ' ' + eventText);
    };


    AdventureGame.prototype.handleConsoleInputAppended = function (target, message) {
        this.processInput(message);
    };


    return AdventureGame;
});
