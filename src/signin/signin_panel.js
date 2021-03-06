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
        function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipDataSession,
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
                $scope.hideObject.progress = pipUtils.toBoolean($scope.hideObject.progress) == true;
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

                pipDataSession.signin($scope.data,
                    function (user) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId))return;
                        $scope.transaction.end();

                        if (!pipUtils.checkSupported()) {
                            pipDataSession.signout();
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