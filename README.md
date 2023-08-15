<div align=center>
	<h1>Stock APP API & Client</h1>
</div>

<div align="center">
      <p>Live API(seperated from frontend for representation)</p>
	<a href="https://stockapi01test.pythonanywhere.com/swagger/">
		<img src="https://img.shields.io/badge/live-%23.svg?&style=for-the-badge&logo=www&logoColor=white%22&color=black">
	</a>
	<hr>
</div>

_Auth systems not working with Netlify deploy because of external redirections, you can check the stock system with this account: email:test@test.com password:Test0101!_

<div align="center">
      <p>Live Stock APP(API <-> Client)</p>
	<a href="https://stock-client-ehkarabas.netlify.app/">
		<img src="https://img.shields.io/badge/live-%23.svg?&style=for-the-badge&logo=www&logoColor=white%22&color=black">
	</a>
	<hr>
</div>

_Wait a while for the explanatory gif to load..._


<div align="center">
	<img src="./presentation/stock_app_apiclient-presentation.gif"/>
	<hr>
</div>

<div align="center">
      <p>You can check presentation as video from below</p>
</div>

[![Go To The Presentation Video](https://i.hizliresim.com/e9wcm64.png)](https://youtu.be/U65mUQWBLOQ)
<hr>

## Description

A comprehensive API system for a stock application database developed using Django, Djoser & Python Social Auth, and its associated front-end developed using React with MUI & Redux. 

The authentication system is entirely customized with a user model and is based on Djoser JWT token. Password reset, account activation (including resending activation email), and username reset operations are performed through Djoser Base Endpoints and email server configuration. Users must be authenticated to view and operate. Social Auth options have been added to the authentication, allowing end-users to authenticate using their Google, Github, or Linkedin accounts instead of username-password authentication. The Social Auth Token Strategy is also delegated to Djoser, so if an end-user chooses to authenticate with social auth, unique access and refresh tokens are generated and saved to Outstanding Tokens on the backend side. Because PermissionsClass has been defined with DjangoModelPermissions, the end-user will need permission on the relevant model for all operations. In username-password authentication and Social Authentication during user creation, the user has been automatically assigned to a permission group, and they have been made to have basic permissions (which can be changed as desired). During login, extra field data is added to the token payload by overriding validate in the serializer, allowing data related to the specific end-user to be pulled from the backend to the frontend in addition to the accessToken and refreshToken. Token lifetimes have been determined, and when the access token lifetime expires, it is automatically renewed through the refresh token using Axios interceptors. In parallel requests (Promise.all), it has been ensured that only one refresh operation takes place. When the end-user logs out, the existing refresh token is automatically added to the Blacklist for security reasons.

In the stock system, transaction security has been ensured while operating on the same product at the same time, and data integrity has been preserved. The price_total field has been automatically calculated when registering an instance with signals. In the Purchase and Sale models, the product's stock has been checked and updated after every save and delete operation if there is a Purchase or Sale instance; if not, it has been created. At the same time, the views have been given the ability to search in fields with a query and to retrieve all products in a category with a different serializer when a specific query is entered.

On the frontend; in all forms, error display related to the corresponding field and form submit control have been provided to the end-user using formik-yup, along with helperText. On the dashboard, there are KPICards visually narrating the ultimate result of the Sale and Purchase transactions. If an authenticated end-user is_staff, they can quickly access the backend admin panel with a single click from the Admin Panel tab in the Drawer. Stock updates can be made with the instances created from the Sale and Purchase tabs. If the specified brand does not match the product's brand or if there is insufficient stock when creating a Sale instance, a customized error is displayed in a toast. When a Purchase or Sale is deleted/updated, the Product stock shown in Sale and Purchase tab of the Drawer is automatically updated thanks to backend configurations.

## Backend Goals

Practicing on models, field types, user instance change and create form customization on admin panel via selecting specific fields of UserAccount model, admin panel model & instance layout customizations, inheriting UserAccount model from PermissionsMixin an registering UserAccount model via custom admin panel class inherited from UserAdmin to handle user groups and permissions without an issue on admin panel, creating entirely customized user model(inherited from AbstractBaseUser) and its create_user & create_superuser methods via another own class(UserAccountManager), defining username field on user model via USERNAME_FIELD and defining required fields via REQUIRED_FIELDS on user model, overriding get_full_name and get_short_name on user model, creating serializers to manage user creation & user get/update(put,patch)/delete, assigning the end-user to a permission group automatically in email-password / social auth user-creation, creating custom TokenObtainPairSerializer inherited from Simple JWT's TokenObtainPairSerializer to add extra fields to token payload, creating Logout & LogoutAll views to add users refresh token to backend's Blacklist model while logout is taking place, creating a function to add in SOCIAL_AUTH_PIPELINE of Python Social Auth to store user info fetched from related social platform to user model while login via social auth is taking place, customizing DJOSER object on settings to handle username-password authentication with all its aspects, defining AUTH_USER_MODEL on settings to set custom user model to default user model, configuring email server on settings for activation and reset of authentication datas of end-users, stringrelatedfield & primarykeyrelatedfield(to put and post via related table rows' validation) on serializers and using source parameter on primarykeyrelatedfield to avoid conflict between each other, using signals to calculate price_total field with quantity and price fields while saving on Purchase and Sale models, determining whether the operation to be performed in a purchase or sale will be an insert or an update & updating the product stock accordingly & displaying this in all related models, checking whether the product stock is sufficient before creating a row in the sale model, ensuring save and delete operations take place within a transaction using transaction.atomic to prevent the stock value from being unexpectedly updated while multiple transactions are being performed on the same product and locking the relevant product, preventing row creation on database and throwing an error through the clean(and full_clean to run related validations) method used in the model if the brand data entered by the end-user does not match the related product's brand, raising custom error on model(for operations on Admin Panel) and raising validation error on serializer(for API operations) in case of stock defficiency while end-user creating a Sale instance, getting category info from related product instance on serializers via SerializerMethodField & get_category, using search_fields on views to filter model instances according to a model field via URL query, using get_serializer_class on views to switch to different serializer if URL has specified query, defining custom pattern for swaggers get_schema_view to solve conflict between djoser.views.UserViewSet and drf-yasg module, swagger, redoc, debug-toolbar.

## Frontend Goals

Practicing on components, props, tailwind, MUI, theme toggling(via tailwind, MUI and redux persist), customizing MUI theme for dark/light theme toggling and distribute customized MUI theme to whole project on App.js, axios(custom hook containing instance with authorization configuration), using axios interceptors to check if lifetime of accessToken is over or not on every request and if it is over refreshing it via refreshToken, refreshing accessToken only once if the request is parallel(Promise.all) via building refresh mechanism on axios interceptor in compatible with parallel requests, request cancelation via axios cancelToken on useAxios custom hook to improve performance, using jwtDecode on useAxios custom hook to decode JWT payload and then use info in it, redux, redux-toolkit(slices, async thunk, extra reducers, configureStore),  using multiple hooks in another hook via custom hooks, query-string to return parameter values of URL queries as string, react-router(private router included), using a redirect layout on router to handle complex redirection according to multiple conditions, .env(to hide API datas), _redirect file in case of refreshing issues on host, taostify, formik to configure and yup to validate forms, React hooks.

## Technologies

Backend:
- Django
- Djoser
- Python Social Auth
- Swagger & Redoc
- Import-Export
- Corsheaders
- Mail Server(just configuration)

Frontend:
- React(with React Helmet)
- React Router v5
- Material UI(with modals, theme customization in assistance of Tailwind and so on)
- Tailwind(with layer overrides)
- Redux(with persist, slices, async thunk and extra reducers)
- JWT Decode
- Query String
- Formik & Yup
- Custom Hooks
- Axios(with instances in a custom hook)
- Toastify



## Installation

To run this app on your local, run commands below on the terminal:

1. Clone the repo on your local.

    ```bash
    $ git clone https://github.com/ehkarabas/stock-api-client.git
    ```

2. On this repo, open terminal in ./backend for the backend and:

	2.1. Make sure you've installed python and added python to the system path.


	2.2. Install python environment to this repo.

	```bash
	$ python -m venv env
	```

	2.3. Activate python environment.

	For powershell:
	```powershell
	PS .\env\Scripts\activate
	```
	
	For git bash:
	```bash
	$ source env/Scripts/activate
	```
	
	For linux/mac:
	```sh
	$ source env/bin/activate
	```

	2.4. Install required packages to this sub-repo.

	```bash
	$ python install -r requirements.txt
	```

	2.5. Run the server on your browser.

	```bash
	$ python manage.py runserver
	```

4. On this repo, open terminal in ./frontend for the frontend and:

	3.1. Install node modules to this repo.

	```bash
	$ yarn install
 	```
	or
 	```bash
	$ npm install
	```

	3.2. Run the app on your browser.

	```bash
	$ yarn start
	```
	or
	```bash
	$ npm start
	```


## Resource Structure 

```
stock_api_client(folder)
|
├── backend
│   ├── accounts
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── __init__.py
│   │   ├── management
│   │   │   └── commands
│   │   │       └── delete_old_tokens.py
│   │   ├── migrations
│   │   │   ├── 0001_initial.py
│   │   │   ├── __init__.py
│   │   │   └── __pycache__
│   │   │       ├── 0001_initial.cpython-311.pyc
│   │   │       └── __init__.cpython-311.pyc
│   │   ├── models.py
│   │   ├── __pycache__
│   │   │   ├── admin.cpython-311.pyc
│   │   │   ├── apps.cpython-311.pyc
│   │   │   ├── __init__.cpython-311.pyc
│   │   │   ├── models.cpython-311.pyc
│   │   │   ├── serializers.cpython-311.pyc
│   │   │   ├── social.cpython-311.pyc
│   │   │   ├── urls.cpython-311.pyc
│   │   │   └── views.cpython-311.pyc
│   │   ├── serializers.py
│   │   ├── social.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── core
│   │   ├── asgi.py
│   │   ├── __init__.py
│   │   ├── __pycache__
│   │   │   ├── __init__.cpython-311.pyc
│   │   │   ├── urls.cpython-311.pyc
│   │   │   ├── views.cpython-311.pyc
│   │   │   └── wsgi.cpython-311.pyc
│   │   ├── settings
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   ├── __init__.py
│   │   │   ├── production.py
│   │   │   └── __pycache__
│   │   │       ├── base.cpython-311.pyc
│   │   │       ├── development.cpython-311.pyc
│   │   │       └── __init__.cpython-311.pyc
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── wsgi.py
│   ├── db.sqlite3
│   ├── debug.log
│   ├── manage.py
│   ├── requirements.txt
│   └── stock
│       ├── admin.py
│       ├── apps.py
│       ├── __init__.py
│       ├── migrations
│       │   ├── 0001_initial.py
│       │   ├── __init__.py
│       │   └── __pycache__
│       │       ├── 0001_initial.cpython-311.pyc
│       │       ├── 0002_alter_purchase_quantity_alter_sale_quantity.cpython-311.pyc
│       │       └── __init__.cpython-311.pyc
│       ├── models.py
│       ├── permissions.py
│       ├── __pycache__
│       │   ├── admin.cpython-311.pyc
│       │   ├── apps.cpython-311.pyc
│       │   ├── __init__.cpython-311.pyc
│       │   ├── models.cpython-311.pyc
│       │   ├── permissions.cpython-311.pyc
│       │   ├── serializers.cpython-311.pyc
│       │   ├── signals.cpython-311.pyc
│       │   ├── urls.cpython-311.pyc
│       │   └── views.cpython-311.pyc
│       ├── serializers.py
│       ├── signals.py
│       ├── tests.py
│       ├── urls.py
│       └── views.py
├── frontend
│   ├── package.json
│   ├── public
│   │   ├── images
│   │   │   ├── ehlogo-transparent.png
│   │   │   ├── Facebook_Logo.png
│   │   │   ├── Github_Logo.png
│   │   │   ├── Google_Logo.png
│   │   │   ├── Instagram_Logo.png
│   │   │   ├── LinkedIn_Logo.png
│   │   │   ├── stock-app-presentation1.gif
│   │   │   ├── stock-app-presentation2.gif
│   │   │   └── stock-app-presentation3.gif
│   │   ├── index.html
│   │   └── _redirect
│   ├── src
│   │   ├── app
│   │   │   └── store.jsx
│   │   ├── App.js
│   │   ├── assets
│   │   │   ├── loading.gif
│   │   │   └── result.svg
│   │   ├── components
│   │   │   ├── AuthForms
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   ├── ResetEmailConfirmForm.jsx
│   │   │   │   ├── ResetPwConfirmForm.jsx
│   │   │   │   ├── ResetPwReActivateForm.jsx
│   │   │   │   ├── SignInForm.jsx
│   │   │   │   └── SignUpForm.jsx
│   │   │   ├── BrandCard.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── FirmCard.jsx
│   │   │   ├── KpiCards.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── MenuListItems.jsx
│   │   │   ├── modals
│   │   │   │   ├── BrandAddUpdateModal.jsx
│   │   │   │   ├── BrandDeleteModal.jsx
│   │   │   │   ├── FirmAddUpdateModal.jsx
│   │   │   │   ├── FirmDeleteModal.jsx
│   │   │   │   ├── ProductAddUpdateModal.jsx
│   │   │   │   ├── ProductDeleteModal.jsx
│   │   │   │   ├── ProfileDeleteModal.jsx
│   │   │   │   ├── PurchaseAddUpdateModal.jsx
│   │   │   │   ├── PurchaseDeleteModal.jsx
│   │   │   │   ├── SaleAddUpdateModal.jsx
│   │   │   │   └── SaleDeleteModal.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── SocialLogins.jsx
│   │   │   └── Theme
│   │   │       ├── ThemeProviderWrapper.jsx
│   │   │       └── ThemeToggle.jsx
│   │   ├── features
│   │   │   ├── authSlice.jsx
│   │   │   ├── stockSlice.jsx
│   │   │   └── themeSlice.jsx
│   │   ├── helper
│   │   │   ├── ErrorCatch.js
│   │   │   ├── RefreshCheck.js
│   │   │   ├── socials.js
│   │   │   └── ToastNotify.js
│   │   ├── hooks
│   │   │   ├── useAuthCall.jsx
│   │   │   ├── useAxios.jsx
│   │   │   └── useStockCall.jsx
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── pages
│   │   │   ├── About.jsx
│   │   │   ├── AuthPages
│   │   │   │   ├── Activate.jsx
│   │   │   │   ├── AuthLayout.jsx
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── ResetPasswordConfirm.jsx
│   │   │   │   ├── ResetPwAndReActivate.jsx
│   │   │   │   ├── ResetUsernameConfirm.jsx
│   │   │   │   ├── SignIn.jsx
│   │   │   │   ├── SignUp.jsx
│   │   │   │   └── SocialAuth.jsx
│   │   │   ├── Brands.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Firms.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Purchases.jsx
│   │   │   └── Sales.jsx
│   │   ├── router
│   │   │   ├── AppRouter.jsx
│   │   │   └── PrivateRouter.jsx
│   │   └── styles
│   │       └── globalStyles.js
│   ├── tailwind.config.js
│   ├── yarn-error.log
│   └── yarn.lock
├── presentation
│   └── stock_app_apiclient-presentation.gif
└── README.md
```