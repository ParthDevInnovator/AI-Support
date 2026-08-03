import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-placeholder';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-placeholder';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface JwtPayload {
    userId: string;
    orgId: string | null;
    role: string;
}

export const generateTokens = (payload: JwtPayload) => {
    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN as any });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN as any });

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};
