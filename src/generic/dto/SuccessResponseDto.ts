export class SuccessResponseDto {
  constructor(
    public success: boolean,
    public statusCode: number,
    public message: string,
    public data?: any,
    public timestamp?: string,
  ) {
    this.timestamp = new Date().toISOString();
  }
}
