import { Module } from '@nestjs/common';
import { CodeModule } from './code/code.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, // Import the PrismaModule to make PrismaService available
    CodeModule,   // Import your application-specific module(s)
  ],
})
export class AppModule { }
