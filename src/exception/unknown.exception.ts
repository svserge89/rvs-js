import {InternalServerErrorException, Logger} from '@nestjs/common';

export class UnknownException extends InternalServerErrorException {
  constructor(logger: Logger, exception: any) {
    logger.error(
      `Unknown database error: ${exception.message ?? 'Something went wrong.'}`,
    );
    logger.verbose(exception.stack);

    super();
  }
}
