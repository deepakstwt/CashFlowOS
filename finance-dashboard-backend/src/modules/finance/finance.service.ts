import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Parser } from 'json2csv';
import mongoose, { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreateTransactionDto, UpdateTransactionDto, QueryTransactionDto } from './dto/transaction.dto';
import { UserRole } from '../../users/schemas/user.schema';
import { AuditLogService } from '../../common/audit/audit-log.service';
import { AuditAction } from '../../common/audit/schemas/audit-log.schema';

@Injectable()
export class FinanceService {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<TransactionDocument>,
    private readonly auditLogService: AuditLogService
  ) {}

  async createTransaction(userId: string, organizationId: string, dto: CreateTransactionDto): Promise<TransactionDocument> {
    const transaction = new this.transactionModel({
      ...dto,
      userId,
      organizationId: new Types.ObjectId(organizationId),
    });
    const savedTransaction = await transaction.save();
    
    // Logging Audit Event
    await this.auditLogService.log(AuditAction.CREATE, savedTransaction._id, userId, dto);
    
    return savedTransaction;
  }

  async getTransactions(organizationId: string, query: QueryTransactionDto, isExport = false) {
    // COLLABORATIVE DATA MODEL: users see all transactions in their organization.
    const filter: any = { 
      isDeleted: false,
      organizationId: new Types.ObjectId(organizationId)
    };

    if (query.type) {
      filter.type = query.type;
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.startDate || query.endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (query.startDate) {
        dateFilter.$gte = new Date(query.startDate);
      }
      if (query.endDate) {
        dateFilter.$lte = new Date(query.endDate);
      }
      filter.date = dateFilter;
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.transactionModel
        .find(filter)
        .populate('userId', 'name role')
        .sort({ date: -1 })
        .skip(isExport ? 0 : skip)
        .limit(isExport ? 0 : limit)
        .lean()
        .exec(),
      this.transactionModel.countDocuments(filter).exec(),
    ]);

    // Transforming userId to createdBy for cleaner frontend consumption
    const transformedData = data.map(item => {
      const { userId, ...rest } = item;
      return {
        ...rest,
        createdBy: userId, // userId is now populated with { name, role }
      };
    });

    return {
      data: transformedData,
      total,
      page,
      limit,
    };
  }

  async updateTransaction(transactionId: string, dto: UpdateTransactionDto, organizationId: string, performedBy: string) {
    const transaction = await this.transactionModel.findOne({
      _id: transactionId,
      organizationId: new Types.ObjectId(organizationId),
      isDeleted: false,
    }).exec();

    if (!transaction) {
      throw new NotFoundException('Transaction not found or unauthorized for this organization');
    }

    const updatedTransaction = await this.transactionModel
      .findByIdAndUpdate(transactionId, dto, { new: true })
      .populate('userId', 'name role')
      .lean()
      .exec();

    if (!updatedTransaction) {
      throw new NotFoundException('Updated transaction not found');
    }

    // Logging Audit Event with the user who performed the update
    await this.auditLogService.log(AuditAction.UPDATE, transactionId, performedBy, dto);

    // Transforming userId to createdBy
    const { userId, ...rest } = updatedTransaction as any;
    return {
      ...rest,
      createdBy: userId,
    };
  }

  async deleteTransaction(transactionId: string, organizationId: string, performedBy: string) {
    const transaction = await this.transactionModel.findOne({
      _id: transactionId,
      organizationId: new Types.ObjectId(organizationId),
      isDeleted: false,
    }).exec();

    if (!transaction) {
      throw new NotFoundException('Transaction not found or unauthorized for this organization');
    }

    transaction.isDeleted = true;
    await transaction.save();

    // Logging Audit Event with the user who performed the delete
    await this.auditLogService.log(AuditAction.DELETE, transactionId, performedBy);

    return { message: 'Transaction successfully deleted' };
  }

  async getTransactionsCsv(organizationId: string, query: QueryTransactionDto): Promise<string> {
    const { data } = await this.getTransactions(organizationId, query, true);
    
    const fields = [
      { label: 'Date', value: (row: { date: string | number | Date }) => new Date(row.date).toLocaleDateString() },
      { label: 'Type', value: 'type' },
      { label: 'Category', value: 'category' },
      { label: 'Amount', value: 'amount' },
      { label: 'Notes', value: 'notes' },
      { label: 'Created By', value: 'createdBy.name' },
      { label: 'Creator Role', value: 'createdBy.role' }
    ];

    const parser = new Parser({ fields });
    return parser.parse(data);
  }
}
