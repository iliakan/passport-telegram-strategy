"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeProfile = normalizeProfile;
function normalizeProfile(profile) {
    var normalizedProfile = __assign(__assign({}, profile), { provider: 'telegram', displayName: profile.username, name: {
            givenName: profile.first_name,
            familyName: profile.last_name,
        }, photos: profile.photo_url ? [{ value: profile.photo_url }] : [] });
    return normalizedProfile;
}
//# sourceMappingURL=normalizeProfile.js.map