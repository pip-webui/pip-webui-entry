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
                    gotoRecoverPasswordDialog:'=pipGotoRecoverPasswordDialog'
                },
                templateUrl: 'signin/signin_panel.html',
                controller: 'pipSigninPanelController'

            };
        }
    );
    thisModule.controller('pipSigninPanelController',
        function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
                  pipFormErrors, pipEntryCommon, $state, $mdMedia, pipTheme, pipUtils) {

            $scope.$mdMedia = $mdMedia;


            $scope.showServerError = true;
            $scope.transaction = pipTransaction('entry.signin', $scope);

            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;

            $scope.onSignin = onSignin;
            $scope.gotoSignup = gotoSignup;
            $scope.gotoRecoverPassword = gotoRecoverPassword;
            $scope.onEnter = onEnter;

            pipEntryCommon.initScope($scope);

            return;

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

        })

})();