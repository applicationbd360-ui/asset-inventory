-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "costCenterId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_centers" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cost_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "employeeCode" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "departmentId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_matrix" (
    "id" SERIAL NOT NULL,
    "module" TEXT NOT NULL,
    "documentType" TEXT,
    "conditionType" TEXT NOT NULL,
    "minAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "maxAmount" DECIMAL(18,2),
    "approverRole" TEXT NOT NULL,
    "approverOrder" INTEGER NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "approval_matrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_logs" (
    "id" SERIAL NOT NULL,
    "module" TEXT NOT NULL,
    "documentId" INTEGER NOT NULL,
    "approverUserId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "remarks" TEXT,
    "actionedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approval_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "functional_locations" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parentId" INTEGER,
    "pathIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "pathCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "level" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "functional_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_categories" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isBiomedical" BOOLEAN NOT NULL DEFAULT false,
    "requiresCalib" BOOLEAN NOT NULL DEFAULT false,
    "requiresPM" BOOLEAN NOT NULL DEFAULT true,
    "defaultPmFreqDays" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "equipment_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "flocId" INTEGER,
    "costCenterId" INTEGER,
    "fixedAssetId" INTEGER,
    "grnLineId" INTEGER,
    "poId" INTEGER,
    "serialNo" TEXT,
    "modelNo" TEXT,
    "manufacturer" TEXT,
    "supplierId" INTEGER,
    "purchaseDate" TIMESTAMP(3),
    "purchaseValue" DECIMAL(18,2),
    "warrantyStartDate" TIMESTAMP(3),
    "warrantyEndDate" TIMESTAMP(3),
    "installDate" TIMESTAMP(3),
    "criticality" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "phase" TEXT NOT NULL DEFAULT 'PLANNED',
    "isBiomedical" BOOLEAN NOT NULL DEFAULT false,
    "calibRequired" BOOLEAN NOT NULL DEFAULT false,
    "pmRequired" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "imageUrl" TEXT,
    "qrCodeUrl" TEXT,
    "riskScore" DECIMAL(5,2),
    "riskLevel" TEXT,
    "attributes" JSONB NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "taxId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pr_headers" (
    "id" SERIAL NOT NULL,
    "prNo" TEXT NOT NULL,
    "sourceModule" TEXT NOT NULL,
    "sourceDocType" TEXT,
    "sourceDocId" INTEGER,
    "prType" TEXT NOT NULL,
    "requestedById" INTEGER NOT NULL,
    "departmentId" INTEGER,
    "costCenterId" INTEGER,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requiredDate" TIMESTAMP(3),
    "justification" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "prStatus" TEXT NOT NULL DEFAULT 'OPEN',
    "totalEstimated" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pr_headers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pr_lines" (
    "id" SERIAL NOT NULL,
    "prId" INTEGER NOT NULL,
    "lineNo" INTEGER NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" INTEGER,
    "itemDescription" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "uomCode" TEXT,
    "estimatedUnitPrice" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "assetClassCode" TEXT,
    "workOrderId" INTEGER,
    "equipmentId" INTEGER,
    "lineStatus" TEXT NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "pr_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_headers" (
    "id" SERIAL NOT NULL,
    "poNo" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "poType" TEXT NOT NULL,
    "poDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDeliveryDate" TIMESTAMP(3),
    "paymentTerms" TEXT,
    "deliveryLocationId" INTEGER,
    "currencyCode" TEXT NOT NULL DEFAULT 'BDT',
    "exchangeRate" DECIMAL(18,6) NOT NULL DEFAULT 1,
    "approvalStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "poStatus" TEXT NOT NULL DEFAULT 'OPEN',
    "totalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "warrantyTerms" TEXT,
    "amcTerms" TEXT,
    "notes" TEXT,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "po_headers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_lines" (
    "id" SERIAL NOT NULL,
    "poId" INTEGER NOT NULL,
    "prLineId" INTEGER,
    "lineNo" INTEGER NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" INTEGER,
    "itemDescription" TEXT NOT NULL,
    "orderedQty" DECIMAL(18,4) NOT NULL,
    "receivedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "acceptedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "rejectedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "uomCode" TEXT,
    "unitPrice" DECIMAL(18,4) NOT NULL,
    "taxAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "assetClassCode" TEXT,
    "costCenterId" INTEGER,
    "lineStatus" TEXT NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "po_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grn_headers" (
    "id" SERIAL NOT NULL,
    "grnNo" TEXT NOT NULL,
    "poId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "receivedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedById" INTEGER,
    "grnType" TEXT NOT NULL,
    "inspectionRequired" BOOLEAN NOT NULL DEFAULT true,
    "grnStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grn_headers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grn_lines" (
    "id" SERIAL NOT NULL,
    "grnId" INTEGER NOT NULL,
    "poLineId" INTEGER,
    "itemType" TEXT NOT NULL,
    "itemId" INTEGER,
    "itemDescription" TEXT NOT NULL,
    "receivedQty" DECIMAL(18,4) NOT NULL,
    "acceptedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "rejectedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(18,4),
    "serialNo" TEXT,
    "modelNo" TEXT,
    "manufacturer" TEXT,
    "warrantyStartDate" TIMESTAMP(3),
    "warrantyEndDate" TIMESTAMP(3),
    "batchNo" TEXT,
    "inspectionStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grn_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grn_inspections" (
    "id" SERIAL NOT NULL,
    "grnLineId" INTEGER NOT NULL,
    "inspectionType" TEXT NOT NULL,
    "inspectedById" INTEGER,
    "inspectionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL,
    "physicalConditionOk" BOOLEAN NOT NULL DEFAULT false,
    "specificationMatched" BOOLEAN NOT NULL DEFAULT false,
    "accessoriesComplete" BOOLEAN NOT NULL DEFAULT false,
    "warrantyDocReceived" BOOLEAN NOT NULL DEFAULT false,
    "calibCertReceived" BOOLEAN NOT NULL DEFAULT false,
    "installationRequired" BOOLEAN NOT NULL DEFAULT true,
    "safetyCheckPassed" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,

    CONSTRAINT "grn_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_performance" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "poId" INTEGER,
    "grnId" INTEGER,
    "deliveryScore" INTEGER NOT NULL DEFAULT 3,
    "qualityScore" INTEGER NOT NULL DEFAULT 3,
    "priceScore" INTEGER NOT NULL DEFAULT 3,
    "serviceScore" INTEGER NOT NULL DEFAULT 3,
    "remarks" TEXT,
    "evaluatedById" INTEGER,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_performance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "uomCode" TEXT NOT NULL DEFAULT 'PCS',
    "unitCost" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_locations" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_balances" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "qtyOnHand" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "reservedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "availableQty" DECIMAL(18,4) NOT NULL DEFAULT 0,

    CONSTRAINT "stock_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "movType" TEXT NOT NULL,
    "qty" DECIMAL(18,4) NOT NULL,
    "unitCost" DECIMAL(18,4) NOT NULL,
    "refDocType" TEXT,
    "refDocId" INTEGER,
    "movedById" INTEGER,
    "movedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_policies" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "minQty" DECIMAL(18,4) NOT NULL,
    "maxQty" DECIMAL(18,4) NOT NULL,
    "reorderQty" DECIMAL(18,4) NOT NULL,
    "autoPr" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "stock_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chart_of_accounts" (
    "id" SERIAL NOT NULL,
    "glCode" TEXT NOT NULL,
    "glName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "normalBalance" TEXT NOT NULL,
    "isControlAcc" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "chart_of_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_classes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assetGlCode" TEXT NOT NULL,
    "accumDepreciationGlCode" TEXT NOT NULL,
    "depreciationExpenseGlCode" TEXT NOT NULL,
    "defaultUsefulLifeMonths" INTEGER NOT NULL,
    "depreciationMethod" TEXT NOT NULL DEFAULT 'STRAIGHT_LINE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "asset_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixed_assets" (
    "id" SERIAL NOT NULL,
    "faNo" TEXT NOT NULL,
    "assetClassId" INTEGER NOT NULL,
    "assetName" TEXT NOT NULL,
    "acquisitionDate" TIMESTAMP(3) NOT NULL,
    "capitalizationDate" TIMESTAMP(3) NOT NULL,
    "acquisitionValue" DECIMAL(18,2) NOT NULL,
    "salvageValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "usefulLifeMonths" INTEGER NOT NULL,
    "depreciationMethod" TEXT NOT NULL DEFAULT 'STRAIGHT_LINE',
    "accumulatedDeprn" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "bookValue" DECIMAL(18,2) NOT NULL,
    "vendorId" INTEGER,
    "poId" INTEGER,
    "grnId" INTEGER,
    "grnLineId" INTEGER,
    "departmentId" INTEGER,
    "costCenterId" INTEGER,
    "locationId" INTEGER,
    "assetStatus" TEXT NOT NULL DEFAULT 'CAPITALIZED',
    "retiredAt" TIMESTAMP(3),
    "disposalValue" DECIMAL(18,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixed_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depreciation_schedules" (
    "id" SERIAL NOT NULL,
    "fixedAssetId" INTEGER NOT NULL,
    "fiscalYear" INTEGER NOT NULL,
    "fiscalMonth" INTEGER NOT NULL,
    "openingBookValue" DECIMAL(18,2) NOT NULL,
    "deprnAmount" DECIMAL(18,2) NOT NULL,
    "closingBookValue" DECIMAL(18,2) NOT NULL,
    "journalId" INTEGER,
    "runStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "runDate" TIMESTAMP(3),

    CONSTRAINT "depreciation_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_headers" (
    "id" SERIAL NOT NULL,
    "journalNo" TEXT NOT NULL,
    "sourceModule" TEXT NOT NULL,
    "sourceDocType" TEXT NOT NULL,
    "sourceDocId" INTEGER NOT NULL,
    "postingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "narration" TEXT,
    "totalDebit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalCredit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "postingStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journal_headers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_lines" (
    "id" SERIAL NOT NULL,
    "journalId" INTEGER NOT NULL,
    "lineNo" INTEGER NOT NULL,
    "glCode" TEXT NOT NULL,
    "debitAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "creditAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "costCenterId" INTEGER,
    "fixedAssetId" INTEGER,
    "workOrderId" INTEGER,
    "narration" TEXT,

    CONSTRAINT "journal_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posting_rules" (
    "id" SERIAL NOT NULL,
    "sourceModule" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "assetClassId" INTEGER,
    "itemType" TEXT,
    "orderType" TEXT,
    "debitGlCode" TEXT NOT NULL,
    "creditGlCode" TEXT NOT NULL,
    "autoPost" BOOLEAN NOT NULL DEFAULT true,
    "approvalRequired" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "posting_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets" (
    "id" SERIAL NOT NULL,
    "fiscalYear" INTEGER NOT NULL,
    "budgetType" TEXT NOT NULL,
    "costCenterId" INTEGER NOT NULL,
    "glCode" TEXT,
    "budgetedAmount" DECIMAL(18,2) NOT NULL,
    "utilizedAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "committedAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "id" SERIAL NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL DEFAULT 'BDT',
    "rateDate" DATE NOT NULL,
    "buyRate" DECIMAL(18,6) NOT NULL,
    "sellRate" DECIMAL(18,6) NOT NULL,
    "source" TEXT,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" SERIAL NOT NULL,
    "woNo" TEXT NOT NULL,
    "orderType" TEXT NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "flocId" INTEGER,
    "costCenterId" INTEGER,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "assignedToId" INTEGER,
    "plannedDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "closedDate" TIMESTAMP(3),
    "estimatedHours" DECIMAL(8,2),
    "actualHours" DECIMAL(8,2),
    "problemDesc" TEXT,
    "resolution" TEXT,
    "pmPlanId" INTEGER,
    "parentWoId" INTEGER,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wo_labor" (
    "id" SERIAL NOT NULL,
    "workOrderId" INTEGER NOT NULL,
    "employeeId" INTEGER,
    "employeeName" TEXT,
    "craftType" TEXT,
    "hoursWorked" DECIMAL(8,2) NOT NULL,
    "hourlyRate" DECIMAL(18,4) NOT NULL,
    "laborCost" DECIMAL(18,2) NOT NULL,
    "workDate" DATE NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "wo_labor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wo_materials" (
    "id" SERIAL NOT NULL,
    "workOrderId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "requiredQty" DECIMAL(18,4) NOT NULL,
    "issuedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "returnedQty" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "unitCost" DECIMAL(18,4) NOT NULL,
    "totalCost" DECIMAL(18,2) NOT NULL,
    "lineStatus" TEXT NOT NULL DEFAULT 'PLANNED',
    "locationId" INTEGER,
    "issuedById" INTEGER,
    "issuedAt" TIMESTAMP(3),

    CONSTRAINT "wo_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wo_services" (
    "id" SERIAL NOT NULL,
    "workOrderId" INTEGER NOT NULL,
    "vendorId" INTEGER,
    "serviceDescription" TEXT NOT NULL,
    "serviceAmount" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "serviceEntryStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "serviceDate" TIMESTAMP(3),
    "verifiedById" INTEGER,
    "remarks" TEXT,

    CONSTRAINT "wo_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wo_cost_summaries" (
    "id" SERIAL NOT NULL,
    "workOrderId" INTEGER NOT NULL,
    "laborCost" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "materialCost" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "serviceCost" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "otherCost" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wo_cost_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_downtimes" (
    "id" SERIAL NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "workOrderId" INTEGER NOT NULL,
    "downtimeStart" TIMESTAMP(3) NOT NULL,
    "downtimeEnd" TIMESTAMP(3),
    "downtimeHours" DECIMAL(10,2),
    "downtimeReason" TEXT,
    "financialImpact" DECIMAL(18,2),

    CONSTRAINT "equipment_downtimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pm_plans" (
    "id" SERIAL NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "planName" TEXT NOT NULL,
    "orderType" TEXT NOT NULL DEFAULT 'PREVENTIVE',
    "frequencyType" TEXT NOT NULL,
    "frequencyValue" INTEGER NOT NULL,
    "calibFreqMonths" INTEGER,
    "checklist" JSONB NOT NULL DEFAULT '[]',
    "responsibleTeam" TEXT,
    "advanceCreateDays" INTEGER NOT NULL DEFAULT 7,
    "nextDueDate" TIMESTAMP(3),
    "lastCreatedDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pm_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calibrations" (
    "id" SERIAL NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "calibrationType" TEXT NOT NULL,
    "standardRef" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "performedDate" TIMESTAMP(3),
    "performedBy" TEXT,
    "result" TEXT,
    "certificateNo" TEXT,
    "certificateUrl" TEXT,
    "nextDueDate" TIMESTAMP(3),
    "workOrderId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calibrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rcm_assessments" (
    "id" SERIAL NOT NULL,
    "assessmentNo" TEXT NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "hierarchy" JSONB NOT NULL DEFAULT '[]',
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rcm_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_lifecycle_links" (
    "id" SERIAL NOT NULL,
    "sourceType" TEXT NOT NULL,
    "workOrderId" INTEGER,
    "oldEquipmentId" INTEGER,
    "newEquipmentId" INTEGER,
    "prId" INTEGER,
    "prLineId" INTEGER,
    "poId" INTEGER,
    "poLineId" INTEGER,
    "grnId" INTEGER,
    "grnLineId" INTEGER,
    "fixedAssetId" INTEGER,
    "lifecycleStatus" TEXT NOT NULL DEFAULT 'STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_lifecycle_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "changedBy" INTEGER,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "module" TEXT,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cost_centers_code_key" ON "cost_centers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeCode_key" ON "users"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "approval_matrix_module_documentType_conditionType_approverR_key" ON "approval_matrix"("module", "documentType", "conditionType", "approverRole", "approverOrder");

-- CreateIndex
CREATE UNIQUE INDEX "functional_locations_code_key" ON "functional_locations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_categories_code_key" ON "equipment_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_code_key" ON "equipment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_fixedAssetId_key" ON "equipment"("fixedAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_code_key" ON "vendors"("code");

-- CreateIndex
CREATE UNIQUE INDEX "pr_headers_prNo_key" ON "pr_headers"("prNo");

-- CreateIndex
CREATE UNIQUE INDEX "po_headers_poNo_key" ON "po_headers"("poNo");

-- CreateIndex
CREATE UNIQUE INDEX "grn_headers_grnNo_key" ON "grn_headers"("grnNo");

-- CreateIndex
CREATE UNIQUE INDEX "grn_inspections_grnLineId_key" ON "grn_inspections"("grnLineId");

-- CreateIndex
CREATE UNIQUE INDEX "items_code_key" ON "items"("code");

-- CreateIndex
CREATE UNIQUE INDEX "stock_locations_code_key" ON "stock_locations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "stock_balances_itemId_locationId_key" ON "stock_balances"("itemId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_policies_itemId_locationId_key" ON "stock_policies"("itemId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "chart_of_accounts_glCode_key" ON "chart_of_accounts"("glCode");

-- CreateIndex
CREATE UNIQUE INDEX "asset_classes_code_key" ON "asset_classes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "fixed_assets_faNo_key" ON "fixed_assets"("faNo");

-- CreateIndex
CREATE UNIQUE INDEX "fixed_assets_grnLineId_key" ON "fixed_assets"("grnLineId");

-- CreateIndex
CREATE UNIQUE INDEX "depreciation_schedules_fixedAssetId_fiscalYear_fiscalMonth_key" ON "depreciation_schedules"("fixedAssetId", "fiscalYear", "fiscalMonth");

-- CreateIndex
CREATE UNIQUE INDEX "journal_headers_journalNo_key" ON "journal_headers"("journalNo");

-- CreateIndex
CREATE UNIQUE INDEX "posting_rules_sourceModule_transactionType_assetClassId_ite_key" ON "posting_rules"("sourceModule", "transactionType", "assetClassId", "itemType", "orderType");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_fiscalYear_budgetType_costCenterId_glCode_key" ON "budgets"("fiscalYear", "budgetType", "costCenterId", "glCode");

-- CreateIndex
CREATE UNIQUE INDEX "exchange_rates_fromCurrency_toCurrency_rateDate_key" ON "exchange_rates"("fromCurrency", "toCurrency", "rateDate");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_woNo_key" ON "work_orders"("woNo");

-- CreateIndex
CREATE UNIQUE INDEX "wo_cost_summaries_workOrderId_key" ON "wo_cost_summaries"("workOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_downtimes_workOrderId_key" ON "equipment_downtimes"("workOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "rcm_assessments_assessmentNo_key" ON "rcm_assessments"("assessmentNo");

-- CreateIndex
CREATE INDEX "activity_logs_tableName_recordId_idx" ON "activity_logs"("tableName", "recordId");

-- CreateIndex
CREATE INDEX "activity_logs_changedBy_idx" ON "activity_logs"("changedBy");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "functional_locations" ADD CONSTRAINT "functional_locations_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "functional_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "equipment_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_flocId_fkey" FOREIGN KEY ("flocId") REFERENCES "functional_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_fixedAssetId_fkey" FOREIGN KEY ("fixedAssetId") REFERENCES "fixed_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_poId_fkey" FOREIGN KEY ("poId") REFERENCES "po_headers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pr_headers" ADD CONSTRAINT "pr_headers_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pr_lines" ADD CONSTRAINT "pr_lines_prId_fkey" FOREIGN KEY ("prId") REFERENCES "pr_headers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_headers" ADD CONSTRAINT "po_headers_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_lines" ADD CONSTRAINT "po_lines_poId_fkey" FOREIGN KEY ("poId") REFERENCES "po_headers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_lines" ADD CONSTRAINT "po_lines_prLineId_fkey" FOREIGN KEY ("prLineId") REFERENCES "pr_headers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_headers" ADD CONSTRAINT "grn_headers_poId_fkey" FOREIGN KEY ("poId") REFERENCES "po_headers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_headers" ADD CONSTRAINT "grn_headers_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_lines" ADD CONSTRAINT "grn_lines_grnId_fkey" FOREIGN KEY ("grnId") REFERENCES "grn_headers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_lines" ADD CONSTRAINT "grn_lines_poLineId_fkey" FOREIGN KEY ("poLineId") REFERENCES "po_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_inspections" ADD CONSTRAINT "grn_inspections_grnLineId_fkey" FOREIGN KEY ("grnLineId") REFERENCES "grn_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_performance" ADD CONSTRAINT "vendor_performance_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "stock_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "stock_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_policies" ADD CONSTRAINT "stock_policies_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_policies" ADD CONSTRAINT "stock_policies_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "stock_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_assets" ADD CONSTRAINT "fixed_assets_assetClassId_fkey" FOREIGN KEY ("assetClassId") REFERENCES "asset_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_assets" ADD CONSTRAINT "fixed_assets_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_assets" ADD CONSTRAINT "fixed_assets_grnLineId_fkey" FOREIGN KEY ("grnLineId") REFERENCES "grn_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_assets" ADD CONSTRAINT "fixed_assets_poId_fkey" FOREIGN KEY ("poId") REFERENCES "po_headers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depreciation_schedules" ADD CONSTRAINT "depreciation_schedules_fixedAssetId_fkey" FOREIGN KEY ("fixedAssetId") REFERENCES "fixed_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journal_headers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_glCode_fkey" FOREIGN KEY ("glCode") REFERENCES "chart_of_accounts"("glCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_fixedAssetId_fkey" FOREIGN KEY ("fixedAssetId") REFERENCES "fixed_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posting_rules" ADD CONSTRAINT "posting_rules_debitGlCode_fkey" FOREIGN KEY ("debitGlCode") REFERENCES "chart_of_accounts"("glCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posting_rules" ADD CONSTRAINT "posting_rules_creditGlCode_fkey" FOREIGN KEY ("creditGlCode") REFERENCES "chart_of_accounts"("glCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_pmPlanId_fkey" FOREIGN KEY ("pmPlanId") REFERENCES "pm_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wo_labor" ADD CONSTRAINT "wo_labor_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wo_materials" ADD CONSTRAINT "wo_materials_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wo_materials" ADD CONSTRAINT "wo_materials_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wo_services" ADD CONSTRAINT "wo_services_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wo_cost_summaries" ADD CONSTRAINT "wo_cost_summaries_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_downtimes" ADD CONSTRAINT "equipment_downtimes_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_downtimes" ADD CONSTRAINT "equipment_downtimes_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pm_plans" ADD CONSTRAINT "pm_plans_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calibrations" ADD CONSTRAINT "calibrations_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rcm_assessments" ADD CONSTRAINT "rcm_assessments_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_lifecycle_links" ADD CONSTRAINT "procurement_lifecycle_links_newEquipmentId_fkey" FOREIGN KEY ("newEquipmentId") REFERENCES "equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
