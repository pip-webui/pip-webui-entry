/**
 * @file Entry verify email controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.VerifyEmail', ['pipEntry.Common']);

    thisModule.controller('pipVerifyEmailController',
        function ($scope, $rootScope, pipAuthState, pipTransaction, pipDataUser, 
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

                pipDataUser.verifyEmail(
                    {
                        serverUrl: $scope.data.serverUrl,
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
            }

            function onRecover() {
                if (!$rootScope.$user || !$rootScope.$user.id) {
                    return ;
                }

                var tid = $scope.transaction.begin('PROCESSING');
                if (!tid) return;

                pipDataUser.requestEmailVerification(
                    {
                        serverUrl: $scope.data.serverUrl,
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
            }
        }
    );

    thisModule.controller('pipVerifyEmailSuccessController',
        function ($scope, pipAuthState, pipEntryCommon) {

            pipEntryCommon.configureAppBar();

            $scope.onContinue = onContinue;

            return;
            
            //-----------------------------

            function onContinue() {
                pipAuthState.goToAuthorized({});
            };
        }
    );

})();