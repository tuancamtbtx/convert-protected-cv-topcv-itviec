/**
 * Created by Tien Nguyen on 3/23/17.
 */
import apiCache from "apicache";
let cache = apiCache.middleware;

// higher-order function returns false for requests of other status codes (e.g. 403, 404, 500, etc)
const onlyStatus200 = req => req.statusCode === 200;

/**
 * Cache 1 minute middleware
 * @param req
 * @param res
 * @param next
 */
export function cache1Minute(req, res, next) {
    cache('1 minutes', onlyStatus200)(req, res, next);
}

/**
 * Cache 5 minutes middleware
 * @param req
 * @param res
 * @param next
 */
export function cache5Minutes(req, res, next) {
    cache('5 minutes', onlyStatus200)(req, res, next);
}

/**
 * Cache 15 minutes middleware
 * @param req
 * @param res
 * @param next
 */
export function cache15Minutes(req, res, next) {
    cache('15 minutes', onlyStatus200)(req, res, next);
}

/**
 * Cache 30 minutes middleware
 * @param req
 * @param res
 * @param next
 */
export function cache30Minutes(req, res, next) {
    cache('30 minutes', onlyStatus200)(req, res, next);
}

/**
 * Cache 60 minutes middleware
 * @param req
 * @param res
 * @param next
 */
export function cache60Minutes(req, res, next) {
    cache('1 hour', onlyStatus200)(req, res, next);
}