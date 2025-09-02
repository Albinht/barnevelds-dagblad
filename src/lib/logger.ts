export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  metadata?: Record<string, any>
  userId?: string
  action?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  
  private formatMessage(level: string, message: string, metadata?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level: level as LogEntry['level'],
      message,
      metadata,
    }
  }

  private output(entry: LogEntry) {
    const logLine = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`
    
    if (entry.level === 'error') {
      console.error(logLine, entry.metadata)
    } else if (entry.level === 'warn') {
      console.warn(logLine, entry.metadata)
    } else if (entry.level === 'debug' && this.isDevelopment) {
      console.debug(logLine, entry.metadata)
    } else {
      console.log(logLine, entry.metadata)
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    const entry = this.formatMessage('info', message, metadata)
    this.output(entry)
  }

  warn(message: string, metadata?: Record<string, any>) {
    const entry = this.formatMessage('warn', message, metadata)
    this.output(entry)
  }

  error(message: string, error?: Error | any, metadata?: Record<string, any>) {
    const errorMetadata = error instanceof Error 
      ? { error: error.message, stack: error.stack, ...metadata }
      : { error, ...metadata }
    
    const entry = this.formatMessage('error', message, errorMetadata)
    this.output(entry)
  }

  debug(message: string, metadata?: Record<string, any>) {
    if (this.isDevelopment) {
      const entry = this.formatMessage('debug', message, metadata)
      this.output(entry)
    }
  }

  // Security and audit logging
  security(action: string, userId: string, details?: Record<string, any>) {
    const entry = this.formatMessage('info', `Security: ${action}`, {
      userId,
      action,
      ...details
    })
    this.output(entry)
  }

  // Database operation logging
  database(operation: string, table: string, details?: Record<string, any>) {
    const entry = this.formatMessage('debug', `Database: ${operation} on ${table}`, {
      operation,
      table,
      ...details
    })
    this.output(entry)
  }

  // API request logging
  api(method: string, path: string, statusCode: number, duration?: number, details?: Record<string, any>) {
    const level = statusCode >= 400 ? 'warn' : 'info'
    const entry = this.formatMessage(level, `API: ${method} ${path} ${statusCode}`, {
      method,
      path,
      statusCode,
      duration,
      ...details
    })
    this.output(entry)
  }
}

export const logger = new Logger()