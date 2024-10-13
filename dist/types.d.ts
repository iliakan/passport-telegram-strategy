import { Request } from 'express';
export interface TelegramOptions {
    botToken: string;
    queryExpiration?: number;
    passReqToCallback?: boolean;
}
export interface TelegramUser {
    auth_date: number;
    first_name: string;
    hash: string;
    id: string;
    last_name: string;
    username: string;
    photo_url: string;
}
export type PassportTelegramUser = TelegramUser & {
    provider: 'telegram';
    id: string;
    displayName: string;
    name: {
        familyName: string;
        givenName: string;
    };
    photos: Array<{
        value: string;
    }>;
};
export type DoneCallback = (err: any, user: any, info: any) => void;
export type CallbackWithRequest = (req: Request, user: PassportTelegramUser, done: DoneCallback) => void;
export type CallbackWithoutRequest = (user: PassportTelegramUser, done: DoneCallback) => void;
export type VerifyCallback = CallbackWithRequest | CallbackWithoutRequest;
