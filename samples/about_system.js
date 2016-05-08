/**
 * @file About System page for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';
    
    var thisModule = angular.module('pipAboutSystem', ['pipTranslate', 'pipRest']);

    thisModule.config(
        function($stateProvider, pipTranslateProvider, pipAuthStateProvider) {

        // Configure module routes
        pipAuthStateProvider
            .state('about_system', { 
                url: '/about_system?party_id', 
                controller: 'pipAboutSystemController', 
                templateUrl: 'about_system.html', 
                auth: true
            });

        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
        });
        
        pipTranslateProvider.translations('ru', {
        });

    });

    thisModule.controller('pipAboutSystemController', 
        function ($scope, pipAppBar) {

            pipAppBar.showMenuNavIcon();
            pipAppBar.showTitleBreadcrumb('About System', []);
            pipAppBar.showLocalActions([], []);

            pipAppBar.showShadow();

        }
    );

})();