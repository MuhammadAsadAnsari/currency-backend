export interface OAuthTokenResponse {
  access_token: string;
  context: string;
  scope: string;
  user: {
    id: number;
    email: string;
  };
}
