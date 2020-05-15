const cons = require("consolidate");

// Set the url based on the window URL and port - used across all calls
var urlPrefix = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

$(document).ready(function(){
  $('nav a').click(function(){
    $('nav a').removeClass('active');
    $(this).addClass('active');
    let link=$(this).attr('href');
    window.location.href=link;
  });
 });

var editorFontSize = 18;

var app = angular.module('jsonToolkitApp', ['ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "jsonpath.html"
    })
    .when("/jsonschema", {
      templateUrl: "jsonschema.html"
    })
    .when('/*', {
      templateUrl: "notFound.html"
    });
})

app.controller("jsonPathController", function ($scope) {
  $scope.autoRunLStatus = 'Off';

  $scope.savedPaths = [];

  // Editor settings
  var editorInputJSONPath = ace.edit("editorInputJSONPath");
  editorInputJSONPath.setTheme("ace/theme/solarized_light");
  editorInputJSONPath.session.setMode("ace/mode/json");
  editorInputJSONPath.setFontSize(editorFontSize);

  // Editor settings
  var editorOutputJSONPath = ace.edit("editorOutputJSONPath");
  editorOutputJSONPath.setTheme("ace/theme/solarized_light");
  editorOutputJSONPath.session.setMode("ace/mode/json");
  editorOutputJSONPath.setFontSize(editorFontSize);

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

  $scope.setAutoRun = function setAutoRun() {
    if ($scope.autoRunLStatus === 'Off') {
      $scope.autoRunLStatus = 'On';
      $('#jsonP').on('input', () => {
        $scope.evaluateJSONPath();
      })
    } else {
      $('#jsonP').off();
      $scope.autoRunLStatus = 'Off';
    }
  }

  $scope.loadSavedPath = function loadSavedPath(p, i, o) {
    $scope.jsonP = p;
    editorInputJSONPath.setValue(i, -1);
    editorOutputJSONPath.setValue(o, -1);
  }

  $scope.switchOutputInput = function switchOutputInput() {
    editorInputJSONPath.setValue(editorOutputJSONPath.session.getValue());
    editorOutputJSONPath.setValue('{}');
  }
});

app.controller("jsonSchemaController", function ($scope) {
  $scope.jsonSchemaErrors = [];

  // Editor settings
  var editorInputJSONObject = ace.edit("editorInputJSONObject");
  editorInputJSONObject.setTheme("ace/theme/solarized_light");
  editorInputJSONObject.session.setMode("ace/mode/json");
  editorInputJSONObject.setFontSize(editorFontSize);

  // Editor settings
  var editorInputJSONSchema = ace.edit("editorInputJSONSchema");
  editorInputJSONSchema.setTheme("ace/theme/solarized_light");
  editorInputJSONSchema.session.setMode("ace/mode/json");
  editorInputJSONSchema.setFontSize(editorFontSize);

  $scope.validateJSON = function validateJSON() {
    let schema = JSON.parse(editorInputJSONSchema.session.getValue());
    let obj = JSON.parse(editorInputJSONObject.session.getValue());

    var ajv = new Ajv();
    var validate = ajv.compile(schema);
    var valid = validate(obj);
    if (!valid) {
      $scope.jsonSchemaResults = "Invalid";
      $scope.jsonSchemaErrors = validate.errors;
    } else {
      $scope.jsonSchemaResults = "Valid";
    }
  }

  $scope.generateSchema = function generateSchema() {
    let obj = JSON.parse(editorInputJSONObject.session.getValue());
    editorInputJSONSchema.setValue(JSON.stringify(j2s(obj), null, 1), -1);
  }

});