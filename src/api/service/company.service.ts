import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entity/company';
import { Repository } from 'typeorm';
import { ResponseBom } from '../bom/responseBom';
import { CompanyBom } from '../bom/companyBom';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private repository: Repository<Company>,
  ) {}

  async getList(): Promise<ResponseBom<Company[]>> {
    const companies = await this.repository.find();
    return new ResponseBom<Company[]>(companies);
  }

  async get(id: number): Promise<ResponseBom<CompanyBom>> {
    const company = await this.repository.findOneBy({
      id,
    });
    if (company) {
      const address = await company.address;
      const { streetNumber, streetName, suburb, postCode, city, state } =
        address;
      const { id, name, email } = company;
      return new ResponseBom({
        id,
        name,
        email,
        address: {
          streetNumber,
          streetName,
          suburb,
          postCode,
          city,
          state,
        },
      });
    }
    throw new HttpException(new ResponseBom(null), HttpStatus.NOT_FOUND);
  }
}
