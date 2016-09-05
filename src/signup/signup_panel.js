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
                    hideElements: '=pipHideElements' // {title, server, agreement, signin}
                },
                templateUrl: 'signup/signup_panel.html',
                controller: 'pipSignupPanelController'

            };
        }
    );
    thisModule.controller('pipSignupPanelController',
        function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
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
                $scope.hideObject.agreement = pipUtils.toBoolean($scope.hideObject.agreement) == true;
                $scope.hideObject.signin = pipUtils.toBoolean($scope.hideObject.signin) == true;
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

        })

})();