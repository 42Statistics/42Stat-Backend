import { Field, ObjectType } from '@nestjs/graphql';
import type {
  PokemonCard,
  PokemonType,
} from '../personal.general.character.pokemon';

@ObjectType()
export class CharacterType implements PokemonType {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  color: string;
}

@ObjectType()
export class Character implements PokemonCard {
  @Field()
  name: string;

  @Field((_type) => [CharacterType])
  types: readonly CharacterType[];

  @Field()
  imgUrl: string;
}
