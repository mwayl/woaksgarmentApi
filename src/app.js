const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const path = require('path');

const app = express();

if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// set security HTTP headers
// app.use(helmet());

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                "default-src": ["'self'", "data:"],
                "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://trusted.cdn.com"],
                "img-src": ["'self'", "data:", "https://wokegarments.com", "https://storage.googleapis.com", "https://shoprusset.com"],
                "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                "font-src": ["'self'", "https://fonts.gstatic.com"],
                "connect-src": ["'self'", "https://woaksgarment-api.vercel.app", "https://wokegarments.com"], // Ensure to allow your frontend and backend
                "frame-ancestors": ["'none'"],
                "base-uri": ["'self'"],
                "form-action": ["'self'"],
            },
            useDefaults: true,
        },
    })
);
// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
const corsOptions = {
    origin: 'https://wokegarments.com', // Allow requests from your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
    optionsSuccessStatus: 200, // For legacy browser support
};

// Enable CORS with the specified options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.get('/', express.static(path.join(__dirname, '../../my-app/build')));
app.use(express.static(path.join(__dirname, '../../my-app/build')));
// app.use(express.static(path.join(__dirname, 'my-app/build')));


// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
    app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../my-app/build/index.html'));
});


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;