var Move = require('./move');

/**
 * This Move is used in the second part of each round. It represents the attack or transfer of armies from
 *fromRegion to toRegion. If toRegion is owned by the player himself, it's a transfer. If toRegion is
 * owned by the opponent, this Move is an attack. 
 * 
 * @param {string} playerName - player attacking/transferring
 * @param {Region} fromRegion - region attacking/transferring from
 * @param {Region} toRegion - region attacking/transferring to
 * @param {int} armies - number of armies to use in attack/transfer
 */
function AttackTransferMove(playerName, fromRegion, toRegion, armies) {
    this.playerName = playerName;
    this.fromRegion = fromRegion;
    this.toRegion = toRegion;
    this.armies = armies;
    _.bindAll(this);
}

AttackTransferMove.prototype = new Move;

AttackTransferMove.prototype.getString = function() {
    if (this.illegalMove) {
        return this.PlayerName + " illegal_move " + this.IllegalMove;
    }

    return this.PlayerName + " attack/transfer " + this.fromRegion.Id + " " + this.toRegion.Id + " " + this.armies;
}

module.exports = AttackTransferMove;
