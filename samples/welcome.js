/**
 * @file Welcome (landing) page for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';
    
    var thisModule = angular.module('pipWelcome', ['ui.router', 'pipTranslate']);

    thisModule.config( 
        function($stateProvider, pipTranslateProvider) {

        // Configure module routes
        $stateProvider
            .state('welcome', { url: '/', controller: 'pipWelcomeController', templateUrl: 'welcome.html' });

        // Set translation strings for the module
        pipTranslateProvider.translations('en', {});
        
        pipTranslateProvider.translations('ru', {});

    });

    thisModule.controller('pipWelcomeController', 
        function ($scope, pipAppBar, $rootScope) {

            pipAppBar.hideNavIcon();
            pipAppBar.showAppTitleText('Sample Application', false);
            pipAppBar.showLanguage();
            pipAppBar.showShadow();
        }
    );
})();