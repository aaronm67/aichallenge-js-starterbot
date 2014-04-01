var _ = require('lodash');

function Map(regions, superRegions) {
    this.regions = regions || [];
    this.superRegions = superRegions || [];
    _.bindAll(this);
}

/**
 * Adds a region to the map
 * @param {Region} region - region to add
 */
Map.prototype.addRegion = function(region) {
    if (!this.containsRegion(region)) {
        this.regions.push(region);
    }
};

/**
 * Adds a super region to the map
 * @param {SuperRegion} superRegion - super region to add
 */
Map.prototype.addSuperRegion = function(superRegion) {
    if (!this.containsSuperRegion(superRegion)) {
        this.superRegions.push(superRegion);
    }
};


/**
 * Returns whether the map contains region
 * @param  {Region} region - region to test
 * @return {Boolean}
 */
Map.prototype.containsRegion = function(region) {
    return _.any(this.regions, function(r) {
        return r.sameAs(region);
    });
};

/**
 * Returns whether the map contains super region
 * @param  {SuperRegion} superRegion - region to test
 * @return {Boolean}
 */
Map.prototype.containsSuperRegion = function(superRegion) {
    return _.any(this.superRegions, function(r) {
        return r.sameAs(superRegion);
    });
};

/**
 * Gets a copy of the map
 * @return {Map}
 */
Map.prototype.getCopy = function() {
    return _.cloneDeep(this);
};

/**
 * Gets a region by Id
 * @param  {int} id - region id to get
 * @return {Region}
 */
Map.prototype.getRegion = function(id) {
    return _.find(this.regions, function(region) {
        return region.id === id;
    });
};

/**
 * Gets a super region by ID
 * @param  {int} id - id of the region to get
 * @return {SuperRegion}
 */
Map.prototype.getSuperRegion = function(id) {
    return _.find(this.superRegions, function(region) {
        return region.id === id;
    });
};

/**
 * Gets a string representation of the map
 * @return {String}
 */
Map.prototype.getString = function() {
    return _.map(this.regions, function(region) {
        return region.id + ';' + region.playerName + ';' + region.armies;
    }).join(' ');
};

module.exports = Map;