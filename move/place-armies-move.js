var Move = require('./move');

/**
 * This Move is used in the first part of each round. It represents what Region is increased
 * with how many armies.
 * @param {string} playerName - player placing the armies
 * @param {Region} region - region to place armies
 * @param {int} armies - number of armies to place
 */
function PlaceArmiesMove(playerName, region, armies) {
    this.playerName = playerName;
    this.region = region;
    this.armies = armies;
    _.bindAll(this);
}

PlaceArmiesMove.prototype = new Move;

PlaceArmiesMove.prototype.getString = function() {
    if (this.illegalMove) {
        return this.PlayerName + " illegal_move " + this.IllegalMove;
    }

    return this.PlayerName + " attack/transfer " + this.fromRegion.Id + " " + this.toRegion.Id + " " + this.armies;
}

module.exports = PlaceArmiesMove;
