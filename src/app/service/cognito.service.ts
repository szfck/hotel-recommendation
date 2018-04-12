import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import {
    User
} from '../constant';

@Injectable()
export class CognitoService {

    public static _REGION = environment.region;

    // public static _IDENTITY_POOL_ID = environment.identityPoolId;
    public static _USER_POOL_ID = environment.userPoolId;
    public static _CLIENT_ID = environment.clientId;

    public static _TOKEN;

    public static _POOL_DATA: any = {
        UserPoolId: CognitoService._USER_POOL_ID,
        ClientId: CognitoService._CLIENT_ID
    };

    getUserPool() {
        return new CognitoUserPool(CognitoService._POOL_DATA);
    }

    getCurrentUser() {
        return this.getUserPool().getCurrentUser();
    }

    constructor() { }

}
