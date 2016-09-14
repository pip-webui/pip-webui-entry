/**
 * @file Entry recover password controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.RecoverPassword', ['pipEntry.Common', "pipRecoverPasswordPanel"]);

    thisModule.controller('pipRecoverPasswordController',
        function ($scope, $rootScope, pipUtils, pipAuthState, pipTransaction, pipDataUser, 
            pipFormErrors, pipEntryCommon, $window) {

            pipEntryCommon.configureAppBar();
            $scope.goBack = goBack;

            $scope.onRecover = onRecover;

            $scope.transaction = pipTransaction('entry.recover_password', $scope);

            return

            function goBack(){
                $window.history.back();
            }
            function onRecover() {
                if ($scope.$panel)  $scope.$panel.onRecover();
            }

        }
    );

})();