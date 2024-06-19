import * as bcrypt from "bcryptjs";
import { Length } from "class-validator";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Member {

    constructor(name: string, username: string, password: string) {
        this.name = name;
        this.username = username;
        this.password = password;
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Length(1, 255)
    name!: string;

    @Column()
    @Length(1, 255)
    username!: string;

    @Column()
    @Length(6, 255)
    password!: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}

