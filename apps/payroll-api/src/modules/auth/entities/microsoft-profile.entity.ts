export class MicrosoftProfileEntity {
  sub!: string;
  oid!: string;
  upn?: string;
  displayName!: string;
  name!: {
    familyName?: string;
    givenName?: undefined;
    middleName?: undefined;
  };
  emails?: string;
  _raw?: string;
  _json!: {
    aud: string;
    iss: string;
    iat: number;
    nbf: number;
    exp: number;
    aio: number;
    email: string;
    name: string;
    nonce: string;
    oid: string;
    preferred_username: string;
    rh: string;
    sub: string;
    tid: string;
    uti: string;
    ver: string;
  };
}
