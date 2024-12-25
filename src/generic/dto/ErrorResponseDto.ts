export class ErrorResponseDto {
  constructor(
    public success: boolean,
    public statusCode: number,
    public message: string,
    public path: string,
    public timestamp?: string,
  ) {
    this.timestamp = new Date().toISOString();
  }
}
