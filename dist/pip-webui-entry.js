/**
 * @file Entry pages (signin, signup) logic
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry', 
        [
            'ui.router', 'ngMessages', 
            
            'pipCore', 'pipRest', 'pipBasicControls', 'pipLocations', 'pipPictures', 'pipRest.State',
            'pipEntry.Strings', 'pipEntry.Common', 'pipEntry.Signin', 'pipEntry.Signup', 'pipEntry.PostSignup', 
            'pipEntry.RecoverPassword', 'pipEntry.ResetPassword', 'pipEntry.VerifyEmail', 'pipEntry.Templates'
        ]);

    thisModule.config(
        ['$stateProvider', '$locationProvider', '$httpProvider', 'pipAuthStateProvider', function ($stateProvider, $locationProvider, $httpProvider, pipAuthStateProvider) {

            // Switch to HTML5 routing mode
            //$locationProvider.html5Mode(true);


            // Configure module routes for all users
            $stateProvider
                .state('signin', {
                    url: '/signin?email&server_url&redirect_to',
                    auth: false,
                    controller: 'pipSigninController',
                    templateUrl: 'signin/signin.html'
                })
                .state('recover_password', {
                    url: '/recover_password?server_url&email',
                    auth: false,
                    controller: 'pipRecoverPasswordController',
                    templateUrl: 'recover_password/recover_password.html'
                })
                .state('reset_password', {
                    url: '/reset_password?server_url&email&code',
                    auth: false,
                    controller: 'pipResetPasswordController',
                    templateUrl: 'reset_password/reset_password.html'
                })
                .state('signout', { 
                    url: '/signout',
                    auth: false
                })
                .state('signup', {
                    url: '/signup?name&email&server_url',
                    auth: false,
                    controller: 'pipSignupController',
                    templateUrl: 'signup/signup.html'
                })
                .state('post_signup', {
                    url: '/post_signup?party_id',
                    auth: false,
                    controller: 'pipPostSignupController',
                    templateUrl: 'post_signup/post_signup.html',
                    resolve: {
                        $party: /* @ngInject */ ['$rootScope', '$stateParams', 'pipRest', 'pipSession', function ($rootScope, $stateParams, pipRest, pipSession) {
                            var userId = pipSession.userId();
                            var partyId = $stateParams.party_id || userId;

                            if (partyId != userId)
                                throw('ERROR_NOT_ALLOWED');
                            return pipRest.parties().get({ id: partyId }).$promise;
                        }]
                    }
                })
                .state('verify_email', {
                    url: '/verify_email?server_url&email&code',
                    auth: false,
                    controller: 'pipVerifyEmailController',
                    templateUrl: 'verify_email/verify_email.html'
                })
                .state('verify_email_success', {
                    url: '/verify_email_success',
                    auth: false,
                    controller: 'pipVerifyEmailSuccessController',
                    templateUrl: 'verify_email/verify_email_success.html'
                });

            // Set default paths and states
            pipAuthStateProvider.signinState('signin');
            pipAuthStateProvider.signoutState('signout');
        }]
    );
    
})();
(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('post_signup/post_signup.html',
    '<!--\n' +
    '@file Post-signup page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <pip-post-signup-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control"\n' +
    '                pip-party="$party">\n' +
    '\n' +
    '        </pip-post-signup-panel>\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-hide="transaction.busy()" class="md-accent"\n' +
    '                       ng-click="onPostSignupSubmit()" aria-label="CONTINUE">\n' +
    '                {{::\'CONTINUE\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '            <md-button ng-show="transaction.busy()" class="md-warn"\n' +
    '                       ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('post_signup/post_signup_dialog.html',
    '<!--\n' +
    '@file Post signup dialog\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-entry lp0 rp0">\n' +
    '    <md-dialog-content>\n' +
    '        <pip-post-signup-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control"\n' +
    '                pip-party="$party">\n' +
    '\n' +
    '        </pip-post-signup-panel>\n' +
    '    </md-dialog-content>\n' +
    '    <md-dialog-actions class="layout-row layout-align-end-center">\n' +
    '        <md-button ng-hide="transaction.busy()" class="md-accent"\n' +
    '                   ng-click="onPostSignupSubmit()" aria-label="CONTINUE">\n' +
    '            {{::\'CONTINUE\' | translate}}\n' +
    '        </md-button>\n' +
    '\n' +
    '        <md-button ng-show="transaction.busy()" class="md-warn"\n' +
    '                   ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '    </md-dialog-actions>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('post_signup/post_signup_panel.html',
    '<div class="pip-body">\n' +
    '    <div class="pip-content">\n' +
    '        <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '        </md-progress-linear>\n' +
    '\n' +
    '        <h2 class="text-overflow" ng-if="!hideObject.title">{{\'POST_SIGNUP_TITLE\' | translate}}</h2>\n' +
    '\n' +
    '        <p class="bm0 line-height-string" ng-if="!hideObject.successTitle">\n' +
    '            {{\'POST_SIGNUP_TEXT_1\' | translate}}\n' +
    '        </p>\n' +
    '\n' +
    '        <p class="line-height-string m0" ng-if="!hideObject.subTitle">\n' +
    '            {{\'POST_SIGNUP_TEXT_2\' | translate}}\n' +
    '        </p>\n' +
    '\n' +
    '        <form name="form" novalidate>\n' +
    '            <div ng-messages="form.$serverError" class="text-error bm8"  md-auto-hide="false">\n' +
    '                <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1002">{{::\'ERROR_1002\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="pip-ref-item">\n' +
    '                <pip-avatar-edit ng-disabled="transaction.busy()"\n' +
    '                                 pip-reset="false" pip-party-id="data.id"\n' +
    '                                 pip-created="onPictureCreated($event)"\n' +
    '                                 pip-changed="onPictureChanged($control, $event)"\n' +
    '                                 class="rm16 flex-fixed">\n' +
    '                </pip-avatar-edit>\n' +
    '\n' +
    '                <div class="pip-content">\n' +
    '                    <p class="pip-title">{{data.name}}</p>\n' +
    '                    <p class="pip-subtitle">{{data.email}}</p>\n' +
    '                </div>\n' +
    '\n' +
    '            </div>\n' +
    '\n' +
    '            <md-input-container class="pip-no-hint bp4">\n' +
    '                <label>{{\'HINT_ABOUT\' | translate}}</label>\n' +
    '                        <textarea ng-model="data.about"  ng-initial ng-disabled="transaction.busy()" pip-clear-errors>\n' +
    '                        </textarea>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <div class="tm2">\n' +
    '                <p class="text-caption bm0">{{\'GENDER\' | translate}}</p>\n' +
    '                <md-select class="w-stretch tm0 tp0 bp8" ng-disabled="transaction.busy()"\n' +
    '                           ng-model="data.gender" label="{{\'GENDER\' | translate}}"\n' +
    '                           ng-change="onStatusChange(data)" pip-clear-errors>\n' +
    '                    <md-option ng-value="opt.id" ng-repeat="opt in genders track by opt.id">\n' +
    '                        {{ opt.name }}\n' +
    '                    </md-option>\n' +
    '                </md-select>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="tm2">\n' +
    '                <p class="text-caption bm0">{{::\'BIRTHDAY\' | translate}}</p>\n' +
    '                <pip-date ng-disabled="transaction.busy()"\n' +
    '                          ng-model="data.birthday"\n' +
    '                          pip-time-mode="past"\n' +
    '                          pip-clear-errors time-mode="past">\n' +
    '                </pip-date>\n' +
    '            </div>\n' +
    '           <md-input-container>\n' +
    '               <label>{{::\'LANGUAGE\' | translate}}</label>\n' +
    '               <md-select class="w-stretch tm0 tp0  bp16" ng-disabled="transaction.busy()"\n' +
    '                          ng-model="data.language"\n' +
    '                          ng-change="onStatusChange(data)" pip-clear-errors>\n' +
    '                   <md-option ng-value="opt.id" ng-repeat="opt in languages track by opt.id">\n' +
    '                       {{ opt.name }}\n' +
    '                   </md-option>\n' +
    '               </md-select>\n' +
    '           </md-input-container>\n' +
    '\n' +
    '\n' +
    '        </form>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('reset_password/reset_password.html',
    '<!--\n' +
    '@file Password reset page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '\n' +
    '        <pip-reset-password-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control">\n' +
    '\n' +
    '        </pip-reset-password-panel>\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-hide="transaction.busy()" ng-click="goBack()" class="rm8" aria-label="CANCEL">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button ng-hide="transaction.busy()" ng-click="onReset()" aria-label="ENTRY_SET_PASSWORD"\n' +
    '                       ng-disabled="(form.$pristine && !data.email) || data.serverUrl.length == 0 ||\n' +
    '                       data.email.length == 0 || data.code.length == 0 || data.password.length < 6"\n' +
    '                       class="md-accent" type="submit">\n' +
    '                {{::\'ENTRY_SET_PASSWORD\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-warn" ng-show="transaction.busy()" ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('reset_password/reset_password_dialog.html',
    '<!--\n' +
    '@file Reset password\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-entry  lp0 rp0">\n' +
    '    <md-dialog-content>\n' +
    '        <pip-reset-password-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control">\n' +
    '\n' +
    '        </pip-reset-password-panel>\n' +
    '    </md-dialog-content>\n' +
    '\n' +
    '    <md-dialog-actions class="layout-row layout-align-end-center">\n' +
    '        <md-button ng-hide="transaction.busy()" ng-click="goBack()" class="rm8" aria-label="CANCEL">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '        <md-button ng-hide="transaction.busy()" ng-click="onReset()" aria-label="ENTRY_SET_PASSWORD"\n' +
    '                   ng-disabled="(form.$pristine && !data.email) || data.serverUrl.length == 0 ||\n' +
    '                       data.email.length == 0 || data.code.length == 0 || data.password.length < 6"\n' +
    '                   class="md-accent" type="submit">\n' +
    '            {{::\'ENTRY_SET_PASSWORD\' | translate}}\n' +
    '        </md-button>\n' +
    '        <md-button class="md-warn" ng-show="transaction.busy()" ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '    </md-dialog-actions>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('reset_password/reset_password_panel.html',
    '<div class="pip-body">\n' +
    '    <div class="pip-content">\n' +
    '        <md-progress-linear ng-show="transaction.busy()  && showServerError" md-mode="indeterminate"\n' +
    '                            class="pip-progress-top">\n' +
    '        </md-progress-linear>\n' +
    ' \n' +
    '        <h2 ng-if="!hideObject.title">{{::\'RESET_PWD_PASSWORD\' | translate}}</h2>\n' +
    '\n' +
    '        <p class="title-padding bm16" ng-if="!hideObject.subTitle">\n' +
    '            {{::\'RESET_PWD_TEXT\' | translate}}\n' +
    '        </p>\n' +
    '\n' +
    '        <form name="form" novalidate>\n' +
    '            <div ng-messages="form.$serverError" class="text-error bm8"  md-auto-hide="false">\n' +
    '                <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <a ng-hide="showServerUrl || fixedServerUrl || hideObject.server" ng-click="showServerUrl = true" href="">\n' +
    '                {{::\'ENTRY_CHANGE_SERVER\' | translate}}\n' +
    '            </a>\n' +
    '\n' +
    '            <div ng-show="showServerUrl && !hideObject.server">\n' +
    '                <md-autocomplete\n' +
    '                        ng-initial autofocus tabindex="1"\n' +
    '                        class="pip-combobox w-stretch bm8"\n' +
    '                        name="server"\n' +
    '                        ng-enabled="!transaction.busy()"\n' +
    '                        placeholder="{{::\'ENTRY_SERVER_URL\' | translate}}"\n' +
    '                        md-no-cache="true"\n' +
    '                        md-selected-item="data.serverUrl"\n' +
    '                        md-search-text="selected.searchURLs"\n' +
    '                        md-items="item in getMatches()"\n' +
    '                        md-item-text="item"\n' +
    '                        md-selected-item-change="onServerUrlChanged()"\n' +
    '                        md-delay="200"\n' +
    '                        ng-model="data.serverUrl"\n' +
    '                        pip-clear-errors>\n' +
    '                    <span md-highlight-text="selected.searchURLs">{{item}}</span>\n' +
    '                </md-autocomplete>\n' +
    '            </div>\n' +
    '\n' +
    '            <md-input-container class="pip-no-hint" style="padding-bottom: 4px!important;">\n' +
    '                <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                <input name="email" type="email" ng-model="data.email" required step="any" pip-clear-errors\n' +
    '                       ng-disabled="transaction.busy()" tabindex="2" pip-email-unique="data.email"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.email).hint && !hideObject.hint">\n' +
    '                    {{::\'HINT_EMAIL\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.email)" class="md-input-error"  md-auto-hide="false">\n' +
    '\n' +
    '                    <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="emailUnique">{{::\'ERROR_1104\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1100">{{::\'ERROR_1100\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1106">{{::\'ERROR_1106\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="pip-no-hint">\n' +
    '                <label>{{::\'ENTRY_RESET_CODE\' | translate}}</label>\n' +
    '                <input name="code" ng-disabled="transaction.busy()"\n' +
    '                       ng-model="data.code" required tabindex="3" pip-clear-errors/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.code).hint && !hideObject.hint">\n' +
    '                    {{::\'ENTRY_RESET_CODE\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.code)" class="md-input-error"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'ERROR_CODE_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="ERROR_1108">{{::\'ERROR_1108\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1109">{{::\'ERROR_1109\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="pip-no-hint" style="padding-bottom: 4px!important;">\n' +
    '                <label>{{::\'PASSWORD\' | translate}}</label>\n' +
    '                <input name="password" ng-disabled="transaction.busy()" pip-clear-errors\n' +
    '                       type="password" tabindex="4" ng-model="data.password"\n' +
    '                       required minlength="6"/>\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.password).hint && !hideObject.hint">\n' +
    '                    {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.password)"\n' +
    '                     class="md-input-error"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'MINLENGTH_PASSWORD\' | translate}}</div>\n' +
    '                    <div ng-message="minlength">{{::\'MINLENGTH_PASSWORD\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1102">{{::\'ERROR_1102\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1103">{{::\'ERROR_1103\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1105">{{::\'ERROR_1105\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '        </form>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('recover_password/recover_password.html',
    '<!--\n' +
    '@file Password recovery page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <pip-recover-password-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control">\n' +
    '\n' +
    '        </pip-recover-password-panel>\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-hide="transaction.busy()" ng-click="goBack()" class="rm8" aria-label="CANCEL">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '            <md-button ng-hide="transaction.busy()" class="md-accent" ng-click="onRecover()"\n' +
    '                       aria-label="RECOVER_PWD_RECOVER"\n' +
    '                       ng-disabled="(form.$pristine && !data.email) || data.serverUrl.length == 0 || data.email.length == 0">\n' +
    '                {{::\'RECOVER_PWD_RECOVER\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '            <md-button ng-show="transaction.busy()" class="md-warn" ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('recover_password/recover_password_dialog.html',
    '<!--\n' +
    '@file Recover password dialog\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-entry lp0 rp0">\n' +
    '    <md-dialog-content>\n' +
    '        <pip-recover-password-panel\n' +
    '                pip-data="data"\n' +
    '                pip-created="$panel = $control"\n' +
    '                pip-goto-reset="pipGotoReset">\n' +
    '\n' +
    '        </pip-recover-password-panel>\n' +
    '    </md-dialog-content>\n' +
    '\n' +
    '    <md-dialog-actions class="layout-row layout-align-end-center">\n' +
    '        <md-button ng-hide="transaction.busy()" ng-click="goBack()" class="rm8" aria-label="CANCEL">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '\n' +
    '        <md-button ng-hide="transaction.busy()" class="md-accent" ng-click="onRecover()"\n' +
    '                   aria-label="RECOVER_PWD_RECOVER"\n' +
    '                   ng-disabled="(form.$pristine && !data.email) || data.email== undefined ||\n' +
    '                           || data.serverUrl.length == 0 || data.email.length == 0">\n' +
    '            {{::\'RECOVER_PWD_RECOVER\' | translate}}\n' +
    '        </md-button>\n' +
    '\n' +
    '        <md-button ng-show="transaction.busy()" class="md-warn" ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '            {{::\'CANCEL\' | translate}}\n' +
    '        </md-button>\n' +
    '    </md-dialog-actions>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('recover_password/recover_password_panel.html',
    '<div class="pip-body">\n' +
    '    <div class="pip-content">\n' +
    '        <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '        </md-progress-linear>\n' +
    '\n' +
    '        <h2 ng-if="!hideObject.title">{{\'RECOVER_PWD_TITLE\' | translate}}</h2>\n' +
    '\n' +
    '        <p class="text-primary tm0 bm16" ng-if="!hideObject.subTitle1">{{\'RECOVER_PWD_TEXT_1\' | translate}} </p>\n' +
    '\n' +
    '        <p class="text-primary tm0 bm16" ng-if="!hideObject.subTitle2">{{\'RECOVER_PWD_TEXT_2\' | translate}}</p>\n' +
    '\n' +
    '        <form name="form" novalidate>\n' +
    '            <div ng-messages="form.$serverError" class="text-error bm8"  md-auto-hide="false">\n' +
    '                <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <a ng-hide="showServerUrl || fixedServerUrl || hideObject.server" ng-click="showServerUrl = true" href="">\n' +
    '                {{\'ENTRY_CHANGE_SERVER\' | translate}}\n' +
    '            </a>\n' +
    '\n' +
    '            <div ng-show="showServerUrl && !hideObject.server">\n' +
    '                <md-autocomplete\n' +
    '                        ng-initial autofocus tabindex="1"\n' +
    '                        class="pip-combobox w-stretch bm8"\n' +
    '                        name="server"\n' +
    '                        ng-enabled="!transaction.busy()"\n' +
    '                        placeholder="{{::\'ENTRY_SERVER_URL\' | translate}}"\n' +
    '                        md-no-cache="true"\n' +
    '                        md-selected-item="data.serverUrl"\n' +
    '                        md-search-text="selected.searchURLs"\n' +
    '                        md-items="item in getMatches()"\n' +
    '                        md-item-text="item"\n' +
    '                        md-selected-item-change="onServerUrlChanged()"\n' +
    '                        md-delay="200"\n' +
    '                        ng-model="data.serverUrl"\n' +
    '                        pip-clear-errors>\n' +
    '                    <span md-highlight-text="selected.searchURLs">{{item}}</span>\n' +
    '                </md-autocomplete>\n' +
    '            </div>\n' +
    '            <md-input-container class="pip-no-hint" style="padding-bottom: 4px!important;">\n' +
    '                <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                <input name="email" type="email"\n' +
    '                       ng-model="data.email"\n' +
    '                       pip-email-unique="data.email"\n' +
    '                       required step="any" pip-clear-errors\n' +
    '                       ng-disabled="transaction.busy()" tabindex="2"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.email).hint && !hideObject.hint">\n' +
    '                    {{::\'HINT_EMAIL\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.email)"\n' +
    '                     class="md-input-error"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="emailUnique">{{::\'ERROR_1104\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1100">{{::\'ERROR_1100\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1106">{{::\'ERROR_1106\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '        </form>\n' +
    '\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signin/signin.html',
    '<!--\n' +
    '@file Signin page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <pip-signin-panel pipfixedServerUrl="fixedServerUrl" >\n' +
    '        </pip-signin-panel>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signin/signin_dialog.html',
    '<!--\n' +
    '@file Signin dialog\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-entry">\n' +
    '    <md-dialog-content>\n' +
    '        <pip-signin-panel pip-goto-signup-dialog="pipGotoSignupDialog"\n' +
    '                          pip-goto-recover-password-dialog="pipGotoRecoverPasswordDialog">\n' +
    '        </pip-signin-panel>\n' +
    '    </md-dialog-content>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signin/signin_panel.html',
    '<div class="pip-body">\n' +
    '    <div class="pip-content">\n' +
    '        <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '        </md-progress-linear>\n' +
    '\n' +
    '        <h2 pip-translate="SIGNIN_TITLE" ng-if="!hideObject.title"></h2>\n' +
    '\n' +
    '        <form name="form" novalidate>\n' +
    '            <div ng-messages="form.$serverError" class="text-error bm8 color-error"  md-auto-hide="false">\n' +
    '                <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <a ng-hide="showServerUrl || fixedServerUrl || hideObject.server"\n' +
    '               ng-click="showServerUrl = true" href=""\n' +
    '               id="link-server-url"\n' +
    '               pip-test="link-server-url">\n' +
    '                {{::\'ENTRY_CHANGE_SERVER\' | translate}}\n' +
    '            </a>\n' +
    '\n' +
    '            <div ng-show="showServerUrl && !hideObject.server">\n' +
    '                <md-autocomplete\n' +
    '                        ng-initial autofocus tabindex="1"\n' +
    '                        class="pip-combobox w-stretch bm8"\n' +
    '                        name="server"\n' +
    '                        placeholder="{{::\'ENTRY_SERVER_URL\' | translate}}"\n' +
    '                        md-no-cache="true"\n' +
    '                        md-selected-item="data.serverUrl"\n' +
    '                        md-search-text="selected.searchURLs"\n' +
    '                        md-items="item in getMatches()"\n' +
    '                        md-item-text="item"\n' +
    '                        md-selected-item-change="onServerUrlChanged()"\n' +
    '                        md-delay="200"\n' +
    '                        ng-model="data.serverUrl"\n' +
    '                        ng-disabled="transaction.busy()"\n' +
    '                        pip-clear-errors\n' +
    '                        pip-test="autocomplete-server">\n' +
    '                    <span md-highlight-text="selected.searchURLs">{{item}}</span>\n' +
    '                </md-autocomplete>\n' +
    '            </div>\n' +
    '\n' +
    '            <md-input-container class="display  bp4">\n' +
    '                <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                <input name="email" type="email" ng-model="data.email" required step="any"\n' +
    '                       ng-keypress="onEnter($event)"\n' +
    '                       pip-clear-errors\n' +
    '                       ng-disabled="transaction.busy()" tabindex="2"\n' +
    '                       pip-test="input-email"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.email).hint && !hideObject.hint">\n' +
    '                    {{::\'HINT_EMAIL\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.email)" md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="ERROR_1100">{{::\'ERROR_1100\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1106">{{::\'ERROR_1106\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1114">{{::\'ERROR_1114\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '            <md-input-container class="display bp4">\n' +
    '                <label>{{::\'PASSWORD\' | translate}}</label>\n' +
    '                <input name="password" ng-disabled="transaction.busy()" pip-clear-errors\n' +
    '                       type="password" tabindex="3" ng-model="data.password"\n' +
    '                       ng-keypress="onEnter($event)"\n' +
    '                       required minlength="6"\n' +
    '                       pip-test="input-password"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.password).hint && !hideObject.hint">\n' +
    '                    {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.password)"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'HINT_PASSWORD\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1102">{{::\'ERROR_1102\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1107">{{::\'ERROR_1107\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '            <a href="" class="display bm16"\n' +
    '               ng-if="!hideObject.forgotPassword"\n' +
    '               ng-click="gotoRecoverPassword()"\n' +
    '               tabindex="4">\n' +
    '                {{::\'SIGNIN_FORGOT_PASSWORD\' | translate}}\n' +
    '            </a>\n' +
    '\n' +
    '            <md-checkbox ng-disabled="transaction.busy()" \n' +
    '                         ng-if="!hideObject.forgotPassword"\n' +
    '                         md-no-ink class="lm0"\n' +
    '                         aria-label="{{\'SIGNIN_REMEMBER\' | translate}}" tabindex="5"\n' +
    '                         ng-model="data.remember"\n' +
    '                         pip-test-checkbox="remember">\n' +
    '                <label class="label-check">{{::\'SIGNIN_REMEMBER\' | translate}}</label>\n' +
    '            </md-checkbox>\n' +
    '\n' +
    '            <div style="height: 36px; overflow: hidden;">\n' +
    '                <md-button ng-if="!transaction.busy()" ng-click="onSignin()" aria-label="SIGNIN"\n' +
    '                           class="md-raised md-accent w-stretch m0" tabindex="6"\n' +
    '                           ng-disabled="(data.email == undefined) || data.email.length == 0 || data.serverUrl == \'\' ||\n' +
    '                                   data.serverUrl == undefined || data.serverUrl.length == 0 || (data.password == undefined)"\n' +
    '                           pip-test="button-signin">\n' +
    '                    {{::\'SIGNIN_TITLE\' | translate}}\n' +
    '                </md-button>\n' +
    '                <md-button ng-if="transaction.busy()" ng-click="transaction.abort()" class="md-raised md-warn m0 w-stretch"\n' +
    '                           tabindex="5" aria-label="ABORT"\n' +
    '                           pip-test="button-cancel">\n' +
    '                    {{::\'CANCEL\' | translate}}\n' +
    '                </md-button>\n' +
    '            </div>\n' +
    '            <div class="tm24 layout-row" ng-if="!adminOnly && $mdMedia(\'gt-xs\') && !hideObject.signup">\n' +
    '                <p class="m0 text-small"> <!--  <p class="a-question-text">  -->\n' +
    '                    {{::\'SIGNIN_NOT_MEMBER\' | translate}}\n' +
    '                    <a href=""\n' +
    '                       ng-click="gotoSignup()"\n' +
    '                       tabindex="6">\n' +
    '                        {{::\'SIGNIN_SIGNUP_HERE\' | translate}}\n' +
    '                    </a>\n' +
    '                </p>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="tm24 divider-top text-signup" \n' +
    '                 ng-if="!adminOnly && $mdMedia(\'xs\') && !hideObject.signup">\n' +
    '                <div class="h48 layout-row layout-align-center-end">\n' +
    '                    <p class="m0 text-small">{{::\'SIGNIN_NOT_MEMBER\' | translate}}</p>\n' +
    '                </div>\n' +
    '                <div class="h48 layout-row layout-align-center-start">\n' +
    '                    <a class="text-small" ng-click="gotoSignup()" href="" tabindex="6">\n' +
    '                        {{::\'SIGNIN_SIGNUP_HERE\' | translate}}\n' +
    '                    </a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </form>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signup/signup.html',
    '<!--\n' +
    '@file Signup page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <pip-signup-panel>\n' +
    '        </pip-signup-panel>\n' +
    '    </pip-card>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signup/signup_dialog.html',
    '<!--\n' +
    '@file Signup page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-dialog class="pip-entry">\n' +
    '    <md-dialog-content>\n' +
    '        <pip-signup-panel pip-goto-signin-dialog="pipGotoSigninDialog"\n' +
    '                          pip-post-signup="pipPostSignup"></pip-signup-panel>\n' +
    '    </md-dialog-content>\n' +
    '</md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('signup/signup_panel.html',
    '<div class="pip-body ">\n' +
    '    <div class="pip-content">\n' +
    '        <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '        </md-progress-linear>\n' +
    '\n' +
    '        <h2 pip-translate="SIGNUP_TITLE" ng-if="!hideObject.title"></h2>\n' +
    '\n' +
    '        <form name="form" novalidate autocomplete="off">\n' +
    '            <input type="email" style="display:none">\n' +
    '            <input type="password" style="display:none">\n' +
    '\n' +
    '            <div ng-messages="form.$serverError" class="text-error bm8"  md-auto-hide="false">\n' +
    '                <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <a ng-hide="showServerUrl || fixedServerUrl || hideObject.server" ng-click="showServerUrl = true" href="">\n' +
    '                {{::\'ENTRY_CHANGE_SERVER\' | translate}}\n' +
    '            </a>\n' +
    '\n' +
    '            <div ng-show="showServerUrl && !hideObject.server">\n' +
    '                <md-autocomplete\n' +
    '                        ng-initial autofocus tabindex="1"\n' +
    '                        class="pip-combobox w-stretch bm8"\n' +
    '                        name="server"\n' +
    '                        ng-enabled="!transaction.busy()"\n' +
    '                        placeholder="{{::\'ENTRY_SERVER_URL\' | translate}}"\n' +
    '                        md-no-cache="true"\n' +
    '                        md-selected-item="data.serverUrl"\n' +
    '                        md-search-text="selected.searchURLs"\n' +
    '                        md-items="item in getMatches()"\n' +
    '                        md-item-text="item"\n' +
    '                        md-selected-item-change="onServerUrlChanged()"\n' +
    '                        md-delay="200"\n' +
    '                        ng-model="data.serverUrl"\n' +
    '                        ng-disabled="transaction.busy()"\n' +
    '                        pip-clear-errors>\n' +
    '                    <span md-highlight-text="selected.searchURLs">{{item}}</span>\n' +
    '                </md-autocomplete>\n' +
    '            </div>\n' +
    '\n' +
    '            <md-input-container class="display bp4">\n' +
    '                <label>{{::\'FULLNAME\' | translate}}</label>\n' +
    '                <input name="signupFullName"\n' +
    '                       ng-disabled="transaction.busy()" autocomplete="off"\n' +
    '                       ng-model="data.name" ng-init="data.name = \'\'"\n' +
    '                       required tabindex="2" pip-clear-errors\n' +
    '                       ng-keypress="onEnter($event)">\n' +
    '\n' +
    '                <div class="hint text-overflow w-stretch"\n' +
    '                     ng-if="touchedErrorsWithHint(form, form.signupFullName).hint && !hideObject.hint">\n' +
    '                    {{::\'HINT_FULLNAME\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.signupFullName)"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">\n' +
    '                        {{::\'HINT_FULLNAME\' | translate}} {{::\'ERROR_FULLNAME_INVALID\' | translate }}\n' +
    '                    </div>\n' +
    '                    <div ng-message="ERROR_1101">{{::\'ERROR_1101\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="display bp4">\n' +
    '                <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                <input name="userEmail" ng-disabled="transaction.busy()" pip-clear-errors\n' +
    '                       type="email" tabindex="3" ng-model="data.email"\n' +
    '                       required\n' +
    '                       pip-email-unique="data.email"\n' +
    '                       ng-keypress="onEnter($event)"\n' +
    '                       pip-test="input-password"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.userEmail).hint && !hideObject.hint">\n' +
    '                    {{::\'HINT_EMAIL\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.userEmail)" md-auto-hide="false"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                    <div ng-message="emailUnique">{{::\'ERROR_1104\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1100">{{::\'ERROR_1100\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1106">{{::\'ERROR_1106\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1104">{{::\'ERROR_1104\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1300">{{::\'ERROR_1300\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1305">{{::\'ERROR_1305\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1301">{{::\'ERROR_1301\' | translate}}</div>\n' +
    '                    <div ng-message="ERROR_1114">{{::\'ERROR_1114\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="display bp4">\n' +
    '                <label>{{::\'PASSWORD_SET\' | translate}}</label>\n' +
    '                <input name="password" ng-disabled="transaction.busy()" pip-clear-errors\n' +
    '                       type="password" tabindex="4" ng-model="data.password"\n' +
    '                       required minlength="6"\n' +
    '                       ng-keypress="onEnter($event)"\n' +
    '                       pip-test="input-password"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.password).hint && !hideObject.hint">\n' +
    '                    {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.password)"  md-auto-hide="false">\n' +
    '                    <div ng-message="required">\n' +
    '                        {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="minlength">\n' +
    '                        {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="ERROR_1102" ng-if="!form.password.$pristine">\n' +
    '                        {{::\'ERROR_1102\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="ERROR_1107" ng-if="!form.password.$pristine">\n' +
    '                        {{::\'ERROR_1107\' | translate}}\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="display bp4" ng-if="!hideObject.passwordConfirm">\n' +
    '                <label>{{::\'PASSWORD_CONFIRM\' | translate}}</label>\n' +
    '                <input name="passwordConfirm"\n' +
    '                       type="password" tabindex="4"\n' +
    '                       required minlength="6"\n' +
    '                       ng-model="confirmPassword"\n' +
    '                       ng-disabled="transaction.busy()" pip-clear-errors\n' +
    '                       compare-to="data.password"\n' +
    '                       ng-keypress="onEnter($event)"\n' +
    '                       pip-test="input-password"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="touchedErrorsWithHint(form, form.passwordConfirm).hint && !hideObject.hint">\n' +
    '                    {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                </div>\n' +
    '                <div ng-messages="touchedErrorsWithHint(form, form.passwordConfirm)"  md-auto-hide="false">\n' +
    '                    <div ng-message="compareTo">\n' +
    '                        {{::\'PASSWORD_MATCH\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="required">\n' +
    '                        {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="minlength">\n' +
    '                        {{::\'HINT_PASSWORD\' | translate}}\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <p class="text-small-secondary" ng-if="!hideObject.agreement">\n' +
    '                {{::\'SIGNUP_TEXT_11\' | translate}}\n' +
    '                <a href="#/legal/privacy">{{::\'SIGNUP_PRIVACY\' | translate}}</a>\n' +
    '                {{::\'SIGNUP_TEXT_12\' | translate}}\n' +
    '                <a href="#/legal/services">{{::\'SIGNUP_SERVICES\' | translate}}</a>\n' +
    '            </p>\n' +
    '\n' +
    '            <md-button ng-hide="transaction.busy()" class="md-raised m0  md-accent w-stretch"\n' +
    '                       ng-click="onSignup()" aria-label="SIGNUP"\n' +
    '                       ng-disabled="form.$invalid || (form.$pristine && !data.email) || data.serverUrl.length == 0\n' +
    '                               || data.email.length == 0 || (!data.password)\n' +
    '                               || (!data.name) || data.name.length == 0 || data.password.length == 0">\n' +
    '                {{::\'SIGNUP_TITLE\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '            <md-button ng-show="transaction.busy()" ng-click="transaction.abort()"\n' +
    '                       class="md-raised md-warn m0 w-stretch" aria-label="ABORT">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '            <div class="tm24 layout-row" ng-if="$mdMedia(\'gt-xs\') && !hideObject.signin">\n' +
    '                <p class="text-small m0">\n' +
    '                    {{::\'SIGNUP_TEXT_2\' | translate}}\n' +
    '                    <a href="" ng-click="gotoSignin()">\n' +
    '                        {{::\'SIGNUP_SIGNIN_HERE\' | translate}}\n' +
    '                    </a>\n' +
    '                </p>\n' +
    '            </div>\n' +
    '            <div class="tm24 divider-top" ng-if="$mdMedia(\'xs\') && !hideObject.signin"\n' +
    '                 style="margin-right: -16px; margin-left: -16px; background-color: rgb(238, 238, 238);">\n' +
    '                <div class="h48 layout-row layout-align-center-end">\n' +
    '                    <p class="bm0 text-small">{{::\'SIGNUP_TEXT_2\' | translate}}</p>\n' +
    '                </div>\n' +
    '                <div class="h48 layout-row layout-align-center-start">\n' +
    '                    <p class="bm0 text-small"><a href="" ng-click="gotoSignin()">\n' +
    '                        {{::\'SIGNUP_SIGNIN_HERE\' | translate}}</a></p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </form>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('verify_email/verify_email.html',
    '<!--\n' +
    '@file Verify email page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <div class="pip-body">\n' +
    '            <div class="pip-content">\n' +
    '                <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top" >\n' +
    '                </md-progress-linear>\n' +
    '\n' +
    '                <h2>{{\'VERIFY_EMAIL_TITLE\' | translate}}</h2>\n' +
    '\n' +
    '                <p class="title-padding">{{\'VERIFY_EMAIL_TEXT_1\' | translate}} </p>\n' +
    '\n' +
    '                <form name=\'form\' novalidate>\n' +
    '                    <div ng-messages="form.$serverError" class="text-error bm8">\n' +
    '                        <div ng-message="ERROR_1000">{{::\'ERROR_1000\' | translate}}</div>\n' +
    '                        <div ng-message="ERROR_1110">{{::\'ERROR_1110\' | translate}}</div>\n' +
    '                        <div ng-message="ERROR_1111">{{::\'ERROR_1111\' | translate}}</div>\n' +
    '                        <div ng-message="ERROR_1112">{{::\'ERROR_1112\' | translate}}</div>\n' +
    '                        <div ng-message="ERROR_-1">{{::\'ERROR_SERVER\' | translate}}</div>\n' +
    '                        <div ng-message="ERROR_UNKNOWN">\n' +
    '                            {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <a ng-hide="showServerUrl || fixedServerUrl" ng-click="showServerUrl = true" href="">      \n' +
    '                        {{\'ENTRY_CHANGE_SERVER\' | translate}}\n' +
    '                    </a>\n' +
    '                    <div ng-show="showServerUrl">\n' +
    '                        <md-autocomplete\n' +
    '                                ng-initial autofocus tabindex="1"\n' +
    '                                class="pip-combobox w-stretch bm8"\n' +
    '                                name="server"\n' +
    '                                ng-enabled="!transaction.busy()"\n' +
    '                                placeholder="{{::\'ENTRY_SERVER_URL\' | translate}}"\n' +
    '                                md-no-cache="true"\n' +
    '                                md-selected-item="data.serverUrl"\n' +
    '                                md-search-text="selected.searchURLs"\n' +
    '                                md-items="item in getMatches()"\n' +
    '                                md-item-text="item"\n' +
    '                                md-selected-item-change="onServerUrlChanged()"\n' +
    '                                md-delay="200"\n' +
    '                                ng-model="data.serverUrl"\n' +
    '                                pip-clear-errors>\n' +
    '                            <span md-highlight-text="selected.searchURLs">{{item}}</span>\n' +
    '                        </md-autocomplete>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <md-input-container class="pip-no-hint" style="padding-bottom: 4px!important;">\n' +
    '                        <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                        <input name="email" type="email" ng-model="data.email" required step="any"  pip-clear-errors\n' +
    '                               ng-disabled="transaction.busy()" tabindex="2" />\n' +
    '\n' +
    '                        <div ng-messages="touchedErrorsWithHint(form, form.email)" ng-if="!form.email.$pristine" class="md-input-error">\n' +
    '                            <div ng-message="hint" class="pip-input-hint">{{::\'HINT_EMAIL\' | translate}}</div>\n' +
    '                            <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                            <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                            <div ng-message="ERROR_1100">{{::\'ERROR_1100\' | translate}}</div>\n' +
    '                            <div ng-message="ERROR_1104">{{::\'ERROR_1104\' | translate}}</div>\n' +
    '                            <div ng-message="ERROR_1305">{{::\'ERROR_1305\' | translate}}</div>\n' +
    '                            <div ng-message="ERROR_1106">{{::\'ERROR_1106\' | translate}}</div>\n' +
    '                        </div>\n' +
    '                    </md-input-container>\n' +
    '\n' +
    '                    <md-input-container class="pip-no-hint">\n' +
    '                        <label>{{::\'ENTRY_RESET_CODE\' | translate}}</label>\n' +
    '                        <input name="code" ng-disabled="transaction.busy()"\n' +
    '                               ng-model="data.code" required tabindex="3" />\n' +
    '\n' +
    '                        <div ng-messages="touchedErrorsWithHint(form, form.code)" ng-if="!form.fullName.$pristine" class="md-input-error">\n' +
    '                            <div ng-message="hint" class="pip-input-hint">{{::\'ENTRY_RESET_CODE\' | translate}}</div>\n' +
    '                            <div ng-message="required">{{::\'ERROR_CODE_INVALID\' | translate }}</div>\n' +
    '                            <div ng-message="ERROR_1108">{{::\'ERROR_1108\' | translate}}</div>\n' +
    '                        </div>\n' +
    '                    </md-input-container>\n' +
    '\n' +
    '                    <p> \n' +
    '                        {{\'VERIFY_EMAIL_TEXT_21\' | translate}} \n' +
    '                        <a ng-click="onRecover()" class="pointer" href="">{{\'VERIFY_EMAIL_RESEND\' | translate}}</a>\n' +
    '                        {{\'VERIFY_EMAIL_TEXT_22\' | translate}} \n' +
    '                    </p>\n' +
    '                </form>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-click="goBack()" ng-hide="transaction.busy()" class="rm8" aria-label="CANCEL">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-accent" ng-click="onVerify()" ng-hide="transaction.busy()" aria-label="VERIFY"\n' +
    '                ng-disabled="data.code.length == 0 || data.email.length == 0 || (!data.email && form.$pristine) || (!data.code)">\n' +
    '                {{::\'VERIFY\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-warn " ng-show="transaction.busy()" ng-click="transaction.abort()" aria-label="ABORT">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipEntry.Templates');
} catch (e) {
  module = angular.module('pipEntry.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('verify_email/verify_email_success.html',
    '<!--\n' +
    '@file Email verification success page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<div class="pip-card-container pip-outer-scroll pip-entry">\n' +
    '    <pip-card width="400">\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-click="onContinue()" class="md-accent">\n' +
    '                {{\'CONTINUE\' | translate}} \n' +
    '            </md-button>\n' +
    '        </div>\n' +
    '        <div class="pip-body">\n' +
    '            <div class="pip-content">\n' +
    '                <h2>{{\'VERIFY_EMAIL_TITLE\' | translate}}</h2>\n' +
    '\n' +
    '                <p class="title-padding">\n' +
    '                    {{\'VERIFY_EMAIL_SUCCESS_TEXT\' | translate}} \n' +
    '                </p>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </pip-card>\n' +
    '</div>');
}]);
})();

/**
 * @file Checking uniqueness of email in input control
 * @description
 * Email validation is performed on server via /api/signup_validate REST operation
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEmailUnique', ['ngResource', 'pipRest']);

    thisModule.directive('pipEmailUnique',
        ['$http', 'pipRest', function ($http, pipRest) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function ($scope, $element, $attrs, ngModel) {
                    var oldEmail = $attrs.pipEmailUnique;

                    $scope.$watch($attrs.ngModel, _.throttle(function (newValue) {
                        var oldHint = ngModel.$validators.emailUnique;
                        if (!newValue || newValue.length == 0 || oldEmail == newValue) {
                            ngModel.$setValidity('emailUnique', oldHint);
                            return;
                        }

                        if (!newValue) ngModel.$setValidity('emailUnique', true);

                        pipRest.signupValidate().call(
                            {
                                email: newValue
                            },
                            function (data) {
                                ngModel.$setValidity('emailUnique', true);
                            },
                            function (err) {
                                ngModel.$setValidity('emailUnique', false);
                            }
                        );
                    }, 500));
                }
            };
        }]
    );

})();
/**
 * @file Entry common logic
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.Common', []);

    thisModule.provider('pipEntry', function() {
        var
            adminOnly = false,
            fixedServerUrl = null;
        
        this.adminOnly = function(newAdminOnly) {
            adminOnly = newAdminOnly;  
        };

        this.fixedServerUrl = function(newFixedServerUrl) {
            fixedServerUrl  = newFixedServerUrl; 
        };

        this.$get = function () {
            return {
                adminOnly: function() {
                    return adminOnly;
                },
                
                fixedServerUrl: function() {
                    return fixedServerUrl;
                }
            };
        }
    });

    thisModule.factory('pipEntryCommon',
        ['$rootScope', '$state', '$window', 'pipAppBar', 'pipSession', 'pipRest', 'pipEntry', 'pipFormErrors', function ($rootScope, $state, $window, pipAppBar, pipSession, pipRest, pipEntry, pipFormErrors) {
            return {
                configureAppBar: configureAppBar,
                initScope: initScope
            };
            
            //---------------------
            
            function configureAppBar() {
                pipAppBar.hideNavIcon();
                if (pipAppBar.config().appTitleLogo) {
                    pipAppBar.showTitleLogo(pipAppBar.config().appTitleLogo);
                }
                else {
                    pipAppBar.showTitleLogo('images/piplife_logo.svg');
                }
                pipAppBar.showLanguage();
                pipAppBar.showShadow();
                pipAppBar.hideSearch();
            };

            function initScope($scope) {
                $scope.adminOnly = pipEntry.adminOnly();
                $scope.data = {
                    serverUrl: pipRest.serverUrl(), //$state.params.server_url || 'http://alpha.pipservices.net',
                    email: ($state.name != 'signup' && $state.params.email) ? $state.params.email : null,
                    password: '',
                    remember: false,
                    adminOnly: $scope.adminOnly,
                    name: $state.params.name || null, // signout
                    code: $state.params.code || null
                };
        
                $scope.showServerUrl = false;
                $scope.fixedServerUrl = false;
                $scope.data.serverUrl = $scope.data.serverUrl || pipSession.usedServerUrls();
        
                // Fixed server url shall disable changing URL by the user
                if (pipEntry.fixedServerUrl()) {
                    $scope.data.serverUrl = pipRest.serverUrl();
                    $scope.fixedServerUrl = true;  
                }
                        
                if ($state.name != 'signup') {
                    $scope.data.email = $scope.data.email || pipSession.lastUsedEmail($scope.data.serverUrl);
                    // $scope.data.password = $scope.data.password || pipSession.lastUsedPassword($scope.data.serverUrl);
                }
                $scope.serverUrls = pipSession.usedServerUrls();
                $scope.servers = pipSession.usedServers();
        
                $scope.selected = {};
                $scope.selected.searchURLs = $scope.data.serverUrl;
        
                // Set email from history
                if ($scope.data.serverUrl && !$scope.data.email && $state.name != 'signup') {
                    var server = $scope.servers[$scope.data.serverUrl];
                    $scope.data.email = (server || {}).email;
                }

                $scope.filterItem = filterItem;
                $scope.getMatches = getMatches;
                $scope.onServerUrlChanged = onServerUrlChanged;
                $scope.isEmpty = _.isEmpty;

                return;
                
                //---------------------------
        
                function filterItem(item) {
                    var result = ($scope.selected.searchURLs
                        && item
                        && item.toLowerCase().indexOf($scope.selected.searchURLs.toLowerCase()) >= 0);
                    return result;
                };
        
                function getMatches() {
                    if (!$scope.selected.searchURLs)
                        return $scope.showServerUrl;
                    $scope.data.serverUrl = $scope.selected.searchURLs;
                    return _.filter($scope.serverUrls, $scope.filterItem);
                };
        
                function onServerUrlChanged() {
                    // Change server url for REST API
                    pipRest.serverUrl($scope.data.serverUrl);
                    
                    if (!$scope.selected.searchURLs) return;
                    var server = $scope.servers[$scope.data.serverUrl];
        
                    if (server && $state.name != 'signup') {
                        $scope.data.email = server.email;
                        $scope.data.password = server.password;
                    }
                    
                    pipFormErrors.resetFormErrors($scope.form, false);
                    pipFormErrors.resetFieldsErrors($scope.form);
                };
            };            
        }]
    );
   
})();
/**
 * @file String resources for entry pages
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';
    
    var thisModule = angular.module('pipEntry.Strings', []);

    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {

        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
            // Common labels
            'FULLNAME': 'First and last name',
            'EMAIL': 'Email',
            'PASSWORD': 'Password',
            'LANGUAGE': 'Language',
            'GENDER': 'Gender',
            'BIRTHDAY': 'Birthday',
            'LOCATION': 'Location',

            // Common hints
            'HINT_FULLNAME': "Use your real name, so others know who you are",
            'HINT_PASSWORD': 'Minimum 6 characters',
            'HINT_ABOUT': 'Few words about yourself',
            'VERIFY_EMAIL': 'Please, verify your email address. ',
            'HINT_EMAIL': 'Please, type your email address.',

            // Sign In page
            'SIGNIN_TITLE': 'Sign in',
            'SIGNIN_NOT_MEMBER': 'Not a member?',
            'SIGNIN_REMEMBER': 'Remember',
            'SIGNIN_FORGOT_PASSWORD': 'Forgot password?',
            'SIGNIN_SIGNUP_HERE': ' Sign up here',

            // Sign Up page
            'SIGNUP_TITLE': 'Sign up',
            'SIGNUP_NOT_MEMBER': 'Not a member? Sign up now',
            'SIGNUP_TEXT_11': 'By clicking Sign up, you agree to the',
            'SIGNUP_PRIVACY': 'privacy statement',
            'SIGNUP_TEXT_12': 'and',
            'SIGNUP_SERVICES': 'services agreement',
            'SIGNUP_TEXT_2': 'Do you have an account?',
            'SIGNUP_SIGNIN_HERE': ' Sign in here',
            'SIGNUP_EMAIL_REGISTERED': 'This email is already registered',
            'SIGNUP_FULLNAME_WRONG': 'xxxx',
            'SIGNUP_EMAIL_WRONG': 'xxxx',

            // Sign Up Details page
            'POST_SIGNUP_TITLE': 'Welcome to Pip.Life',
            'POST_SIGNUP_TEXT_1': 'Your account was successfully created.',
            'POST_SIGNUP_TEXT_2': 'Tell us some more about yourself.',

            // Recover Password page
            'RECOVER_PWD_TITLE': 'Forgot password?',
            'RECOVER_PWD_TEXT_1': "Enter the email address you used when you joined and we'll send you instructions to reset your password.",
            'RECOVER_PWD_TEXT_2': 'For security reasons, we do NOT store your password. So rest assured that we will never send your password via email.',
            'RECOVER_PWD_RECOVER': 'Recover password',

            // Reset Password page
            'RESET_PWD_PASSWORD': 'Reset password',
            'RESET_PWD_TEXT': 'Enter the email address together with the reset code you received in email from PipLife. Remember the code is only active for 24 hours.',
            'RESET_PWD_SUCCESS_TEXT': 'Your password was successfully changed',

            // Verify Email page
            'VERIFY_EMAIL_TITLE': 'Email verification',
            'VERIFY_EMAIL_TEXT_1': 'Confirm your email address using verification code',
            'VERIFY_EMAIL_TEXT_21': "If you haven't received the code, press ",
            'VERIFY_EMAIL_RESEND': 'resend',
            'VERIFY_EMAIL_TEXT_22': 'to send it again.',
            'VERIFY_EMAIL_SUCCESS_TEXT': 'Your email address was successfully verified. Thank you!',

            'PASSWORD_MATCH': 'Passwords don\'t match',
            'PASSWORD_CONFIRM': 'Confirm the password',
            'PASSWORD_SET': 'Set a password',

            // Common entry resources
            'ENTRY_CHANGE_SERVER': 'Change server',
            'ENTRY_SERVER_URL': 'Server URL',
            'ENTRY_RESET_CODE': 'Reset code',
            'ENTRY_VERIFICATION_CODE': 'Verification code',
            'ENTRY_NEW_PASSWORD': 'New password',
            'ENTRY_SET_PASSWORD': 'Set Password',
            'ENTRY_FREE': 'Free',
            'ENTRY_REPEAT': 'Repeat',

            // Validation errors
            'ERROR_EMAIL_INVALID': 'Enter a valid email',
            'ERROR_PASSWORD_INVALID': 'Enter a valid password',
            'ERROR_FULLNAME_INVALID': 'Enter full name',
            'ERROR_CODE_INVALID': 'Enter a code from mail',
            'ERROR_ACCOUNT_NOT_FOUND': 'User name or password are incorrect',
            'ERROR_WRONG_PASSWORD': 'User name or password are incorrect', //'Wrong password',
            'ERROR_CODE_WRONG': 'Wrong recovery code',
            'ERROR_SERVER': 'Server is not responding',
            'ERROR_SERVER_INVALID': 'Enter server URL',

            //Languages
            'LANGUAGE_RUSSIAN': 'Russian',
            'LANGUAGE_ENGLISH': 'English'
        });

        pipTranslateProvider.translations('ru', {
            // Common labels
            'FULLNAME': 'Имя и фамилия',
            'EMAIL': 'Адрес эл.почты',
            'PASSWORD': 'Пароль',
            'LANGUAGE': 'Язык',
            'GENDER': 'Пол',
            'BIRTHDAY': 'Дата рождения',
            'LOCATION': 'Местонахождение',

            // Common hints
            'HINT_FULLNAME': "Используйте своё настоящее имя, чтобы другие знали с кем имеют дело",
            'HINT_PASSWORD': 'Минимум 6 символов',
            'HINT_ABOUT': 'Несколько слов о себе',
            'VERIFY_EMAIL': 'Подтвердите адрес своей эл.почты',
            'HINT_EMAIL': 'Введите адрес своей эл.почты',

            // Sign In page
            'SIGNIN_TITLE': 'Вход в систему',
            'SIGNIN_NOT_MEMBER': 'Еще не зарегистрировались?',
            'SIGNIN_REMEMBER': 'Запомнить',
            'SIGNIN_FORGOT_PASSWORD': 'Забыли пароль?',
            'SIGNIN_SIGNUP_HERE': ' Зарегистрироваться здесь',

            // Sign Up page
            'SIGNUP_TITLE': 'Регистрация',
            'SIGNUP_NOT_MEMBER': 'Новенький? Зарегистрируйтесь сейчас',
            'SIGNUP_TEXT_11': 'Нажимая кнопку регистрация, я соглашаюсь с',
            'SIGNUP_SERVICES': 'договором об услугах',
            'SIGNUP_TEXT_12': 'и',
            'SIGNUP_PRIVACY': 'соглашением о личных данных',
            'SIGNUP_TEXT_2': 'Уже зарегистрировались?',
            'SIGNUP_SIGNIN_HERE': ' Вход здесь',
            'SIGNUP_EMAIL_REGISTERED': 'Данный адрес эл.почты уже занят',

            // Sign Up Details page
            'POST_SIGNUP_TITLE': 'Добро пожаловать в Pip.Life',
            'POST_SIGNUP_TEXT_1': 'Ваша учетная запись создана.',
            'POST_SIGNUP_TEXT_2': 'Несклько слов о о себе',

            // Recover Password page
            'RECOVER_PWD_TITLE': 'Забыли пароль?',
            'RECOVER_PWD_TEXT_1': 'Введите адрес эл.почты, который вы использовали при регистрации и мы вышлем вам инструкции как изменить пароль.',
            'RECOVER_PWD_TEXT_2': 'По соображениям безопасности мы НЕ храним пароли. Таким образом, мы никогда не пошлем ваш пароль по электронной почте.',
            'RECOVER_PWD_RECOVER': 'Восстановить пароль',

            // Reset Password page
            'RESET_PWD_PASSWORD': 'Изменить пароль',
            'RESET_PWD_TEXT': 'Введите адрес эл.почты вместе с кодом, который вы получили в почтовом сообщении от PipLife. Помните, что код действителен только 24 часа.',
            'RESET_PWD_SUCCESS_TEXT': 'Ваш пароль успешно изменён',

            // Verify Email page
            'VERIFY_EMAIL_TITLE': 'Подтверждение адреса эл.почты',
            'VERIFY_EMAIL_TEXT_1': 'Введите код, который вы получили по эл.почте',
            'VERIFY_EMAIL_TEXT_21': "Если вы не получили почтовое сообщение с кодом, нажмите ",
            'VERIFY_EMAIL_RESEND': 'отправить снова',
            'VERIFY_EMAIL_TEXT_22': '.',
            'VERIFY_EMAIL_SUCCESS_TEXT': 'Адрес вашей электронной почты успешно подтвержден. Спасибо!',

            'PASSWORD_MATCH': 'Пароли не совпадают',
            'PASSWORD_CONFIRM': 'Подтвердите пароль',
            'PASSWORD_SET': 'Задайте пароль',

            // Common entry resources
            'ENTRY_CHANGE_SERVER': 'Изменить сервер',
            'ENTRY_SERVER_URL': 'URL сервера',
            'ENTRY_RESET_CODE': 'Код подтверждения',
            'ENTRY_VERIFICATION_CODE': 'Код проверки',
            'ENTRY_NEW_PASSWORD': 'Новый пароль',
            'ENTRY_SET_PASSWORD': 'Изменить пароль',
            'ENTRY_FREE': 'бесплатно',
            'ENTRY_REPEAT': 'Повторить',

            // Validation errors
            'ERROR_EMAIL_INVALID': 'Введите адрес электронной почты',
            'ERROR_PASSWORD_INVALID': 'Введите пароль',
            'ERROR_FULLNAME_INVALID': 'Введите полное имя',
            'ERROR_CODE_INVALID': 'Введите код',
            'ERROR_ACCOUNT_NOT_FOUND': 'Введено неверное имя пользователя или пароль',//'Такой пользователь не зарегистрирован',
            'ERROR_WRONG_PASSWORD': 'Введено неверное имя пользователя или пароль', //'Неправильный пароль',
            'ERROR_CODE_WRONG': 'Неправильный код',
            'ERROR_SERVER': 'Сервер не отвечает. Проверьте URL сервера.',
            'ERROR_SERVER_INVALID': 'Введите URL сервера',

            //Languages
            'LANGUAGE_RUSSIAN': 'Русский',
            'LANGUAGE_ENGLISH': 'Английский'
        });

    }]);

})();
/**
 * @file Checking uniqueness of email in input control
 * @description
 * Email validation is performed on server via /api/signup_validate REST operation
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipPasswordMatch', []);

    thisModule.directive('compareTo',function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    });

})();

/**
 * @file Entry recover password controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.RecoverPassword', ['pipEntry.Common', "pipRecoverPasswordPanel"]);

    thisModule.controller('pipRecoverPasswordController',
        ['$scope', '$rootScope', 'pipUtils', 'pipAuthState', 'pipTransaction', 'pipRest', 'pipFormErrors', 'pipEntryCommon', '$window', function ($scope, $rootScope, pipUtils, pipAuthState, pipTransaction, pipRest, 
            pipFormErrors, pipEntryCommon, $window) {

            pipEntryCommon.configureAppBar();
            $scope.goBack = goBack;

            $scope.onRecover = onRecover;

            $scope.transaction = pipTransaction('entry.recover_password', $scope);

            return

            function goBack(){
                $window.history.back();
            }
            function onRecover() {
                if ($scope.$panel)  $scope.$panel.onRecover();
            }

        }]
    );

})();
/**
 * @file Recover password dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.RecoverPasswordDialog', ['pipEntry.Common', "pipRecoverPasswordPanel",
        'pipEntry.ResetPasswordDialog']);

    thisModule.factory('pipRecoverPasswordDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'recover_password/recover_password_dialog.html',
                        controller: 'pipRecoverPasswordDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                        .then(function () {
                            if (successCallback) {
                                successCallback();
                            }
                        }, function () {
                            if (cancelCallback) {
                                cancelCallback();
                            }
                        });
                }
            };
        }]
    );

    thisModule.controller('pipRecoverPasswordDialogController',
        ['$scope', '$rootScope', '$location', 'pipSession', 'params', '$mdDialog', 'pipResetPasswordDialog', function ($scope, $rootScope, $location, pipSession, params, $mdDialog, pipResetPasswordDialog){

            $scope.onRecover = onRecover;

            if ($scope.$panel) $scope.transaction = $scope.$panel.transacton;

            $scope.goBack = $mdDialog.cancel;
            $scope.pipGotoReset = pipGotoResetPasswordDialog;

            return;

            function onRecover() {
                if ($scope.$panel)  $scope.$panel.onRecover();
            }

            function pipGotoResetPasswordDialog(){
                pipResetPasswordDialog.show({});
            }
        }]
    );

})();
/**
 * @file Recover password panel
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipRecoverPasswordPanel", ['pipUtils', 'pipFocused', 'pipEntry.Strings']);

    thisModule.directive('pipRecoverPasswordPanel',
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    data: '=pipData',
                    created: '&pipCreated',
                    gotoReset: '=pipGotoReset',
                    hideElements: '=pipHideElements' // {title, subTitle1, subTitle2, server}
                },
                templateUrl: 'recover_password/recover_password_panel.html',
                controller: 'pipRecoverPasswordPanelController'

            };
        }
    );
    thisModule.controller('pipRecoverPasswordPanelController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipFormErrors', 'pipEntryCommon', '$state', '$mdMedia', 'pipTranslate', 'pipEnums', 'pipRest', 'pipUtils', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
                  pipFormErrors, pipEntryCommon, $state, $mdMedia, pipTranslate, pipEnums, pipRest, pipUtils) {

            $scope.$mdMedia = $mdMedia;

            setElementVisability();

            pipEntryCommon.initScope($scope);

            $scope.showServerError = true;

            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
            $scope.onRecover = onRecover;
            $scope.transaction = pipTransaction('entry.recover_password', $scope);

            $scope.$control = {};
            $scope.$control.onRecover = onRecover;

            if ($scope.created) {
                $scope.created({
                    $control: $scope.$control
                });
            }

            return;

            function setElementVisability() {
                $scope.hideObject = angular.isObject($scope.hideElements) ? $scope.hideElements : {};
                $scope.hideObject.title = pipUtils.toBoolean($scope.hideObject.title) == true;
                $scope.hideObject.subTitle1 = pipUtils.toBoolean($scope.hideObject.subTitle1) == true; 
                $scope.hideObject.subTitle2 = pipUtils.toBoolean($scope.hideObject.subTitle2) == true; 
                $scope.hideObject.server = pipUtils.toBoolean($scope.hideObject.server) == true;
                $scope.hideObject.hint = pipUtils.toBoolean($scope.hideObject.hint) == true; 
            }

            //-----------------------------

            function onRecover() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }

                var transactionId = $scope.transaction.begin('PROCESSING');
                if (!transactionId) return;

                pipRest.recoverPassword($scope.data.serverUrl).call(
                    {
                        email: $scope.data.email
                    },
                    function (data) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId)) return;

                        $scope.transaction.end();
                        if (!$scope.gotoReset)
                            pipAuthState.go('reset_password', {
                                server_url: $scope.data.serverUrl,
                                email: $scope.data.email
                            });
                        else
                            $scope.gotoReset();
                    },
                    function (error) {
                        $scope.error = error;
                        $scope.transaction.end($scope.error);
                        pipFormErrors.setFormError(
                            $scope.form, $scope.error,
                            {
                                1100: 'email', // Missing email
                                1106: 'email', // User was not found
                                1000: 'form', // Unknown error
                                1110: 'form', // Account is locked
                                1111: 'form', // Number of attempts exceeded. Account was locked
                                1112: 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                        pipFormErrors.resetFormErrors($scope.form, true);
                    }
                );
            };

        }])

})();
/**
 * @file Entry reset password controller
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Fix error handling
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.ResetPassword', ['pipEntry.Common', 'pipResetPasswordPanel',
        'pipEmailUnique']);

    thisModule.controller('pipResetPasswordController',
        ['$scope', '$rootScope', 'pipUtils', 'pipAuthState', 'pipTransaction', 'pipRest', 'pipToasts', 'pipTranslate', 'pipFormErrors', 'pipEntryCommon', '$window', function ($scope, $rootScope, pipUtils, pipAuthState, pipTransaction, pipRest, pipToasts, 
            pipTranslate, pipFormErrors, pipEntryCommon, $window) {

            pipEntryCommon.configureAppBar();
            $scope.goBack = goBack;

            $scope.onReset = onReset;

            $scope.transaction = pipTransaction('entry.reset_password', $scope);

            return


            function goBack(){
                $window.history.back();
            }

            function onReset() {
                if ($scope.$panel)  $scope.$panel.onReset();
            }



        }]
    );

})();
/**
 * @file Reset password dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.ResetPasswordDialog', ['pipEntry.Common', "pipResetPasswordPanel"]);

    thisModule.factory('pipResetPasswordDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'entry/dialogs/reset_password.html',
                        controller: 'pipResetPasswordDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                        .then(function () {
                            if (successCallback) {
                                successCallback();
                            }
                        }, function () {
                            if (cancelCallback) {
                                cancelCallback();
                            }
                        });
                }
            };
        }]
    );

    thisModule.controller('pipResetPasswordDialogController',
        ['$scope', '$rootScope', '$location', 'pipSession', 'params', '$mdDialog', function ($scope, $rootScope, $location, pipSession, params, $mdDialog){

            $scope.onReset = onReset;

            if ($scope.$panel) $scope.transaction = $scope.$panel.transacton;

            $scope.goBack = $mdDialog.cancel;


            return

            function onReset() {
                if ($scope.$panel)  $scope.$panel.onReset();
            }
        }]
    );

})();
/**
 * @file Reset password panel
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipResetPasswordPanel", ['pipUtils', 'pipFocused', 'pipEntry.Strings']);

    thisModule.directive('pipResetPasswordPanel',
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    data: '=pipData',
                    created: '&pipCreated',
                    hideElements: '=pipHideElements' // {title, subTitle, server}
                },
                templateUrl: 'reset_password/reset_password_panel.html',
                controller: 'pipResetPasswordPanelController'

            };
        }
    );
    thisModule.controller('pipResetPasswordPanelController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipToasts', 'pipFormErrors', 'pipEntryCommon', '$state', '$mdMedia', 'pipTranslate', 'pipEnums', 'pipRest', 'pipUtils', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession, pipToasts,
                  pipFormErrors, pipEntryCommon, $state, $mdMedia, pipTranslate, pipEnums, pipRest, pipUtils) {

            $scope.$mdMedia = $mdMedia;

            setElementVisability();

            pipEntryCommon.initScope($scope);

            $scope.showServerError = true;

            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
            $scope.onReset = onReset;
            $scope.transaction = pipTransaction('entry.recover_password', $scope);

            $scope.$control = {};
            $scope.$control.onReset = onReset;

            if ($scope.created) {
                $scope.created({
                    $control: $scope.$control
                });
            }

            return;

            function setElementVisability() {
                $scope.hideObject = angular.isObject($scope.hideElements) ? $scope.hideElements : {};
                $scope.hideObject.subTitle = pipUtils.toBoolean($scope.hideObject.subTitle) == true;
                $scope.hideObject.title = pipUtils.toBoolean($scope.hideObject.title) == true; 
                $scope.hideObject.server = pipUtils.toBoolean($scope.hideObject.server) == true;
                $scope.hideObject.hint = pipUtils.toBoolean($scope.hideObject.hint) == true; 
            }

            //-----------------------------

            function onShowToast(message, type) {
                if (!message) return;
                message = pipTranslate.translate(message);
                type = type || 'message';

                if (type == 'message') {
                    pipToasts.showMessage(message);
                    return;
                }
                if (type == 'error') {
                    pipToasts.showError(message);
                    return;
                }
            };

            function onReset() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }

                var transactionId = $scope.transaction.begin('PROCESSING');
                if (!transactionId) return;

                pipRest.resetPassword($scope.data.serverUrl).call(
                    {
                        email: $scope.data.email,
                        code: $scope.data.code,
                        password: $scope.data.password
                    },
                    function (data) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId)) return;

                        var message = String() + 'RESET_PWD_SUCCESS_TEXT';
                        onShowToast(message, 'message');
                        $scope.transaction.end();
                        pipAuthState.go('signin', {
                            server_url: $scope.data.serverUrl,
                            email: $scope.data.email
                        });
                    },
                    function (error) {
                        $scope.error = error;
                        $scope.transaction.end($scope.error);
                        pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1100 : 'email', // Missing email
                                1106 : 'email', // User was not found
                                1102 : 'password', // Missing password
                                1103 : 'password', // Password should be 5 to 20 symbols long
                                1105 : 'password', // Old and new passwords are identical
                                1108 : 'code', // Invalid password recovery code
                                1109 : 'code', // Password recovery code expired
                                1000 : 'form', // Unknown error
                                1110 : 'form', // Account is locked
                                1111 : 'form', // Number of attempts exceeded. Account was locked
                                1112 : 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                    }
                );
            };

        }])

})();
/**
 * @file Entry post signup controller
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Fix error handling
 * - Make a better post-signup. Redo it with document layout
 */

/* global angular */

(function () {
    'use strict';



    var thisModule = angular.module('pipEntry.PostSignup', ['pipEntry.Common', "pipPostSignupPanel"]);

    thisModule.controller('pipPostSignupController',
        ['$scope', '$rootScope', 'pipAuthState', '$party', function ($scope, $rootScope, pipAuthState, $party) {

            $scope.$party = $party;
            $scope.onPostSignupSubmit = onPostSignupSubmit;

            if ($scope.$panel) $scope.transaction = $scope.$panel.transacton;

            return

            function onPostSignupSubmit() {
                if ($scope.$panel)  $scope.$panel.onPostSignupSubmit();
            }
        }]
    );

})();
/**
 * @file Post signup dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.PostSignupDialog', ['pipEntry.Common', "pipPostSignupPanel"]);

    thisModule.factory('pipPostSignupDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'post_signup/post_signup_dialog.html',
                        controller: 'pipPostSignupDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                        .then(function () {
                            if (successCallback) {
                                successCallback();
                            }
                        }, function () {
                            if (cancelCallback) {
                                cancelCallback();
                            }
                        });
                }
            };
        }]
    );

    thisModule.controller('pipPostSignupDialogController',
        ['$scope', '$rootScope', '$location', 'pipSession', 'params', function ($scope, $rootScope, $location, pipSession, params) {
            $scope.$party = params.$party;

            $scope.onPostSignupSubmit = onPostSignupSubmit;

            if ($scope.$panel) $scope.transaction = $scope.$panel.transacton;

            return

            function onPostSignupSubmit() {
                if ($scope.$panel)  $scope.$panel.onPostSignupSubmit();
            }
        }]
    );

})();
/**
 * @file Post signup panel
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipPostSignupPanel", ['pipUtils', 'pipFocused', 'pipEntry.Strings']);

    thisModule.directive('pipPostSignupPanel',
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    data:'=pipData',
                    created:'&pipCreated',
                    $party:'=pipParty',
                    hideElements: '=pipHideElements' // {title, successTitle, subTitle}
                },
                templateUrl: 'post_signup/post_signup_panel.html',
                controller: 'pipPostSignupPanelController'

            };
        }
    );
    thisModule.controller('pipPostSignupPanelController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipFormErrors', 'pipEntryCommon', '$state', '$mdMedia', 'pipTranslate', 'pipEnums', 'pipRest', 'pipUtils', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
                  pipFormErrors, pipEntryCommon, $state, $mdMedia, pipTranslate, pipEnums, pipRest, pipUtils) {

            $scope.$mdMedia = $mdMedia;

            setElementVisability();

            pipEntryCommon.initScope($scope);
            $scope.showServerError = true;
            $scope.genders = pipTranslate.translateSet(pipEnums.GENDERS);
            $scope.languages = pipTranslate.translateSet(pipEnums.LANGUAGES);

            $scope.data = {
                id: $scope.$party.id,
                name: $scope.$party.name,
                email: $scope.$party.email,
                about: $scope.$party.about,
                language: pipTranslate.use(),
                birthday: $scope.$party.birthday,
                gender: $scope.$party.gender || pipEnums.GENDER.NOT_SPECIFIED,
                location: $scope.$party.location
            };

            $scope.transaction = pipTransaction('entry.post_signup', $scope);

            $scope.$control = {};
            $scope.$control.onPostSignupSubmit = onPostSignupSubmit;
            $scope.$control.transaction =  $scope.transaction;

            if ($scope.created){
                $scope.created({
                    $control: $scope.$control
                });
            }

            $scope.onPictureChanged = onPictureChanged;
            $scope.onPictureCreated = onPictureCreated;
            $scope.onPostSignupSubmit = onPostSignupSubmit;

            return;

            function setElementVisability() {
                $scope.hideObject = angular.isObject($scope.hideElements) ? $scope.hideElements : {};
                $scope.hideObject.subTitle = pipUtils.toBoolean($scope.hideObject.subTitle) == true;
                $scope.hideObject.title = pipUtils.toBoolean($scope.hideObject.title) == true; 
                $scope.hideObject.successTitle = pipUtils.toBoolean($scope.hideObject.successTitle) == true; 
            }

            //---------------------------

            function onPictureChanged($control) {
                if($scope.picture)
                    $scope.picture.save(
                        // Success callback
                        function() {},
                        // Error callback
                        function(error) {
                            console.error(error);
                        }
                    );
            };

            function onPictureCreated($event) {
                $scope.picture = $event.sender;
            };

            function onPostSignupSubmit() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }

                var transactionId = $scope.transaction.begin('PROCESSING');
                if (!transactionId) return;

                pipRest.parties().update(
                    $scope.data,

                    function (party) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId)) return;

                        $scope.transaction.end();

                        if (!pipUtils.checkSupported()) {
                            pipSession.signout();
                            $state.go('errors_unsupported');
                            return ;
                        }

                        pipAuthState.goToAuthorized({ party_id: party.id });
                    },
                    function (error) {
                        $scope.error = error;
                        $scope.transaction.end($scope.error);
                        pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1000 : 'form', // Unknown error
                                1110 : 'form', // Account is locked
                                1111 : 'form', // Number of attempts exceeded. Account was locked
                                1112 : 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                    }
                );
            };

        }])

})();
/**
 * @file Entry signin controller
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Remove hack with guide_intro redirect
 * - Fix error handling
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.Signin', ['pipEntry.Common', "pipSigninPanel"]);

    thisModule.controller('pipSigninController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipFormErrors', 'pipEntryCommon', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
            pipFormErrors, pipEntryCommon) {

            pipEntryCommon.configureAppBar();
            if (!$rootScope.isSignin) pipSession.signout(); // hak for set language

            $rootScope.isSignin = false;
            return;


        }]
    );

})();
/**
 * @file Entry signin dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.SigninDialog', ['pipEntry.Common', "pipSigninPanel",  'pipEntry.SignupDialog',
        'pipEntry.RecoverPasswordDialog']);

    thisModule.factory('pipSigninDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'signin/signin_dialog.html',
                        controller: 'pipSigninDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                        .then(function () {
                            if (successCallback) {
                                successCallback();
                            }
                        }, function () {
                            if (cancelCallback) {
                                cancelCallback();
                            }
                        });
                }
            };
        }]
    );

    thisModule.controller('pipSigninDialogController',
        ['$scope', '$rootScope', '$location', 'pipSession', 'pipSignupDialog', 'pipRecoverPasswordDialog', function ($scope, $rootScope, $location, pipSession,  pipSignupDialog, pipRecoverPasswordDialog) {

            //pipEntryCommon.configureAppBar();
            pipSession.signout();

            $scope.pipGotoSignupDialog = pipGotoSignupDialog;
            $scope.pipGotoRecoverPasswordDialog = pipGotoRecoverPasswordDialog;

            return;

            function pipGotoSignupDialog(){
                pipSignupDialog.show({});
            }

            function pipGotoRecoverPasswordDialog(){
                pipRecoverPasswordDialog.show({});
            }

        }]
    );

})();
/**
 * @file Signin panel
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipSigninPanel", ['pipUtils', 'pipFocused', 'pipEntry.Strings']);

    thisModule.directive('pipSigninPanel',
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    gotoSignupPage: '=pipGotoSignupPage',
                    gotoSignupDialog: '=pipGotoSignupDialog',
                    gotoRecoverPasswordDialog:'=pipGotoRecoverPasswordDialog',
                    rememberDefault: '=pipRemember', // set remember check
                    hideElements: '=pipHideElements' // {remember, title, server, forgotPassword, signup}
                },
                templateUrl: 'signin/signin_panel.html',
                controller: 'pipSigninPanelController'

            };
        }
    );
    thisModule.controller('pipSigninPanelController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipFormErrors', 'pipEntryCommon', '$state', '$mdMedia', 'pipTheme', 'pipUtils', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
                  pipFormErrors, pipEntryCommon, $state, $mdMedia, pipTheme, pipUtils) {

            $scope.$mdMedia = $mdMedia;

            setElementVisability();

            $scope.showServerError = true;
            $scope.transaction = pipTransaction('entry.signin', $scope);

            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;

            $scope.onSignin = onSignin;
            $scope.gotoSignup = gotoSignup;
            $scope.gotoRecoverPassword = gotoRecoverPassword;
            $scope.onEnter = onEnter;

            pipEntryCommon.initScope($scope);

            return;

            function setElementVisability() {
                $scope.hideObject = angular.isObject($scope.hideElements) ? $scope.hideElements : {};
                $scope.hideObject.remember = pipUtils.toBoolean($scope.hideObject.remember) == true;
                $scope.hideObject.title = pipUtils.toBoolean($scope.hideObject.title) == true; 
                $scope.hideObject.server = pipUtils.toBoolean($scope.hideObject.server) == true;
                $scope.hideObject.forgotPassword = pipUtils.toBoolean($scope.hideObject.forgotPassword) == true;
                $scope.hideObject.signup = pipUtils.toBoolean($scope.hideObject.signup) == true;
                $scope.hideObject.hint = pipUtils.toBoolean($scope.hideObject.hint) == true;
            }

            function gotoSignup(){
                if(!$scope.gotoSignupPage &&  !$scope.gotoSignupDialog){
                    $state.go('signup',{ server_url: $scope.data.serverUrl, email: $scope.data.email });
                    return;
                }
                if($scope.gotoSignupPage){
                    $state.go($scope.gotoSignupPage);
                    return;
                }
                if($scope.gotoSignupDialog){
                    $scope.gotoSignupDialog();
                    return;
                }
            }

            function gotoRecoverPassword(){

                if(!$scope.gotoRecoverPasswordDialog){
                    $state.go('recover_password',{ server_url: $scope.data.serverUrl, email: $scope.data.email });
                    return;
                }
                if($scope.gotoRecoverPasswordDialog){
                    $scope.gotoRecoverPasswordDialog();
                    return;
                }
            }
  
            function onSignin() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }

                var transactionId = $scope.transaction.begin('ENTERING');
                if (!transactionId) return;

                $rootScope.isSignin = true;
                
                if ($scope.hideObject.remember && !!$scope.rememberDefault) {
                    $scope.data.remember = true;
                }

                pipSession.signin($scope.data,
                    function (user) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId))return;
                        $scope.transaction.end();

                        if (!pipUtils.checkSupported()) {
                            pipSession.signout();
                            $state.go('errors_unsupported');
                            return ;
                        }

                        if (pipAuthState.params.redirect_to) {
                            $location.url(pipAuthState.params.redirect_to);

                        } else {
                            pipAuthState.goToAuthorized();
                        }


                    },
                    function (error) {
                        $rootScope.isSignin = false;
                        pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1100 : 'email', // Missing email
                                1106 : 'email', // User was not found
                                1114 : 'email', // Invalid email
                                1102 : 'password', // Missing password
                                1107 : 'password', // Invalid password
                                1000 : 'form', // Unknown error
                                1110 : 'form', // Account is locked
                                1111 : 'form', // Number of attempts exceeded. Account was locked
                                1112 : 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                        $scope.transaction.end({message:error});

                    }
                );
            };

            function onEnter(event) {
                if(event.keyCode === 13) {
                    onSignin();
                }
            }

        }])

})();
/**
 * @file Entry signup controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.Signup', ['pipEntry.Common', 'pipEmailUnique',  'pipSignupPanel',
        'pipPasswordMatch']);

    thisModule.controller('pipSignupController',
        ['$scope', '$rootScope', 'pipAuthState', 'pipTransaction', 'pipRest', 'pipSession', 'pipFormErrors', 'pipEntryCommon', function ($scope, $rootScope, pipAuthState, pipTransaction, pipRest, pipSession, //pipAuth,
            pipFormErrors, pipEntryCommon) {

            pipEntryCommon.configureAppBar();

        }]
    );

})();
/**
 * @file Entry signup controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.SignupDialog', ['pipEntry.Common', "pipSignupPanel", 'pipEntry.SigninDialog',
        'pipEntry.PostSignupDialog']);

    thisModule.factory('pipSignupDialog',
        ['$mdDialog', function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'signup/signup_dialog.html',
                        controller: 'pipSignupDialogController',
                        locals: { params: params },
                        clickOutsideToClose: true
                    })
                        .then(function () {
                            if (successCallback) {
                                successCallback();
                            }
                        }, function () {
                            if (cancelCallback) {
                                cancelCallback();
                            }
                        });
                }
            };
        }]
    );

    thisModule.controller('pipSignupDialogController',
        ['$scope', '$rootScope', '$location', 'pipSession', 'pipSigninDialog', 'pipPostSignupDialog', function ($scope, $rootScope, $location, pipSession, pipSigninDialog, pipPostSignupDialog) {

            pipSession.signout();
            $scope.pipGotoSigninDialog = pipGotoSigninDialog;
            $scope.pipPostSignup = pipPostSignup;

            return;

            function pipGotoSigninDialog(){
                pipSigninDialog.show({});
            }

            function pipPostSignup(user){
                pipPostSignupDialog.show({
                    $party:user
                });
            }


        }]
    );

})();
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipSignupPanel", ['pipUtils', 'pipFocused', 'pipEntry.Strings']);

    thisModule.directive('pipSignupPanel',
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    gotoPostSignup:'=pipPostSignup',
                    gotoSigninPage:'=pipGotoSigninPage',
                    gotoSigninDialog:'=pipGotoSigninDialog',
                    hideElements: '=pipHideElements' // {title, server, agreement, signin, passwordConfirm}
                },
                templateUrl: 'signup/signup_panel.html',
                controller: 'pipSignupPanelController'

            };
        }
    );
    thisModule.controller('pipSignupPanelController',
        ['$scope', '$rootScope', '$location', 'pipTransaction', 'pipAuthState', 'pipSession', 'pipFormErrors', 'pipEntryCommon', 'pipRest', '$mdMedia', '$state', 'pipUtils', function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
                  pipFormErrors, pipEntryCommon, pipRest, $mdMedia, $state, pipUtils) {

            $scope.$mdMedia = $mdMedia;

            setElementVisability();

            pipEntryCommon.initScope($scope);

            $scope.confirmPassword = '';

            $scope.isEmpty = _.isEmpty;
            $scope.onEnter = onEnter;
            $scope.showServerError = true;
            $scope.transaction = pipTransaction('entry.signup', $scope);

            // фильтр по серверам
            $scope.filterItem = filterItem;
            $scope.getMatches = getMatches;
            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
            $scope.onServerUrlChanged = function () {};
            $scope.onSignup = onSignup;
            $scope.gotoSignin =  gotoSignin;

            return;

            function setElementVisability() {
                $scope.hideObject = angular.isObject($scope.hideElements) ? $scope.hideElements : {};
                $scope.hideObject.title = pipUtils.toBoolean($scope.hideObject.title) == true; 
                $scope.hideObject.server = pipUtils.toBoolean($scope.hideObject.server) == true;
                $scope.hideObject.passwordConfirm = pipUtils.toBoolean($scope.hideObject.passwordConfirm) == true;
                $scope.hideObject.agreement = pipUtils.toBoolean($scope.hideObject.agreement) == true;
                $scope.hideObject.signin = pipUtils.toBoolean($scope.hideObject.signin) == true;
                $scope.hideObject.hint = pipUtils.toBoolean($scope.hideObject.hint) == true; 
            }

            function gotoSignin(){
                if(!$scope.gotoSigninPage &&  !$scope.gotoSigninDialog){
                    $state.go('signin',{});
                    return;
                }
                if($scope.gotoSigninPage){
                    $state.go($scope.gotoSigninPage);
                    return;
                }
                if($scope.gotoSigninDialog){
                    $scope.gotoSigninDialog();
                    return;
                }
            }

            function filterItem(item) {
                var result = ($scope.selected.searchURLs
                && item
                && item.toLowerCase().indexOf($scope.selected.searchURLs.toLowerCase()) >= 0);
                return result;
            };

            function getMatches() {
                if (!$scope.selected.searchURLs)
                    return $scope.showServerUrl;
                $scope.data.serverUrl = $scope.selected.searchURLs;
                return _.filter($scope.serverUrls, $scope.filterItem);
            };

            function onSignup() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }
                var transactionId = $scope.transaction.begin('PROCESSING');
                if (!transactionId) return;
                pipRest.signup($scope.data.serverUrl).call(
                    {
                        name: $scope.data.name,
                        email: $scope.data.email,
                        password: $scope.data.password,
                        language: $rootScope.$language || 'en',
                        theme: $rootScope.theme || 'blue'
                    },
                    function (user) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId)) return;
                        $scope.transaction.end();

                        pipSession.open($scope.data.serverUrl, user, $scope.data.password, false);
                        if(!$scope.gotoPostSignup)
                            pipAuthState.go('post_signup', { party_id: user.id });
                        else
                            $scope.gotoPostSignup(user);

                    },
                    function (error) {
                        $scope.error = error;
                        pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1101 : 'signupFullName', // Missing name
                                1100 : 'userEmail', // Missing email
                                1106 : 'userEmail', // User was not found
                                1104 : 'userEmail', // Email is already registered
                                1305 : 'userEmail', // Email is already registered
                                1114 : 'userEmail', // Invalid email
                                1301 : 'userEmail', // Invalid email
                                1300 : 'userEmail', // Missing email
                                1102 : 'password', // Missing password
                                1103 : 'password', // Password should be 5 to 20 symbols long
                                1000 : 'form', // Unknown error
                                1110 : 'form', // Account is locked
                                1111 : 'form', // Number of attempts exceeded. Account was locked
                                1112 : 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                        $scope.transaction.end(error);
                    }
                );
            };

            function onEnter(event) {
                if(event.keyCode === 13) {
                    onSignup();
                }
            }

        }])

})();
/**
 * @file Entry verify email controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.VerifyEmail', ['pipEntry.Common']);

    thisModule.controller('pipVerifyEmailController',
        ['$scope', '$rootScope', 'pipAuthState', 'pipTransaction', 'pipRest', 'pipFormErrors', 'pipEntryCommon', function ($scope, $rootScope, pipAuthState, pipTransaction, pipRest, 
            pipFormErrors, pipEntryCommon) {

            pipEntryCommon.configureAppBar();
            pipEntryCommon.initScope($scope);

            $scope.showServerError = true;
            $scope.transaction = pipTransaction('entry.verify_email', $scope);

            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
            $scope.onVerify = onVerify;
            $scope.onRecover = onRecover;

            return;

            //-----------------------------

            function onVerify() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }

                var transactionId = $scope.transaction.begin('PROCESSING');
                if (!transactionId) return;

                pipRest.verifyEmail($scope.data.serverUrl).call(
                    {
                        email: $scope.data.email,
                        code: $scope.data.code
                    },
                    function (data) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId)) return;

                        $scope.transaction.end();
                        pipAuthState.go('verify_email_success', {});
                    },
                    function (error) {
                        $scope.error = error;
                        $scope.transaction.end($scope.error);
                        pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, $scope.error,
                            {
                                1100 : 'email', // Missing email
                                1106 : 'email', // User was not found
                                1104 : 'email', // Email is already registered
                                1305 : 'email', // Email is already registered
                                1108 : 'code', // Invalid password recovery code
                                1000 : 'form', // Unknown error
                                1110 : 'form', // Account is locked
                                1111 : 'form', // Number of attempts exceeded. Account was locked
                                1112 : 'form', // Account is not active
                                '-1' : 'form' // server not response
                            }
                        );
                    }
                );
            };

            function onRecover() {
                if (!$rootScope.$user || !$rootScope.$user.id) {
                    return ;
                }

                var tid = $scope.transaction.begin('PROCESSING');
                if (!tid) return;
                pipRest.requestEmailVerification($scope.data.serverUrl).get(
                    {
                        party_id: $rootScope.$user.id,
                        email: $scope.data.email
                    },
                    function (data) {
                        if ($scope.transaction.aborted(tid)) return;

                        $scope.transaction.end();
                        pipAuthState.go('reset_password', {
                            server_url: $scope.data.serverUrl,
                            email: $scope.data.email
                        });
                    },
                    function (error) {
                        $scope.transaction.end(error);
                    }
                );
            };
        }]
    );

    thisModule.controller('pipVerifyEmailSuccessController',
        ['$scope', 'pipAuthState', 'pipEntryCommon', function ($scope, pipAuthState, pipEntryCommon) {

            pipEntryCommon.configureAppBar();

            $scope.onContinue = onContinue;

            return;
            
            //-----------------------------

            function onContinue() {
                pipAuthState.goToAuthorized({});
            };
        }]
    );

})();
//# sourceMappingURL=pip-webui-entry.js.map
