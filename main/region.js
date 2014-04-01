var _ = require('lodash');

/**
 * Represents a subregion
 * @param {int} id - id of the region
 * @param {SuperRegion} superRegion - super region that contains this region
 * @param {String} playerName (optional) - player who owns this region
 * @param {int} armies (optional) - # of armies in this region
 */
function Region(id, superRegion, playerName, armies) {
    this.id = id;
    this.superRegion = superRegion;
    this.playerName = playerName || '';
    this.armies = armies || 0;
    this.neighbors = [];
    _.bindAll(this);
}

/**
 * Adds a neighbor to this region
 * @param {Region} neighbor - region to add as neighbor
 */
Region.prototype.addNeighbor = function(neighbor) {
    if (!this.isNeighbor(neighbor)) {
        this.neighbors.push(neighbor);
        neighbor.addNeighbor(this);
    }
};

/**
 * Gets whether "region" is a neighbor of this 
 * @param  {Region}  region - region to check
 * @return {Boolean} - whether the region is a neighbor
 */
Region.prototype.isNeighbor = function(region) {
    return _.any(this.neighbors, function(neighbor) {
        return neighbor.sameAs(region);
    });
};

/**
 * Returns whether the region is owned by the player with playerName 
 * @param  {string} player - name of the player to check
 * @return {Boolean} - whether player owns this region
 */
Region.prototype.isOwnedByPlayer = function(playerName) {
    return this.playerName === playerName;
};

/**
 * Returns whether this region is the same as test region
 * @param  {Region} region - region to test
 * @return {Boolean}
 */
Region.prototype.sameAs = function(region) {
    return this.id === region.id;
};


module.exports = Region;