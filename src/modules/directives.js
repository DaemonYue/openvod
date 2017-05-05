'use strict';

(function() {
  var app = angular.module('app.directives', [])

  .directive('fileModel', ['$parse','CONFIG', function ($parse, CONFIG) {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;

              element.bind('change', function(){
                  scope.$apply(function(){
                      modelSetter(scope.$parent, element[0].files[0]);
                  });

                  var filename = element[0].files[0].name;
                  var reg = ".*\\.(jpg|png|gif|jpeg|bmp|JPG|PNG|GIF|JPEG|BMP)";
                  var r = filename.match(reg);
                  if(r == null){
                      alert("对不起，请上传以jpg|png|gif|jpeg|bmp|JPG|PNG|GIF|JPEG|BMP为后缀的图片");
                  }
                  else {
                      document.getElementById(attrs.e).click();
                  }
              });
          }
      };
  }])

  .directive('videoModel', ['$parse','CONFIG', function ($parse, CONFIG) {
          return {
              restrict: 'A',
              link: function(scope, element, attrs) {
                  var model = $parse(attrs.videoModel);
                  var modelSetter = model.assign;

                  element.bind('change', function(){
                      scope.$apply(function(){
                          modelSetter(scope.$parent, element[0].files[0]);
                      });

                      var filename = element[0].files[0].name;
                      /*var reg = ".*\\.(avi)";
                      var r = filename.match(reg);
                      if(r == null){
                          alert("对不起，请上传以avi为后缀的图片");
                      }
                      else {
                          document.getElementById(attrs.e).click();
                      }*/
                      document.getElementById(attrs.e).click();

                  });
              }
          };
      }])

})();