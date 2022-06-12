import { HttpStatus, ValidationPipeOptions } from '@nestjs/common';

const validationPipeOptions: ValidationPipeOptions = {
  errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  transform: true,
};

export default validationPipeOptions;
