import { Request } from 'express';
import { Strategy } from 'passport-strategy';
import { TelegramOptions, VerifyCallback } from './types';
type WithRequired<T, K extends keyof T> = Required<Pick<T, K>> & Exclude<T, K>;
export declare const defaultOptions: {
    queryExpiration: number;
    passReqToCallback: boolean;
};
export declare const whitelistParams: string[];
/**
 * `TelegramStrategy` constructor.
 *
 * The Telegram authentication strategy authenticates requests by delegating to
 * Telegram using their protocol: https://core.telegram.org/widgets/login
 *
 * Applications must supply a `verify` callback which accepts an `account` object,
 * and then calls `done` callback sypplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occurred, `error` should be set.
 *
 * More info here: https://core.telegram.org/widgets/login
 *
 * @param {Object} options
 * @param {Function} verify
 * @example
 * passport.use(new TelegramStrategy({
 *   botId: 12434151
 * }), (user) => {
 *   User.findOrCreate({telegramId: user.id}, done);
 * });
 */
export default class TelegramStrategy extends Strategy {
    readonly name: string;
    readonly options: WithRequired<TelegramOptions, 'queryExpiration' | 'passReqToCallback'>;
    protected readonly verify: any;
    protected readonly hashedBotToken: Buffer;
    constructor(options: TelegramOptions, verify: VerifyCallback);
    authenticate(req: Request): false | void;
    /**
       * Function to check if provided date in callback is outdated
       * @returns {number}
       */
    protected getTimestamp(): number;
    protected getBotToken(): Buffer;
    /**
       * Used to validate if fields like telegram must send are exists
       * @param {e.Request} req
       * @returns {any}
       */
    validateQuery(req: Request): boolean | void;
}
export {};
