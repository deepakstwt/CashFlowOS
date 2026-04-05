import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Res } from '@nestjs/common';
import * as Express from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FinanceService } from './finance.service';
import { CreateTransactionDto, UpdateTransactionDto, QueryTransactionDto } from './dto/transaction.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';
import type { AuthenticatedUser } from '../../auth/interfaces/user.interface';

@ApiTags('Finance Records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @ApiOperation({ summary: 'Create a new financial record (Admin and Analyst Only)' })
  @ApiResponse({ status: 201, description: 'Record successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires Admin or Analyst role' })
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  async createTransaction(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTransactionDto) {
    return this.financeService.createTransaction(user.userId, user.organizationId, dto);
  }

  @ApiOperation({ summary: 'Get records or export to CSV (Admin/Analyst/Viewer)' })
  @ApiQuery({ name: 'export', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns records or a CSV file' })
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ANALYST)
  async getTransactions(
    @Query() query: QueryTransactionDto,
    @Query('export') exportFlag: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Express.Response,
  ) {
    if (exportFlag === 'true') {
      const csv = await this.financeService.getTransactionsCsv(user.organizationId, query);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=finance-records-${Date.now()}.csv`);
      return res.send(csv);
    }
    
    res.setHeader('X-API-Version', '3.0.0-collaborative-org');
    const result = await this.financeService.getTransactions(user.organizationId, query);
    return res.json(result);
  }

  @ApiOperation({ summary: 'Update an existing record (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Record successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires Admin role' })
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateTransaction(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.financeService.updateTransaction(id, dto, user.organizationId, user.userId);
  }

  @ApiOperation({ summary: 'Soft delete a record (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Record successfully marked as deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires Admin role' })
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteTransaction(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.financeService.deleteTransaction(id, user.organizationId, user.userId);
  }
}
