/**
 * @file Entry signup controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.Signup', ['pipEntry.Common', 'pipEmailUnique',  'pipSignupPanel',
        'pipPasswordMatch']);

    thisModule.controller('pipSignupController',
        function ($scope, $rootScope, pipAuthState, pipTransaction, //pipAuth,
            pipFormErrors, pipEntryCommon) {

            pipEntryCommon.configureAppBar();

        }
    );

})();