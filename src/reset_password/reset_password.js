/**
 * @file Entry reset password controller
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Fix error handling
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.ResetPassword', ['pipEntry.Common', 'pipResetPasswordPanel',
        'pipEmailUnique']);

    thisModule.controller('pipResetPasswordController',
        function ($scope, $rootScope, pipUtils, pipAuthState, pipTransaction, pipRest, pipToasts, 
            pipTranslate, pipFormErrors, pipEntryCommon, $window) {

            pipEntryCommon.configureAppBar();
            $scope.goBack = goBack;

            $scope.onReset = onReset;

            $scope.transaction = pipTransaction('entry.reset_password', $scope);

            return


            function goBack(){
                $window.history.back();
            }

            function onReset() {
                if ($scope.$panel)  $scope.$panel.onReset();
            }



        }
    );

})();