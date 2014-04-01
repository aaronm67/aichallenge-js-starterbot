var _ = require('lodash');

/**
 * Super Region 
 * @param {int} id - super region id
 * @param {int} armiesReward - # of armies awarded for controlling this region
 */
function SuperRegion(id, armiesReward) {
    this.id = id;
    this.armiesReward = armiesReward;
    this.subRegions = [];

    _.bindAll(this);
}

/**
 * Adds a subregion to this super region
 * @param {Region} region - region to add
 */
SuperRegion.prototype.addSubRegion = function(region) {
    var hasRegion = function(subRegion) {
        return subRegion.sameAs(region);
    };

    if (!_.any(this.subRegions, hasRegion)) {
        this.subRegions.push(region);
    }
};

/**
 * Gets the name of the player who owns this region. Returns '' if not controlled.
 * @return {string} Name of the player who owns this region
 */
SuperRegion.prototype.ownedByPlayer = function() {
    var player = (this.subRegions.length > 0) ? this.subRegions[0].playerName : '';

    var ownedByPlayer = _.all(this.subRegions, function(region) {
        return region.playerName === player;
    });

    if (ownedByPlayer && player) {
        return player;
    }

    return '';
};

/**
 * Returns whether this region is the same as test region
 * @param  {SuperRegion} region - region to test
 * @return {Boolean}
 */
SuperRegion.prototype.sameAs = function(superRegion) {
    return this.id === superRegion.id;
};

module.exports = SuperRegion;