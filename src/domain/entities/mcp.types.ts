// Domain Layer - Entidades e regras de negócio
export interface McpRequest {
  id: string;
  method: string;
  params?: Record<string, any>;
  timestamp: Date;
}

export interface McpResponse {
  id: string;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
  timestamp: Date;
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export interface McpResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

// Enums do domínio
export enum McpErrorCode {
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,
  PARSE_ERROR = -32700,
}

export enum McpMethod {
  INITIALIZE = 'initialize',
  TOOLS_LIST = 'tools/list',
  TOOLS_CALL = 'tools/call',
  RESOURCES_LIST = 'resources/list',
  RESOURCES_READ = 'resources/read',
  NOTIFICATIONS_INITIALIZED = 'notifications/initialized',
}
