/**
 * @file Entry common logic
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipEntry.Common', []);

    thisModule.provider('pipEntry', function() {
        var
            adminOnly = false,
            fixedServerUrl = null;
        
        this.adminOnly = function(newAdminOnly) {
            adminOnly = newAdminOnly;  
        };

        this.fixedServerUrl = function(newFixedServerUrl) {
            fixedServerUrl  = newFixedServerUrl; 
        };

        this.$get = function () {
            return {
                adminOnly: function() {
                    return adminOnly;
                },
                
                fixedServerUrl: function() {
                    return fixedServerUrl;
                }
            };
        }
    });

    thisModule.factory('pipEntryCommon',
        function ($rootScope, $state, $window, pipAppBar, pipSession, pipDataConfig, pipEntry, pipFormErrors) {
            return {
                configureAppBar: configureAppBar,
                initScope: initScope
            };
            
            //---------------------
            
            function configureAppBar() {
                pipAppBar.hideNavIcon();
                if (pipAppBar.config().appTitleLogo) {
                    pipAppBar.showTitleLogo(pipAppBar.config().appTitleLogo);
                }
                else {
                    pipAppBar.showTitleLogo('images/piplife_logo.svg');
                }
                pipAppBar.showLanguage();
                pipAppBar.showShadow();
                pipAppBar.hideSearch();
            };

            function initScope($scope) {
                $scope.adminOnly = pipEntry.adminOnly();
                $scope.data = {
                    serverUrl: pipDataConfig.serverUrl(), //$state.params.server_url || 'http://alpha.pipservices.net',
                    email: ($state.name != 'signup' && $state.params.email) ? $state.params.email : null,
                    password: '',
                    remember: false,
                    adminOnly: $scope.adminOnly,
                    name: $state.params.name || null, // signout
                    code: $state.params.code || null
                };
        
                $scope.showServerUrl = false;
                $scope.fixedServerUrl = false;
                $scope.data.serverUrl = $scope.data.serverUrl || pipSession.usedServerUrls();
        
                // Fixed server url shall disable changing URL by the user
                if (pipEntry.fixedServerUrl()) {
                    $scope.data.serverUrl = pipDataConfig.serverUrl();
                    $scope.fixedServerUrl = true;  
                }
                        
                if ($state.name != 'signup') {
                    $scope.data.email = $scope.data.email || pipSession.lastUsedEmail($scope.data.serverUrl);
                    // $scope.data.password = $scope.data.password || pipSession.lastUsedPassword($scope.data.serverUrl);
                }
                $scope.serverUrls = pipSession.usedServerUrls();
                $scope.servers = pipSession.usedServers();
        
                $scope.selected = {};
                $scope.selected.searchURLs = $scope.data.serverUrl;
        
                // Set email from history
                if ($scope.data.serverUrl && !$scope.data.email && $state.name != 'signup') {
                    var server = $scope.servers[$scope.data.serverUrl];
                    $scope.data.email = (server || {}).email;
                }

                $scope.filterItem = filterItem;
                $scope.getMatches = getMatches;
                $scope.onServerUrlChanged = onServerUrlChanged;
                $scope.isEmpty = _.isEmpty;

                return;
                
                //---------------------------
        
                function filterItem(item) {
                    var result = ($scope.selected.searchURLs
                        && item
                        && item.toLowerCase().indexOf($scope.selected.searchURLs.toLowerCase()) >= 0);
                    return result;
                };
        
                function getMatches() {
                    if (!$scope.selected.searchURLs)
                        return $scope.showServerUrl;
                    $scope.data.serverUrl = $scope.selected.searchURLs;
                    return _.filter($scope.serverUrls, $scope.filterItem);
                };
        
                function onServerUrlChanged() {
                    // Change server url for REST API
                    pipDataConfig.serverUrl($scope.data.serverUrl);
                    
                    if (!$scope.selected.searchURLs) return;
                    var server = $scope.servers[$scope.data.serverUrl];
        
                    if (server && $state.name != 'signup') {
                        $scope.data.email = server.email;
                        $scope.data.password = server.password;
                    }
                    
                    pipFormErrors.resetFormErrors($scope.form, false);
                    pipFormErrors.resetFieldsErrors($scope.form);
                };
            };            
        }
    );
   
})();