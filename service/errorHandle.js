const errorHandle = (res, message) => {
    res.status(400).json({
        "status": "error",
        "message": message
    })
}
module.exports = errorHandle;