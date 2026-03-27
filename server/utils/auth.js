import crypto from 'crypto';

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || 'dev-secret-change-me';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

const toBase64Url = (value) => Buffer.from(value).toString('base64url');
const fromBase64Url = (value) => Buffer.from(value, 'base64url').toString('utf8');

const signValue = (value) =>
  crypto.createHmac('sha256', TOKEN_SECRET).update(value).digest('base64url');

export const createAuthToken = (user) => {
  const payload = {
    sub: user._id.toString(),
    usertype: user.usertype,
    email: user.email,
    username: user.username,
    exp: Date.now() + TOKEN_TTL_MS
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signValue(encodedPayload);
  return `${encodedPayload}.${signature}`;
};

export const verifyAuthToken = (token) => {
  if (!token || !token.includes('.')) {
    throw new Error('Invalid token');
  }

  const [encodedPayload, signature] = token.split('.');
  const expectedSignature = signValue(encodedPayload);

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error('Invalid token signature');
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload));
  if (!payload.exp || payload.exp < Date.now()) {
    throw new Error('Token expired');
  }

  return payload;
};

export const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  usertype: user.usertype
});
