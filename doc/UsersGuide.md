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
  
## <a name="settings_page"></a> Settings page

**Settings** page is implemented as extensible container that can be dynamically filled with tabs.
On smaller screens the tabs transform into dropdown menu.

Navigation to the **Settings** page can be done using **settings** state or **/settings** route. 
Child state specifies the tab that shall be activated. If child set is not set, it opens the default tab
configured in **pipSettings** provider.

### Usage

```javascript
pipSideNavProvider.sections([{
    links: [
        {title: 'Settings', url: '/settings'}
    ]
}]);
```

## <a name="basic_info_tab"></a> Basic Info tab

**Basic Info** tab allows to set account settings and change user preferences such as language or theme. It also lets user 
to change his password or verify primary email using verification code sent via email message.

The tab requires users REST API to be implemented on the server.
List specific REST operations required for this tab:
* **pipRest.parties().update** - function for updating parties collections with the use PUT method
* **pipRest.users().update** - function for updating users collections with the use PUT method
* **pipRest.requestEmailVerification().get** - function for email verification
* **pipRest.verifyEmail().call** - function for email verification

[Go to Pip.WebUI.Rest Users's Guide](https://github.com/pip-webui/pip-webui-rest/blob/master/doc/UsersGuide.md)

### Usage

To add **Basic Info** tab into **Settings** page just register **pipUserSettings.BasicInfo** in angular module dependencies.
If you add **pipUserSettings** module it will register all user settings tabs.
```javascript
angular.module('myApp', [..., 'pipUserSettings.BasicInfo'])
```

<img src="images/img-settings-basic-info.png"/>

See online sample [here...](http://webui.pipdevs.com/pip-webui-settings/index.html#/settings/basic_info)


## <a name="sessions_tab"></a> Active Sessions tab

**Active Sessions** tab show active sessions open by the user. It also allows to close specific session or all of them
except the current one.

The tab requires sessions REST API to be implemented on the server.
List specific REST operations required for this tab:
* **pipRest.userSessions().remove** - function for remove some session
* **pipRest.userSessions().query** - function for return sessions collections
* **pipRest.sessionId()** - function for return id active session

[Go to Pip.WebUI.Rest Users's Guide](https://github.com/pip-webui/pip-webui-rest/blob/master/doc/UsersGuide.md)


### Usage

To add **Active Sessions** tab into **Settings** page just register **pipUserSettings.Sessions** in angular module dependencies.
If you add **pipUserSettings** module it will register all user settings tabs.
```javascript
angular.module('myApp', [..., 'pipUserSettings.Sessions'])
```

<img src="images/img-settings-active-sessions.png"/>

See online sample [here...](http://webui.pipdevs.com/pip-webui-settings/index.html#/settings/sessions)


## <a name="issues"></a> Questions and bugs

If you have any questions regarding the module, you can ask them using our 
[discussion forum](https://groups.google.com/forum/#!forum/pip-webui).

Bugs related to this module can be reported using [github issues](https://github.com/pip-webui/pip-webui-settings/issues).
