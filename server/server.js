const express = require('express');
const app = express();
const router = require('./router/htmlRoutes');
const path = require('path');
const cors = require("cors");
const cookieParser = require('cookie-parser');

app.use(cors())
app.use(express.urlencoded({extended: true}))

app.use(cookieParser());
const PORT = process.env.PORT || 5000;
const publicPath = '../client/src/public';
const pagesPath = '../client/sr/pages';
app.use(express.static(path.join(__dirname, publicPath)));
app.use(express.static(path.join(__dirname, pagesPath)));
// Use the router module
app.use('/', router);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

