(function() {

  var Weir = angular.module("Weir");

  Weir.controller("Weir.SettingsController", [
    "$scope",
    "Weir.LocalSettings",
    "Weir.Request",
    function($scope, Settings, Request) {
      var fileInput = document.querySelector(".inputOPML");
      fileInput.addEventListener("change", function() {
        var file = fileInput.files[0];
        if (file) {
          var xhr = new XMLHttpRequest();
          xhr.onload = function() { $scope.toggleSettings(false); $scope.refresh(); };
          xhr.open("POST", "meta/import/opml");
          xhr.send(file);
        }
      });

      $scope.saveSettings = function() {
        //use LocalSettings eventually
        $scope.toggleSettings(false);
      }
      
      var totp = Request.ask({
        url: "/checkpoint"
      });
      
      totp.then(function(data) {
        $scope.secret = data.secret;
        $scope.secretQR = data.secretQR;
      });
      
    }]);
  
})();

  
