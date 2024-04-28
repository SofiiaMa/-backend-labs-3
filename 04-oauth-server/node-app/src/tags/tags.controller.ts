import {Controller, Delete, Get, Post} from '@nestjs/common';
import {TagsService} from "./tags.service";
import {Tag} from "./tags.interface";
import {ApiTags} from "@nestjs/swagger";
import {TagEntity} from "./tag.entity";

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
    constructor(private tagsService:TagsService) {}

    @Get()
    async get(): Promise<TagEntity[]>{
        return await this.tagsService.get();
    }
    @Get(':id')
    async find(id: number): Promise<TagEntity | null> {
        return await this.tagsService.find(id);
    }
    @Post()
    async create(tag: Tag): Promise<TagEntity> {
        return await this.tagsService.create(tag);
    }
    @Post(':id')
    async update(id: number, tag: Tag): Promise<TagEntity> {
        return await this.tagsService.update(id, tag);
    }
    @Delete(':id')
    async delete(id: number): Promise<TagEntity | null> {
        return await this.tagsService.delete(id);
    }
}
