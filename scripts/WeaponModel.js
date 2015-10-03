define(function (require) {
    'use strict';


    function WeaponModel () {

        this.title = 'Fisticuffs';

        this.strength = 5;

        this.modifiers = [
            { factor: 2, target: 'Squishy' }
        ];

    }


    return WeaponModel;
})