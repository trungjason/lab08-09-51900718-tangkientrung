const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const signAccessToken = async(payload) => {
    return new Promise((resolve, reject) => {
        const secretKey = process.env.SECRET_KEY_ACCESS_TOKEN;

        const options = {
            expiresIn: "1h",
        }
        jwt.sign(payload, secretKey, options, (err, token) => {
            if (err) reject(err);

            resolve(token);
        });
    })
}

const signRefreshToken = async(payload) => {
    return new Promise((resolve, reject) => {
        const secretKey = process.env.SECRET_KEY_REFRESH_TOKEN;

        const options = {
            expiresIn: "1y",
        }
        jwt.sign(payload, secretKey, options, (err, token) => {
            if (err) reject(err);

            resolve(token);
        });
    })
}

const verifyAccessTokenMiddleware = (req, res, next) => {

    const isJSONAccept = req.headers['accept'] === 'application/json';

    let accessToken = "";

    if ( isJSONAccept ){
        if (!req.headers['authorization']) {
            return next(createError.Unauthorized());
        }

        const authHeader = req.headers['authorization'];
        const tokenParts = authHeader.split(' ');
    
        const preTokenPart = tokenParts[0];
        accessToken = tokenParts[1];
    
        if ( preTokenPart !== 'Bearer' && accessToken.match(/\$+\.\$+\.\$+/) !== null ){
            return next(createError.Unauthorized("Invalid authorization token format"));
        }
    } else {
        accessToken = req.cookies.accessToken;
        
        if (!accessToken){
            return next(createError.Unauthorized());
        }

        if ( accessToken.match(/\$+\.\$+\.\$+/) !== null ){
            return next(createError.Unauthorized("Invalid authorization token format"));
        }
    }

    const secretKey = process.env.SECRET_KEY_ACCESS_TOKEN;
    jwt.verify(accessToken, secretKey, (err, payload) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return isJSONAccept ? res.status(401).json({status: 'false', status_code: 401, message: err.message}) : next(createError.Unauthorized(err.message));
            } else if (err.name === 'JsonWebTokenError') {
                return isJSONAccept ? res.status(401).json({status: 'false', status_code: 401, message: err.message}) : next(createError.Unauthorized());
            } else {
                return isJSONAccept ? res.status(401).json({status: 'false', status_code: 401, message: err.message}) : next(createError.Unauthorized());
            }
        }

        req.payload = payload;

        next();
    });
}

const verifyRefreshToken = async(refreshToken) => {
    return new Promise((resolve, reject) => {
        const secretKey = process.env.SECRET_KEY_REFRESH_TOKEN;
        jwt.verify(refreshToken, secretKey, (err, payload) => {
            if (err) {
                reject(err);
            }

            resolve(payload);
        });
    })
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessTokenMiddleware,
    verifyRefreshToken,
}