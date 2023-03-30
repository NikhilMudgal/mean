import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

// implementing to restrict users from accessing routes. it will make sure on entering the routes, we have to render the component or do some other action
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const isAuth = this.authService.getisAuth();
        if(!isAuth) {
            this.router.navigate(['/auth/login'])
        }
        return isAuth; // router will know if the route that is being protected is accessible if we return true/promise,observable. if it return false, it will deny access and redirect
    } 

}