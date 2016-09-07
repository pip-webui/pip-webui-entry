/**
 * @file String resources for entry pages
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';
    
    var thisModule = angular.module('pipEntry.Strings', []);

    thisModule.config(function (pipTranslateProvider) {

        // Set translation strings for the module
        pipTranslateProvider.translations('en', {
            // Common labels
            'FULLNAME': 'First and last name',
            'EMAIL': 'Email',
            'PASSWORD': 'Password',
            'LANGUAGE': 'Language',
            'GENDER': 'Gender',
            'BIRTHDAY': 'Birthday',
            'LOCATION': 'Location',

            // Common hints
            'HINT_FULLNAME': "Use your real name, so others know who you are",
            'HINT_PASSWORD': 'Minimum 6 characters',
            'SIGNIN_HINT_PASSWORD': 'Please, type password',
            'HINT_ABOUT': 'Few words about yourself',
            'VERIFY_EMAIL': 'Please, verify your email address. ',
            'HINT_EMAIL': 'Please, type your email address.',

            // Sign In page
            'SIGNIN_TITLE': 'Sign in',
            'SIGNIN_NOT_MEMBER': 'Not a member?',
            'SIGNIN_REMEMBER': 'Remember',
            'SIGNIN_FORGOT_PASSWORD': 'Forgot password?',
            'SIGNIN_SIGNUP_HERE': ' Sign up here',

            // Sign Up page
            'SIGNUP_TITLE': 'Sign up',
            'SIGNUP_NOT_MEMBER': 'Not a member? Sign up now',
            'SIGNUP_TEXT_11': 'By clicking Sign up, you agree to the',
            'SIGNUP_PRIVACY': 'privacy statement',
            'SIGNUP_TEXT_12': 'and',
            'SIGNUP_SERVICES': 'services agreement',
            'SIGNUP_TEXT_2': 'Do you have an account?',
            'SIGNUP_SIGNIN_HERE': ' Sign in here',
            'SIGNUP_EMAIL_REGISTERED': 'This email is already registered',
            'SIGNUP_FULLNAME_WRONG': 'xxxx',
            'SIGNUP_EMAIL_WRONG': 'xxxx',

            // Sign Up Details page
            'POST_SIGNUP_TITLE': 'Welcome to Pip.Life',
            'POST_SIGNUP_TEXT_1': 'Your account was successfully created.',
            'POST_SIGNUP_TEXT_2': 'Tell us some more about yourself.',

            // Recover Password page
            'RECOVER_PWD_TITLE': 'Forgot password?',
            'RECOVER_PWD_TEXT_1': "Enter the email address you used when you joined and we'll send you instructions to reset your password.",
            'RECOVER_PWD_TEXT_2': 'For security reasons, we do NOT store your password. So rest assured that we will never send your password via email.',
            'RECOVER_PWD_RECOVER': 'Recover password',

            // Reset Password page
            'RESET_PWD_PASSWORD': 'Reset password',
            'RESET_PWD_TEXT': 'Enter the email address together with the reset code you received in email from PipLife. Remember the code is only active for 24 hours.',
            'RESET_PWD_SUCCESS_TEXT': 'Your password was successfully changed',

            // Verify Email page
            'VERIFY_EMAIL_TITLE': 'Email verification',
            'VERIFY_EMAIL_TEXT_1': 'Confirm your email address using verification code',
            'VERIFY_EMAIL_TEXT_21': "If you haven't received the code, press ",
            'VERIFY_EMAIL_RESEND': 'resend',
            'VERIFY_EMAIL_TEXT_22': 'to send it again.',
            'VERIFY_EMAIL_SUCCESS_TEXT': 'Your email address was successfully verified. Thank you!',

            'PASSWORD_MATCH': 'Passwords don\'t match',
            'PASSWORD_CONFIRM': 'Confirm the password',
            'PASSWORD_SET': 'Set a password',

            // Common entry resources
            'ENTRY_CHANGE_SERVER': 'Change server',
            'ENTRY_SERVER_URL': 'Server URL',
            'ENTRY_RESET_CODE': 'Reset code',
            'ENTRY_VERIFICATION_CODE': 'Verification code',
            'ENTRY_NEW_PASSWORD': 'New password',
            'ENTRY_SET_PASSWORD': 'Set Password',
            'ENTRY_FREE': 'Free',
            'ENTRY_REPEAT': 'Repeat',

            // Validation errors
            'ERROR_EMAIL_INVALID': 'Enter a valid email',
            'ERROR_PASSWORD_INVALID': 'Enter a valid password',
            'ERROR_FULLNAME_INVALID': 'Enter full name',
            'ERROR_CODE_INVALID': 'Enter a code from mail',
            'ERROR_ACCOUNT_NOT_FOUND': 'User name or password are incorrect',
            'ERROR_WRONG_PASSWORD': 'User name or password are incorrect', //'Wrong password',
            'ERROR_CODE_WRONG': 'Wrong recovery code',
            'ERROR_SERVER': 'Server is not responding',
            'ERROR_SERVER_INVALID': 'Enter server URL',

            //Languages
            'LANGUAGE_RUSSIAN': 'Russian',
            'LANGUAGE_ENGLISH': 'English'
        });

        pipTranslateProvider.translations('ru', {
            // Common labels
            'FULLNAME': 'Имя и фамилия',
            'EMAIL': 'Адрес эл.почты',
            'PASSWORD': 'Пароль',
            'LANGUAGE': 'Язык',
            'GENDER': 'Пол',
            'BIRTHDAY': 'Дата рождения',
            'LOCATION': 'Местонахождение',

            // Common hints
            'HINT_FULLNAME': "Используйте своё настоящее имя, чтобы другие знали с кем имеют дело",
            'HINT_PASSWORD': 'Минимум 6 символов',
            'SIGNIN_HINT_PASSWORD': 'Введите пароль',
            'HINT_ABOUT': 'Несколько слов о себе',
            'VERIFY_EMAIL': 'Подтвердите адрес своей эл.почты',
            'HINT_EMAIL': 'Введите адрес своей эл.почты',

            // Sign In page
            'SIGNIN_TITLE': 'Вход в систему',
            'SIGNIN_NOT_MEMBER': 'Еще не зарегистрировались?',
            'SIGNIN_REMEMBER': 'Запомнить',
            'SIGNIN_FORGOT_PASSWORD': 'Забыли пароль?',
            'SIGNIN_SIGNUP_HERE': ' Зарегистрироваться здесь',

            // Sign Up page
            'SIGNUP_TITLE': 'Регистрация',
            'SIGNUP_NOT_MEMBER': 'Новенький? Зарегистрируйтесь сейчас',
            'SIGNUP_TEXT_11': 'Нажимая кнопку регистрация, я соглашаюсь с',
            'SIGNUP_SERVICES': 'договором об услугах',
            'SIGNUP_TEXT_12': 'и',
            'SIGNUP_PRIVACY': 'соглашением о личных данных',
            'SIGNUP_TEXT_2': 'Уже зарегистрировались?',
            'SIGNUP_SIGNIN_HERE': ' Вход здесь',
            'SIGNUP_EMAIL_REGISTERED': 'Данный адрес эл.почты уже занят',

            // Sign Up Details page
            'POST_SIGNUP_TITLE': 'Добро пожаловать в Pip.Life',
            'POST_SIGNUP_TEXT_1': 'Ваша учетная запись создана.',
            'POST_SIGNUP_TEXT_2': 'Несклько слов о о себе',

            // Recover Password page
            'RECOVER_PWD_TITLE': 'Забыли пароль?',
            'RECOVER_PWD_TEXT_1': 'Введите адрес эл.почты, который вы использовали при регистрации и мы вышлем вам инструкции как изменить пароль.',
            'RECOVER_PWD_TEXT_2': 'По соображениям безопасности мы НЕ храним пароли. Таким образом, мы никогда не пошлем ваш пароль по электронной почте.',
            'RECOVER_PWD_RECOVER': 'Восстановить пароль',

            // Reset Password page
            'RESET_PWD_PASSWORD': 'Изменить пароль',
            'RESET_PWD_TEXT': 'Введите адрес эл.почты вместе с кодом, который вы получили в почтовом сообщении от PipLife. Помните, что код действителен только 24 часа.',
            'RESET_PWD_SUCCESS_TEXT': 'Ваш пароль успешно изменён',

            // Verify Email page
            'VERIFY_EMAIL_TITLE': 'Подтверждение адреса эл.почты',
            'VERIFY_EMAIL_TEXT_1': 'Введите код, который вы получили по эл.почте',
            'VERIFY_EMAIL_TEXT_21': "Если вы не получили почтовое сообщение с кодом, нажмите ",
            'VERIFY_EMAIL_RESEND': 'отправить снова',
            'VERIFY_EMAIL_TEXT_22': '.',
            'VERIFY_EMAIL_SUCCESS_TEXT': 'Адрес вашей электронной почты успешно подтвержден. Спасибо!',

            'PASSWORD_MATCH': 'Пароли не совпадают',
            'PASSWORD_CONFIRM': 'Подтвердите пароль',
            'PASSWORD_SET': 'Задайте пароль',

            // Common entry resources
            'ENTRY_CHANGE_SERVER': 'Изменить сервер',
            'ENTRY_SERVER_URL': 'URL сервера',
            'ENTRY_RESET_CODE': 'Код подтверждения',
            'ENTRY_VERIFICATION_CODE': 'Код проверки',
            'ENTRY_NEW_PASSWORD': 'Новый пароль',
            'ENTRY_SET_PASSWORD': 'Изменить пароль',
            'ENTRY_FREE': 'бесплатно',
            'ENTRY_REPEAT': 'Повторить',

            // Validation errors
            'ERROR_EMAIL_INVALID': 'Введите адрес электронной почты',
            'ERROR_PASSWORD_INVALID': 'Введите пароль',
            'ERROR_FULLNAME_INVALID': 'Введите полное имя',
            'ERROR_CODE_INVALID': 'Введите код',
            'ERROR_ACCOUNT_NOT_FOUND': 'Введено неверное имя пользователя или пароль',//'Такой пользователь не зарегистрирован',
            'ERROR_WRONG_PASSWORD': 'Введено неверное имя пользователя или пароль', //'Неправильный пароль',
            'ERROR_CODE_WRONG': 'Неправильный код',
            'ERROR_SERVER': 'Сервер не отвечает. Проверьте URL сервера.',
            'ERROR_SERVER_INVALID': 'Введите URL сервера',

            //Languages
            'LANGUAGE_RUSSIAN': 'Русский',
            'LANGUAGE_ENGLISH': 'Английский'
        });

    });

})();