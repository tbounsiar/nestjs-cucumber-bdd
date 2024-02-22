import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Company } from './company';

@Entity()
export class Address {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  streetNumber: number;

  @Column()
  streetName: string;

  @Column()
  suburb: string;

  @Column()
  postCode: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @OneToMany(() => Company, (company) => company.address, {
    lazy: true,
  })
  @JoinTable()
  companies: Promise<Company[]>;
}
