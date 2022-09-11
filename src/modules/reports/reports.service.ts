import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { GetStimateDto } from './dto/get-estimate.dto';
import { TestDto } from './dto/test.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repository: Repository<Report>,
  ) {}
  createEstimate(estimateDto: GetStimateDto) {
    return this.repository
      .createQueryBuilder()
      .select('*')
      .where('make = :make', { make: estimateDto.make })
      .andWhere('model = :model', { model: estimateDto.model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimateDto.lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: estimateDto.year })
      .getRawMany();
  }

  async create(createReportDto: CreateReportDto, user: User, teste: TestDto) {
    const report = this.repository.create({
      ...createReportDto,
      test: createReportDto.test,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    report.user = user;
    return this.repository.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repository.findOne(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.repository.save(report);
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
