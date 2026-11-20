/**
 * Human-Friendly Error Messages for Kabun Coffee + Roastery
 *
 * Converts technical errors (network failures, HTTP status codes,
 * fetch errors, database constraints) into warm, natural English
 * sentences that customers and staff can easily understand.
 */

export function toFriendlyErrorMessage(
  error: unknown,
  fallbackMessage: string = 'Something unexpected happened. Please give it another try.'
): string {
  if (!error) return fallbackMessage;

  let raw = '';
  if (typeof error === 'string') {
    raw = error;
  } else if (error instanceof Error) {
    raw = error.message;
  } else if (typeof error === 'object' && error !== null) {
    raw = (error as any).message || (error as any).error || '';
  }

  const lower = (raw || '').toLowerCase().trim();

  // 1. Network drops, offline mode, server sleeping or DNS failures
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('load failed') ||
    lower.includes('err_connection') ||
    lower.includes('econnrefused') ||
    lower.includes('fetch') ||
    lower.includes('network request failed') ||
    lower.includes('offline')
  ) {
    return "We're having trouble connecting to the roastery. Please check your internet connection and try again.";
  }

  // 2. HTTP POST / submission failures
  if (
    lower.includes('post error') ||
    lower.includes('failed to post') ||
    lower.includes('cannot post') ||
    lower.includes('post request failed')
  ) {
    return 'We were unable to submit your request right now. Please try again in a moment.';
  }

  // 3. Server-side 5xx errors or cold starts
  if (
    lower.includes('500') ||
    lower.includes('502') ||
    lower.includes('503') ||
    lower.includes('504') ||
    lower.includes('internal server error') ||
    lower.includes('bad gateway') ||
    lower.includes('service unavailable')
  ) {
    return 'Our system is taking a quick moment to refresh. Please wait a few seconds and try again.';
  }

  // 4. 404 Not Found
  if (lower.includes('404') || lower.includes('not found') || lower.includes('endpoint')) {
    return 'The requested menu item, table, or service could not be found.';
  }

  // 5. 401 / 403 Authentication / Expired sessions
  if (
    lower.includes('401') ||
    lower.includes('403') ||
    lower.includes('unauthorized') ||
    lower.includes('forbidden') ||
    lower.includes('jwt') ||
    lower.includes('token expired') ||
    lower.includes('invalid credentials')
  ) {
    return 'Your session has ended or your credentials were not recognized. Please sign in again.';
  }

  // 6. Timeouts
  if (lower.includes('timeout') || lower.includes('timed out')) {
    return 'The request took longer than expected to respond. Please try again.';
  }

  // 7. Order submission context
  if (lower.includes('order') && (lower.includes('fail') || lower.includes('error'))) {
    return "We couldn't send your order to the barista right now. Please check your connection and tap Send again.";
  }

  // 8. Assistance / Call staff context
  if (
    (lower.includes('waiter') || lower.includes('staff') || lower.includes('assistance')) &&
    (lower.includes('fail') || lower.includes('error'))
  ) {
    return "We couldn't notify the barista right now. Please try calling again in a moment.";
  }

  // 9. Table management context
  if (lower.includes('table') && (lower.includes('fail') || lower.includes('error'))) {
    if (lower.includes('already exists') || lower.includes('unique')) {
      return 'A table with this number already exists. Please choose a different table number.';
    }
    return "We couldn't save this table. Please check the details and try again.";
  }

  // 10. Account / Password context
  if (lower.includes('account') && (lower.includes('fail') || lower.includes('error'))) {
    return "We couldn't update your login credentials. Please check your entries and try again.";
  }

  // 11. If the message is already clean natural English without tech terms, use it
  const hasTechnicalJargon =
    lower.includes('status ') ||
    lower.includes('prisma') ||
    lower.includes('sql') ||
    lower.includes('http') ||
    lower.includes('json') ||
    lower.includes('exception') ||
    lower.includes('typeerror') ||
    lower.includes('undefined') ||
    lower.includes('null') ||
    lower.includes('eval') ||
    lower.includes('stack');

  if (!hasTechnicalJargon && raw.length > 5 && raw.length < 140) {
    return raw;
  }

  return fallbackMessage;
}
