// to define the columns I have in the table and the data types of those columns

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;  // primary key, auto-generated

  @Column({ unique: true })
  username!: string;

  @Column({nullable: true, select: false})
  password!: string;

  @Column({nullable: true})
  name?: string;

  @Column({default: 'inactive'})
  accountStatus!: 'active' | 'inactive';
}