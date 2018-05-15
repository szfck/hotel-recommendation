import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from './cognito.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import {
    User,
    Hotel
} from '../constant';

interface clickInfo {
    username: String;
    tags: String[];
};

interface TagInfo {
    tag: String;
};

interface QueryInfo {
    username: String;
    lat: Number;
    lng: Number;
};

@Injectable()
export class UserService {

    public static baseAPI = `${environment.host}/${environment.api}`;

    constructor(
        private router: Router,
        private cognitoService: CognitoService,
        private http: HttpClient
    ) { }

    getToken(callback) {
        var cognitoUser = this.cognitoService.getCurrentUser();
        var router = this.router;
        console.log(cognitoUser);
        var token;
        if (cognitoUser !== null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log(`err ${err}`);

                    router.navigate(['/login']);
                }
                token = session.getIdToken().getJwtToken();
                callback(token);
                // console.log(`token: ${token}`);
            });
        }
        return token;
    }

    // get hotel by the given tag
    getTagHotels(token, tag: string): Observable<Hotel[]> {
        const httpOptions = {
            headers: {
                Authorization: token
            }
        };

        const username = this.cognitoService.getCurrentUser().getUsername();

        let hotelsUrl = `${UserService.baseAPI}/hotels/tag`;

        const tagInfo: TagInfo = {
            tag: tag
        };

        console.log('search by tag');
        

        return this.http.post<Hotel[]>(hotelsUrl, tagInfo, httpOptions);

    }

    // get hotel recommendations given the current position and username
    getRecommendHotels(token, position: google.maps.LatLng): Observable<Hotel[]> {
        
        const httpOptions = {
            headers: {
                Authorization: token
            }
        };

        const username = this.cognitoService.getCurrentUser().getUsername();
        
        // let hotelsUrl = `${baseAPI}/hotels?username=${username}&lat=${position.lat()}&lng=${position.lng()}`;
        let hotelsUrl = `${UserService.baseAPI}/hotels`;
        
        // let hotelsUrl = `${baseAPI}/hotels`;
        console.log(token);
        console.log(hotelsUrl);
        const queryInfo: QueryInfo = {
            username: username,
            lat: position.lat(),
            lng: position.lng()
        };

        return this.http.post<Hotel[]>(hotelsUrl, queryInfo, httpOptions);
    }

    // user click a tag
    // send click info to server
    clickTag(token, tags: String[]): Observable<clickInfo> {
        console.log(`get token ${token}`);
        const httpOptions = {
            headers: {
                Authorization: token
            }
        };

        const username = this.cognitoService.getCurrentUser().getUsername();

        let clickTagUrl = `${UserService.baseAPI}/tags`;

        const clickinfo: clickInfo = {
            username: username,
            tags: tags
        };

        return this.http.post<clickInfo>(clickTagUrl, clickinfo, httpOptions);
    }

    signup(user: User, router: Router) {
        var attributeList = [];

        var dataEmail = {
            Name: 'email',
            Value: user.email
        };

        var attributeEmail = new CognitoUserAttribute(dataEmail);

        attributeList.push(attributeEmail);

        this.cognitoService.getUserPool().signUp(user.username, user.password, attributeList, null, function (err, result) {
            if (err) {
                alert(err.message);
                return;
            }
            const cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            router.navigate([`/confirm/${cognitoUser.getUsername()}`]);
        });
    }

    confirm(code: string, username: string, router: Router) {
        console.log(`code: ${code}, username: ${username}`);

        var userData = {
            Username: username,
            Pool: this.cognitoService.getUserPool()
        };

        var cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmRegistration(code, true, function (err, result) {
            if (err) {
                alert(err.message);
                return;
            }
            console.log('call result: ' + result);
            alert(`Email confirmed!`);
            router.navigate(['/login']);
        });
    }

    resend(username: string) {

        var userData = {
            Username: username,
            Pool: this.cognitoService.getUserPool()
        };

        var cognitoUser = new CognitoUser(userData);
        cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
                alert(err.message);
                return;
            }
            console.log('call result: ' + result);
            alert('code has been resent!');
        });
    }


    login(username: string, password: string, router: Router) {
        var authenticationData = {
            Username: username,
            Password: password,
        };
        var authenticationDetails = new AuthenticationDetails(authenticationData);

        var userData = {
            Username: username,
            Pool: this.cognitoService.getUserPool()
        };
        var cognitoUser = new CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (session) {
                const tokens = {
                    accessToken: session.getAccessToken().getJwtToken(),
                    idToken: session.getIdToken().getJwtToken(),
                    refreshToken: session.getRefreshToken().getToken()
                };
                cognitoUser['tokens'] = tokens; // Save tokens for later use
                // CognitoService._TOKEN = session.getAccessToken();
                // resolve
                // const token = result.getAccessToken().getJwtToken();
                // console.log('access token + ' + token);

                // localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token })); 

                AWS.config.region = CognitoService._REGION; // Region
                // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                //   // IdentityPoolId: 'us-east-2:02bc6049-e116-4003-9ea5-0cf6b11089e5',
                //   IdentityPoolId: CognitoService._IDENTITY_POOL_ID
                // });
                // Initialize the Amazon Cognito credentials provider
                AWS.config.region = 'us-east-1'; // Region
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-east-1:abbfab96-78d0-49da-ade1-131bd10d6c5d',
                });
                //POTENTIAL: Region needs to be set if not already set previously elsewhere.
                // AWS.config.region = '<region>';
                // let url = 'cognito-idp.' + CognitoService._REGION.toLowerCase() + '.amazonaws.com/' + CognitoService._USER_POOL_ID;

                // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                //     // IdentityPoolId : '...', // your identity pool id here
                //     IdentityPoolId: CognitoService._IDENTITY_POOL_ID,
                //     Logins: {
                //         // Change the key below according to the specific region your user pool is in.
                //         // `cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>` : result.getIdToken().getJwtToken()
                //         url: session.getIdToken().getJwtToken()
                //     }
                // });
                // console.log(AWS.config.credentials);
                // AWS.config.cognitoidentity.

                router.navigate(['/home']);

                // AWS.CognitoIdentity.
                //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
                // AWS.config.credentials.refresh((error) => {
                //     if (error) {
                //         console.error(error);
                //     } else {
                //         // Instantiate aws sdk service objects now that the credentials have been updated.
                //         // example: var s3 = new AWS.S3();
                //         console.log('Successfully logged!');
                //     }
                // });
            },

            onFailure: function (err) {
                alert(err.message);
            },

        });
    }

    logout(): void {
        this.cognitoService.getCurrentUser().signOut();
    }

    getUserLoggedIn(): boolean {
        return this.cognitoService.getCurrentUser() != null;
    }

    getUserName(): string {
        return this.cognitoService.getCurrentUser().getUsername();
    }

}
