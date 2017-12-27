webpackJsonp(["main"],{

/***/ "../../../../../public/spa/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../public/spa/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "../../../../../public/spa/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../public/spa/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<app-navbar></app-navbar>\n<div class=\"container\">\n    <router-outlet></router-outlet>\n</div>\n\n\n"

/***/ }),

/***/ "../../../../../public/spa/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = (function () {
    function AppComponent() {
        this.title = 'app';
    }
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__("../../../../../public/spa/app/app.component.html"),
            styles: [__webpack_require__("../../../../../public/spa/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "../../../../../public/spa/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__("../../../../../public/spa/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__navbar_navbar_component__ = __webpack_require__("../../../../../public/spa/app/navbar/navbar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__home_home_component__ = __webpack_require__("../../../../../public/spa/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__collections_collections_component__ = __webpack_require__("../../../../../public/spa/app/collections/collections.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__data_data_component__ = __webpack_require__("../../../../../public/spa/app/data/data.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__data_service__ = __webpack_require__("../../../../../public/spa/app/data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__auth_service__ = __webpack_require__("../../../../../public/spa/app/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__loggedin_guard__ = __webpack_require__("../../../../../public/spa/app/loggedin.guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__app_routing__ = __webpack_require__("../../../../../public/spa/app/app.routing.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Angular imports



// Components





// Services



// routing

var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_4__navbar_navbar_component__["a" /* NavbarComponent */],
                __WEBPACK_IMPORTED_MODULE_5__home_home_component__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_6__collections_collections_component__["a" /* CollectionsComponent */],
                __WEBPACK_IMPORTED_MODULE_7__data_data_component__["a" /* DataComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_11__app_routing__["a" /* routing */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_9__auth_service__["a" /* AuthService */],
                __WEBPACK_IMPORTED_MODULE_8__data_service__["b" /* DataService */],
                __WEBPACK_IMPORTED_MODULE_10__loggedin_guard__["a" /* LoggedinGuard */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "../../../../../public/spa/app/app.routing.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return routing; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_home_component__ = __webpack_require__("../../../../../public/spa/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_data_component__ = __webpack_require__("../../../../../public/spa/app/data/data.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__collections_collections_component__ = __webpack_require__("../../../../../public/spa/app/collections/collections.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__loggedin_guard__ = __webpack_require__("../../../../../public/spa/app/loggedin.guard.ts");





var routing = __WEBPACK_IMPORTED_MODULE_0__angular_router__["c" /* RouterModule */].forRoot([
    { path: '', component: __WEBPACK_IMPORTED_MODULE_1__home_home_component__["a" /* HomeComponent */] },
    {
        path: 'data',
        component: __WEBPACK_IMPORTED_MODULE_2__data_data_component__["a" /* DataComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_4__loggedin_guard__["a" /* LoggedinGuard */]]
    },
    {
        path: 'collections/:coll',
        component: __WEBPACK_IMPORTED_MODULE_3__collections_collections_component__["a" /* CollectionsComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_4__loggedin_guard__["a" /* LoggedinGuard */]]
    }
]);


/***/ }),

/***/ "../../../../../public/spa/app/auth.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* unused harmony export Profile */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__("../../../../rxjs/_esm5/Rx.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthService = (function () {
    function AuthService(_http) {
        var _this = this;
        this._http = _http;
        this._url = "/api/me";
        this._isAuthenticated = false;
        //public user: IProfile = new Profile();
        this.listen = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["a" /* BehaviorSubject */](new Profile());
        this.getProfile().subscribe(function (u) {
            _this.listen.next(u);
        });
    }
    AuthService.prototype.authenticated = function () {
        return this._isAuthenticated;
    };
    AuthService.prototype.getProfile = function () {
        var _this = this;
        return this._http.get(this._url)
            .map(function (res) {
            var p = new Profile();
            p.displayName = res['user'].profile.displayName; // TODO: need dig deeper in resource object, once we get it....
            p.rc = res['rc'] || "UNDEFINED";
            if (p.rc == "OK") {
                p.httpStatus = 200;
            }
            else {
                p.httpStatus = 403;
            }
            _this._isAuthenticated = (p.rc == "OK");
            return p;
        })
            .catch(function (e) {
            console.log("AuthService.getProfile error object: " + JSON.stringify(e));
            var p = new Profile();
            p.httpStatus = e['status'] || 0;
            p.rc = e['statusText'] || "";
            p.displayName = "";
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["b" /* Observable */].of(p);
        });
    };
    AuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */]])
    ], AuthService);
    return AuthService;
}());

var Profile = (function () {
    function Profile() {
        this.displayName = "I. N. Itializing";
        this.rc = "INITIALIZING";
        this.httpStatus = 503;
    }
    return Profile;
}());



/***/ }),

/***/ "../../../../../public/spa/app/collections/collections.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../public/spa/app/collections/collections.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"isLoggedin\" class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n                {{title}} - Collection: \n                {{ data.name }} \n                [ showing max {{ data.limit }} from position {{ data.offset }} of total {{ data.count }} rows]\n        </div>\n        <div class=\"panel-body\">\n                <div class=\"row\">\n                <button type=\"button\" class=\"btn btn-info\" (click)=\"onPrevPage()\" [disabled]=\"data.offset==0\">\n                        Prev\n                </button>\n                <button type=\"button\" class=\"btn btn-info\" (click)=\"onNextPage()\" [disabled]=\"(data.offset + data.limit) >= data.count\">\n                        Next\n                </button>\n        </div>\n                <div class=\"row\">\n                        <div class=\"col-md-12 \">\n                                <table class=\"table table-striped \">\n                                        <thead>\n                                                <tr>\n                                                        <td>\n                                                                ID\n                                                        </td>\n                                                        <td>\n                                                                Date [UTC]\n                                                        </td>\n                                                        <td>\n                                                                object\n                                                                 \n                                                        </td>\n                                                </tr>\n                                        </thead>\n\n                                        <tbody *ngIf=\"data\">\n                                                <tr *ngFor=\"let row of data.rows\">\n                                                        <td>\n                                                                {{ row.id }}\n                                                        </td>\n                                                        <td>\n                                                                {{ row.date | date:'yyyy-MM-dd HH:mm:ss':'UTC' }}\n                                                        <td>\n                                                                <pre>{{ row | json }}</pre>\n                                                        </td>\n                                                        <td>\n                                                                <button type=\"button\" class=\"btn btn-warning\" (click)=\"onDelete(row.id)\" [disabled]=\"isDeleting==row.id\">\n                                                                        Delete\n                                                                </button>\n                                                        </td>\n                                                </tr>\n\n                                        </tbody>\n                                </table>\n                        </div>\n                </div>\n        </div>\n</div>\n\n<div *ngIf=\"!isLoggedin\" class=\"panel panel-danger\">\n        <div class=\"panel-heading\">\n                {{title}}\n        </div>\n        <div class=\"panel-body\">\n                You are not logged in\n        </div>\n</div>"

/***/ }),

/***/ "../../../../../public/spa/app/collections/collections.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CollectionsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__("../../../../../public/spa/app/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_service__ = __webpack_require__("../../../../../public/spa/app/data.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CollectionsComponent = (function () {
    function CollectionsComponent(_authService, _dataService, _route) {
        this._authService = _authService;
        this._dataService = _dataService;
        this._route = _route;
        this.isLoggedin = false;
        this.title = "CollectionsComponent";
        this.errorMsg = "";
        this.infoMsg = "";
        this.isLoading = true;
        this.isDeleting = "";
        this.colName = "";
        this.limit = 5;
        this.offset = 0;
        this.data = new __WEBPACK_IMPORTED_MODULE_3__data_service__["a" /* CollectionData */]();
    }
    CollectionsComponent.prototype.load = function () {
        var _this = this;
        this.isLoading = true;
        this._dataService
            .getCollectionData(this.colName, this.offset, this.limit)
            .subscribe(function (d) {
            _this.data = d;
            console.log(d);
            _this.isLoading = false;
        });
    };
    CollectionsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._authService.listen.subscribe(function (u) {
            _this.isLoggedin = (u.httpStatus == 200);
        });
        this._route.params.subscribe(function (params) {
            _this.colName = params["coll"];
            _this.load();
        });
    };
    CollectionsComponent.prototype.onDelete = function (id) {
        var _this = this;
        this.isDeleting = id;
        this._dataService.deleteRow(this.colName, id).subscribe(function (s) {
            if (s.rc == "OK") {
                _this.info("deleted ID: " + id);
                // this.form.reset()// reset form to be untouched, clear fields
                _this.load();
                _this.isDeleting = "";
            }
            else {
                _this.error("response from delete: " + JSON.stringify(s));
                _this.isDeleting = "";
            }
        }, function (e) {
            _this.error('delete returned error: ' + e);
            _this.isDeleting = "";
        });
    };
    CollectionsComponent.prototype.onNextPage = function () {
        this.offset += this.limit;
        this.load();
    };
    CollectionsComponent.prototype.onPrevPage = function () {
        this.offset -= this.limit;
        if (this.offset < 0) {
            this.offset = 0;
        }
        this.load();
    };
    CollectionsComponent.prototype.info = function (s) {
        this.infoMsg = s;
        this.errorMsg = "";
    };
    CollectionsComponent.prototype.error = function (s) {
        this.errorMsg = s;
        this.infoMsg = "";
    };
    CollectionsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'spa-collections',
            template: __webpack_require__("../../../../../public/spa/app/collections/collections.component.html"),
            styles: [__webpack_require__("../../../../../public/spa/app/collections/collections.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_3__data_service__["b" /* DataService */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]])
    ], CollectionsComponent);
    return CollectionsComponent;
}());



/***/ }),

/***/ "../../../../../public/spa/app/data.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DataService; });
/* unused harmony export DataServiceResponse */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CollectionData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DataService = (function () {
    function DataService(_http) {
        this._http = _http;
        this._url = "/api/collections";
    }
    DataService.prototype.getCollections = function () {
        return this._http.get(this._url);
    };
    DataService.prototype.getCollectionData = function (coll, offset, limit) {
        offset = offset || 0;
        limit = limit || 10;
        return this._http.get(this._url + "/" + coll + "?filldate=1&offset=" + offset + "&limit=" + limit, { observe: 'response' }).map(function (r) {
            var d = new CollectionData(coll, Number(r.headers.get('X-Total-Count')), offset, limit);
            for (var _i = 0, _a = r.body; _i < _a.length; _i++) {
                var s = _a[_i];
                var o = new CollectionRow(JSON.stringify(s));
                d.push(o);
            }
            return d;
        });
    };
    DataService.prototype.deleteRow = function (collectionName, id) {
        var url = this._url + "/" + collectionName + "/" + id;
        // var headers = new Headers({});
        // var options= new RequestOptions({
        //   headers: headers,
        //   search: "user_key=" + this._user_key
        // });
        return this._http.delete(url)
            .map(this._mapDeleteResponse);
        // .catch(this.handleError);
    };
    DataService.prototype._mapDeleteResponse = function (result) {
        var rc = result.ok == 1 ?
            { rc: "OK", n: result.n } : { rc: "ERROR", n: result.n };
        return rc;
    };
    DataService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], DataService);
    return DataService;
}());

var DataServiceResponse = (function () {
    function DataServiceResponse(s) {
        this.rc = s;
    }
    return DataServiceResponse;
}());

var MongoDeleteResponse = (function () {
    function MongoDeleteResponse() {
    }
    return MongoDeleteResponse;
}());
var CollectionRow = (function () {
    function CollectionRow(s) {
        this.obj = JSON.parse(s) || {};
        this.id = this.obj._id || "unknown ID";
        this.date = this.obj.date || "unknown date";
    }
    return CollectionRow;
}());
var CollectionData = (function () {
    function CollectionData(name, count, offset, limit) {
        this.name = name || "";
        this.count = count || 0;
        this.offset = offset;
        this.limit = limit;
        this.rows = [];
    }
    CollectionData.prototype.push = function (row) {
        this.rows.push(row);
    };
    return CollectionData;
}());



/***/ }),

/***/ "../../../../../public/spa/app/data/data.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../public/spa/app/data/data.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"isLoggedin\" class=\"panel panel-default\">\n    <div class=\"panel-heading\">\n        {{ title }}\n    </div>\n    <div class=\"panel-body\">\n\n        <div class=\"row\">\n            <div class=\"col-md-8 col-md-offset-2 \">\n                <table class=\"table table-striped \">\n                    <thead>\n                        <tr>\n                            <td>Collections [ {{collectionCount}} items ]</td>\n                        </tr>\n                    </thead>\n\n                    <tbody>\n                        <tr *ngFor=\"let c of collections\">\n                            <td>\n                                <a routerLink=\"/collections/{{ c }}\">\n                                    {{ c }}\n                                </a>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n\n    </div>\n</div>\n\n<div *ngIf=\"!isLoggedin\" class=\"panel panel-danger\">\n    <div class=\"panel-heading\">\n        {{title}}\n    </div>\n    <div class=\"panel-body\">\n        You are not logged in\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../public/spa/app/data/data.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__("../../../../../public/spa/app/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_service__ = __webpack_require__("../../../../../public/spa/app/data.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var DataComponent = (function () {
    function DataComponent(_authService, _dataService) {
        this._authService = _authService;
        this._dataService = _dataService;
        this.isLoggedin = false;
        this.collections = [];
        this.collectionCount = 0;
        this.title = 'Data Component';
    }
    DataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._authService.listen.subscribe(function (u) {
            _this.isLoggedin = (u.httpStatus == 200);
            // console.log("HomeComponent got auth status: "+ u.httpStatus)
            _this.getCollections();
        });
    };
    DataComponent.prototype.getCollections = function () {
        var _this = this;
        this._dataService.getCollections().subscribe(function (s) {
            _this.collections = s;
            _this.collectionCount = s.length;
        });
    };
    DataComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'spa-data',
            template: __webpack_require__("../../../../../public/spa/app/data/data.component.html"),
            styles: [__webpack_require__("../../../../../public/spa/app/data/data.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2__data_service__["b" /* DataService */]])
    ], DataComponent);
    return DataComponent;
}());



/***/ }),

/***/ "../../../../../public/spa/app/home/home.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../public/spa/app/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"isLoggedin\" class=\"panel panel-default\">\n    <div class=\"panel-heading\">\n            {{title}}\n        </div>\n    <div class=\"panel-body\">\n\n        <div class=\"row\">\n            <div class=\"col-md-8 col-md-offset-2 \">\n                <table class=\"table table-striped \">\n                    <thead>\n                        <tr>\n                            <td>Collections [ {{collectionCount}} items ]</td>\n                        </tr>\n                    </thead>\n\n                    <tbody>\n                        <tr *ngFor=\"let c of collections\">\n                            <td>\n                                <a routerLink=\"collections/{{ c }}\">\n                                    {{ c }}\n                                </a>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n\n    </div>\n</div>\n\n<div *ngIf=\"!isLoggedin\" class=\"panel panel-danger\">\n    <div class=\"panel-heading\">\n        {{title}}\n    </div>\n    <div class=\"panel-body\">\n        You are not logged in\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../public/spa/app/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__("../../../../../public/spa/app/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_service__ = __webpack_require__("../../../../../public/spa/app/data.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HomeComponent = (function () {
    function HomeComponent(_authService, _dataService) {
        this._authService = _authService;
        this._dataService = _dataService;
        this.isLoggedin = false;
        this.collections = [];
        this.collectionCount = 0;
        this.title = 'Home Component';
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._authService.listen.subscribe(function (u) {
            _this.isLoggedin = (u.httpStatus == 200);
            // console.log("HomeComponent got auth status: "+ u.httpStatus)
            _this.getCollections();
        });
    };
    HomeComponent.prototype.getCollections = function () {
        var _this = this;
        this._dataService.getCollections().subscribe(function (s) {
            _this.collections = s;
            _this.collectionCount = s.length;
        });
    };
    HomeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-home',
            template: __webpack_require__("../../../../../public/spa/app/home/home.component.html"),
            styles: [__webpack_require__("../../../../../public/spa/app/home/home.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2__data_service__["b" /* DataService */]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "../../../../../public/spa/app/loggedin.guard.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoggedinGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__("../../../../../public/spa/app/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LoggedinGuard = (function () {
    function LoggedinGuard(_authService, _router) {
        this._authService = _authService;
        this._router = _router;
    }
    LoggedinGuard.prototype.canActivate = function (next, state) {
        if (this._authService.authenticated()) {
            return true;
        }
        else {
            this._router.navigate(['']);
            return false;
        }
    };
    LoggedinGuard = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]])
    ], LoggedinGuard);
    return LoggedinGuard;
}());



/***/ }),

/***/ "../../../../../public/spa/app/navbar/navbar.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../public/spa/app/navbar/navbar.component.html":
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-inverse navbar-fixed-top\">\n  <div class=\"container\">\n    <!-- Brand and toggle get grouped for better mobile display -->\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#lgnavbar\" aria-expanded=\"false\">\n                <span class=\"sr-only\">Toggle Navigation</span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n            </button>\n      <a class=\"navbar-brand\" href=\"/\">\n        <img src=\"assets/img/logo.png\" alt=\"SPA\" height=\"49\" width=\"49\">\n      </a>\n    </div>\n\n    <!-- Collect the nav links, forms, and other content for toggling -->\n    <div class=\"collapse navbar-collapse navbar-left\" id=\"lgnavbar\">\n      <ul class=\"nav navbar-nav\">\n        <li>\n          <a routerLink=\"\"> Spa Home </a>\n        </li>\n        <li>\n          <a *ngIf=\"isLoggedin\" routerLink=\"data\">Data</a>\n        </li>\n    \n        <li *ngIf=\"isLoggedin\" >\n          <a href=\"/logout\"> [ {{ profile.displayName }} ]</a>\n        </li>\n        <li *ngIf=\"!isLoggedin\">\n          <a  href=\"/login\"> [ Login ]</a>\n        </li>\n    \n      </ul>\n    </div>\n    <!-- /.navbar-collapse -->\n\n  </div>\n</nav>"

/***/ }),

/***/ "../../../../../public/spa/app/navbar/navbar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavbarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__("../../../../../public/spa/app/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NavbarComponent = (function () {
    function NavbarComponent(_authService, _router) {
        var _this = this;
        this._authService = _authService;
        this._router = _router;
        this.isLoggedin = false;
        this._authService.listen.subscribe(function (u) {
            _this.profile = u;
            _this.isLoggedin = (u.httpStatus == 200);
            // console.log("NavBarComponent got auth status: "+ this.profile.httpStatus)
        });
    }
    NavbarComponent.prototype.ngOnInit = function () {
    };
    NavbarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-navbar',
            template: __webpack_require__("../../../../../public/spa/app/navbar/navbar.component.html"),
            styles: [__webpack_require__("../../../../../public/spa/app/navbar/navbar.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]])
    ], NavbarComponent);
    return NavbarComponent;
}());



/***/ }),

/***/ "../../../../../public/spa/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "../../../../../public/spa/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../public/spa/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../public/spa/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../public/spa/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map