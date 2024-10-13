"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whitelistParams = exports.defaultOptions = void 0;
var passport_strategy_1 = require("passport-strategy");
var crypto = __importStar(require("crypto"));
var deferPromise_1 = __importDefault(require("./deferPromise"));
var normalizeProfile_1 = require("./normalizeProfile");
exports.defaultOptions = {
    queryExpiration: 86400,
    passReqToCallback: false,
};
exports.whitelistParams = [
    'id',
    'first_name',
    'last_name',
    'username',
    'photo_url',
    'auth_date',
];
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
var TelegramStrategy = /** @class */ (function (_super) {
    __extends(TelegramStrategy, _super);
    function TelegramStrategy(options, verify) {
        var _this = _super.call(this) || this;
        _this.name = 'telegram';
        if (!options.botToken) {
            throw new TypeError('options.botToken is required in TelegramStrategy');
        }
        if (!verify) {
            throw new TypeError('LocalStrategy requires a verify callback');
        }
        _this.options = __assign(__assign({}, exports.defaultOptions), options);
        _this.verify = verify;
        _this.hashedBotToken = _this.getBotToken();
        return _this;
    }
    TelegramStrategy.prototype.authenticate = function (req) {
        var _this = this;
        var query = req.method === 'GET' ? req.query : req.body;
        try {
            var validationResult = this.validateQuery(req);
            if (validationResult !== true) {
                return validationResult;
            }
            var profile = (0, normalizeProfile_1.normalizeProfile)(query);
            var promise = (0, deferPromise_1.default)();
            if (this.options.passReqToCallback) {
                this.verify(req, profile, promise.callback);
            }
            else {
                this.verify(profile, promise.callback);
            }
            promise
                .then(function (_a) {
                var _b = __read(_a, 2), user = _b[0], info = _b[1];
                if (!user) {
                    return _this.fail(info);
                }
                return _this.success(user, info);
            })
                .catch(function (err) {
                return _this.error(err);
            });
        }
        catch (e) {
            return this.error(e);
        }
    };
    /**
       * Function to check if provided date in callback is outdated
       * @returns {number}
       */
    TelegramStrategy.prototype.getTimestamp = function () {
        return Math.floor(Date.now() / 1000);
    };
    // We have to hash botToken too
    TelegramStrategy.prototype.getBotToken = function () {
        return crypto.createHash('sha256').update(this.options.botToken).digest();
    };
    /**
       * Used to validate if fields like telegram must send are exists
       * @param {e.Request} req
       * @returns {any}
       */
    TelegramStrategy.prototype.validateQuery = function (req) {
        var query = req.method === 'GET' ? req.query : req.body;
        if (!query.auth_date || !query.hash || !query.id) {
            return this.fail({ message: 'Missing some important data' }, 400);
        }
        var authDate = Math.floor(Number(query.auth_date));
        if (this.options.queryExpiration !== -1 &&
            (Number.isNaN(authDate) || this.getTimestamp() - authDate > this.options.queryExpiration)) {
            return this.fail({ message: 'Data is outdated' }, 400);
        }
        var sorted = Object.keys(query).sort();
        var mapped = sorted // Only whitelisted query parameters must be mapped
            .filter(function (d) { return exports.whitelistParams.includes(d); })
            .map(function (key) { return "".concat(key, "=").concat(query[key]); });
        var hashString = mapped.join('\n');
        var hash = crypto.createHmac('sha256', this.hashedBotToken).update(hashString).digest('hex');
        if (hash !== query.hash) {
            return this.fail({ message: 'Hash validation failed' }, 403);
        }
        return true;
    };
    return TelegramStrategy;
}(passport_strategy_1.Strategy));
exports.default = TelegramStrategy;
//# sourceMappingURL=strategy.js.map