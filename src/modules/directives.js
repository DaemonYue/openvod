'use strict';

(function () {
    var app = angular.module('app.directives', [])

    /*------------------- 针对图片-------------------------*/
        .directive('fileModel', ['$parse', 'CONFIG', function ($parse, CONFIG) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function () {
                        scope.$apply(function () {
                            modelSetter(scope.$parent, element[0].files[0]);
                        });

                        var filename = element[0].files[0].name;
                        var reg = ".*\\.(jpg|png|gif|jpeg|bmp|JPG|PNG|GIF|JPEG|BMP)";
                        var r = filename.match(reg);
                        if (r == null) {
                            alert("对不起，请上传以jpg|png|gif|jpeg|bmp|JPG|PNG|GIF|JPEG|BMP为后缀的图片");
                        }
                        else {
                            document.getElementById(attrs.e).click();
                        }
                    });
                }
            };
        }])

        /*------------------- 针对不需要验证的文件-------------------------*/
        .directive('videoModel', ['$parse', 'CONFIG', function ($parse, CONFIG) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var model = $parse(attrs.videoModel);
                    var modelSetter = model.assign;

                    element.bind('change', function () {
                        scope.$apply(function () {
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

    /* .directive('inputModel', ['$parse','CONFIG', function ($parse, CONFIG) {
     return {
     restrict: 'A',
     link: function(scope, element, attrs) {
     var model = $parse(attrs.inputModel);
     var modelSetter = model.assign;
     console.log(modelSetter);

     element.bind('change', function(){
     /!* scope.$apply(function(){
     modelSetter(scope.$parent, element[0].files[0]);
     });*!/
     console.log(element);
     var limitString = attrs.e;
     var value = this.value;
     var limitsFirObj = limitString.split(',')
     var limits = {}
     for(var i=0;i<limitsFirObj.length;i++){
     var item  = limitsFirObj[i].split(':');
     limits[item[0]] = item[1];
     console.log(limits);
     }
     for(var j in limits){
     switch (j){
     case 'max':
     console.log(value.length);
     if(value && value.length>Number(limits[j])){
     this.setCustomValidity('输入超长,请输入'+limits[j]+'字以内!')
     }else {
     this.setCustomValidity('')
     }
     break;
     }


     }

     //var filename = element[0].files[0].name;
     /!*var reg = ".*\\.(avi)";
     var r = filename.match(reg);
     if(r == null){
     alert("对不起，请上传以avi为后缀的图片");
     }
     else {
     document.getElementById(attrs.e).click();
     }*!/


     });
     }
     };
     }])*/

})();