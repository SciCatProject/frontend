/**
 * SciCat Ingestor API
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { OidcCallbackOkUserInfo } from './oidcCallbackOkUserInfo';
import { OidcCallbackOkOAuth2Token } from './oidcCallbackOkOAuth2Token';


export interface OidcCallbackOk { 
    OAuth2Token: OidcCallbackOkOAuth2Token;
    UserInfo: OidcCallbackOkUserInfo;
}

