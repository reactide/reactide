function PostCSSLoaderError(error) {
    Error.call(this);
    Error.captureStackTrace(this, PostCSSLoaderError);
    this.name = 'Syntax Error';
    this.error = error.input.source;
    this.message = error.reason;
    if ( error.line ) {
        this.message += ' (' + error.line + ':' + error.column + ')';
    }
    if ( error.line && error.input.source ) {
        this.message += '\n\n' + error.showSourceCode() + '\n';
    }
    this.hideStack = true;
}

PostCSSLoaderError.prototype = Object.create(Error.prototype);
PostCSSLoaderError.prototype.constructor = PostCSSLoaderError;

module.exports = PostCSSLoaderError;
