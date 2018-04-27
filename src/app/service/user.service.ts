import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from './cognito.service'
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

@Injectable()
export class UserService {

    constructor(
        private router: Router,
        private cognitoService: CognitoService
    ) { }

    getRecommendHotels() {
        let hotelList: Hotel[] = [
            // {
            //     name: "A",
            //     lat: 40.6945088,
            //     lng: -73.9871052,
            //     desc: "Hotel A desc",
            //     tags: [
            //         "tag1",
            //         "tag2"
            //     ]
            // }, 
            // {
            //     name: "B",
            //     lat: 40.7000000,
            //     lng: -74.0000000,
            //     desc: "Hotel B desc",
            //     tags: [
            //         "tag1",
            //         "tag3"
            //     ]
            // }, 
            // {
            //     name: "C",
            //     lat: 41.7000000,
            //     lng: -74.0000000,
            //     desc: "Hotel C desc",
            //     tags: [
            //         "tag4",
            //         "tag5"
            //     ]
            // }, 
            // {
            //     name: "D",
            //     lat: 39.7000000,
            //     lng: -74.0000000,
            //     desc: "Hotel D desc",
            //     tags: [
            //         "tag6",
            //         "tag7"
            //     ]
            // }
            {
                name: 'Hotel 50 Bowery NYC',
                lat: 40.71599,
                lng: -73.99683,
                desc: 'this is Hotel 50 Bowery NYC',
                tags: ['Single Room']
            }
            ,
            {
                name: 'Kleinfeld Hotel Blocks',
                lat: 40.7411663979292,
                lng: -73.9946056902409,
                desc: 'this is Kleinfeld Hotel Blocks',
                tags: ['Double or Twin Room']
            }
            ,
            {
                name: 'Casablanca Hotel',
                lat: 40.75641,
                lng: -73.98547,
                desc: 'this is Casablanca Hotel',
                tags: ['Suite']
            }
            ,
            {
                name: '1 Hotel Brooklyn Bridge',
                lat: 40.70224,
                lng: -73.99554,
                desc: 'this is 1 Hotel Brooklyn Bridge',
                tags: ['Basic Triple Room']
            }
            ,
            {
                name: '1 Hotel Central Park',
                lat: 40.76471,
                lng: -73.97651,
                desc: 'this is 1 Hotel Central Park',
                tags: ['Single Room']
            }
            ,
            {
                name: 'The Williamsburg Hotel',
                lat: 40.72161,
                lng: -73.95884,
                desc: 'this is The Williamsburg Hotel',
                tags: ['Double or Twin Room']
            }
            ,
            {
                name: 'citizenM hotel New York Times Square',
                lat: 40.761561,
                lng: -73.984968,
                desc: 'this is citizenM hotel New York Times Square',
                tags: ['Suite']
            }
            ,
            {
                name: 'Edge Hotel',
                lat: 40.84003,
                lng: -73.93793,
                desc: 'this is Edge Hotel',
                tags: ['Basic Triple Room']
            }
            ,
            {
                name: 'NobleDEN',
                lat: 40.7194,
                lng: -73.9968,
                desc: 'this is NobleDEN',
                tags: ['Single Room']
            }
            ,
            {
                name: 'The Ludlow New York City',
                lat: 40.721839,
                lng: -73.987355,
                desc: 'this is The Ludlow New York City',
                tags: ['Double or Twin Room']
            }
            ,
            {
                name: 'Courtyard by Marriott New York Manhattan/Midtown East',
                lat: 40.7574547612934,
                lng: -73.9699241362457,
                desc: 'this is Courtyard by Marriott New York Manhattan/Midtown East',
                tags: ['Suite']
            }
            ,
            {
                name: 'Courtyard by Marriott New York Manhattan/SoHo',
                lat: 40.7275586084056,
                lng: -74.0057217632294,
                desc: 'this is Courtyard by Marriott New York Manhattan/SoHo',
                tags: ['Basic Triple Room']
            }
            ,
            {
                name: 'The Beekman, A Thompson Hotel',
                lat: 40.7111443,
                lng: -74.0066413,
                desc: 'this is The Beekman, A Thompson Hotel',
                tags: ['Single Room']
            }
            ,
            {
                name: 'Hampton Inn Brooklyn/Downtown',
                lat: 40.695679,
                lng: -73.983963,
                desc: 'this is Hampton Inn Brooklyn/Downtown',
                tags: ['Double or Twin Room']
            }
            ,
            {
                name: 'Boro Hotel',
                lat: 40.7547438,
                lng: -73.9358372,
                desc: 'this is Boro Hotel',
                tags: ['Suite']
            }
            ,
            {
                name: 'Fairfield Inn & Suites by Marriott New York',
                lat: 40.7521723402439,
                lng: -73.9951658490235,
                desc: 'this is Fairfield Inn & Suites by Marriott New York',
                tags: ['Basic Triple Room']
            }
            ,
            {
                name: 'Hyatt Place Flushing Laguardia',
                lat: 40.759295,
                lng: -73.832643,
                desc: 'this is Hyatt Place Flushing Laguardia',
                tags: ['Single Room']
            }
            ,
            {
                name: 'Residence Inn New York the Bronx At Metro Center Atrium',
                lat: 40.849546,
                lng: -73.84263,
                desc: 'this is Residence Inn New York the Bronx At Metro Center Atrium',
                tags: ['Double or Twin Room']
            }
            ,
            {
                name: 'Hotel Le Jolie',
                lat: 40.71653,
                lng: -73.9508,
                desc: 'this is Hotel Le Jolie',
                tags: ['Suite']
            }
            ,
            {
                name: 'Franklin Guesthouse',
                lat: 40.733066,
                lng: -73.957824,
                desc: 'this is Franklin Guesthouse',
                tags: ['Basic Triple Room']
            }
        ];
        return hotelList;
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
