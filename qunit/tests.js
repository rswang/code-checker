var checkCode = codeChecker;

var function_return = 'function foo(x) {\n\treturn x;\n}';
var function_var_return = 'function foo(x) {\n\tvar y = 0;\n\treturn y;\n}';
var function_var_return_if = 'function foo(x) {\n\tvar y = 0;\n\treturn y;\n}\nif (typeof "hi" === "string") {\n\tconsole.log("hi");\n}';

console.log(function_var_return_if);
test("test whitelist", function() {
    var whitelist1 = ['FunctionDeclaration'];
    var whitelistSuccess = checkCode(whitelist1, [], [], function_return);
    deepEqual(whitelistSuccess[0], []);

    var whitelist2 = ['ReturnStatement'];
    var whitelistSuccess2 = checkCode(whitelist2, [], [], function_return);
    deepEqual(whitelistSuccess2[0], []);

    var whitelist3 = ['VariableDeclaration', 'FunctionDeclaration', 'ReturnStatement'];
    var whitelistSuccess3 = checkCode(whitelist3, [], [], function_var_return);
    deepEqual(whitelistSuccess3[0], []);

    var whitelist4 = ['VariableDeclaration'];
    var whitelistFail = checkCode(whitelist4, [], [], function_return);
    deepEqual(whitelistFail[0], whitelist4);

    var whitelist5 = ['VariableDeclaration', 'IfStatement'];
    var whitelistFail = checkCode(whitelist5, [], [], function_var_return);
    deepEqual(whitelistFail[0], ['IfStatement']);
});

test("test blacklist", function() {
    var blacklist1 = ['FunctionDeclaration'];
    var blacklistFail = checkCode([], blacklist1, [], function_return);
    deepEqual(blacklistFail[1], blacklist1);

    var blacklist2 = ['ReturnStatement'];
    var blacklistSuccess = checkCode([], blacklist2, [], function_return);
    deepEqual(blacklistSuccess[1], []);

    var blacklist3 = ['VariableDeclaration', 'FunctionDeclaration', 'ReturnStatement'];
    var blacklistFail2 = checkCode(blacklist3, [], [], function_var_return);
    deepEqual(blacklistFail2[0], []);

});

test("test structure", function() {
    var structureList = [['FunctionDeclaration', 'ReturnStatement']];
    var structureListSuccess = checkCode([], [], structureList, function_return);
    deepEqual(structureListSuccess[2], [0]);

    var structureList2 = [['ReturnStatement', 'FunctionDeclaration']];
    var structureListSuccess = checkCode([], [], structureList2, function_return);
    deepEqual(structureListSuccess[2], []);

    var structureList3 = [['ReturnStatement', 'VariableDeclaration']];
    var structureListResult1 = checkCode([], [], structureList3, function_var_return);
    deepEqual(structureListResult1[2], []);

    var structureList4 = [['VariableDeclaration', 'ReturnStatement']];
    var structureListResult2 = checkCode([], [], structureList4, function_var_return);
    deepEqual(structureListResult2[2], []);

    var structureList5 = [['VariableDeclaration', 'IfStatement']];
    var structureListResult3 = checkCode([], [], structureList5, function_var_return_if);
    deepEqual(structureListResult3[2], []);
});