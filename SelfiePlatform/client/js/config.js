angular.module("EasyRashApp.config", [])
.constant("CONFIG", {
  "appVersion": "3.0.1",
  "base_url": "http://raspberrypi.local:8080",
  "endpoint": "/api",
  "photos": "/photos",
  "photo": "/photo",
  "takePhoto": "/takePhoto",
  "deleteLogs": "/deleteLogs",
  "deleteAll": "/deleteAll",
  "movePhotos": "/movePhotos",
  "restart": "/restart"
});
