/**
 * @file Welcome (landing) page for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipWelcome', ['ui.router', 'pipTranslate']);

    thisModule.config(
        function ($stateProvider, pipTranslateProvider) {

            // Configure module routes
            $stateProvider
                .state('welcome', {url: '/', controller: 'pipWelcomeController', templateUrl: 'welcome.html'});

            // Set translation strings for the module
            pipTranslateProvider.translations('en', {});
            pipTranslateProvider.translations('ru', {});

        });

    thisModule.controller('pipWelcomeController',
        function ($scope, pipAppBar) {

            pipAppBar.hideNavIcon();
            pipAppBar.showAppTitleText('SAMPLE_APPLICATION', false);
            pipAppBar.showLanguage();
            pipAppBar.showShadow();
        }
    );
})(window.angular);
