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
        function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
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
                $scope.hideObject.progress = pipUtils.toBoolean($scope.hideObject.progress) == true;
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

        })

})();