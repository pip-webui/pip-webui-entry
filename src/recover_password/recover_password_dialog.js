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
        function ($mdDialog) {
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
        }
    );

    thisModule.controller('pipRecoverPasswordDialogController',
        function ($scope, $rootScope, $location, pipSession, params, $mdDialog, pipResetPasswordDialog){

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
        }
    );

})();