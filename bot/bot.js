var _ = require('lodash');
var BotParser = require('./parsers/bot-parser');

function Bot() {
    this.parser = new BotParser(this);
    _.bindAll(this);
}

Bot.prototype.start = function() {
    this.parser.run();
};

Bot.prototype.getRandom = function(low, high) {
    return Math.floor(Math.random() * high) + low;
};

/**
 * This method is called at the beginning of the game to decide which regions to start with.
 * 6 regions must be returned.
 * 
 * @param  {BotState} state - current game state
 * @param  {int} timeout - maximum timeout
 * @return {Region} - list of regions to start with
 */
Bot.prototype.getPreferredStartingRegions = function(currentState, timeout) {
    var toAdd = 6;
    var regionsToPlace = [];

    var pickableRegions = currentState.pickableStartingRegions;

    var findRegion = function(existingRegion) {
        return existingRegion.sameAs(region);
    };

    for (var i = 0; i < toAdd; i++) {
        var index = this.getRandom(0, pickableRegions.length - 1);
        var regionId = pickableRegions[index].id;
        var region = currentState.fullMap.getRegion(regionId);
        var alreadyAdded = _.any(regionsToPlace, findRegion);
        if (alreadyAdded) {
            i--;
            continue;
        }

        regionsToPlace.push(region);
    }

    return regionsToPlace;
};

/**
 * This method is called at the first part of each round. 
 * @param  {BotState} currentState - current bot state
 * @param  {int} timeout - timeout in milliseconds
 * @return {PlaceArmiesMove[]} - list of moves to take
 */
Bot.prototype.getPlaceArmiesMoves = function(currentState, timeout) {
    var movesToMake = [];
    var myName = currentState.MyPlayerName;
    var armies = 2;
    var armiesLeft = currentState.startingArmies;
    var visibleRegions = currentState.visibleMap.regions;

    while (armiesLeft > 0) {
        var index = this.getRandom(1, visibleRegions.length);
        var region = visibleRegions[index];

        if (region.ownedByPlayer(myName))
        {
            movesToMake.push(new PlaceArmiesMove(myName, region, armies));
            armiesLeft -= armies;
        }
    }

    return movesToMake;
};

/**
 * This method is called at the second part of each round.
 * @param  {BotState} currentState - current bot state
 * @param  {int} timeout - timeout in milliseconds
 * @return {AttackTransferMove[]} - list of attack/transfers
 */
Bot.prototype.getAttackTransferMoves = function(currentState, timeout) {
    var attackTransferMoves = [];
    var myName = currentState.myPlayerName;
    var armies = 5;

    var findRegion = function(region) {
        return region.sameAs(toRegion);
    };

    _.each(currentState.visibleMap.regions, function(fromRegion) {
        if (fromRegion.ownedByPlayer(myName)) {
            // get all neighbors of this region
            var possibleToRegions = fromRegion.neighbors.slice(0);
            while (_.any(possibleToRegions)) {
                var rand = this.getRandom(1, possibleToRegions.length);
                var toRegion = possibleToRegions[rand];
                if (toRegion.playerName != myName && fromRegion.armies > 6) {
                    // do an attack
                    attackTransferMoves.push(new AttackTransferMove(myName, fromRegion, toRegion, armies));
                    break;
                }

                if (toRegion.playerName == myName && fromRegion.armies > 1) {
                    // do a transfer
                    attackTransferMoves.push(new AttackTransferMove(myName, fromRegion, toRegion, armies));
                    break;
                }

                possibleToRegions = _.filter(possibleToRegions, findRegion);
            }
        }
    });

    return attackTransferMoves;
};

module.exports = Bot;