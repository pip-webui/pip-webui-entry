'use strict';

describe('SignIn', function () {
    var pipEntryCommon,
        pipTransaction,
        pipAuthState,
        pipSession,
        pipFormErrors,
        pipitUserParty,
        controller, scope, $httpBackend,
        signinRequestHandler, provider, $state;
    var signoutSpy, configureAppBarSpy, initScopeSpy, beginTransactionSpy;

    beforeEach(module('pipPages'));
    beforeEach(module('pipit.UserParty'));
    beforeEach(module('pipit.General'));

    beforeEach(inject(function (_pipEntryCommon_, _pipTransaction_, _pipAuthState_, _pipSession_,
                           _pipFormErrors_, $controller, $rootScope, $injector, _$state_, _pipitUserParty_) {
        pipEntryCommon = _pipEntryCommon_;
        pipTransaction = _pipTransaction_;
        pipAuthState = _pipAuthState_;
        pipAuthState.goToAuthorized = function () {};

        pipSession = _pipSession_;
        pipFormErrors = _pipFormErrors_;

        $httpBackend = $injector.get('$httpBackend');

        scope = $rootScope.$new(); // this is what you missed out
        $state = _$state_;
        provider = $state;

        signoutSpy = sinon.spy(pipSession, "signout");
        configureAppBarSpy = sinon.spy(pipEntryCommon, "configureAppBar");
        initScopeSpy = sinon.spy(_pipEntryCommon_, "initScope");

        controller = $controller('pipSigninPanelController', {
            $scope: scope,
            $rootScope: $rootScope,
            $location: {},
            pipEntryCommon: _pipEntryCommon_,
            pipTransaction: _pipTransaction_,
            pipAuthState: pipAuthState,
            pipSession: _pipSession_,
            pipFormErrors: _pipFormErrors_
        });

        pipitUserParty = _pipitUserParty_;

        scope.form = {};
        scope.form.$setPristine = function () {};
        scope.form.$setUntouched = function () {};
        scope.form.$setDirty = function () {};
        scope.form.$setSubmitted = function () {};

        scope.transaction = pipTransaction('entry.signin', scope);
        beginTransactionSpy = sinon.spy(scope.transaction, 'begin');

    }));

    it('should initialize scope data', function () {
        assert.isTrue(initScopeSpy.called);
    });


    it('should reject submit when form is invalid', function () {

        var formErrorSpy = sinon.spy(pipFormErrors, "resetFormErrors");
        var signinSpy = sinon.spy(pipSession, "signin");
        var authorizedSpy = sinon.spy(pipAuthState, "goToAuthorized");

        scope.form.$invalid = true;
        scope.onSignin();
        assert.isTrue(formErrorSpy.calledWith(scope.form, true));
        assert.isFalse(signinSpy.called);
        assert.isFalse(beginTransactionSpy.called);
        assert.isFalse(authorizedSpy.called);

    });

    it('should provide signin to system after filling form (success case)', function (done) {
        assert.isDefined(scope.showServerError);
        assert.isDefined(scope.onSignin);

        scope.data.email = pipitUserParty.getParty().email;
        scope.data.password = '123456';
        scope.data.serverUrl = 'http://alpha.pipservices.net';

        signinRequestHandler = $httpBackend
            .when('POST', scope.data.serverUrl + '/api/signin')
            .respond(pipitUserParty.getParty());

        var spy = sinon.spy(pipSession, "signin");
        var authorizedSpy = sinon.spy(pipAuthState, "goToAuthorized");

        scope.onSignin();

        assert.isTrue(spy.called);

        $httpBackend.flush();

        assert.isTrue(beginTransactionSpy.called);
        assert.isTrue(authorizedSpy.called);

        done();
    });

});
