import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CriticalErrorReport {
  error: unknown;
  statusCode: number;
  method?: string;
  url?: string;
  requestId?: string | number;
  userId?: string;
}

const TELEGRAM_MAX_LENGTH = 4096;
const REQUEST_TIMEOUT_MS = 5_000;
/** The same error (same route + message) is reported at most once per window. */
const DEDUPE_WINDOW_MS = 60_000;
const MAX_STACK_LINES = 12;

/**
 * Sends critical (5xx) error alerts to the owner via a Telegram bot.
 *
 * Configure with TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID. If either is
 * missing, reporting is silently disabled. Sending is fire-and-forget and
 * never throws, so a Telegram outage can't affect API responses.
 */
@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken?: string;
  private readonly chatId?: string;
  private readonly environment: string;
  private readonly recentlySent = new Map<string, number>();

  constructor(config: ConfigService) {
    this.botToken = config.get<string>('TELEGRAM_BOT_TOKEN') || undefined;
    this.chatId = config.get<string>('TELEGRAM_CHAT_ID') || undefined;
    this.environment = config.get<string>('NODE_ENV') ?? 'unknown';

    if (!this.isEnabled) {
      this.logger.warn(
        'TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set; critical error alerts are disabled',
      );
    }
  }

  get isEnabled(): boolean {
    return Boolean(this.botToken && this.chatId);
  }

  /** Fire-and-forget: never awaits, never throws. */
  reportCriticalError(report: CriticalErrorReport): void {
    if (!this.isEnabled) return;

    const { name, message, stack } = this.describeError(report.error);
    const key = `${report.method} ${report.url?.split('?')[0]} ${name}: ${message}`;
    if (this.isDuplicate(key)) return;

    void this.sendMessage(this.formatReport(report, name, message, stack));
  }

  async sendMessage(html: string): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: this.chatId,
            text: html,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        },
      );
      if (!res.ok) {
        this.logger.warn(
          `Telegram alert failed: ${res.status} ${await res.text()}`,
        );
      }
    } catch (err) {
      this.logger.warn(
        `Telegram alert failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  private formatReport(
    report: CriticalErrorReport,
    name: string,
    message: string,
    stack?: string,
  ): string {
    const lines = [
      `🚨 <b>Critical error</b> · <code>${escapeHtml(this.environment)}</code>`,
      '',
      `<b>Route:</b> <code>${escapeHtml(`${report.method ?? '?'} ${report.url ?? '?'}`)}</code>`,
      `<b>Status:</b> ${report.statusCode}`,
      `<b>Error:</b> <code>${escapeHtml(`${name}: ${message}`)}</code>`,
      report.requestId !== undefined
        ? `<b>Request ID:</b> <code>${escapeHtml(String(report.requestId))}</code>`
        : undefined,
      report.userId
        ? `<b>User ID:</b> <code>${escapeHtml(report.userId)}</code>`
        : undefined,
      `<b>Time:</b> ${new Date().toISOString()}`,
    ].filter((line): line is string => line !== undefined);

    let text = lines.join('\n');
    if (stack) {
      const trimmedStack = stack
        .split('\n')
        .slice(0, MAX_STACK_LINES)
        .join('\n');
      // Leave room for the closing tags so truncation never breaks the HTML.
      const room = TELEGRAM_MAX_LENGTH - text.length - 30;
      if (room > 100) {
        text += `\n\n<pre>${escapeHtml(trimmedStack).slice(0, room)}</pre>`;
      }
    }
    return text;
  }

  private describeError(error: unknown): {
    name: string;
    message: string;
    stack?: string;
  } {
    if (error instanceof Error) {
      return { name: error.name, message: error.message, stack: error.stack };
    }
    return { name: 'NonError', message: safeStringify(error) };
  }

  private isDuplicate(key: string): boolean {
    const now = Date.now();
    for (const [k, sentAt] of this.recentlySent) {
      if (now - sentAt > DEDUPE_WINDOW_MS) this.recentlySent.delete(k);
    }
    if (this.recentlySent.has(key)) return true;
    this.recentlySent.set(key, now);
    return false;
  }
}

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const safeStringify = (value: unknown): string => {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
};
