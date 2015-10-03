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

    // Templates
    var tableTemplate = tmpl(require('text!../templates/table.tmpl'));


    function AdventureGame () {

        this.consoleView = new ConsoleView(document.querySelector('.js-consoleView'));

        this.playerModel = new PlayerModel();

        this.handleConsoleInputAppended = this.handleConsoleInputAppended.bind(this);

        this.init();
    }


    var _random = function (x, y, modifier) {
        x = (x * 19 & 0xff) + 1;
        y = (y * 23 & 0xff) + 1;
        modifier = (modifier & 0xff) + 1;
        return 0.5 * Math.sin(modifier * x + y) + 0.5;
    };


    AdventureGame.COMMAND = {
        MOVE: 'move',
        NORTH: 'north',
        EAST: 'east',
        SOUTH: 'south',
        WEST: 'west',
        INVENTORY: 'inventory',
        INVENTORY_SHORTHAND: 'i'
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
        var html = tableTemplate({
            tableRows: [
                [ 'Position:',  this.playerModel.x + ', ' + this.playerModel.y ],
                [ 'XP:',        this.playerModel.xp ],
                [ 'Gold:',      this.playerModel.gold ],
                [ 'Health:',    this.playerModel.hitPoints + ' / ' + this.playerModel.maxHitPoints ],
                [ 'Armor:',     this.playerModel.armor === null ? 'None' : this.playerModel.armor.title ],
                [ 'Weapon:',    this.playerModel.weapon.title + ' (' + this.playerModel.weapon.modifiers[0].factor +'x against ' + this.playerModel.weapon.modifiers[0].against + ')' ],
                [ 'Items:',     this.playerModel.items.map(function (item) {
                                    return item.title;
                                }).join(', ') ]
            ]
        });
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
        var noun = sceneryData.nouns[Math.floor(_random(x, y, 2) * sceneryData.nouns.length)]
        this.consoleView.appendOutput([ prefix, adjective, noun ].join(' '));
    };


    AdventureGame.prototype.handleConsoleInputAppended = function (target, message) {
        this.processInput(message);
    };


    return AdventureGame;
});
