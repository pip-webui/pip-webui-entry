/**
 * @file Post signup dialog
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.PostSignupDialog', ['pipEntry.Common', "pipPostSignupPanel"]);

    thisModule.factory('pipPostSignupDialog',
        function ($mdDialog) {
            return {
                show: function (params, successCallback, cancelCallback) {
                    $mdDialog.show({
                        targetEvent: params.event,
                        templateUrl: 'post_signup/post_signup_dialog.html',
                        controller: 'pipPostSignupDialogController',
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

    thisModule.controller('pipPostSignupDialogController',
        function ($scope, $rootScope, $location, pipSession, params) {
            $scope.$party = params.$party;

            $scope.onPostSignupSubmit = onPostSignupSubmit;

            if ($scope.$panel) $scope.transaction = $scope.$panel.transacton;

            return

            function onPostSignupSubmit() {
                if ($scope.$panel)  $scope.$panel.onPostSignupSubmit();
            }
        }
    );

})();