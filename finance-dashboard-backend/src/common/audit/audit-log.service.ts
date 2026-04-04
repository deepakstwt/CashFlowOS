import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument, AuditAction } from './schemas/audit-log.schema';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLogDocument>
  ) {}

  async log(action: AuditAction, transactionId: any, userId: any, details?: any) {
    const log = new this.auditLogModel({
      action,
      transactionId,
      performedBy: userId,
      details,
    });
    return log.save();
  }

  async getLogs(limit = 50) {
    return this.auditLogModel
      .find()
      .populate('performedBy', 'name email role')
      .populate('transactionId', 'amount type category')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
