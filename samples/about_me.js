/**
 * @file About Me page for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipAboutMe', ['pipTranslate', 'pipRest']);

    thisModule.config(
        function (pipTranslateProvider, pipAuthStateProvider) {

            // Configure module routes
            pipAuthStateProvider
                .state('about_me', {
                    url: '/about_me',
                    controller: 'pipAboutMeController',
                    templateUrl: 'about_me.html',
                    auth: true
                });

            // Set translation strings for the module
            pipTranslateProvider.translations('en', {
                // Todo: Add here string resources for english
            });

            pipTranslateProvider.translations('ru', {
                // Todo: Add here string resources for russian
            });

        });

    thisModule.controller('pipAboutMeController',
        function ($scope, pipAppBar) {

            pipAppBar.showMenuNavIcon();
            pipAppBar.showTitleText('About Me');
            pipAppBar.showLocalActions([], []);
            pipAppBar.showShadow();
        }
    );

})(window.angular);
