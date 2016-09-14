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
        function ($mdDialog) {
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
        }
    );

    thisModule.controller('pipSignupDialogController',
        function ($scope, $rootScope, $location, pipDataSession, pipSigninDialog, pipPostSignupDialog) {

            pipDataSession.signout();
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


        }
    );

})();