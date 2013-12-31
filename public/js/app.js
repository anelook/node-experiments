var myApp = angular.module('myApp', []);
debugger;
myApp.controller('logInController', ['$scope', function ($scope) {
    $scope.availableRooms = [
      { name: 'Main', shade: 'dark' },
      { name: 'Lobby', shade: 'light' },
      { name: 'Red', shade: 'dark' },
      { name: 'Blue', shade: 'dark' },
      { name: 'Yellow', shade: 'light' }
    ];
    $scope.preselectedRoom = $scope.availableRooms[1]; // Lobby
}]);