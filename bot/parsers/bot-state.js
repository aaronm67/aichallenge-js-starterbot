var Map = require('../../main/map');
var Region = require('../../main/region');
var SuperRegion = require('../../main/super-region');
var _ = require('lodash');

var BotState = function() {
    this.fullMap = new Map();
    this.pickableStartingRegions = [];
    this.opponentMoves = [];
    this.roundNumber = 0;
    this.myPlayerName = '';
    this.opponentPlayerName = '';
    _.bindAll(this);
};

var debug = function(a){
};

BotState.prototype.updateSettings = function(key, value) {
    if (key === "your_bot") {
        this.myPlayerName = value;
        debug(this);
    }

    if (key === "opponent_bot") {
        this.opponentPlayerName = value;
        debug(this);
    }

    if (key === "starting_armies") {
        this.startingArmies = parseInt(value);
        this.roundNumber++; // Next round
        debug(this);
    }
};

BotState.prototype.setupMap = function(mapInput) {
    var superRegionId;
    if (mapInput[1] === 'super_regions') {
         for (var i = 2; i < mapInput.length; i++) {
            superRegionId = parseInt(mapInput[i]);
            i++;
            var reward = parseInt(mapInput[i]);
            this.fullMap.addSuperRegion(new SuperRegion(superRegionId, reward));
         }
     }

     if (mapInput[1] === "regions") {
        for (var j = 2; j < mapInput.length; j++) {
            var regionId = parseInt(mapInput[j]);
            j++;
            superRegionId = parseInt(mapInput[j]);
            var superRegion = this.fullMap.getSuperRegion(superRegionId);
            this.fullMap.addRegion(new Region(regionId, superRegion));
        }
    }

    if (mapInput[1] === "neighbors") {
        for (k = 2; k < mapInput.length; k++) {
            var region = this.fullMap.getRegion(parseInt(mapInput[k]));
            k++;
            var neighborIds = mapInput[k].split(',');
            for (var l = 0; l < neighborIds.Length; l++) {
                var neighbor = this.fullMap.getRegion(parseInt(neighborIds[l]));
                region.addNeighbor(neighbor);
            }
        }
    }

    debug(this);
};

BotState.prototype.setPickableStartingRegions = function(mapInput) {
    for (var i = 2; i < mapInput.length; i++) {
        var regionId = parseInt(mapInput[i]);
        var pickableRegion = this.fullMap.getRegion(regionId);
        debug("REGION", pickableRegion, this.fullMap);
        this.pickableStartingRegions.push(pickableRegion);
    }

    debug(this);
};

BotState.prototype.updateMap = function(mapInput) {
     this.visibleMap = this.fullMap.getCopy();

    for (var i = 1; i < mapInput.Length; i++) {
        var region = this.VisibleMap.GetRegion(int.Parse(mapInput[i]));
        var playerName = mapInput[i + 1];
        var armies = parseInt(mapInput[i + 2]);

        region.playerName = playerName;
        region.armies = armies;
        i += 2;

        var unknownRegions = [];

        _.each(this.visibleMap.regions, function(region) {
            if (region.playerName === 'unknown') {
                unknownRegions.push(region);
            }
        });

        this.visibleMap.regions = _.filter(this.visibleMap.regions, function(region) {
            return !_.any(unknownRegions, function(region2) {
                return region.sameAs(region2);
            });
        });
    }
};

BotState.prototype.readOpponentMoves = function(moveInput) {
    this.opponentMoves = [];
    
    var move;
    var armies;
    var playerName;
    for (var i = 1; i < moveInput.Length; i++) {
        var moveType = moveInput[i + 1];
         if (moveType === 'place_armies') {
            var region = this.visibleMap.getRegion(parseInt(moveInput[i + 2]));
            playerName = moveInput[i];
            armies = parseInt(moveInput[i + 3]);
            move = new PlaceArmiesMove(playerName, region, armies);
            i += 3;
        }
        else if (moveType === 'attack/transfer') {
            var fromRegion = this.visibleMap.getRegion(parseInt(moveInput[i + 2]));

            // Might happen if the region isn't visible
            if (!fromRegion) {
                fromRegion = this.fullMap.getRegion(parseInt(moveInput[i + 2]));
            }

            // Might happen if the region isn't visible
            var toRegion = this.visibleMap.getRegion(parseInt(moveInput[i + 3]));
            if (!toRegion) {
                toRegion = this.fullMap.getRegion(parseInt(moveInput[i + 3]));
            }

            playerName = moveInput[i];
            armies = parseInt(moveInput[i + 4]);
            move = new AttackTransferMove(playerName, fromRegion, toRegion, armies);
            i += 4;
        }
        else {
            continue;
        }

        this.opponentMoves.push(move);
    }
};

module.exports = BotState;