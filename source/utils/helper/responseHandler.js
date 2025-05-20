const responseHandler = (res, statusCode, data, message, error) => {
    return res.status(statusCode).json({
        code: statusCode,
        data,
        message,
        error
    });
}

export default responseHandler;