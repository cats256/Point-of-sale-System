class HttpError extends Error {
    constructor(message = "") {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * Status code: 401
 */
export class UnauthorizedError extends HttpError {}

/**
 * Status code: 409
 */
export class ConflictError extends HttpError {}
