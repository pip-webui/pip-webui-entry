/**
 * @file Checking uniqueness of email in input control
 * @description
 * Email validation is performed on server via /api/signup_validate REST operation
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEmailUnique', ['ngResource', 'pipDataUser']);

    thisModule.directive('pipEmailUnique',
        function ($http, pipDataUser) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function ($scope, $element, $attrs, ngModel) {
                    var oldEmail = $attrs.pipEmailUnique;

                    $scope.$watch($attrs.ngModel, _.throttle(function (newValue) {
                        var oldHint = ngModel.$validators.emailUnique;
                        if (!newValue || newValue.length == 0 || oldEmail == newValue) {
                            ngModel.$setValidity('emailUnique', oldHint);
                            return;
                        }

                        if (!newValue) ngModel.$setValidity('emailUnique', true);

                        pipDataUser.signupValidate(email, 
                            function (data) {
                                ngModel.$setValidity('emailUnique', true);
                            }, 
                            function (err) {
                                ngModel.$setValidity('emailUnique', false);
                            });
                            
                    }, 500));
                }
            };
        }
    );

})();