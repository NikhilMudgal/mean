import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

// Injectable decorator or any other angular/custom decorator generates metadata. A special kind of metadata(design:paramtypes) is required to inject a service.
@Injectable()
// interceptors are functions like middleware that are created to manipulate the outgoing http requests. here we will create interceptors to add header in outgoing http request to angular client
export class AuthInceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {  }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        // we create a clone of the request and then update the headers to prevent errors 
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer " + authToken)
        })
        return next.handle(authRequest);
    }
}