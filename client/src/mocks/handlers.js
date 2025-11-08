import { http, HttpResponse } from 'msw';

const SUPABASE_URL = 'https://yalzwjzfumdjjsjhxgim.supabase.co';

export const handlers = [
  // Sign in with password
  http.post(`${SUPABASE_URL}/auth/v1/token`, async ({ request }) => {
    const params = new URL(request.url).searchParams;
    const grantType = params.get('grant_type');
    
    if (grantType === 'password') {
      const body = await request.json();
      const { email, password } = body;

      // Mock successful sign-in
      if (email === 'test@example.com' && password === 'password123') {
        return HttpResponse.json({
          access_token: 'mock-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user: {
            id: 'mock-user-id',
            email: 'test@example.com',
            email_confirmed_at: '2024-01-01T00:00:00Z',
            user_metadata: {
              name: 'Test User'
            }
          }
        });
      }

      // Mock invalid credentials
      return HttpResponse.json(
        {
          error: 'invalid_grant',
          error_description: 'Invalid login credentials'
        },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      { error: 'unsupported_grant_type' },
      { status: 400 }
    );
  }),

  // Sign up
  http.post(`${SUPABASE_URL}/auth/v1/signup`, async ({ request }) => {
    const body = await request.json();
    const { email, password } = body;

    // Mock email already exists error
    if (email === 'existing@example.com') {
      return HttpResponse.json(
        {
          error: 'user_already_exists',
          error_description: 'User already registered'
        },
        { status: 400 }
      );
    }

    // Mock successful sign-up
    return HttpResponse.json({
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-new-user-id',
        email,
        email_confirmed_at: null,
        user_metadata: body.options?.data || {}
      }
    });
  }),

  // Password recovery
  http.post(`${SUPABASE_URL}/auth/v1/recover`, async ({ request }) => {
    const body = await request.json();
    
    // Mock successful password reset request
    return HttpResponse.json({
      message: 'Check your email for the password reset link'
    });
  }),

  // Get user session
  http.get(`${SUPABASE_URL}/auth/v1/user`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader && authHeader.includes('mock-access-token')) {
      return HttpResponse.json({
        id: 'mock-user-id',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User'
        }
      });
    }

    return HttpResponse.json(
      { error: 'invalid_token' },
      { status: 401 }
    );
  })
];
