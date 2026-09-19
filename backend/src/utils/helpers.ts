import { Response } from 'express';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: Record<string, unknown>
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
};

// ── Number sequence generators ───────────────────────────────
let counters: Record<string, number> = {};

export const generateSequenceNo = (prefix: string, length = 8): string => {
  if (!counters[prefix]) counters[prefix] = 10000;
  counters[prefix]++;
  return `${prefix}-${String(counters[prefix]).padStart(length, '0')}`;
};

// ── Pagination helper ────────────────────────────────────────
export const parsePagination = (query: Record<string, any>) => {
  const page = Math.max(1, parseInt(query.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// ── Search filter helper ─────────────────────────────────────
export const parseSearch = (query: Record<string, any>, fields: string[]) => {
  if (!query.search) return undefined;
  return {
    OR: fields.map((f) => ({
      [f]: { contains: query.search, mode: 'insensitive' as const },
    })),
  };
};

// ── Date range helper ────────────────────────────────────────
export const parseDateRange = (from?: string, to?: string) => {
  if (!from && !to) return undefined;
  return {
    ...(from && { gte: new Date(from) }),
    ...(to && { lte: new Date(to) }),
  };
};
