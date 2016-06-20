'use strict';

describe('SignUp', function () {
    var pipEntryCommon,
        pipTransaction,
        pipAuthState,
        pipSession,
        pipFormErrors,
        pipRest,
        controller, scope, $httpBackend,
        signupRequestHandler, $state, rootScope;
    var signoutSpy, configureAppBarSpy, initScopeSpy, beginTransactionSpy, endTransactionSpy;
    var sandbox;

    beforeEach(module('pipPages'));

    beforeEach(inject(function (_pipEntryCommon_, _pipTransaction_, _pipAuthState_, _pipSession_,
                           _pipFormErrors_, $controller, $rootScope, $injector, _$state_, _pipRest_) {
        pipEntryCommon = _pipEntryCommon_;
        pipTransaction = _pipTransaction_;
        pipAuthState = _pipAuthState_;
        pipRest = _pipRest_;
        pipAuthState.go = function (param1, param2) {};

        pipSession = _pipSession_;
        pipFormErrors = _pipFormErrors_;

        $httpBackend = $injector.get('$httpBackend');

        rootScope = $rootScope;
        scope = $rootScope.$new(); // this is what you missed out
        $state = _$state_;
        rootScope.$state = $state;
        sandbox = sinon.sandbox.create();

        signoutSpy = sinon.spy(pipSession, "signout");
        configureAppBarSpy = sinon.spy(pipEntryCommon, "configureAppBar");
        initScopeSpy = sinon.spy(_pipEntryCommon_, "initScope");

        controller = $controller('pipSignupPanelController', {
            $scope: scope,
            $rootScope: $rootScope,
            $location: {},
            pipEntryCommon: _pipEntryCommon_,
            pipTransaction: _pipTransaction_,
            pipAuthState: pipAuthState,
            pipSession: _pipSession_,
            pipFormErrors: _pipFormErrors_
        });

        scope.form = {};
        scope.form.$setPristine = function () {};
        scope.form.$setUntouched = function () {};
        scope.form.$setDirty = function(){};
        scope.form.$setSubmitted = function(){};

        scope.transaction = pipTransaction('entry.signup', scope);
        beginTransactionSpy = sinon.spy(scope.transaction, 'begin');
        endTransactionSpy = sinon.spy(scope.transaction, 'end');


        var serverUrl = 'http://alpha.pipservices.net';
        signupRequestHandler = $httpBackend
            .when('POST', serverUrl + '/api/signup')
            .respond({});

    }));


    it('should initialize scope data', function () {
        assert.isTrue(initScopeSpy.called);
    });

    it('should reject submit when form is invalid', function () {

        var formErrorSpy = sinon.spy(pipFormErrors,"resetFormErrors");
        var signupSpy = sinon.spy(pipRest, "signup");
        var authorizedSpy = sinon.spy(pipAuthState, "goToAuthorized");

        scope.form.$invalid = true;
        scope.onSignup();
        assert.isTrue(formErrorSpy.calledWith(scope.form, true));
        assert.isFalse(signupSpy.called);
        assert.isFalse(beginTransactionSpy.called);
        assert.isFalse(authorizedSpy.called);

    });

    it('should provide signup to system after filling form (success case)', function (done) {
        assert.isDefined(scope.showServerError);
        assert.isDefined(scope.onSignup);

        scope.data.email = 'it2piplife@yandex.ru';
        scope.data.name = 'Boy';
        scope.data.password = '123456';
        scope.data.serverUrl = 'http://alpha.pipservices.net';

        signupRequestHandler.respond({name: "Boy", email: scope.data.email, password: scope.data.password});

        var spy = sinon.spy(pipRest, "signup");
        var postSignupSpy = sinon.spy(pipAuthState, "go");
        var formErrorSpy = sinon.spy(pipFormErrors,"resetFormErrors");

        scope.onSignup();

        assert.isTrue(spy.called);

        $httpBackend.flush();

        assert.isTrue(beginTransactionSpy.called);
        assert.isTrue(postSignupSpy.called);
        assert.isTrue(formErrorSpy.calledWith(scope.form, false));

        done();
    });
    it('should provide signup to system after filling form (error case)', function () {
        var errorObj = {};

        var stubSignup =   sandbox.stub(pipRest.signup(), "call").callsArgWith(2, errorObj);
        var formErrorSpy = sinon.spy(pipFormErrors,"resetFormErrors");

        rootScope.$state.name = 'Boy';
        rootScope.$state.params = "";

        signupRequestHandler.respond(401, {message: 'ERROR_401', code: 401});

        scope.onSignup();

        $httpBackend.flush();

        assert.isTrue(beginTransactionSpy.calledWith('PROCESSING'));
        assert.isTrue(scope.error.status == 401);

        //assert.isTrue(formErrorSpy.calledWith(scope.form, {message: 'ERROR_401', code: 401, details: {message: 'ERROR_401', code: 401}}, sinon.match.any));
        //assert.isTrue(endTransactionSpy.calledWith({message: 'ERROR_401', code: 401, details: {message: 'ERROR_401', code: 401}}));

    });

});
