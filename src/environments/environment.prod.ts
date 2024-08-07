export const environment = {
  production: true,
  authorize_uri: 'https://reserva-auth-service.up.railway.app/oauth2/authorize?',
  authorize_gateway:'/oauth2/authorization/gateway?',
  redirect_gateway:'https://reserva-gateway-production.up.railway.app/login/oauth2/authorization/gateway?',
  client_id:'reserva-com',
  redirect_uri:'https://reserva-auth-service.up.railway.app/authorized https://reserva-gateway-production.up.railway.app/login/oauth2/code/gateway',
  scope:'openid profile',
  response_type:'code',
  response_mode:'form_post',
  code_challenge_method:'S256',
  token_url:'https://reserva-auth-service.up.railway.app/oauth2/token',
  grant_type:'authorization_code',
  logout_url:'https://reserva-auth-service.up.railway.app/logout',
  secret_pkce:'secret'
};
