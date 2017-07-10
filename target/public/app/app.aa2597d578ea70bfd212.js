webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var platform_browser_dynamic_1 = __webpack_require__(1);
	var app_module_1 = __webpack_require__(23);
	platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var platform_browser_1 = __webpack_require__(21);
	var app_component_1 = __webpack_require__(24);
	var navbar_component_1 = __webpack_require__(25);
	var not_found_component_1 = __webpack_require__(28);
	var contact_component_1 = __webpack_require__(29);
	var home_component_1 = __webpack_require__(31);
	var app_routing_1 = __webpack_require__(32);
	var AppModule = (function () {
	    function AppModule() {
	    }
	    return AppModule;
	}());
	AppModule = __decorate([
	    core_1.NgModule({
	        imports: [platform_browser_1.BrowserModule, app_routing_1.routing],
	        declarations: [app_component_1.AppComponent,
	            navbar_component_1.NavbarComponent,
	            home_component_1.HomeComponent,
	            contact_component_1.ContactComponent,
	            not_found_component_1.NotFoundComponent],
	        bootstrap: [app_component_1.AppComponent]
	    }),
	    __metadata("design:paramtypes", [])
	], AppModule);
	exports.AppModule = AppModule;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var AppComponent = (function () {
	    function AppComponent() {
	        this.name = 'Limitless Spa';
	    }
	    return AppComponent;
	}());
	AppComponent = __decorate([
	    core_1.Component({
	        selector: 'spa-app',
	        template: "\n    <navbar></navbar>\n    <div class=\"container\">\n      <h1>Hello {{name}} !</h1>\n      <router-outlet></router-outlet>\n    </div>\n\n    ",
	    }),
	    __metadata("design:paramtypes", [])
	], AppComponent);
	exports.AppComponent = AppComponent;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var auth_service_1 = __webpack_require__(26);
	var NavbarComponent = (function () {
	    function NavbarComponent(_authService) {
	        this._authService = _authService;
	    }
	    NavbarComponent.prototype.ngOnInit = function () {
	        if (this._authService.isLoggedin) {
	            this.userName = this._authService.userName;
	        }
	        else {
	            this.userName = "<None>";
	        }
	    };
	    return NavbarComponent;
	}());
	NavbarComponent = __decorate([
	    core_1.Component({
	        selector: 'navbar',
	        template: __webpack_require__(27),
	        providers: [auth_service_1.AuthService]
	    }),
	    __metadata("design:paramtypes", [auth_service_1.AuthService])
	], NavbarComponent);
	exports.NavbarComponent = NavbarComponent;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var AuthService = (function () {
	    function AuthService() {
	        this.isLoggedin = false;
	    }
	    return AuthService;
	}());
	AuthService = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [])
	], AuthService);
	exports.AuthService = AuthService;


/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "<nav class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n    <div class=\"container\">\n        <!-- Brand and toggle get grouped for better mobile display -->\n        <div class=\"navbar-header\">\n            <button type=\"button\" \n                class=\"navbar-toggle collapsed\" \n                data-toggle=\"collapse\" \n                data-target=\"#lgnavbar\"\n                aria-expanded=\"false\">\n                <span class=\"sr-only\">Toggle Navigation</span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n            </button>\n            <a class=\"navbar-brand\" href=\"#\">\n                <img src=\"/img/logo.png\" alt=\"Limitless Garden\" height=\"50\" width=\"50\">\n            </a>\n        </div>\n\n        <!-- Collect the nav links, forms, and other content for toggling -->\n        <div class=\"collapse navbar-collapse navbar-left\" id=\"lgnavbar\">\n            <ul class=\"nav navbar-nav\">\n                <li><a routerLink=\"app/\"> Spa Home </a></li>\n                <li><a routerLink=\"app/contact\">Contact</a></li>\n                <li><a routerLink=\"\"> User: {{ userName }} </a></li>\n            </ul>\n        </div>\n        <!-- /.navbar-collapse -->\n    </div>\n    <!-- /.container-fluid -->\n</nav>";

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var NotFoundComponent = (function () {
	    function NotFoundComponent() {
	    }
	    return NotFoundComponent;
	}());
	NotFoundComponent = __decorate([
	    core_1.Component({
	        template: "\n        <div class=\"alert alert-danger\">\n            Component not found\n        </div>\n    "
	    }),
	    __metadata("design:paramtypes", [])
	], NotFoundComponent);
	exports.NotFoundComponent = NotFoundComponent;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var contact_service_1 = __webpack_require__(30);
	var ContactComponent = (function () {
	    function ContactComponent(_contactService) {
	        this._contactService = _contactService;
	        this.isLoading = true;
	    }
	    ContactComponent.prototype.ngOnInit = function () {
	        var _this = this;
	        this._contactService.getContact()
	            .subscribe(function (c) {
	            _this.contact = c;
	            _this.isLoading = false;
	        });
	    };
	    return ContactComponent;
	}());
	ContactComponent = __decorate([
	    core_1.Component({
	        template: "\n        <div class=\"alert alert-info\" *ngIf=\"!isLoading\">\n            Contact loaded.\n        </div>\n        <div *ngIf=\"isLoading\">\n            <i class=\"fa fa-spinner fa-spin fa-3x\"></i>\n        </div>\n        <div  *ngIf=\"!isLoading\">\n            <h2> {{ contact.title }} </h2>\n            <p> {{ contact.text }} </p>\n            <p> \n                <a href=\"{{ contact.repoUrl }}\"> \n                    {{ contact.repoUrl }} \n                </a>\n            </p>\n\n    ",
	        providers: [contact_service_1.ContactService]
	    }),
	    __metadata("design:paramtypes", [contact_service_1.ContactService])
	], ContactComponent);
	exports.ContactComponent = ContactComponent;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var Observable_1 = __webpack_require__(5);
	var ContactService = (function () {
	    function ContactService() {
	    }
	    ContactService.prototype.getContact = function () {
	        return Observable_1.Observable.from([{
	                title: "Limitless Spa",
	                text: "This is a Single Page Application connecting to the Limitless Garden API backend",
	                repoUrl: "https://github.com/abarbanell/limitless-garden"
	            }]);
	    };
	    return ContactService;
	}());
	ContactService = __decorate([
	    core_1.Injectable(),
	    __metadata("design:paramtypes", [])
	], ContactService);
	exports.ContactService = ContactService;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(3);
	var contact_service_1 = __webpack_require__(30);
	var HomeComponent = (function () {
	    function HomeComponent(_contactService) {
	        this._contactService = _contactService;
	        this.isLoading = true;
	    }
	    HomeComponent.prototype.ngOnInit = function () {
	        var _this = this;
	        this._contactService.getContact()
	            .subscribe(function (c) {
	            _this.contact = c;
	            _this.isLoading = false;
	        });
	    };
	    return HomeComponent;
	}());
	HomeComponent = __decorate([
	    core_1.Component({
	        template: "\n        <div class=\"alert alert-info\" *ngIf=\"!isLoading\">\n            Home Component loaded.\n        </div>\n        <div *ngIf=\"isLoading\">\n            <i class=\"fa fa-spinner fa-spin fa-3x\"></i>\n        </div>\n        <div  *ngIf=\"!isLoading\">\n            <h2> {{ contact.title }} </h2>\n            <p> {{ contact.text }} </p>\n            <p> \n                <a href=\"{{ contact.repoUrl }}\"> \n                    {{ contact.repoUrl }} \n                </a>\n            </p>\n\n    ",
	        providers: [contact_service_1.ContactService]
	    }),
	    __metadata("design:paramtypes", [contact_service_1.ContactService])
	], HomeComponent);
	exports.HomeComponent = HomeComponent;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var router_1 = __webpack_require__(33);
	// import my components....
	var not_found_component_1 = __webpack_require__(28);
	var contact_component_1 = __webpack_require__(29);
	var home_component_1 = __webpack_require__(31);
	exports.routing = router_1.RouterModule.forRoot([
	    { path: 'app', component: home_component_1.HomeComponent },
	    { path: 'app/contact', component: contact_component_1.ContactComponent },
	    { path: '**', component: not_found_component_1.NotFoundComponent }
	]);


/***/ }
]);
//# sourceMappingURL=app.aa2597d578ea70bfd212.js.map