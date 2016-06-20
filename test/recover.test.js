'use strict';

describe('Recover password', function () {
    var pipEntryCommon,
        pipTransaction,
        pipAuthState,
        pipFormErrors,
        pipRest,
        controller, scope, $httpBackend,
        recoverRequestHandler, $state, rootScope;
    var formErrorSpy, configureAppBarSpy, initScopeSpy, beginTransactionSpy, endTransactionSpy;

    beforeEach(module('pipPages'));

    beforeEach(inject(function (_pipEntryCommon_, _pipTransaction_, _pipAuthState_,
                           _pipFormErrors_, $controller, $rootScope, $injector, _$state_, _pipRest_) {

        pipEntryCommon = _pipEntryCommon_;
        pipTransaction = _pipTransaction_;
        pipAuthState = _pipAuthState_;
        pipRest = _pipRest_;
        pipFormErrors = _pipFormErrors_;
        pipAuthState.go = function (param1, param2) {};

        $httpBackend = $injector.get('$httpBackend');

        rootScope = $rootScope;
        scope = $rootScope.$new(); // this is what you missed out
        $state = _$state_;
        rootScope.$state = $state;

        configureAppBarSpy = sinon.spy(pipEntryCommon, "configureAppBar");
        initScopeSpy = sinon.spy(_pipEntryCommon_, "initScope");
        formErrorSpy = sinon.spy(pipFormErrors, "resetFormErrors");

        controller = $controller('pipRecoverPasswordPanelController', {
            $scope: scope,
            $rootScope: $rootScope,
            pipEntryCommon: _pipEntryCommon_,
            pipTransaction: _pipTransaction_,
            pipAuthState: pipAuthState,
            pipFormErrors: _pipFormErrors_
        });

        scope.form = {};
        scope.form.$setPristine = function () {
        };
        scope.form.$setUntouched = function () {
        };
        scope.form.$setDirty = function () {
        };
        scope.form.$setSubmitted = function () {
        };

        scope.transaction = pipTransaction('entry.recover_password', scope);
        beginTransactionSpy = sinon.spy(scope.transaction, 'begin');
        endTransactionSpy = sinon.spy(scope.transaction, 'end');


        var serverUrl = 'http://alpha.pipservices.net';
        recoverRequestHandler = $httpBackend
            .when('POST', serverUrl + '/api/recover_password')
            .respond({});

    }));


    it('should initialize scope data', function () {
        assert.isTrue(initScopeSpy.called);
    });

    it('should reject submit when form is invalid', function () {
        var resetCallSpy = sinon.spy(pipRest.recoverPassword, "call");

        scope.form.$invalid = true;
        scope.onRecover();

        assert.isFalse(resetCallSpy.called);
        assert.isTrue(formErrorSpy.calledWith(scope.form, true));
    });

    it('should provide  after filling form (success case)', function () {

        scope.data.email = 'it2piplife@yandex.ru';
        scope.data.serverUrl = 'http://alpha.pipservices.net';

        recoverRequestHandler.respond(scope.data);

        var goSpy = sinon.spy(pipAuthState, "go");

        scope.onRecover();

        $httpBackend.flush();

        assert.isTrue(beginTransactionSpy.calledWith('PROCESSING'));
        assert.isTrue(goSpy.calledWith('reset_password', {server_url: scope.data.serverUrl, email: scope.data.email}));
        assert.isTrue(formErrorSpy.calledWith(scope.form, false));

    });

    it('should provide email verification after filling form (error case)', function () {

        var setFormErrorSpy = sinon.spy(pipFormErrors, "setFormError");

        rootScope.$state.name = 'Boy';
        rootScope.$state.params = "";

        recoverRequestHandler.respond(1106, '');

        scope.onRecover();

        $httpBackend.flush();

        assert.isTrue(beginTransactionSpy.calledWith('PROCESSING'));
        assert.isTrue(scope.error.status == 1106);
        assert.isTrue(formErrorSpy.calledWith(scope.form, true));
        assert.isTrue(setFormErrorSpy.calledWith(scope.form, scope.error, sinon.match.object));
        assert.isTrue(endTransactionSpy.calledWith(scope.error));
    });

});
