const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export function getAdminToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('lawsuit_admin_token') || '';
}

export function setAdminToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lawsuit_admin_token', token);
  }
}

export function removeAdminToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lawsuit_admin_token');
  }
}

export async function adminFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    return { success: false, message: err.message || 'Network error' };
  }
}

export async function autoSuperAdminLogin(): Promise<string | null> {
  // Step 1: Send OTP to SuperAdmin account 9999999999
  await adminFetch('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({
      phone_country_code: '+91',
      phone_number: '9999999999',
      role: 'ADMIN',
    }),
  });

  // Step 2: Verify with dev OTP 123456
  const res = await adminFetch('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({
      phone_country_code: '+91',
      phone_number: '9999999999',
      otp: '123456',
    }),
  });

  if (res.success && res.data?.tokens?.access_token) {
    const token = res.data.tokens.access_token;
    setAdminToken(token);
    return token;
  }

  return null;
}
