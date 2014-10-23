(function () {
    // set initial instructions
    var instructions = 'function howTo() {\n\tvar instructions = "Add elements to whitelists, blacklists, or structures! Then write some code to see if you can follow your own instructions. :)";\n\treturn instructions;\n}';
    editor.setValue(instructions);

    // dictionary of elements to their node types
    var elemToType = {
        "function" : "FunctionDeclaration",
        "var" : "VariableDeclaration",
        "for" : "ForStatement",
        "return" : "ReturnStatement",
        "if" : "IfStatement",
    };

    // create a two-way dictionary -- used as utils later
    var typeToElem = {};
    _.map(elemToType, function(v, k) {
        typeToElem[v] = k;
    });

    // lists of whitelist/blacklist/structure list
    // created by user
    var whitelistTypes = [];
    var blacklistTypes = [];
    var structures = [];

    // create a label with specified id, classes, and text
    var createLabel = function(id, classes, text) {
        var classes = classes.join(" ");
        var idString = id ? 'id="' + id + '"' : "";
        return '<span ' + idString + ' class="label ' + classes + '">' + text + '</span>';
    }

    /*
     * Runs the code checker on text in the editor and updates the UI accordingly
     */
    var runChecker = function() {
        var whitelistCopy = _.clone(whitelistTypes);
        var blacklistCopy = _.clone(blacklistTypes);
        var text = editor.getValue();
        
        var results = codeChecker(whitelistCopy, blacklistCopy, structures, text);
        
        var whitelistRemaining = results[0];
        var blacklistRemaining = results[1];
        var structuresFinished = results[2];

        $(".whitelist").green();
        _.map(whitelistRemaining, function(remainingElem) {
            var elemId = "#whitelist-" + typeToElem[remainingElem];
            $(elemId).red();
        });

        $(".blacklist").red();
        _.map(blacklistRemaining, function(remainingElem) {
            var elemId = "#blacklist-" + typeToElem[remainingElem];
            $(elemId).green();
        });

        $(".structure").children().red();
        _.map(structuresFinished, function(num) {
            $("#structure-" + parseInt(num + 1)).children().green();
        });
    }

    // set dynamic checking to true to allow the code checker to run on every keypress
    var dynamicChecking = false;
    $("#dynamic").on("click", function() {
        dynamicChecking = document.getElementById("dynamic-checkbox").checked;
    });
    $("#editor").on("keydown", function() {
        if (dynamicChecking) {
            runChecker();
        }
    });

    // can also click "Check my code!" to check the code manually
    $("#check").on("click", function() {
        runChecker();
    });

    // remove an element from whitelist/blacklist requirements
    $("#requirements").on("click", ".element", function(e) {
        var ids = e.target.id.split("-");
        var list = ids[0];
        var elem = ids[1];
        $("#" + e.target.id).remove();
        if (list === "whitelist") {
            var index = whitelistTypes.indexOf(elemToType[elem]);
            whitelistTypes.slice(index, 1);
        } else if (list === "blacklist") {
            var index = blacklistTypes.indexOf(elemToType[elem]);
            blacklistTypes.slice(index, 1);
        }
    });

    // add an element to whitelist/blacklist requirements
    $("#submit").on("click", function(e) {
        e.preventDefault();
        var list = $("#list").val();
        var elem = $("#elem").val();
        var type = elemToType[elem];
        if (list === "whitelist") {
            // do not add if type has already been added
            if (whitelistTypes.indexOf(type) > -1) {
                return;
            }
            whitelistTypes.push(type);
        } else if (list === "blacklist") {
            // do not add if type has already been added
            if (blacklistTypes.indexOf(type) > -1) {
                return;
            }
            blacklistTypes.push(type);
        }
        $("#" + list).append(createLabel(list + "-" + elem, ["element", list], elem + ' &times;'));
        runChecker();
    });

    // add a new or add to an existing structure 
    $("#structureSubmit").on("click", function(e) {
        e.preventDefault();
        var num = $("#structureNumber").val();
        var elem = $("#structureElem").val();
        // if a new structure
        if (num - 1 === structures.length) {
            var newNumber = parseInt(num) + 1;
            $("#structureNumber").append("<option>" + newNumber + "</option>");
            structures.push([elemToType[elem]]);
            $("#structure").append(createLabel("structure-" + num, ["structure"], ""));
            $("#structure-" + num).append(createLabel(null, ["structureElement"], "Structure " + num + ": ") + createLabel(null, ["structureElement"], elem));
        // otherwise add to existing structure
        } else {
            structures[num - 1].push(elemToType[elem]);
            $("#structure-" + num).append(createLabel(null, ["structureElement"], "&#10140;") + createLabel(null, ["structureElement"], elem));
        }
        runChecker();
    });

    // extend jquery to add easier helper functions
    jQuery.fn.extend({
        green: function() {
            $(this).removeClass("label-danger").addClass("label-success");
        },
        red: function() {
            $(this).removeClass("label-success").addClass("label-danger");
        }
    });
})();