import { Injectable } from '@nestjs/common';
import {Cat} from "./cat.interface";

@Injectable()
export class CatsService {
    private readonly cats: Cat[] = [
        {
            name: "Tom",
            age: 3,
            breed: "American"
        },
        {
            name: "Jerry",
            age: 2,
            breed: "British"
        }
    ];

    create(cat: Cat) {
        this.cats.push(cat);
    }

    findAll(): Cat[] {
        return this.cats;
    }
}
