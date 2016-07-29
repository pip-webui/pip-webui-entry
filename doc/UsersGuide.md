# Pip.WebUI.Entry User's Guide

## <a name="contents"></a> Contents
- [Installing](#install)
- [pipEntry provider](#entry_provider)
- [Signin page](#signin_page)
- [pipSigninDialog](#signin_dialog)
- [pip-signin-panel](#signin_panel)
- [Signup page](#signup_page)
- [pipSignupDialog](#signup_dialog)
- [pip-signup-panel](#signup_panel)
- [Post-signup page](#post_signup_page)
- [pipPostSignupDialog](#post_signup_dialog)
- [pip-post-signup-panel](#post_signup_panel)
- [Recover password page](#recover_password_page)
- [pipRecoverPasswordDialog](#recover_password_dialog)
- [pip-recover-password-panel](#recover_password_panel)
- [Reset password page](#reset_password_page)
- [pipResetPasswordDialog](#reset_password_dialog)
- [pip-reset-password-panel](#reset_password_panel)
- [Verify email page](#verify_email_page)
- [Questions and bugs](#issues)


## <a name="install"></a> Installing

Add dependency to **pip-webui** into your **bower.json** or **package.json** file depending what you use.
```javascript
"dependencies": {
  ...
  "pip-webui": "*"
  ...
}
```

Alternatively you can install **pip-webui** manually using **bower**:
```bash
bower install pip-webui
```

or install it using **npm**:
```bash
npm install pip-webui
```

Include **pip-webui** files into your web application.
```html
<link rel="stylesheet" href=".../pip-webui-lib.min.css"/>
...
<script src=".../pip-webui-lib.min.js"></script>
<script src=".../pip-webui-test.min.js"></script>
```

Register **pipEntry** module in angular module dependencies.
```javascript
angular.module('myApp',[..., 'pipEntry']);
```

## <a name="entry_provider"></a> pipEntry provider

**pipEntry** provider allows to configure behavior and look in entry pages during configure phase.

### Usage
Todo: Add code snippet to demonstrate how to configure entry page

### Methods

* **adminOnly(newValue: bool): bool** - sets requirement for users to have administrative role to enter the application.
  - Params:
    + newValue - **true** to retrict access to admins, **false** to allow access to all types of users, **null** to keep the current setting
  - Returns: the currently set setting

* **fixedServerUrl(newUrl: string): string** - sets fixed server url. If the url is set, all entry forms hide server URL combobox and allow connection only the the fixed server. Otherwise, user can change the server he is connecting to. This setting is useful for testing to switch between servers with one application instance.
  - Params:
    + newUrl - the fixed server url to be set. **null** makes no changes
  - Returns: the currently selected fixed server url
  
## <a name="signin_page"></a> Signin page

**Signin** form allows to authenticate user using login and password. In the future we are going to add authentication with OAuth2 using popular providers like Google, Facebook or Twitter. It depends on **signin** operation in REST API.
Todo: Add reference to pip-webui-rest to the protocol definition

Navigation to the **Signin** page can be done using **signin** state or **#/signin** route. It takes an optional parameter to redirect after successful signin.

Server URL can be hidden by setting **fixedServerUrl** in **pipEntry** provider. **adminOnly** setting in **pipEntry** allows to restrict signins only to users with admin roles. It also hides links to signup since new users do not get admin privileges by default.

### Usage

Todo: Add code snippet to demonstrate navigation to this page

<img src="images/img-signin.png"/>


## <a name="signin_dialog"></a> pipSigninDialog

**pipSigninDialog** provides the same signin form as **Signin** page, but it shows it as a dialog. 

### Usage
Todo: Add code snippet to demonstrate how to call the dialog

### Methods
* **show(params: any, successCallback, cancelCallback): void** - shows the dialog
  - Params:
    + params - dialog parameters
    + successCallback - callback function that is called when user is successfuly authenticated
    + cancelCallback - callback function that is called when user cancels the dialog


## <a name="signin_panel"></a> pip-signin-panel

**pip-signin-panel** provides the same signin form as **Signin** page, but it shows it as a panel, that can be placed on any custom form.

### Usage
Todo: Add HTML snippet that demonstrates directive with attributes

### Attributes
Todo: List the directive attributes


## <a name="issues"></a> Questions and bugs

If you have any questions regarding the module, you can ask them using our 
[discussion forum](https://groups.google.com/forum/#!forum/pip-webui).

Bugs related to this module can be reported using [github issues](https://github.com/pip-webui/pip-webui-settings/issues).
