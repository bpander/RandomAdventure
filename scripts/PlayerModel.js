define(function (require) {
    'use strict';


    function PlayerModel () {

        this.x = 0;

        this.y = 0;

        this.level = 1;

        this.maxHitPoints = 1;

        this.hitPoints = 1;

        this.armor = null;

        this.weapon = null;

        this.items = [];

        this.carryingCapacity = 100;

    }


    return PlayerModel;
});
