/**
 * @file Entry post signup controller
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Fix error handling
 * - Make a better post-signup. Redo it with document layout
 */

/* global angular */

(function () {
    'use strict';



    var thisModule = angular.module('pipEntry.PostSignup', ['pipEntry.Common', "pipPostSignupPanel"]);

    thisModule.controller('pipPostSignupController',
        function ($scope, $rootScope, pipAuthState, $party) {

            $scope.$party = $party;
            $scope.onPostSignupSubmit = onPostSignupSubmit;

            if ($scope.$panel) $scope.transaction = $scope.$panel.transacton;

            return

            function onPostSignupSubmit() {
                if ($scope.$panel)  $scope.$panel.onPostSignupSubmit();
            }
        }
    );

})();