/**
 * @file Reset password dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.ResetPasswordDialog', ['pipEntry.Common', "pipResetPasswordPanel"]);

    thisModule.factory('pipResetPasswordDialog',
        function ($mdDialog) {
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
        }
    );

    thisModule.controller('pipResetPasswordDialogController',
        function ($scope, $rootScope, $location, pipSession, params, $mdDialog){

            $scope.onReset = onReset;

            if ($scope.$panel) $scope.transaction = $scope.$panel.transacton;

            $scope.goBack = $mdDialog.cancel;


            return

            function onReset() {
                if ($scope.$panel)  $scope.$panel.onReset();
            }
        }
    );

})();