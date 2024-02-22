import { Controller, Get, Param } from '@nestjs/common';
import { CompanyService } from '../service/company.service';
import { ResponseBom } from '../bom/responseBom';
import { Company } from '../entity/company';
import { CompanyBom } from '../bom/companyBom';

@Controller('/api/v1/company')
export class CompanyController {

  constructor(private service: CompanyService) {
  }

  @Get()
  getList(): Promise<ResponseBom<Company[]>> {
    return this.service.getList();
  }

  @Get('/:id')
  get(@Param('id') id: number): Promise<ResponseBom<CompanyBom>> {
    return this.service.get(id);
  }
}
