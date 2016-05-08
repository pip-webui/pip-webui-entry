'use strict';

suite('Verify', function () {
    var pipEntryCommon,
        pipTransaction,
        pipAuthState,
        pipFormErrors,
        pipRest,
        controller, scope, $httpBackend,
        verifyRequestHandler, $state, rootScope;
    var formErrorSpy, configureAppBarSpy, initScopeSpy, beginTransactionSpy, endTransactionSpy;

    setup(module('pipPages'));

    setup(inject(function (_pipEntryCommon_, _pipTransaction_, _pipAuthState_,
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
        formErrorSpy = sinon.spy(pipFormErrors,"resetFormErrors");

        controller = $controller('pipVerifyEmailController', {
            $scope: scope,
            $rootScope: $rootScope,
            $location: {},
            pipEntryCommon: _pipEntryCommon_,
            pipTransaction: _pipTransaction_,
            pipAuthState: pipAuthState,
            pipFormErrors: _pipFormErrors_
        });

        scope.form = {};
        scope.form.$setPristine = function () {};
        scope.form.$setUntouched = function () {};
        scope.form.$setDirty = function(){};
        scope.form.$setSubmitted = function(){};

        scope.transaction = pipTransaction('entry.verify', scope);
        beginTransactionSpy = sinon.spy(scope.transaction, 'begin');
        endTransactionSpy = sinon.spy(scope.transaction, 'end');

        verifyRequestHandler = $httpBackend
            .when('POST', scope.data.serverUrl + '/api/verify_email')
            .respond({});

    }));

    test('should initialize header', function () {
        assert.isTrue(configureAppBarSpy.called);
    });

    test('should initialize scope data', function () {
        assert.isTrue(initScopeSpy.called);
    });

    test('should reject submit when form is invalid', function () {
        var verifyCallSpy = sinon.spy(pipRest.verifyEmail,"call");

        scope.form.$invalid = true;
        scope.onVerify();

        assert.isFalse(verifyCallSpy.called);
        assert.isTrue(formErrorSpy.calledWith(scope.form, true));
    });

    test('should provide email verification after filling form (success case)', function () {

        scope.data.email = 'test2piplife@yandex.ru';
        scope.data.name = 'Boy';
        scope.data.password = '123456';
        scope.data.serverUrl = 'http://alpha.pipservices.net';

        verifyRequestHandler.respond({name: "Boy", email: scope.data.email, password: scope.data.password});

        var verifySpy = sinon.spy(pipAuthState, "go");

        scope.onVerify();

        $httpBackend.flush();

        assert.isTrue(beginTransactionSpy.called);
        assert.isTrue(verifySpy.called);
        assert.isTrue(formErrorSpy.calledWith(scope.form, false));
    });

    test('should provide email verification after filling form (error case)', function () {

        var setFormErrorSpy = sinon.spy(pipFormErrors,"setFormError");

        rootScope.$state.name = 'Boy';
        rootScope.$state.params = "";

        verifyRequestHandler.respond(401, {message: 'ERROR_401', code: 401});

        scope.onVerify();

        $httpBackend.flush();

        assert.isTrue(beginTransactionSpy.calledWith('PROCESSING'));
        assert.isTrue(scope.error.status == 401);
        assert.isTrue(formErrorSpy.calledWith(scope.form, true));
        assert.isTrue(setFormErrorSpy.calledWith(scope.form, scope.error, sinon.match.object));
        assert.isTrue(endTransactionSpy.calledWith(scope.error));
    });

});
