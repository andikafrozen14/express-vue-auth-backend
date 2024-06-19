import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { Member } from "../entities/Member";
import { MemberRepository } from "../repositories/MemberRepository";

export class MemberService {

    async register(name: string, username: string, password: string) {

        let code = 200, token = null;
        const memberExists = await MemberRepository.findByUserName(username);
        if (memberExists) {
            code = 403;
        } else {
            const member = new Member(name, username, password);
            const neo = await MemberRepository.save(member);
            token = this.createToken(neo);
        }
        
        return { code, token };
    }

    async login(username: string, password: string) {

        const member = await MemberRepository.findByUserName(username);
        if (!member) throw new Error("Member not found");

        const validPassword = await bcrypt.compare(password, member.password);
        if (!validPassword) throw new Error("Invalid password");

        return this.createToken(member);
    }

    createToken(member: Member) {

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error('JWT secret not configured');
        }

        return jwt.sign({ id: member.id }, JWT_SECRET, { expiresIn: "1h" });
    }
}