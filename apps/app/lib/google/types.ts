export interface GoogleTokenData {
  access_token: string
  refresh_token: string
  expires_at: string
  scope: string
  token_type: string
}

export interface GoogleBusinessProfile {
  business_account_id: string
  business_name: string
  access_token: string
  refresh_token: string
  expires_at: string
}

export interface GoogleOAuthConfig {
  client_id: string
  client_secret: string
  redirect_uri: string
  scope: string[]
}

export interface TokenRefreshResponse {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
}
