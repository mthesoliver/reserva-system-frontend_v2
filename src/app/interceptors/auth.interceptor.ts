import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clonar a requisição para adicionar/modificar os headers
    const clonedRequest = request.clone({
      headers: request.headers.set('Custom-Header', 'value')
    });

    // Logar os headers para verificação
    console.log('Headers:', clonedRequest.headers);

    // Continuar com a requisição
    return next.handle(clonedRequest);
  }
}
