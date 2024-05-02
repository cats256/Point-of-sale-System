/**
 * Represents an HTTP error.
 * @extends Error
 * @class
 */
class HttpError extends Error {
    /**
     * Constructs a new HttpError instance.
     * @param {string} [message=""] - The error message.
     */
    constructor(message = "") {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * Represents an HTTP 401 Unauthorized error.
 * @extends HttpError
 * @class
 */
export class UnauthorizedError extends HttpError {
    /**
     * Constructs a new UnauthorizedError instance.
     * @param {string} [message=""] - The error message.
     */
    constructor(message = "") {
        super(message);
    }
}

/**
 * Represents an HTTP 409 Conflict error.
 * @extends HttpError
 * @class
 */
export class ConflictError extends HttpError {
    /**
     * Constructs a new ConflictError instance.
     * @param {string} [message=""] - The error message.
     */
    constructor(message = "") {
        super(message);
    }
}
