import {Controller, Get} from '@nestjs/common';
import {CatsService} from "./cats.service";
import {Cat} from "./cat.interface";
import {ApiTags} from "@nestjs/swagger";

@Controller('cats')
@ApiTags('Cat')
export class CatsController {
    constructor(private catsService: CatsService) {
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
    }

}
