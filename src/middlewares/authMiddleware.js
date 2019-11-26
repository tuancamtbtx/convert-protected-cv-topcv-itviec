import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/user';

function getTokenFromAuthorization(req) {
    var token = req.headers['authorization'];
    if(token != null){
        return token.substr(4, token.length);
    }
    return '';
}

export default (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || getTokenFromAuthorization(req);
    if (token) {
        jwt.verify(token, config.secret, (err, payload) => {
            if (err) {
                return res.json({success: false, message: 'Failed to authorization token'});
            } else {
                User.findOne({_id: payload._doc._id}).then(user => {
                    if (user) {
                        if (user.banned_info.banned) {
                            return res.json({success: false, message: user.banned_info.message});
                        } else {
                            req.user = user;
                            next();
                        }
                    } else {
                        return res.json({success: false, message: 'User not found'});
                    }
                })
            }
        });
    }
    else {
        return res.status(403).send({
            success: false,
            message: 'No token provided'
        })
    }
}