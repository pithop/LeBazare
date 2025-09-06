// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Déconnexion réussie' }, { status: 200 });
  res.cookies.set('auth_token', '', { path: '/', maxAge: 0 });
  return res;
}