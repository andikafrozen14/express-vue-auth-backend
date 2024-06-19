import { AppDataSource } from "../data-source";
import { Member } from "../entities/Member";

export const MemberRepository = AppDataSource.getRepository(Member).extend({
    findByUserName(username: string) {
        return this.findOneBy({ username });
    }
});
