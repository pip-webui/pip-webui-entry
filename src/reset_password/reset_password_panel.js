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
        function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession, pipToasts,
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

        })

})();