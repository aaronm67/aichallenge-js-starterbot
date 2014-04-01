var _ = require('lodash');
var BotState = require('./bot-state');
var readline = require('readline');

function BotParser(bot) {
    this.bot = bot;
    this.currentState = new BotState();
    _.bindAll(this);
}


var debug = function(output) {
}

/**
 * Starts a process to read from stdin
 */
BotParser.prototype.run = function() {
    var stdIn = process.openStdin();

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', this.handleStdin);
};

/**
 * Writes a line of output to the bot program
 * @param  {string} output - string to write
 */
BotParser.prototype.writeLine = function(output) {
    console.log(output);
};

/**
 * Writes a line of error message to the bot program
 * @param  {string} output - string to write
 */
BotParser.prototype.writeError = function(output) {
    console.log('Error:' + output);
};

/**
 * Reads a line of input, parses it, and writes a response
 * @param  {String} input - input string
 */
BotParser.prototype.handleStdin = function(input) {
    var inputStr = input.toString().substring(0, input.length).trim();
    if (!inputStr) {
        return;
    }

    var parts = _.map(inputStr.split(' '), function(i) {
        return i.trim();
    });

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

    if (parts.length === 3 && parts[0].trim() === "settings") {
        return this.currentState.updateSettings(parts[1], parts[2]);
    }
    
    // Initial full map is given
    if (parts[0] == "setup_map") {
        return this.currentState.setupMap(parts);
    }

    // All visible regions are given
    if (parts[0] == "update_map") {
        return this.currentState.updateMap(parts);
    }

    if (parts[0] == "opponent_moves") {
        return this.currentState.readOpponentMoves(parts);
    }

    this.writeError('BOT:: Unable to parse line "' + parts.length + '    ' + input + '"');
};

/**
 * Handles input/output for picking starting regions
 * @param  {String[]} parts - input from cli
 */
BotParser.prototype.pickStartingRegions = function(parts) {
     // Pick which regions you want to start with
    this.currentState.setPickableStartingRegions(parts);
    debug(this);

    var preferredStartingRegions = this.bot.getPreferredStartingRegions(this.currentState, parseInt(parts[1]));


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