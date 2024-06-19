import { Request, Response } from "express";
import { MemberRepository } from "../repositories/MemberRepository";
import { MemberService } from "../services/MemberService";
import redisClient from "../utils/RedisUtils";

const memberService = new MemberService();

export class MemberController {

    static async register(req: Request, res: Response) {
        try {
            const { name, username, password } = req.body;
            const result = await memberService.register(name, username, password);
            return res.send(result);
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const token = await memberService.login(username, password);
            return res.json({ token });
        } catch (error) {
            return res.status(400).send(error);
        }
    }

    static async getProfile(req: Request, res: Response) {
        const mid = req.id;
        const cacheKey = `member:${mid}`;

        try {
            
            const cachedMember = await redisClient.get(cacheKey);
            if (cachedMember) {
                return res.json(JSON.parse(cachedMember));
            }

            const member = await MemberRepository.findOneBy({ id: mid });
            if (!member) {
                return res.status(404).json({ message: 'Member not found' });
            }
            
            await redisClient.set(cacheKey, JSON.stringify(member), { 
                EX: Number(process.env.MEMBER_INFO_EXP)
            });

            return res.json(member);
        } catch (error) {
            console.error('Error fetching member profile:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
