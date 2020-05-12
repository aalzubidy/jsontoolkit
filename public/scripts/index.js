const cons = require("consolidate");

// Set the url based on the window URL and port - used across all calls
var urlPrefix = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

var app = angular.module('jsonToolkitApp', []);

app.controller("jsonPathController", function ($scope, $http) {
    $scope.test = 'JSON Tools Plus!';
    $scope.savedPaths = [];

    // Editor settings
    var editorInputJSONPath = ace.edit("editorInputJSONPath");
    editorInputJSONPath.setTheme("ace/theme/solarized_light");
    editorInputJSONPath.session.setMode("ace/mode/json");

    // Editor settings
    var editorOutputJSONPath = ace.edit("editorOutputJSONPath");
    editorOutputJSONPath.setTheme("ace/theme/solarized_light");
    editorOutputJSONPath.session.setMode("ace/mode/json");

    editorInputJSONPath.getSession().on('change', function () {
        if (editorInputJSONPath.session.$annotations.length > 0) {
            editorOutputJSONPath.setValue(JSON.stringify(editorInputJSONPath.session.$annotations));
        } else {
            editorOutputJSONPath.setValue('{}');   
        }
    });

    $scope.evaluateJSONPath = function evaluateJSONPath() {
        const input = JSON.parse(editorInputJSONPath.session.getValue());
        const jsonP = $scope.jsonP;
        const result = JSONPath.JSONPath({
            path: jsonP,
            json: input
        });
        editorOutputJSONPath.setValue(JSON.stringify(result, null, 1), -1);
    }

    $scope.savePath = function savePath() {
        $scope.savedPaths.push({
            path: $scope.jsonP,
            input: editorInputJSONPath.session.getValue(),
            output: editorOutputJSONPath.session.getValue()
        });
    }

    $scope.switchOutputInput = function switchOutputInput() {
        editorInputJSONPath.setValue(editorOutputJSONPath.session.getValue());
        editorOutputJSONPath.setValue('{}');
    }
});