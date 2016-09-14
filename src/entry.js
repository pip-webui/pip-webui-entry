/**
 * @file Entry pages (signin, signup) logic
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry', 
        [
            'ui.router', 'ngMessages', 
            
            'pipCore', 'pipData', 'pipBasicControls', 'pipLocations', 'pipPictures', 'pipRest', 'pipRest.State',
            'pipEntry.Strings', 'pipEntry.Common', 'pipEntry.Signin', 'pipEntry.Signup', 'pipEntry.PostSignup', 
            'pipEntry.RecoverPassword', 'pipEntry.ResetPassword', 'pipEntry.VerifyEmail', 'pipEntry.Templates'
        ]);

    thisModule.config(
        function ($stateProvider, $locationProvider, $httpProvider, pipAuthStateProvider) {

            // Switch to HTML5 routing mode
            //$locationProvider.html5Mode(true);


            // Configure module routes for all users
            $stateProvider
                .state('signin', {
                    url: '/signin?email&server_url&redirect_to',
                    auth: false,
                    controller: 'pipSigninController',
                    templateUrl: 'signin/signin.html'
                })
                .state('recover_password', {
                    url: '/recover_password?server_url&email',
                    auth: false,
                    controller: 'pipRecoverPasswordController',
                    templateUrl: 'recover_password/recover_password.html'
                })
                .state('reset_password', {
                    url: '/reset_password?server_url&email&code',
                    auth: false,
                    controller: 'pipResetPasswordController',
                    templateUrl: 'reset_password/reset_password.html'
                })
                .state('signout', { 
                    url: '/signout',
                    auth: false
                })
                .state('signup', {
                    url: '/signup?name&email&server_url',
                    auth: false,
                    controller: 'pipSignupController',
                    templateUrl: 'signup/signup.html'
                })
                .state('post_signup', {
                    url: '/post_signup?party_id',
                    auth: false,
                    controller: 'pipPostSignupController',
                    templateUrl: 'post_signup/post_signup.html',
                    resolve: {
                        $party: /* @ngInject */ function ($rootScope, $stateParams, pipRest, pipDataSession) {
                            var userId = pipDataSession.userId();
                            var partyId = $stateParams.party_id || userId;

                            if (partyId != userId)
                                throw('ERROR_NOT_ALLOWED');
                            return pipRest.parties().get({ id: partyId }).$promise;
                        }
                    }
                })
                .state('verify_email', {
                    url: '/verify_email?server_url&email&code',
                    auth: false,
                    controller: 'pipVerifyEmailController',
                    templateUrl: 'verify_email/verify_email.html'
                })
                .state('verify_email_success', {
                    url: '/verify_email_success',
                    auth: false,
                    controller: 'pipVerifyEmailSuccessController',
                    templateUrl: 'verify_email/verify_email_success.html'
                });

            // Set default paths and states
            pipAuthStateProvider.signinState('signin');
            pipAuthStateProvider.signoutState('signout');
        }
    );
    
})();