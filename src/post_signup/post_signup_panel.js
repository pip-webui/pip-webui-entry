/**
 * @file Post signup panel
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module("pipPostSignupPanel", ['pipUtils', 'pipFocused', 'pipEntry.Strings']);

    thisModule.directive('pipPostSignupPanel',
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    data:'=pipData',
                    created:'&pipCreated',
                    $party:'=pipParty',
                    hideElements: '=pipHideElements' // {title, successTitle, subTitle}
                },
                templateUrl: 'post_signup/post_signup_panel.html',
                controller: 'pipPostSignupPanelController'

            };
        }
    );
    thisModule.controller('pipPostSignupPanelController',
        function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
                  pipFormErrors, pipEntryCommon, $state, $mdMedia, pipTranslate, pipEnums, pipRest, pipUtils) {

            $scope.$mdMedia = $mdMedia;

            setElementVisability();

            pipEntryCommon.initScope($scope);
            $scope.showServerError = true;
            $scope.genders = pipTranslate.translateSet(pipEnums.GENDERS);
            $scope.languages = pipTranslate.translateSet(pipEnums.LANGUAGES);

            $scope.data = {
                id: $scope.$party.id,
                name: $scope.$party.name,
                email: $scope.$party.email,
                about: $scope.$party.about,
                language: pipTranslate.use(),
                birthday: $scope.$party.birthday,
                gender: $scope.$party.gender || pipEnums.GENDER.NOT_SPECIFIED,
                location: $scope.$party.location
            };

            $scope.transaction = pipTransaction('entry.post_signup', $scope);

            $scope.$control = {};
            $scope.$control.onPostSignupSubmit = onPostSignupSubmit;
            $scope.$control.transaction =  $scope.transaction;

            if ($scope.created){
                $scope.created({
                    $control: $scope.$control
                });
            }

            $scope.onPictureChanged = onPictureChanged;
            $scope.onPictureCreated = onPictureCreated;
            $scope.onPostSignupSubmit = onPostSignupSubmit;

            return;

            function setElementVisability() {
                $scope.hideObject = angular.isObject($scope.hideElements) ? $scope.hideElements : {};
                $scope.hideObject.subTitle = pipUtils.toBoolean($scope.hideObject.subTitle) == true;
                $scope.hideObject.title = pipUtils.toBoolean($scope.hideObject.title) == true; 
                $scope.hideObject.successTitle = pipUtils.toBoolean($scope.hideObject.successTitle) == true; 
            }

            //---------------------------

            function onPictureChanged($control) {
                if($scope.picture)
                    $scope.picture.save(
                        // Success callback
                        function() {},
                        // Error callback
                        function(error) {
                            console.error(error);
                        }
                    );
            };

            function onPictureCreated($event) {
                $scope.picture = $event.sender;
            };

            function onPostSignupSubmit() {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);
                    return;
                }

                var transactionId = $scope.transaction.begin('PROCESSING');
                if (!transactionId) return;

                pipRest.parties().update(
                    $scope.data,

                    function (party) {
                        pipFormErrors.resetFormErrors($scope.form, false);
                        if ($scope.transaction.aborted(transactionId)) return;

                        $scope.transaction.end();

                        if (!pipUtils.checkSupported()) {
                            pipSession.signout();
                            $state.go('errors_unsupported');
                            return ;
                        }

                        pipAuthState.goToAuthorized({ party_id: party.id });
                    },
                    function (error) {
                        $scope.error = error;
                        $scope.transaction.end($scope.error);
                        pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
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