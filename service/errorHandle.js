const errorHandle = (res, message) => {
    res.status(400).json({
        "status": "error",
        "message": message
    }).end();
}
module.exports = errorHandle;