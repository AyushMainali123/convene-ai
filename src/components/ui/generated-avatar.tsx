import { createAvatar } from '@dicebear/core';
import { lorelei, croodlesNeutral, botttsNeutral, } from '@dicebear/collection';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface IGeneratedAvatarProps {
    seed: string;
    collection: "lorelei" | "botttsNeutral" | "croodlesNeutral";
    className?: string;
}


const dicebarCollections = {
    lorelei,
    botttsNeutral,
    croodlesNeutral
} as Record<IGeneratedAvatarProps["collection"], typeof lorelei>;

export function GeneratedAvatar({ seed, collection, className }: IGeneratedAvatarProps) {


    function getAvatar() {
        const avatar = createAvatar(dicebarCollections[collection], {
            seed,
        });
        return avatar.toDataUri();
    }

    return (
        <Avatar className={className}>
            <AvatarFallback>{seed.slice(0, 2).toUpperCase()}</AvatarFallback>
            <AvatarImage src={getAvatar()} alt={seed} />
        </Avatar>
    )
};