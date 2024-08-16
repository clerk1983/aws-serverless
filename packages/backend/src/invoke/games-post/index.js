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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var dayjs_1 = require("dayjs");
var ui7_1 = require("ui7");
var HandlerUtil_1 = require("../HandlerUtil");
var EMPTY = '0';
var DARK = '1';
var LIGHT = '2';
var INITIAL_BOARD = [
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, DARK, LIGHT, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, LIGHT, DARK, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
];
/**
 * POST /tasks
 * ゲーム開始
 * @param event
 * @returns
 */
var handler = function () { return __awaiter(void 0, void 0, void 0, function () {
    var game_id, now, turn_id, squareCount, square_id, params, dynamoDb, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                game_id = (0, ui7_1.default)();
                now = (0, dayjs_1.default)().toISOString();
                console.info("game_id=".concat(game_id, ", now=").concat(now));
                turn_id = (0, ui7_1.default)();
                console.info("turn_id=".concat(turn_id));
                squareCount = INITIAL_BOARD.map(function (line) { return line.length; }).reduce(function (acc, cur) { return acc + cur; }, 0);
                console.info(squareCount);
                square_id = (0, ui7_1.default)();
                console.info("square_id=".concat(square_id));
                params = {
                    TransactItems: [
                        {
                            Put: {
                                TableName: process.env.TABLE_NAME_GAMES,
                                Item: {
                                    id: { S: game_id },
                                    create_at: { S: now },
                                },
                            },
                        },
                        {
                            Put: {
                                TableName: process.env.TABLE_NAME_TURNS,
                                Item: {
                                    id: { S: turn_id },
                                    game_id: { S: game_id },
                                    turn_count: { N: '0' },
                                    next_disc: { N: DARK },
                                    end_at: { S: now },
                                },
                            },
                        },
                        {
                            Put: {
                                TableName: process.env.TABLE_NAME_MOVES,
                                Item: {
                                    id: { S: square_id },
                                    turn_id: { S: turn_id },
                                    square: genAttr(),
                                },
                            },
                        },
                    ],
                };
                dynamoDb = new client_dynamodb_1.DynamoDBClient();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dynamoDb.send(new client_dynamodb_1.TransactWriteItemsCommand(params))];
            case 2:
                result = _a.sent();
                console.info("Transaction successful: ".concat(result));
                return [2 /*return*/, {
                        statusCode: 201,
                        headers: HandlerUtil_1.ALLOW_CORS,
                        body: 'Created',
                    }];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                return [2 /*return*/, {
                        statusCode: 500,
                        headers: HandlerUtil_1.ALLOW_CORS,
                        body: JSON.stringify({
                            message: 'System error',
                            error: error_1.message,
                        }),
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.handler = handler;
var genAttr = function () {
    return {
        L: __spreadArray([], squareList, true),
    };
};
var squareList = [];
INITIAL_BOARD.forEach(function (line, y) {
    line.forEach(function (disc, x) {
        squareList.push(genSqr(x.toString(), y.toString(), disc));
    });
});
console.info(JSON.stringify(squareList, null, 2));
var genSqr = function (x, y, disc) {
    var attr = {
        M: {
            x: { N: x },
            y: { N: y },
            disc: { N: disc },
        },
    };
    return attr;
};
