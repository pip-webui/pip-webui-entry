/**
 * @file Entry signin controller
 * @copyright Digital Living Software Corp. 2014-2016
 * @todo
 * - Remove hack with guide_intro redirect
 * - Fix error handling
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.Signin', ['pipEntry.Common', "pipSigninPanel"]);

    thisModule.controller('pipSigninController',
        function ($scope, $rootScope, $location, pipTransaction, pipAuthState, pipSession,
            pipFormErrors, pipEntryCommon) {

            pipEntryCommon.configureAppBar();
            if (!$rootScope.isSignin) pipSession.signout(); // hak for set language

            $rootScope.isSignin = false;
            return;


        }
    );

})();