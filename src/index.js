"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var rest_1 = require("@octokit/rest");
var node_fetch_1 = require("node-fetch");
var _a = process.env, GITHUB_TOKEN = _a.GITHUB_TOKEN, GIST_ID = _a.GIST_ID;
var getFormatDate = function (date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return [year, month, day].join('');
};
// 시도교육청코드 ex) 대전: G10
var ATPT_OFCDC_SC_CODE = 'G10';
// 표준학교코드 ex) 대덕소프트웨어마이스터고등학교: 7430310
var SD_SCHUL_CODE = '7430310';
// 급식일자
var MLSV_YMD = getFormatDate(new Date());
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var octokit, files, fileName, data, mealServiceDietInfo, menuRegExp, result, Meal, i, match, e_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                octokit = new rest_1.Octokit({
                    auth: GITHUB_TOKEN
                });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, octokit.gists.get({
                        gist_id: 'fcdc51abe32b2ccf38b74f7229571da2'
                    })];
            case 2:
                files = (_b.sent()).data.files;
                fileName = Object.keys(files)[0];
                return [4 /*yield*/, node_fetch_1["default"]("https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=ecabe857ea114a09a0db1163ae5fa947&Type=JSON&ATPT_OFCDC_SC_CODE=" + ATPT_OFCDC_SC_CODE + "&SD_SCHUL_CODE=" + SD_SCHUL_CODE + "&MLSV_YMD=" + MLSV_YMD)];
            case 3:
                data = _b.sent();
                return [4 /*yield*/, data.json()];
            case 4:
                mealServiceDietInfo = (_b.sent()).mealServiceDietInfo;
                menuRegExp = /(?<menu>[가-힣]+[/]*[가-힣]+(?=[\d.]+[<br\/>]*))/g;
                result = ['', '', ''];
                Meal = void 0;
                (function (Meal) {
                    Meal[Meal["\uC544\uCE68"] = 0] = "\uC544\uCE68";
                    Meal[Meal["\uC810\uC2EC"] = 1] = "\uC810\uC2EC";
                    Meal[Meal["\uC800\uB141"] = 2] = "\uC800\uB141";
                })(Meal || (Meal = {}));
                for (i = 0; i < 3; i++) {
                    match = void 0;
                    result[i] += Meal[i] + " - ";
                    if (!mealServiceDietInfo[1].row[i]) {
                        result[i] += '급식이 없어연';
                        break;
                    }
                    while ((match = menuRegExp.exec(mealServiceDietInfo[1].row[i].DDISH_NM))) {
                        result[i] += match.groups.menu + ', ';
                    }
                }
                return [4 /*yield*/, octokit.gists.update({
                        gist_id: GIST_ID,
                        files: (_a = {},
                            _a[fileName] = {
                                filename: '오늘의 급식 🍚',
                                content: result.join('\n')
                            },
                            _a)
                    })];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                e_1 = _b.sent();
                console.error("Unable to update gist\n" + e_1);
                throw e_1;
            case 7: return [2 /*return*/];
        }
    });
}); })();
