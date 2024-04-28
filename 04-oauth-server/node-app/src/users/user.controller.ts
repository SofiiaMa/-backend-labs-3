import {Controller, Get} from '@nestjs/common';
import {Roles} from 'nest-keycloak-connect';
import {UserService} from "./user.service";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get()
    getPublic(): string {
        return `${this.userService.getHello()} from public`;
    }

    @Roles({roles: ['user']})
    @Get('/user')
    getUser(): string {
        return `${this.userService.getHello()} from user`;
    }

    @Roles({roles: ['admin']})
    @Get('/admin')
    getAdmin(): string {
        return `${this.userService.getHello()} from admin`;
    }

    @Get('/all')
    getAll(): string {
        return `${this.userService.getHello()} from all`;
    }
}