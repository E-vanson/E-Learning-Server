import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // reads enviroment variables
import { cert, initializeApp } from 'firebase-admin/app';//connects to fb(firebase) admin sdk using a service account
import { Auth, getAuth } from 'firebase-admin/auth';// provides fb authentication methods

@Injectable()
export class FirebaseService {
  // class properties
  private auth: Auth;// stores fb authentication instance
  private apiKey: string;// stores apikey used for email verification

  constructor(configService: ConfigService) {
    const serviceAccount = configService.getOrThrow<string>(
      'FIREBASE_SERVICE_ACCOUNT',
    );

    this.apiKey = configService.getOrThrow<string>('FIREBASE_API_KEY');

    const app = initializeApp({
      credential: cert(serviceAccount),//initialise fb admin sdk using serviceAccount credentials
    });

    this.auth = getAuth(app);// get fb auth instance
  }

  // fetch user from fb
  async getUser(uid: string) {
    try {
      return await this.auth.getUser(uid);
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  // verify email using fb 
  async verifyEmail(oobCode: string) {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.apiKey}`;
    const body = {
      oobCode,
    };
    console.log(JSON.stringify(body), "The body....");

    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await resp.json();

    if (!resp.ok) {
      const message = json['error']['message'];
      throw new BadRequestException(message);
    }

    const uid = json['localId'];
    const emailVerified = json['emailVerified'];

    return { uid, emailVerified };
    } catch (error) {
      throw new InternalServerErrorException("Server Error", error);
    }
    
  }
}
