/**
 * @file Global configuration for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSampleConfig',
        ['pipRest.State', 'pipData', 'pipEntry', 'pipSideNav', 'pipAppBar']);

    // Configure application services before start
    thisModule.config(
        function ($mdIconProvider, $urlRouterProvider, pipAuthStateProvider, pipDataConfigProvider,
            pipSideNavProvider, pipAppBarProvider, pipTranslateProvider) {

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            // Set global constants
            pipAppBarProvider.appTitleText('Entry Sample Application');
            pipAppBarProvider.globalSecondaryActions([
                {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
            ]);

            // Configure REST API
            // pipRestProvider.version('1.0');
            pipDataConfigProvider.serverUrl('http://alpha.pipservices.net');
            $urlRouterProvider.otherwise(function ($injector, $location) {
                return $location.$$path === '' ? '/' : '/welcome';
            });

            // String translations
            pipTranslateProvider.translations('en', {
                SAMPLE_APPLICATION: 'Sample application',
                ABOUT_ME: 'About Me',
                ABOUT_SYSTEM: 'About system',
                SIGNOUT: 'Sign out'
            });

            pipTranslateProvider.translations('ru', {
                SAMPLE_APPLICATION: 'Пример приложения',
                ABOUT_ME: 'Обо мне',
                ABOUT_SYSTEM: 'О системе',
                SIGNOUT: 'Выйти'
            });

            // Configure default states
            pipAuthStateProvider.unauthorizedState('signin');
            pipAuthStateProvider.authorizedState('about_me');

            // Configure navigation menu
            pipSideNavProvider.sections([
                {
                    links: [
                        {title: 'ABOUT_ME', url: '/about_me'},
                        {title: 'ABOUT_SYSTEM', url: '/about_system'}
                    ]
                },
                {
                    links: [
                        {title: 'SIGNOUT', url: '/signout'}
                    ]
                }
            ]);

        }
    );

})();

