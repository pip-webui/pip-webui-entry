# <img src="https://github.com/pip-webui/pip-webui/raw/master/doc/Logo.png" alt="Pip.WebUI Logo" style="max-width:30%"> <br/> User entry pages

![](https://img.shields.io/badge/license-MIT-blue.svg)

Most Line-of-Business applications tailor information to specific user. To do that, they have to identify who the user is.
It is also need to support registrations for new users, let them recover their passwords and so on.
Pip.WebUI.Entry module supports user registration and entry process. It contains implementation of signin, signup, password recovery and email 
verification views implemented as pages, dialogs and panels.

The module relies on the standard REST API for **users** and **sessions** implemented on the server.

### Signin form

**Signin** form allows to authenticate user using login and password. In the future we are going to add authentication with OAuth2 using popular providers like Google, 
Facebook or Twitter.

<a href="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-signin.png" style="border: 3px ridge #c8d2df; width: 50%; margin: auto; display: block">
    <img src="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-signin.png"/>
</a>

### Signup form

**Signup** form allows users to register their account in application. The form is intentionally made ultra-short to low the barrier to entry for new users. 
Additional information can be entered in optional **Post-signup** form.

<a href="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-signup.png" style="border: 3px ridge #c8d2df; width: 50%; margin: auto; display: block">
    <img src="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-signup.png"/>
</a>

### Post-signup form

**Post signup** form can be opened right after signup to ask user to enter additional information: date of birth, avatar, location, pick preferred color theme.

<a href="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-post-signup.png" style="border: 3px ridge #c8d2df; width: 50%; margin: auto; display: block">
    <img src="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-post-signup.png"/>
</a>

### Password recovery form

**Password recovery** form lets users to recover their forgotten passwords by sending email with reset instructions. After submit, user is transfered to "Password reset** form where he can enter received code and set a new password.

<a href="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-recover-password.png" style="border: 3px ridge #c8d2df; width: 50%; margin: auto; display: block">
    <img src="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-recover-password.png"/>
</a>

### Email verification form

**Email verification** form allows users to confirm their primary email addresses by entering verification code they shall receive via email right after registration. This form is usually opened using a link in the email with the code.

<a href="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-email-verification.png" style="border: 3px ridge #c8d2df; width: 50%; margin: auto; display: block">
    <img src="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-email-verification.png"/>
</a>

### Password reset form

**Password reset** form is opened right after **Password recovery**. It allows to enter a new password after providing a valid reset code.

<a href="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-reset-password.png" style="border: 3px ridge #c8d2df; width: 50%; margin: auto; display: block">
    <img src="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-reset-password.png"/>
</a>

### Change password form

**Change password** is another form that allows user to change his password. In this case he must enter his old password to change it.

<a href="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-change-password.png" style="border: 3px ridge #c8d2df; width: 50%; margin: auto; display: block">
    <img src="https://github.com/pip-webui/pip-webui-entry/raw/master/doc/images/img-change-password.png"/>
</a>

### pipEntry provider

**pipEntry** provider allows to configure look and behavior of entry pages.

Todo: Add code snippet to demonstrate how to configure entry pages

## Learn more about the module

- [User's guide](https://github.com/pip-webui/pip-webui-entry/blob/master/doc/UsersGuide.md)
- [Online samples](http://webui.pipdevs.com/pip-webui-entry/index.html)
- [API reference](http://webui-api.pipdevs.com/pip-webui-entry/index.html)
- [Developer's guide](https://github.com/pip-webui/pip-webui-entry/blob/master/doc/DevelopersGuide.md)
- [Changelog](https://github.com/pip-webui/pip-webui-entry/blob/master/CHANGELOG.md)
- [Pip.WebUI project website](http://www.pipwebui.org)
- [Pip.WebUI project wiki](https://github.com/pip-webui/pip-webui/wiki)
- [Pip.WebUI discussion forum](https://groups.google.com/forum/#!forum/pip-webui)
- [Pip.WebUI team blog](https://pip-webui.blogspot.com/)

## <a name="dependencies"></a>Module dependencies

* [pip-webui-lib](https://github.com/pip-webui/pip-webui-lib): angular, angular material and other 3rd party libraries
* [pip-webui-css](https://github.com/pip-webui/pip-webui-css): CSS styles and web components
* [pip-webui-core](https://github.com/pip-webui/pip-webui-core): localization and other core services
* [pip-webui-rest](https://github.com/pip-webui/pip-webui-rest): REST resources for users, files and sessions
* [pip-webui-controls](https://github.com/pip-webui/pip-webui-controls): date and time controls for post-signup
* [pip-webui-layouts](https://github.com/pip-webui/pip-webui-layouts): document, card and dialog layout
* [pip-webui-locations](https://github.com/pip-webui/pip-webui-locations): location control to show current user location in post-signup
* [pip-webui-pictures](https://github.com/pip-webui/pip-webui-pictures): user avatar control

## <a name="license"></a>License

This module is released under [MIT license](License) and totally free for commercial and non-commercial use.
