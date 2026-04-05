import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { QueryDashboardDto } from './dto/query-dashboard.dto';
import type { AuthenticatedUser } from '../../auth/interfaces/user.interface';

@ApiTags('Dashboard Analytics')
@ApiBearerAuth()
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get quick financial summary (Total Income, Expense, Balance)' })
  @ApiResponse({ status: 200, description: 'Returns summary metrics' })
  @Get('summary')
  async getSummary(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryDashboardDto) {
    return this.dashboardService.getSummary(user.organizationId, query);
  }
  
  @ApiOperation({ summary: 'Get aggregation of spending/income by category' })
  @ApiResponse({ status: 200, description: 'Returns category breakdown' })
  @Get('categories')
  async getCategoryBreakdown(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryDashboardDto) {
    return this.dashboardService.getCategoryBreakdown(user.organizationId, query);
  }
  
  @ApiOperation({ summary: 'Get time-series trends for monthly performance' })
  @ApiResponse({ status: 200, description: 'Returns monthly trends' })
  @Get('trends')
  async getMonthlyTrends(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryDashboardDto) {
    return this.dashboardService.getMonthlyTrends(user.organizationId, query);
  }

  @ApiOperation({ summary: 'Get unified dashboard dataset (Summary + Categories + Trends) in a single request' })
  @Get('all')
  async getDashboardData(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryDashboardDto) {
    return this.dashboardService.getDashboardData(user.organizationId, query);
  }
}


