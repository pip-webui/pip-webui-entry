/**
 * @file Global configuration for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSampleConfig', ['pipRest.State', 'pipRest', 'pipEntry', 'pipSideNav', 'pipAppBar']);

    // Configure application services before start
    thisModule.config(
        function ($mdThemingProvider, $mdIconProvider, $urlRouterProvider, pipAuthStateProvider, pipRestProvider, 
            pipSideNavProvider, pipAppBarProvider, pipEntryProvider) {

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            // Set global constants
            pipAppBarProvider.appTitleText('Entry Sample Application');
            pipAppBarProvider.globalSecondaryActions([
                {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
            ]);

            // Configure REST API
            //pipRestProvider.version('1.0');
            pipRestProvider.serverUrl('http://alpha.pipservices.net');


             $urlRouterProvider.otherwise(function ($injector, $location) {
                 if ($location.$$path == '') return '/';
                 else  return '/welcome';
             });

            // Configure default states
            pipAuthStateProvider.unauthorizedState('welcome');
            pipAuthStateProvider.authorizedState('about_me');

            // Configure navigation menu
            pipSideNavProvider.sections([
                {
                    links: [
                        {title: 'About Me', url: '/about_me'},
                        {title: 'About System', url: '/about_system'},
                    ]
                },
                {
                    links: [
                        {title: 'Signout', url: '/signout'}
                    ]
                },
            ]);

        }
    );

})();

