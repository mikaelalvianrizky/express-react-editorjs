// src/code/code.module.ts
import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CodeService],
  controllers: [CodeController],
})
export class CodeModule { }
