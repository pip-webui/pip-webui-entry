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
        function ($mdDialog) {
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
        }
    );

    thisModule.controller('pipSigninDialogController',
        function ($scope, $rootScope, $location, pipDataSession,  pipSignupDialog, pipRecoverPasswordDialog) {

            //pipEntryCommon.configureAppBar();
            pipDataSession.signout();

            $scope.pipGotoSignupDialog = pipGotoSignupDialog;
            $scope.pipGotoRecoverPasswordDialog = pipGotoRecoverPasswordDialog;

            return;

            function pipGotoSignupDialog(){
                pipSignupDialog.show({});
            }

            function pipGotoRecoverPasswordDialog(){
                pipRecoverPasswordDialog.show({});
            }

        }
    );

})();