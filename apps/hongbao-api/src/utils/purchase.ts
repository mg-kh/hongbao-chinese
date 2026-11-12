import { randomBytes } from 'crypto';
import { format } from 'date-fns';

// e.g. HB-20261024-9F3A1C7B; uniqueness is enforced by Purchase.orderNo @unique.
export const generateOrderNo = () =>
  `HB-${format(new Date(), 'yyyyMMdd')}-${randomBytes(4).toString('hex').toUpperCase()}`;

// perTime is stored in months; 0 / null means lifetime access (null durationDays).
export const perTimeToDurationDays = (perTime?: number | null) =>
  perTime && perTime > 0 ? perTime * 30 : null;
