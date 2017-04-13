'use strict';

(function () {
    var app = angular.module('app.project-config-controllers', [])

    .controller('projectConfigController', ['$state',
        function ($state) {
            var self = this;
            
            self.init = function() {
                if($state.current.name == 'app.projectConfig') {
                    $state.go('app.projectConfig.hotelList');
                }
            }

            
        }
    ])

    .controller('pcHotelListController', ['$scope', '$filter', '$state', '$http', '$stateParams', 'util',
        function ($scope, $filter, $state, $http, $stateParams, util) {
            var self = this;
            
            self.init = function() {
                self.loadHotelInfo();
                self.defaultLangCode = util.getDefaultLangCode();
            }

            self.loadHotelInfo = function() {
                var data = JSON.stringify({
                    action: "getHotelList",
                    token: util.getParams('token'),
                    lang: util.langStyle()
                })
                self.loading = true;

                $http({
                    method: 'POST',
                    url: util.getApiUrl('hotelroom', '', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var data = response.data;
                    if (data.rescode == '200') {
                        self.list = data.data;
                    } else {
                        alert('读取信息失败' + data.errInfo);
                    }
                }, function errorCallback(response) {
                    alert('服务器出错');
                }).finally(function (e) {
                    self.loading = false;
                });
            }

            self.delete = function(id) {
                if(!confirm('确认删除？')) {
                    return;
                }

                var data = JSON.stringify({
                    action: "delHotel",
                    token: util.getParams('token'),
                    lang: util.langStyle(),
                    "HotelID":id
                })

                $http({
                    method: 'POST',
                    url: util.getApiUrl('hotelroom', '', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var data = response.data;
                    if (data.rescode == '200') {
                        alert('已删除');
                        $state.reload();
                    } else {
                        alert('删除失败' + data.errInfo);
                    }
                }, function errorCallback(response) {
                    alert('服务器出错');
                });
            }

            self.edit = function(id) {
                $scope.app.maskParams = {'hotelId': id};
                $scope.app.showHideMask(true,'pages/hotelEdit.html');
            }

            self.add = function() {
                $scope.app.showHideMask(true,'pages/projectConfig/hotelAdd.html');
            }

            self.showSections = function (id) {
                $state.go('app.projectConfig.hotelList.sections',{id:id});

            }
            
        }
    ])

    .controller('sectionController', ['$q', '$scope', '$filter', '$state', '$http', '$stateParams', 'util',
            function ($q, $scope, $filter, $state, $http, $stateParams, util) {
                var self = this;

                self.init = function () {
                    self.hotelId = $stateParams.id;
                    self.defaultLangCode = util.getDefaultLangCode();
                    self.getHotelInfo();
                    self.loadSection();
                }

                self.getHotelInfo = function () {
                    var deferred = $q.defer();
                    self.loading = true;
                    var data = JSON.stringify({
                        action: "getHotel",
                        token: util.getParams('token'),
                        lang: util.langStyle(),
                        HotelID: Number(self.hotelId)
                    })
                    $http({
                        method: 'POST',
                        url: util.getApiUrl('hotelroom', '', 'server'),
                        data: data
                    }).then(function successCallback(response) {
                        var data = response.data;
                        if (data.rescode == '200') {
                            self.hotel = {};
                            self.hotel.Name = data.data.Name;
                            deferred.resolve();
                        } else if (data.rescode == '401') {
                            alert('访问超时，请重新登录');
                            $location.path("pages/login.html");
                        } else {
                            alert('读取信息失败，' + data.errInfo);
                            deferred.reject();
                        }
                    }, function errorCallback(response) {
                        alert(response.status + ' 服务器出错');
                        deferred.reject();
                    }).finally(function (e) {
                        self.loading = false;
                    });
                    return deferred.promise;
                };

                self.add = function () {
                    $scope.app.showHideMask(true,'pages/projectConfig/sectionAdd.html');
                };

                self.edit = function (id,name) {
                    console.log(id);
                    $scope.app.maskParams.sectionId = id;
                    $scope.app.maskParams.sectionName = name;

                    $scope.app.showHideMask(true,'pages/projectConfig/sectionEdit.html');
                };

                self.del = function () {
                    if(!confirm('确认删除？')) {
                        return;
                    }

                    var data = JSON.stringify({
                        action: "deleteSection",
                        token: util.getParams('token'),
                        lang: util.langStyle(),
                        hotelID:id
                    })

                    $http({
                        method: 'POST',
                        url: util.getApiUrl('section', '', 'server'),
                        data: data
                    }).then(function successCallback(response) {
                        var data = response.data;
                        if (data.rescode == '200') {
                            alert('已删除');
                            $state.reload();
                        } else {
                            alert('删除失败' + data.errInfo);
                        }
                    }, function errorCallback(response) {
                        alert('服务器出错');
                    });
                }

                self.loadSection = function () {
                    var deferred = $q.defer();
                    self.loading = true;
                    var data = JSON.stringify({
                        action: "getSectionList",
                        token: util.getParams('token'),
                        lang: util.langStyle(),
                        hotelID: Number(self.hotelId)
                    })
                    $http({
                        method: 'POST',
                        url: util.getApiUrl('section', '', 'server'),
                        data: data
                    }).then(function successCallback(response) {
                        var data = response.data;
                        if (data.rescode == '200') {
                            self.section = {};
                            if(data.sectionList){
                                self.list = data.sectionList;
                            }

                            deferred.resolve();
                        } else if (data.rescode == '401') {
                            alert('访问超时，请重新登录');
                            $location.path("pages/login.html");
                        } else {
                            alert('读取信息失败，' + data.errInfo);
                            deferred.reject();
                        }
                    }, function errorCallback(response) {
                        alert(response.status + ' 服务器出错');
                        deferred.reject();
                    }).finally(function (e) {
                        self.loading = false;
                    });
                    return deferred.promise;
                }


            }
        ])

    .controller('sectionAddController', ['$scope', '$filter', '$state', '$http', '$stateParams', 'util',
            function ($scope, $filter, $state, $http, $stateParams, util) {
                var self = this;

                self.cancel = function () {
                    $scope.app.showHideMask(false);
                }

                self.init = function () {
                    self.defaultLangCode = util.getDefaultLangCode();
                    self.editLangs = util.getParams('editLangs');
                    self.section = {};
                    self.hotelid = $stateParams.id;
                };

                self.save = function () {
                    self.saving = true;
                    var data = JSON.stringify({
                        action: "addSection",
                        token: util.getParams('token'),
                        lang: util.langStyle(),
                        name: self.section.Name,
                        hotelID: self.hotelid

                    })
                    $http({
                        method: 'POST',
                        url: util.getApiUrl('section', '', 'server'),
                        data: data
                    }).then(function successCallback(response) {
                        var data = response.data;
                        if (data.rescode == '200') {
                            alert('添加成功');
                            $state.reload();
                        } else {
                            alert('添加失败' + data.errInfo);
                        }
                    }, function errorCallback(response) {
                        alert(response.status + ' 服务器出错');
                    }).finally(function (e) {
                        self.saving = false;
                    });
                }


            }
        ])

    .controller('sectionEditController', ['$q', '$scope', '$state', '$http', '$stateParams', '$filter', 'util', 'CONFIG',
            function ($q, $scope, $state, $http, $stateParams, $filter, util, CONFIG) {
                console.log('sectionEditController');
                var self = this;
                self.init = function () {
                    self.defaultLangCode = util.getDefaultLangCode();
                    self.sectionId = $scope.app.maskParams.sectionId;
                    console.log(self.sectionId);
                    self.sectionName = $scope.app.maskParams.sectionName;
                    self.editLangs = util.getParams('editLangs');

                };


                self.cancel = function () {
                    $scope.app.showHideMask(false);
                };

                self.save = function () {
                    self.saving = true;
                    var data = JSON.stringify({
                        action: "editSection",
                        token: util.getParams('token'),
                        lang: util.langStyle(),
                        sectionID: Number(self.sectionId),
                        name: self.sectionName

                    })
                    $http({
                        method: 'POST',
                        url: util.getApiUrl('section', '', 'server'),
                        data: data
                    }).then(function successCallback(response) {
                        var data = response.data;
                        if (data.rescode == '200') {
                            alert('修改成功');
                            $state.reload();
                        } else {
                            alert('保存失败' + data.errInfo);
                        }
                    }, function errorCallback(response) {
                        alert(response.status + ' 服务器出错');
                    }).finally(function (e) {
                        self.saving = false;
                    });
                }
            }
        ])

    .controller('hotelAddController', ['$scope', '$state', '$http', '$stateParams', '$filter', 'util', 'CONFIG',
        function ($scope, $state, $http, $stateParams, $filter, util, CONFIG) {
            console.log('hotelADDController');
            var self = this;
            self.items=[];    //初始化数组，以便为每一个ng-model分配一个对象
            var i=0;

            self.init = function () {
                self.defaultLangCode = util.getDefaultLangCode();
                self.ifCheckedHotelTags = [];
                self.editLangs = util.getParams('editLangs');
                self.hotel = {};
                self.imgs1 = new Imgs([]);
                self.imgs2 = new Imgs([], true);
                self.getHotelTags();


            }

            self.cancel = function () {
                $scope.app.showHideMask(false);
            }



            self.save = function () {
                var imgs = [];
                for (var i = 0; i < self.imgs1.data.length; i++) {
                    imgs[i] = {};
                    imgs[i].Seq = i;
                    imgs[i].ImageURL = self.imgs1.data[i].src;
                    imgs[i].ImageSize = self.imgs1.data[i].fileSize;
                }
                //检查图片未上传
                // if (imgs.length == 0) {
                //     alert('请上传酒店图片')
                //     return;
                // }
                //检查logo上传
                // if (self.imgs2.data.length == 0) {
                //     alert('请上传酒店LOGO')
                //     return;
                // }

                var tags = [];
                for (var i = 0; i < self.ifCheckedHotelTags.length; i++) {
                    if (self.ifCheckedHotelTags[i].checked) {
                        tags.push({"ID": self.ifCheckedHotelTags[i].ID});
                    }
                }
                self.saving = true;
                var data = JSON.stringify({
                    action: "addHotel",
                    token: util.getParams('token'),
                    lang: util.langStyle(),
                    data: {
                        "Name": self.hotel.Name,
                        "CityName": "北京",
                        "LocationX": self.hotel.LocationX ? self.hotel.LocationX : 0,
                        "LocationY": self.hotel.LocationY ? self.hotel.LocationY : 0,
                        "LogoURL": self.imgs2.data.length > 0 ? self.imgs2.data[0].src : "",
                        "Features": [],
                        "TelePhone": null,
                        "AdminPhoneNum": '11111',
                        "Address": self.hotel.Address ? self.hotel.Address : {},
                        "Description": self.hotel.Description ? self.hotel.Description : {},
                        "OfficePhone": null,
                        "Gallery": [],
                        "TermMainPage": ''
                    }
                })
                $http({
                    method: 'POST',
                    url: util.getApiUrl('hotelroom', '', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var data = response.data;
                    if (data.rescode == '200') {
                        alert('添加成功');
                        $state.reload();
                    } else {
                        alert('添加失败' + data.err);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function (e) {
                    self.saving = false;
                });
            }

            self.getHotelTags = function () {
                self.loading = true;
                var data = JSON.stringify({
                    action: "getHotelFeatureTag",
                    token: util.getParams('token'),
                    lang: util.langStyle()
                })
                $http({
                    method: 'POST',
                    url: util.getApiUrl('hotelroom', '', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var data = response.data;
                    if (data.rescode == '200') {
                        self.hotelTags = data.data;
                        self.initIfCheckedHotelTags();
                    } else {
                        alert('读取酒店标签出错' + data.rescode + ' ' + data.errInfo);
                    }
                }, function errorCallback(response) {
                    alert(response.status + ' 服务器出错');
                }).finally(function (e) {
                    self.loading = false;
                });
            }

            self.initIfCheckedHotelTags = function () {
                for (var i = 0; i < self.hotelTags.length; i++) {
                    self.ifCheckedHotelTags[i] = {};
                    self.ifCheckedHotelTags[i].checked = false;
                    self.ifCheckedHotelTags[i].ID = self.hotelTags[i].ID;
                }
            }

            self.clickUpload = function (e) {
                setTimeout(function () {
                    document.getElementById(e).click();
                }, 0);
            }

            /*科室分区的编辑*/

            self.getResult=function(){      //计算输入框的总值
                var result=0;
                console.log(self.items)
                angular.forEach(self.items,function(item,key){

                    result+=parseInt(self.items[key]);
                })
                self.result=result;
            }

            self.Fn= {
                add: function () {         //每次添加都要给items数组的长度加一
                    self.items[i] = '';
                    i++;
                },
                del: function (key) {      //每次删除一个输入框都后要让i自减，否则重新添加时会出bug
                    console.log(key);
                    self.items.splice(key, 1);
                    i--;
                    self.getResult();    //每次删除时得重新计算总值
                }
            }


            function Imgs(imgList, single) {
                this.initImgList = imgList;
                this.data = [];
                this.maxId = 0;
                this.single = single ? true : false;
            }

            Imgs.prototype = {
                initImgs: function () {
                    var l = this.initImgList;
                    for (var i = 0; i < l.length; i++) {
                        this.data[i] = {
                            "src": l[i].ImageURL,
                            "fileSize": l[i].ImageSize,
                            "id": this.maxId++,
                            "progress": 100
                        };
                    }
                },
                deleteById: function (id) {
                    var l = this.data;
                    for (var i = 0; i < l.length; i++) {
                        if (l[i].id == id) {
                            // 如果正在上传，取消上传
                            if (l[i].progress < 100 && l[i].progress != -1) {
                                l[i].xhr.abort();
                            }
                            l.splice(i, 1);
                            break;
                        }
                    }
                },

                add: function (xhr, fileName, fileSize) {
                    this.data.push({
                        "xhr": xhr,
                        "fileName": fileName,
                        "fileSize": fileSize,
                        "progress": 0,
                        "id": this.maxId
                    });
                    return this.maxId++;
                },

                update: function (id, progress, leftSize, fileSize) {
                    for (var i = 0; i < this.data.length; i++) {
                        var f = this.data[i];
                        if (f.id === id) {
                            f.progress = progress;
                            f.leftSize = leftSize;
                            f.fileSize = fileSize;
                            break;
                        }
                    }
                },

                setSrcSizeByXhr: function (xhr, src, size) {
                    for (var i = 0; i < this.data.length; i++) {
                        if (this.data[i].xhr == xhr) {
                            this.data[i].src = src;
                            this.data[i].fileSize = size;
                            break;
                        }
                    }
                },

                uploadFile: function (e, o) {

                    // 如果这个对象只允许上传一张图片
                    if (this.single) {
                        // 删除第二张以后的图片
                        for (var i = 1; i < this.data.length; i++) {
                            this.deleteById(this.data[i].id);
                        }
                    }

                    var file = $scope[e];
                    var uploadUrl = CONFIG.uploadUrl;
                    var xhr = new XMLHttpRequest();
                    var fileId = this.add(xhr, file.name, file.size, xhr);
                    // self.search();

                    util.uploadFileToUrl(xhr, file, uploadUrl, 'normal',
                        function (evt) {
                            $scope.$apply(function () {
                                if (evt.lengthComputable) {
                                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                                    o.update(fileId, percentComplete, evt.total - evt.loaded, evt.total);
                                    console.log(percentComplete);
                                }
                            });
                        },
                        function (xhr) {
                            var ret = JSON.parse(xhr.responseText);
                            console && console.log(ret);
                            $scope.$apply(function () {
                                o.setSrcSizeByXhr(xhr, ret.upload_path, ret.size);
                                // 如果这个对象只允许上传一张图片
                                if (o.single) {
                                    // 删除第一站图片
                                    if(o.data.length > 1) {
                                        o.deleteById(o.data[0].id);
                                    }
                                }
                            });
                        },
                        function (xhr) {
                            $scope.$apply(function () {
                                o.update(fileId, -1, '', '');
                            });
                            console.log('failure');
                            xhr.abort();
                        }
                    );
                }
            }
        }
    ])

    .controller('pcProjectInfoController', ['$scope', '$state', '$http', 'CONFIG', 'util',
        function ($scope, $state, $http, CONFIG, util) {
            var self = this;
            
            self.init = function() {
                self.editLangs = util.getParams('editLangs');
                self.loadInfo();
            }

            self.loadInfo = function() {
                var data = JSON.stringify({
                    action: "getTotalInfo",
                    token: util.getParams('token'),
                    lang: util.langStyle()
                })
                self.loading = true;

                $http({
                    method: 'POST',
                    url: util.getApiUrl('hotelroom', '', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var data = response.data;
                    if (data.rescode == '200') {
                        self.projectName = JSON.parse(data.data.projectName);
                        self.LogoImg = data.data.ProjectLogo;
                        self.imgs1 = new Imgs([{"ImageURL": self.LogoImg, "ImageSize": 0}], true);
                        self.imgs1.initImgs();
                    } else {
                        alert('读取信息失败' + data.errInfo);
                    }
                }, function errorCallback(response) {
                    alert('服务器出错');
                }).finally(function (e) {
                    self.loading = false;
                });
            }

            

            self.save = function () {
                var imgs = [];
                for (var i = 0; i < self.imgs1.data.length; i++) {
                    imgs[i] = {};
                    imgs[i].Seq = i;
                    imgs[i].ImageURL = self.imgs1.data[i].src;
                    imgs[i].ImageSize = self.imgs1.data[i].fileSize;
                }
                //检查图片未上传
                if (imgs.length == 0) {
                    alert('请上传LOGO')
                    return;
                }

                self.saving = true;
                var data = JSON.stringify({
                    action: "setTotalInfo",
                    token: util.getParams('token'),
                    lang: util.langStyle(),
                    data: {
                        "projectName": self.projectName,
                        "ProjectLogo": self.imgs1.data[0].src
                    }
                })
                $http({
                    method: 'POST',
                    url: util.getApiUrl('hotelroom', '', 'server'),
                    data: data
                }).then(function successCallback(response) {
                    var data = response.data;
                    if (data.rescode == '200') {
                        alert('保存成功');
                        $state.reload();
                    } else {
                        alert('保存失败' + data.errInfo);
                    }
                }, function errorCallback(response) {
                    alert('服务器出错');
                }).finally(function (e) {
                    self.saving = false;
                });
            }

            // 图片上传相关
            self.clickUpload = function (e) {
                setTimeout(function () {
                    document.getElementById(e).click();
                }, 0);
            }

            function Imgs(imgList, single) {
                this.initImgList = imgList;
                this.data = [];
                this.maxId = 0;
                this.single = single ? true : false;
            }

            Imgs.prototype = {
                initImgs: function () {
                    var l = this.initImgList;
                    for (var i = 0; i < l.length; i++) {
                        this.data[i] = {
                            "src": l[i].ImageURL,
                            "fileSize": l[i].ImageSize,
                            "id": this.maxId++,
                            "progress": 100
                        };
                    }
                },
                deleteById: function (id) {
                    var l = this.data;
                    for (var i = 0; i < l.length; i++) {
                        if (l[i].id == id) {
                            // 如果正在上传，取消上传
                            if (l[i].progress < 100 && l[i].progress != -1) {
                                l[i].xhr.abort();
                            }
                            l.splice(i, 1);
                            break;
                        }
                    }
                },

                add: function (xhr, fileName, fileSize) {
                    this.data.push({
                        "xhr": xhr,
                        "fileName": fileName,
                        "fileSize": fileSize,
                        "progress": 0,
                        "id": this.maxId
                    });
                    return this.maxId++;
                },

                update: function (id, progress, leftSize, fileSize) {
                    for (var i = 0; i < this.data.length; i++) {
                        var f = this.data[i];
                        if (f.id === id) {
                            f.progress = progress;
                            f.leftSize = leftSize;
                            f.fileSize = fileSize;
                            break;
                        }
                    }
                },

                setSrcSizeByXhr: function (xhr, src, size) {
                    for (var i = 0; i < this.data.length; i++) {
                        if (this.data[i].xhr == xhr) {
                            this.data[i].src = src;
                            this.data[i].fileSize = size;
                            break;
                        }
                    }
                },

                uploadFile: function (e, o) {

                    // 如果这个对象只允许上传一张图片
                    if (this.single) {
                        // 删除第二张以后的图片
                        for (var i = 1; i < this.data.length; i++) {
                            this.deleteById(this.data[i].id);
                        }
                    }

                    var file = $scope[e];
                    var uploadUrl = CONFIG.uploadUrl;
                    var xhr = new XMLHttpRequest();
                    var fileId = this.add(xhr, file.name, file.size, xhr);
                    // self.search();

                    util.uploadFileToUrl(xhr, file, uploadUrl, 'normal',
                        function (evt) {
                            $scope.$apply(function () {
                                if (evt.lengthComputable) {
                                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                                    o.update(fileId, percentComplete, evt.total - evt.loaded, evt.total);
                                    console && console.log(percentComplete);
                                }
                            });
                        },
                        function (xhr) {
                            var ret = JSON.parse(xhr.responseText);
                            console && console.log(ret);
                            $scope.$apply(function () {
                                o.setSrcSizeByXhr(xhr, ret.upload_path, ret.size);
                                // 如果这个对象只允许上传一张图片
                                if (o.single) {
                                    // 如果长度大于1张图片，删除前几张图片
                                    if(o.data.length > 1) {
                                        for(var i=0; i<o.data.length-1;i++) {
                                            o.deleteById(o.data[i].id);
                                        }
                                    }
                                }
                            });
                        },
                        function (xhr) {
                            $scope.$apply(function () {
                                o.update(fileId, -1, '', '');
                            });
                            console && console.log('failure');
                            xhr.abort();
                        }
                    );
                }
            }

            
        }
    ])

})();
