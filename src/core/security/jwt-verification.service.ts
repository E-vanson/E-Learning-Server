import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jose from 'jose'; //lib for jwt verfication

@Injectable()
export class JwtVerificationService {
  private jwkSetUri: string;// Stores the URI for Firebase's JSON Web Key Set
  private issuerUri: string;//Stores Firebase’s JWT issuer URL
  constructor(configService: ConfigService) {
    this.jwkSetUri = configService.getOrThrow<string>('JWK_SET_URI');
    this.issuerUri = configService.getOrThrow<string>('ISSUER_URI');
  }

  // verify jwt token
  async verify(token: string) {
    try {
      const JWKS = jose.createRemoteJWKSet(new URL(this.jwkSetUri)); //fetch public keys from fb
      const { payload } = await jose.jwtVerify(token, JWKS, {// verify token signature and issuer
        issuer: this.issuerUri,
      });
      return payload; //returns decoded payload if valid
    } catch (e) {
      throw e;
    }
  }
}
