import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './api/controller/company.controller';
import { Company } from './api/entity/company';
import { CompanyService } from './api/service/company.service';
import { Address } from './api/entity/address';

export const entities = [Company, Address];
export const typeOrmModule = TypeOrmModule.forRoot();
export const ormFeature = TypeOrmModule.forFeature(entities);

@Module({
  imports: [ormFeature, typeOrmModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class AppModule {}
