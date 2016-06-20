'use strict';

describe('PostSignUp', function () {
    var pipEntryCommon, pipTransaction, pipAuthState,
        pipFormErrors, pipRest, controller, scope, $httpBackend,
        partiesRequestHandler, $state, rootScope;
    var formErrorSpy , configureAppBarSpy, initScopeSpy, beginTransactionSpy, endTransactionSpy;
    var party;

    beforeEach(module('pipPages'));

    beforeEach(inject(function (_pipEntryCommon_, _pipTransaction_, _pipAuthState_, _pipEnums_, _pipTranslate_,
                           _pipFormErrors_, $controller, $rootScope, $injector, _$state_, _pipRest_) {
        pipEntryCommon = _pipEntryCommon_;
        pipTransaction = _pipTransaction_;
        pipAuthState = _pipAuthState_;
        pipRest = _pipRest_;
        pipFormErrors = _pipFormErrors_;
        pipAuthState.goToAuthorized = function (param1) {};

        party = {
            about: "eeeee1",
            email: "1@11.com",
            gender: "n/s",
            id: "56603c54cc1eaf174ec7936d",
            language: "en",
            name: "1",
            serverUrl : "http://alpha.pipservices.net"
        };


        $httpBackend = $injector.get('$httpBackend');

        rootScope = $rootScope;
        rootScope.$state = _$state_;
        scope = $rootScope.$new(); // this is what you missed out
        scope.$party = party;
        $state = _$state_;

        configureAppBarSpy = sinon.spy(pipEntryCommon, "configureAppBar");
        initScopeSpy = sinon.spy(pipEntryCommon, "initScope");

        controller = $controller('pipPostSignupPanelController', {
            pipEnums:_pipEnums_,
            pipTranslate:_pipTranslate_,
            pipRest: pipRest,
            $scope: scope,
            $rootScope: $rootScope,
            pipEntryCommon: pipEntryCommon,
            pipTransaction: _pipTransaction_,
            pipAuthState: pipAuthState,
            pipFormErrors: _pipFormErrors_
        });

        scope.form = {};
        scope.form.$setPristine = function () {};
        scope.form.$setUntouched = function () {};
        scope.form.$setDirty = function(){};
        scope.form.$setSubmitted = function(){};

        scope.transaction = pipTransaction('entry.post_signup', scope);
        beginTransactionSpy = sinon.spy(scope.transaction, 'begin');
        endTransactionSpy = sinon.spy(scope.transaction, 'end');
        formErrorSpy = sinon.spy(pipFormErrors,"resetFormErrors");


        partiesRequestHandler = $httpBackend
            .when('PUT', party.serverUrl + '/api/parties/' + party.id)
            .respond({});
    }));



    it('should initialize scope data', function () {
        assert.isTrue(initScopeSpy.called);
    });

    it('should save picture', function () {
        scope.picture = {
            save:function(param1, param2){}
        };
        var pictureSaveSpy = sinon.spy(scope.picture, "save");

        scope.onPictureChanged();
        assert.isTrue(pictureSaveSpy.calledWith(sinon.match.func, sinon.match.func));
    });

    it('should reject submit when form is invalid', function () {
        var partiesUpdateSpy = sinon.spy(pipRest.parties(),"update");

        scope.form.$invalid = true;
        scope.onPostSignupSubmit();

        assert.isTrue(formErrorSpy.calledWith(scope.form, true));
        assert.isFalse(partiesUpdateSpy.called);
        assert.isFalse(beginTransactionSpy.called);

    });

    it('should provide post signup submit (success case)', function () {

        partiesRequestHandler.respond(party);
        pipRest.serverUrl(party.serverUrl);

        var authorizedSpy = sinon.spy(pipAuthState, "goToAuthorized");
        scope.form.$invalid = false;

        scope.onPostSignupSubmit();

        $httpBackend.flush();

        assert.isTrue(beginTransactionSpy.calledWith('PROCESSING'));
        assert.isTrue(formErrorSpy.calledWith(scope.form, false));
        assert.isTrue(authorizedSpy.calledWith({party_id:party.id}));
        assert.isTrue(endTransactionSpy.called);
    });

    it('should provide post signup submit (error case)', function () {
        var errorObj = {};
        rootScope.$state.name = party.name;
        rootScope.$state.params = "";
        var setFormErrorSpy = sinon.spy(pipFormErrors,"setFormError");
        pipRest.serverUrl(party.serverUrl);
        partiesRequestHandler.respond(400, '');

        scope.onPostSignupSubmit();

        $httpBackend.flush();

        assert.isTrue(beginTransactionSpy.calledWith('PROCESSING'));
        assert.isTrue(scope.error.status == 400);
        assert.isTrue(formErrorSpy.calledWith(scope.form, true));
        assert.isTrue(setFormErrorSpy.calledWith(scope.form, scope.error, sinon.match.object));
        assert.isTrue(endTransactionSpy.calledWith(scope.error));

    });

});
