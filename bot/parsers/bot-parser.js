var _ = require('lodash');
var sys = require('sys');
var BotState = require('./bot-state');

function BotParser(bot) {
    this.bot = bot;
    this.currentState = new BotState();
    _.bindAll(this);
}

/**
 * Starts a process to read from stdin
 */
BotParser.prototype.run = function() {
    var stdIn = process.openStdin();
    stdIn.addListener('data', this.handleStdin);
}

/**
 * Writes a line of output to the bot program
 * @param  {string} output - string to write
 */
BotParser.prototype.writeLine = function(output) {
    console.log(output);
}

/**
 * Writes a line of error message to the bot program
 * @param  {string} output - string to write
 */
BotParser.prototype.writeError = function(output) {
    console.log('Error:' + output);
}

/**
 * Reads a line of input, parses it, and writes a response
 * @param  {String} input - input string
 */
BotParser.prototype.handleStdin = function(input) {
    var inputStr = input.toString().substring(0, input.length - 1);

    if (!inputStr) {
        return;
    }

    var parts = inputStr.split(' ');
    var output = '';

    if (parts[0] === 'pick_starting_regions') {
        return this.pickStartingRegions(parts);
    }
    
    if (parts.length === 3 && parts[0] === 'go') {
        if (parts[1] === 'place_armies') {
            return this.placeArmies(parts);
        }

        if (parts[1] === 'attack/transfer') {
            return this.attack(parts);
        }
    }

    if (parts.Length == 3 && parts[0] == "settings") {
        return this.currentState.updateSettings(parts[1], parts[2]);
    }
    
    // Initial full map is given
    if (parts[0] == "setup_map") {
        return this.currentState.setupMap(parts);
    }

    // All visible regions are given
    if (parts[0] == "update_map") {
        return this.currentState.updateMap(parts);
    };

    if (parts[0] == "opponent_moves") {
        return this.currentState.readOpponentMoves(parts);
    }

    this.writeError('Unable to parse line "' + input + '"')
};

/**
 * Handles input/output for picking starting regions
 * @param  {String[]} parts - input from cli
 */
BotParser.prototype.pickStartingRegions = function(parts) {
     // Pick which regions you want to start with
    this.currentState.setPickableStartingRegions(parts);
    var preferredStartingRegions = this.bot.getPreferredStartingRegions(this.currentState, long.Parse(parts[1]));

    var output = _.map(preferredStartingRegions, function(region) {
        return region.id;
    }).join(' ');

    this.writeLine(output);
};


/**
 * Handles input/output for placing armies at the beginning of the turn
 * @param  {String[]} parts - input from cli
 */
BotParser.prototype.placeArmies = function(parts) {
    var placeArmiesMoves = this.bot.getPlaceArmiesMoves(this.currentState, parseInt(parts[2]));
    var output = _.map(placeArmiesMoves, function(move) {
        return move.getString();
    }).join(',');

    if (!_.any(placeArmiesMoves)) {
        output = 'No moves';
    }

    this.writeLine(output);
};


/**
 * Handles input/output for sending attack/transfer moves
 * @param  {String[]} parts - input from cli
 */
BotParser.prototype.attack = function(parts) {
     // attack/transfer
    var attackTransferMoves = this.bot.GetAttackTransferMoves(this.currentState, parseInt(parts[2]));
    var output = _.map(attackTransferMoves, function(move) {
        return move.getString();
    }).join(',');

    if (!_.any(attackTransferMoves)) {
        output = 'No moves';
    }

    this.writeLine(output);
};

module.exports = BotParser;