module.exports = (req, res, next) => {
    req.url = req.url.toLowerCase();
    next();
};