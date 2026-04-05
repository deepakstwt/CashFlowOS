import { IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TransactionType } from '../schemas/transaction.schema';

export class CreateTransactionDto {
  @ApiProperty({ example: 500.5, description: 'Transaction amount (positive value)' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @ApiProperty({ example: 'Food', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: '2024-03-20T10:00:00Z', description: 'Transaction date (ISO8601)' })
  @IsISO8601()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ example: 'Dinner with team', description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export class QueryTransactionDto {
  @ApiPropertyOptional({ enum: TransactionType })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @ApiPropertyOptional({ example: 'Food' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsISO8601()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsISO8601()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  endDate?: string;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? parseInt(value) : parseInt(value) || 10))
  limit?: number;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? parseInt(value) : parseInt(value) || 1) )
  page?: number;

  @ApiPropertyOptional({ example: 'true', description: 'Enable CSV export' })
  @IsString()
  @IsOptional()
  export?: string;

  @IsOptional()
  _cb?: string;
}
