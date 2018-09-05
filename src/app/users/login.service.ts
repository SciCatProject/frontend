import {Injectable} from '@angular/core';
import {map, catchError, concatMap} from 'rxjs/operators';
import {of, forkJoin, Observable} from 'rxjs';

import {ADAuthService} from './adauth.service';
import {UserApi, SDKToken, User, LoopBackAuth} from 'shared/sdk';

@Injectable()
export class LoginService {
    constructor(
        private activeDirSrv: ADAuthService,
        private userSrv: UserApi,
        private authSrv: LoopBackAuth
    ) {}

    public login$(username: string, password: string): Observable<User> {
        /* Try both functional login... */
        const funcLogin$ = this.userSrv.login({username, password}).pipe(
          map(({user}) => user),
          catchError(() => of(null))
        );
        
        /* ...and AD login */
        const adLogin$ = this.activeDirSrv.login(username, password).pipe(
          concatMap(({body}) => {
            const token = new SDKToken({
              id: body.access_token,
              userId: body.userId,
            });
            this.authSrv.setToken(token);
            return this.userSrv.findById(body.userId);
          }),
          catchError(() => of(null))
        );
    
        /* Return whichever was found, or null */
        return forkJoin(funcLogin$, adLogin$).pipe(
          map(([funcUser, adUser]) => funcUser || adUser)
        );
    }
}
