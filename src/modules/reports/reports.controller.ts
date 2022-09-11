import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decoratos';
import { User } from '../users/entities/user.entity';
import { Serialize } from 'src/interceptors/serialiaze.interceptor';
import { ReportDto } from './dto/report.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetStimateDto } from './dto/get-estimate.dto';
import { TestDto } from './dto/test.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  create(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: User,
    teste: TestDto,
  ) {
    return this.reportsService.create(createReportDto, user, teste);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  approveReport(
    @Param('id') id: string,
    @Body() approveReportDto: ApproveReportDto,
  ) {
    return this.reportsService.changeApproval(+id, approveReportDto.approved);
  }

  @Get()
  getEstimate(@Query() query: GetStimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
