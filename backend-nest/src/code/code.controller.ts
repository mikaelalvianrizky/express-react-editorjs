import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CodeService } from './code.service';
import { Code } from './entities/code.entity';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) { }

  @Post()
  create(@Body() createCodeDto: Partial<Code>): Promise<Code> {
    return this.codeService.create(createCodeDto);
  }

  @Get()
  findAll(): Promise<Code[]> {
    return this.codeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Code> {
    return this.codeService.findOne(id);
  }
}
