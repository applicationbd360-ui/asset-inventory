import { PrismaClient } from '@prisma/client';
import { AppError } from './AppError';

// Type definition for a Prisma Transaction Client
type PrismaTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

interface CreateJournalParams {
  tx: PrismaTransaction;
  sourceModule: string;
  transactionType: string;
  sourceDocType: string;
  sourceDocId: number;
  amount: number;
  costCenterId?: number;
  departmentId?: number;
  fixedAssetId?: number;
  workOrderId?: number;
  assetClassId?: number;
  itemType?: string;
  orderType?: string;
  narration?: string;
  createdById?: number;
}

/**
 * Dynamically creates a Journal Entry based on predefined Posting Rules.
 * This mirrors the functionality of the PL/pgSQL create_journal_from_rule function.
 */
export const createJournalFromRule = async (params: CreateJournalParams): Promise<number> => {
  const {
    tx,
    sourceModule,
    transactionType,
    sourceDocType,
    sourceDocId,
    amount,
    costCenterId,
    departmentId,
    fixedAssetId,
    workOrderId,
    assetClassId,
    itemType,
    orderType,
    narration,
    createdById,
  } = params;

  // 1. Find the applicable Posting Rule
  // In SQL this used: ORDER BY asset_class_id NULLS LAST, item_type NULLS LAST, order_type NULLS LAST LIMIT 1
  const rules = await tx.postingRule.findMany({
    where: {
      sourceModule,
      transactionType,
      isActive: true,
      OR: [
        { assetClassId },
        { assetClassId: null }
      ],
    },
  });

  // Filter in memory for precise matching (simulating the SQL fallback logic)
  const matchedRules = rules.filter(r => {
    const matchItem = r.itemType === itemType || r.itemType === null;
    const matchOrder = r.orderType === orderType || r.orderType === null;
    const matchAsset = r.assetClassId === assetClassId || r.assetClassId === null;
    return matchItem && matchOrder && matchAsset;
  });

  // Sort to prioritize specific rules over general rules (nulls last)
  matchedRules.sort((a, b) => {
    let scoreA = (a.assetClassId ? 4 : 0) + (a.itemType ? 2 : 0) + (a.orderType ? 1 : 0);
    let scoreB = (b.assetClassId ? 4 : 0) + (b.itemType ? 2 : 0) + (b.orderType ? 1 : 0);
    return scoreB - scoreA;
  });

  const rule = matchedRules[0];

  if (!rule) {
    throw new AppError(`No posting rule found for module: ${sourceModule}, type: ${transactionType}`, 400);
  }

  // 2. Generate Journal No
  const journalNo = `${sourceModule}-JV-${Date.now()}`;

  // 3. Insert Journal Header and Lines
  const journal = await tx.journalHeader.create({
    data: {
      journalNo,
      sourceModule,
      sourceDocType,
      sourceDocId,
      postingDate: new Date(),
      narration,
      totalDebit: amount,
      totalCredit: amount,
      postingStatus: rule.autoPost ? 'POSTED' : 'DRAFT',
      createdById,
      lines: {
        create: [
          {
            lineNo: 1,
            glCode: rule.debitGlCode,
            debitAmount: amount,
            creditAmount: 0,
            costCenterId,
            departmentId,
            fixedAssetId,
            workOrderId,
            narration,
          },
          {
            lineNo: 2,
            glCode: rule.creditGlCode,
            debitAmount: 0,
            creditAmount: amount,
            costCenterId,
            departmentId,
            fixedAssetId,
            workOrderId,
            narration,
          }
        ]
      }
    }
  });

  return journal.id;
};
