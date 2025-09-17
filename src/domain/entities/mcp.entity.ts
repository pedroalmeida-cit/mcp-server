import { McpRequest, McpResponse, McpErrorCode } from './mcp.types';

export class McpRequestEntity {
  constructor(
    public readonly id: string,
    public readonly method: string,
    public readonly params?: Record<string, any>,
    public readonly timestamp: Date = new Date(),
  ) {}

  static create(data: Partial<McpRequest>): McpRequestEntity {
    return new McpRequestEntity(
      data.id || '',
      data.method || '',
      data.params,
      data.timestamp || new Date(),
    );
  }

  validate(): boolean {
    return !!(this.id && this.method);
  }
}

export class McpResponseEntity {
  constructor(
    public readonly id: string,
    public readonly result?: any,
    public readonly error?: {
      code: McpErrorCode;
      message: string;
    },
    public readonly timestamp: Date = new Date(),
  ) {}

  static success(id: string, result: any): McpResponseEntity {
    return new McpResponseEntity(id, result, undefined);
  }

  static error(id: string, code: McpErrorCode, message: string): McpResponseEntity {
    return new McpResponseEntity(id, undefined, { code, message });
  }

  isError(): boolean {
    return !!this.error;
  }
}
