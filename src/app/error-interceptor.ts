import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInceptor implements HttpInterceptor {
    constructor(private authService: AuthService,
        private matdialog: MatDialog) {  }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        
        // handle() gives us back the response observable stream
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
             let errorMessage = 'An Unkonwn error occurred';
                if(error.error.message) {
                    errorMessage = error.error.message
             }
                this.matdialog.open(ErrorComponent, {
                data: {message: errorMessage}
             })
             return throwError(error) 
            })
        );
    }
}