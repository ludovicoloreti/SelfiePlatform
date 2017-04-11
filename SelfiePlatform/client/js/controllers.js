angular.module('EasyRashApp.controllers', [])

.controller('AppCtrl', function($scope, $http, CONFIG, $window) {
})

.controller('DashCtrl', function($scope, Api, $timeout, $window, $localStorage) {
  console.log("dash");

  if ($localStorage.get("login") != 1) {
    $window.location.href= "/#/login";
  }
  Api.getPhotos().then(function(response) {
    $scope.photos = response.reverse();
    console.log("> Get Photos:\n",response);
  })
  $scope.deletePhotos = function (password) {
    var r = confirm("Sicuro di voler cancellare tutte le foto?");
    if (r == true) {
      Api.deleteAll(password).then(function(response) {
        if (response.success == true) {
          alert("Foto cancellate!");
          $timeout(function(){
            $window.location.reload();
          },3000);
        } else {
          alert("Qualcosa è andato storto!\nMsg: "+JSON.stringify(response.msg)+"\nResponse: "+JSON.stringify(response.response));
          $timeout(function(){
            $window.location.reload();
          },7000);
        }
        console.log("> DeleteAll\n",response)
      })
    }
  }

  $scope.deleteLogs = function (password) {
    var r = confirm("Sicuro di voler cancellare tutti i file di logs?");
    if (r == true) {
      Api.deleteLogs(password).then(function(response) {
        if (response.success == true) {
          alert("Logs cancellati!");
          $timeout(function(){
            $window.location.reload();
          },3000);
        } else {
          alert("Qualcosa è andato storto!\nMsg: "+JSON.stringify(response.msg)+"\nResponse: "+JSON.stringify(response.response));
          $timeout(function(){
            $window.location.reload();
          },7000);
        }
        console.log("> DeleteLogs\n",response)
      })
    }
  }

  $scope.movePhotos = function (password) {
    var r = confirm("Sicuro di voler passare tutte le foto in chiavetta? Potrebbero andare perse!");
    if (r == true) {
      Api.movePhotos(password).then(function(response) {
        if (response.success == true) {
          alert("Foto passate!");
          $timeout(function(){
            $window.location.reload();
          },3000);
        } else {
          alert("Qualcosa è andato storto!\nMsg: "+JSON.stringify(response.msg)+"\nResponse: "+JSON.stringify(response.response));
          $timeout(function(){
            $window.location.reload();
          },7000);
        }
        console.log("> MovePhotos\n",response)
      })
    }
  }

  $scope.reboot = function (password) {
    var r = confirm("Sicuro di voler riavviare?");
    if (r == true) {
      Api.restart(password).then(function(response) {
        if (response.success == true) {
          alert("Rebooted!");
          $timeout(function(){
            $window.location.reload();
          },3000);
        } else {
          alert("Qualcosa è andato storto!\nMsg: "+JSON.stringify(response.msg)+"\nResponse: "+JSON.stringify(response));
          $timeout(function(){
            $window.location.reload();
          },7000);
        }
        console.log("> Reboot\n",response)
      })
    }
  }

  $scope.takePhoto = function() {
    Api.takePhoto().then(function(response) {
      $scope.msg = response.msg+" \n<br>\n "+response.response;
      if (response.success == true) {
        console.log("Arriva la foto!!!");
        console.log(response.image);
        $scope.fotog = response.image;
      } else {
        alert($scope.msg);
      }
      console.log("> Take a Photo:\n",response)
    })
  };

  $scope.clientLogs = function() {
    $window.open(
      '/#/clogs',
      '_blank'
    );
    // $window.location.href = "/#/clogs";
  }

  $scope.apriModal = function(url) {
    dataOra = new Date();
    console.log("Apro foto ("+url+") alle: "+dataOra);
    window.open(url, '_blank');
  }
})
.controller('LoginCtrl', function($scope,$localStorage,$window) {
  console.log("Login");
  if ($localStorage.get("login") == 1) {
    $window.location.href= "/#/dash";
  } else {
    $scope.login = function(pwd) {
      if (pwd === "bitsabenba55") {
        $localStorage.set("login",1);
        $window.location.reload(true);
      } else {
        alert("Login errato.\nRiprovare!");
      }
    }
  }
})

.controller('PhotosCtrl', function($scope) {
  console.log("Photos")
})

.controller('LogsCtrl', function($scope,$http) {
  console.info("LOGS!")
  $http({
    url: '/logs/client.json',
    method: 'GET',
    transformResponse: [function (data) {
      return data;
    }]
  }).success(function(response){
    str = response.replace(/(?:\r\n|\r|\n)/g, ',');
    var lastChar = str.slice(-1);
    if (lastChar == ',') {
      str = str.slice(0, -1);
    }
    var str = "["+str+"]".toString();
    finalArray = [];
    finalArray = JSON.parse(str);
    $scope.logs = finalArray.reverse();
    console.log($scope.logs)
  }).error(function(error){
    console.log(error)
  });
})

.controller('PhotoCtrl', function($scope, $routeParams) {
  console.log("Photo - ", $routeParams.photoId)
});
