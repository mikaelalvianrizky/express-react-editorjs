// src/code/code.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Code, Prisma } from '@prisma/client';

@Injectable()
export class CodeService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.CodeCreateInput): Promise<Code> {
    return this.prisma.code.create({ data });
  }

  async findAll(): Promise<Code[]> {
    return this.prisma.code.findMany();
  }

  async findOne(id: string): Promise<Code> {
    return this.prisma.code.findFirst({ where: { id: Number(id) } });
  }
}
