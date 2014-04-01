var Map = require('../../main/map');
var Region = require('../../main/region');
var SuperRegion = require('../../main/super-region');
var _ = require('lodash');

var BotState = function() {
    this.fullMap = new Map();
    this.pickableStartingRegions = [];
    this.opponentMoves = [];
    this.roundNumber = 0;
    _.bindAll(this);
};

BotState.prototype.updateSettings = function(key, value) {
    if (key == "your_bot") {
        this.myPlayerName = value;
    }

    if (key == "opponent_bot") {
        this.OpponentPlayerName = value;
    }

    if (key == "starting_armies") {
        this.SsartingArmies = parseInt(value);
        this.roundNumber++; // Next round
    }
};

BotState.prototype.setupMap = function(mapInput) {
    if (mapInput[1] === 'super_regions') {
         for (var i = 2; i < mapInput.Length; i++) {
            var superRegionId = parseInt(mapInput[i]);
            i++;
            var reward = parseInt(mapInput[i]);
            this.fullMap.addSuperRegion(new SuperRegion(superRegionId, reward));
         }
     }

     if (mapInput[1] == "regions") {
        for (var i = 2; i < mapInput.Length; i++) {
            var regionId = parseInt(mapInput[i]);
            i++;
            var superRegionId = parseInt(mapInput[i]);
            var superRegion = this.fullMap.GetSuperRegion(superRegionId);
            this.fullMap.addRegion(new Region(regionId, superRegion));
        }
    }

    if (mapInput[1] == "neighbors") {
        for (i = 2; i < mapInput.Length; i++) {
            var region = this.fullMap.GetRegion(parseInt(mapInput[i]));
            i++;
            var neighborIds = mapInput[i].split(',');
            for (var j = 0; j < neighborIds.Length; j++) {
                var neighbor = this.fullMap.getRegion(int.Parse(neighborIds[j]));
                region.addNeighbor(neighbor);
            }
        }
    }
};

BotState.prototype.setPickableStartingRegions = function(mapInput) {
    for (var i = 2; i < mapInput.length; i++) {
        var regionId = int.Parse(mapInput[i]);
        var pickableRegion = this.fullMap.getRegion(regionId);
        this.pickableStartingRegions.Add(pickableRegion);
    }
}

BotState.prototype.readOpponentMoves = function(moveInput) {
    this.OpponentMoves = [];
    
    var move;
    for (var i = 1; i < moveInput.Length; i++) {
        var moveType = moveInput[i + 1];
         if (moveType === 'place_armies') {
            var region = this.visibleMap.getRegion(int.Parse(moveInput[i + 2]));
            var playerName = moveInput[i];
            var armies = parseInt(moveInput[i + 3]);
            move = new PlaceArmiesMove(playerName, region, armies);
            i += 3;
        }
        else if (moveType === 'attack/transfer') {
            var fromRegion = this.visibleMap.getRegion(int.Parse(moveInput[i + 2]));
            if (fromRegion == null)
            {
                // Might happen if the region isn't visible
                fromRegion = this.fullMap.getRegion(int.Parse(moveInput[i + 2]));
            }

            var toRegion = this.visibleMap.getRegion(int.Parse(moveInput[i + 3]));
            if (toRegion == null)
            {
                // Might happen if the region isn't visible
                toRegion = this.fullMap.getRegion(int.Parse(moveInput[i + 3]));
            }

            var playerName = moveInput[i];
            var armies = parseInt(moveInput[i + 4]);
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