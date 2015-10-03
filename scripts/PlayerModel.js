define(function (require) {
    'use strict';

    var WeaponModel = require('WeaponModel');


    function PlayerModel () {

        this.x = 0;

        this.y = 0;

        this.xp = 0;

        this.gold = 10;

        this.maxHitPoints = 10;

        this.hitPoints = 10;

        this.armor = null;

        this.weapon = new WeaponModel();

        this.items = [
            { title: 'Scientology leaflet', description: '' },
            { title: 'Childlike sense of wonder', description: '' }
        ];

        this.carryingCapacity = 100;

    }


    return PlayerModel;
});
