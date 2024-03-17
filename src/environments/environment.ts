// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  authorize_uri: 'http://127.0.0.1:9000/oauth2/authorize?',
  authorize_gateway:'/oauth2/authorization/gateway?',
  client_id:'reserva-com',
  redirect_uri:'http://127.0.0.1:4200/authorized http://127.0.0.1:8081/login/oauth2/code/gateway',
  scope:'openid profile',
  response_type:'code',
  response_mode:'form_post',
  code_challenge_method:'S256',
  token_url:'http://127.0.0.1:9000/oauth2/token',
  grant_type:'authorization_code',
  resource_url:'/resource/',
  logout_url:'http://127.0.0.1:9000/logout',
  secret_pkce:'secret'
};


  // code_challenge:'vEH-FoAkWzg0OUM7O_XXAcWPPfdMTiYzu9tOwRGE9LE',
  // code_verifier:'e7XppJEBTfMSu5i7xUIzKY8rysnghiLw8kIOViZFwdD',

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
