import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../../users/schemas/user.schema';
import { Transaction } from '../../../modules/finance/schemas/transaction.schema';

export type AuditLogDocument = AuditLog & Document;

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AuditLog {
  @Prop({ required: true, enum: AuditAction })
  action: AuditAction;

  @Prop({ type: Types.ObjectId, ref: Transaction.name, required: true })
  transactionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  performedBy: Types.ObjectId;

  @Prop({ type: Object })
  details?: Record<string, any>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// Index for fast retrieval by transaction or user
AuditLogSchema.index({ transactionId: 1 });
AuditLogSchema.index({ performedBy: 1 });
AuditLogSchema.index({ createdAt: -1 });
