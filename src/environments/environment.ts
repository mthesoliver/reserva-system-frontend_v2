
export const environment = {
  production: false,
  authorize_uri: 'http://auth-service:9000/oauth2/authorize?',
  authorize_gateway:'/oauth2/authorization/gateway?',
  redirect_gateway:'http://127.0.0.1:8081/oauth2/authorization/gateway?',
  client_id:'reserva-com',
  redirect_uri:'http://127.0.0.1:4200/authorized http://127.0.0.1:8081/login/oauth2/code/gateway http://reserva-gateway:8081/login/oauth2/code/gateway',
  scope:'openid profile',
  response_type:'code',
  response_mode:'form_post',
  code_challenge_method:'S256',
  token_url:'http://auth-service:9000/oauth2/token',
  grant_type:'authorization_code',
  logout_url:'http://auth-service:9000/logout',
  secret_pkce:'secret'
};


  // code_challenge:'vEH-FoAkWzg0OUM7O_XXAcWPPfdMTiYzu9tOwRGE9LE',
  // code_verifier:'e7XppJEBTfMSu5i7xUIzKY8rysnghiLw8kIOViZFwdD',

