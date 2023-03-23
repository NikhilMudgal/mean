import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class ErrorInceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {  }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        
        // handle() gives us back the response observable stream
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
             console.log(error)
             alert(error.error.error.message)
             return throwError(error) 
            })
        );
    }
}