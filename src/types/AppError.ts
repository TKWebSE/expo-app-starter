export type AppErrorCode =
  | 'validation'
  | 'authentication'
  | 'network'
  | 'permission'
  | 'not_found'
  | 'unexpected';

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
