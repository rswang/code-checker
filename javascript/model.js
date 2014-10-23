var codeChecker = (function () {
    /*
     * Helper to check that a structure exists in the ast
     * Params:
     * - ast: ast to check for structure
     * - start: position to start checking
     * - structure: structure to look for, represented as an array of types
     * - j: index in the original structures list
     * - structuresFinished: list of indices of structures that were found in the code
     */
    var structureChecker = function(ast, start, structure, j, structuresFinished) {
        acorn.walk.findNodeAfter(ast, start, function(nodeType, node) {
            if (structure.length === 0) {
                if (structuresFinished.indexOf(j) === -1) {
                    structuresFinished.push(j);
                }
            } else if (structure[0] === nodeType) {
                structureChecker(ast, node.start + 1, structure.slice(1), j, structuresFinished);
            }
        });
    }

    /*
     * Checks text against a whitelist, blacklist, and structures list.
     * Params:
     * - whitelist: list of types that should be in the code
     * - blacklist: list of types that should not be in the code
     * - structures: list of structures (list of elements) that should be in the code
     * Returns:
     * - Array of [remainingWhitelist, remainingBlacklist, structuresFinished];
     * - remainingWhitelist: whitelist elements that were not found
     * - remainingBlacklist: blacklist elements that were not found (i.e. should be
     *       all blacklist elements if code is correct)
     * - structuresFinished: list of indexes of structures that were completed
     */
    var checkCode = function(whitelist, blacklist, structures, text) {
        var ast = acorn.parse(text);
        var structuresFinished = [];
        acorn.walk.findNodeAfter(ast, 0, function(nodeType, node) {
            if (whitelist.indexOf(nodeType) > -1) {
                var index = whitelist.indexOf(nodeType);
                whitelist.splice(index, 1);
            }
            if (blacklist.indexOf(nodeType) > -1) {
                var index = blacklist.indexOf(nodeType);
                blacklist.splice(index, 1);
            }
            for (var j = 0; j < structures.length; j++) {
                if ((structures[j][0]) === nodeType) {
                    structureChecker(ast, node.start + 1, structures[j].slice(1), j, structuresFinished);
                }
            }
        });
        return [whitelist, blacklist, structuresFinished];
    }

    return checkCode;
})();