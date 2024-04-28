import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { TagEntity } from "./tag.entity";
import {Repository} from "typeorm";
@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>
    ) {
    }
    get(): Promise<TagEntity[]>{
        return this.tagRepository.find();
    }

    find(id: number): Promise<TagEntity | null> {
        return this.tagRepository.findOneBy({ id });
    }
    create(tag: TagEntity): Promise<TagEntity> {
        return this.tagRepository.save(tag);
    }

    update(id: number, tag: TagEntity): Promise<TagEntity> {
        return this.tagRepository.save({ ...tag, id: Number(id) });
    }
    delete(id: number): Promise<any> {
        return this.tagRepository.delete({id});
    }
}
