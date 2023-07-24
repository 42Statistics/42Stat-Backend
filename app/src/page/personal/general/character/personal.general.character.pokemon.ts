import { InternalServerErrorException } from '@nestjs/common';
import type { Coalition } from 'src/api/coalition/models/coalition.model';

export type PokemonType = {
  readonly name: string;
  readonly description: string;
  readonly color: string;
};

export type PokemonCard = {
  readonly name: string;
  readonly types: readonly PokemonType[];
  readonly imgUrl: string;
};

const POKEMON_TYPE = {
  STARTING: {
    name: '스타팅',
    description: '42 초심자',
    color: '#26A69A',
  },
  MASTER: {
    name: '전설',
    description: '42 마스터',
    color: '#9747FF',
  },
  DRAGON: {
    name: '드래곤',
    description: '융합형 타입',
    color: '#6F35FC',
  },
  NORMAL: {
    name: '노말',
    description: '융합형 타입',
    color: '#A8A77A',
  },
  FLYING: {
    name: '비행',
    description: '융합형 타입',
    color: '#A98FF3',
  },
  FIRE: {
    name: '불꽃',
    description: '엄청난 노력형 타입',
    color: '#EE8130',
  },
  STEEL: {
    name: '강철',
    description: '엄청난 노력형 타입',
    color: '#B7B7CE',
  },
  GROUND: {
    name: '땅',
    description: '노력형 타입',
    color: '#E2BF65',
  },
  FIGHTING: {
    name: '격투',
    description: '노력형 타입',
    color: '#C22E28',
  },
  GRASS: {
    name: '풀',
    description: '노력형 타입',
    color: '#7AC74C',
  },
  POISON: {
    name: '독',
    description: '노력형 타입',
    color: '#A33EA1',
  },
  DARK: {
    name: '악',
    description: '엄청난 재능형 타입',
    color: '#705746',
  },
  ICE: {
    name: '얼음',
    description: '엄청난 재능형 타입',
    color: '#96D9D6',
  },
  WATER: {
    name: '물',
    description: '재능형 타입',
    color: '#6390F0',
  },
  PSYCHIC: {
    name: '에스퍼',
    description: '재능형 타입',
    color: '#F95587',
  },
} as const;

const POKEMON = {
  PICKACHU: {
    name: '피카츄',
    types: [POKEMON_TYPE.STARTING],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  },
  BULBASAUR: {
    name: '이상해씨',
    types: [POKEMON_TYPE.STARTING],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
  },
  SQUIRTLE: {
    name: '꼬부기',
    types: [POKEMON_TYPE.STARTING],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
  },
  CHARMANDER: {
    name: '파이리',
    types: [POKEMON_TYPE.STARTING],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
  },
  MACHOP: {
    name: '알통몬',
    types: [POKEMON_TYPE.FIGHTING],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png',
  },
  DUGTRIO: {
    name: '닥트리오',
    types: [POKEMON_TYPE.GROUND],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/51.png',
  },
  LUCARIO: {
    name: '루카리오',
    types: [POKEMON_TYPE.FIGHTING, POKEMON_TYPE.STEEL],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png',
  },
  DIALGA: {
    name: '디아루가',
    types: [POKEMON_TYPE.STEEL, POKEMON_TYPE.DRAGON],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/483.png',
  },
  PSYDUCK: {
    name: '고라파덕',
    types: [POKEMON_TYPE.WATER],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png',
  },
  EEVEE: {
    name: '이브이',
    types: [POKEMON_TYPE.NORMAL],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
  },
  ODDISH: {
    name: '뚜벅쵸',
    types: [POKEMON_TYPE.GRASS, POKEMON_TYPE.POISON],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/43.png',
  },
  MAKUHITA: {
    name: '마크탕',
    types: [POKEMON_TYPE.FIGHTING],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/296.png',
  },
  INFERNAPE: {
    name: '초염몽',
    types: [POKEMON_TYPE.FIRE, POKEMON_TYPE.FIGHTING],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/392.png',
  },
  MARILL: {
    name: '마릴',
    types: [POKEMON_TYPE.WATER],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/183.png',
  },
  WOBBUFFET: {
    name: '마자용',
    types: [POKEMON_TYPE.PSYCHIC],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/202.png',
  },
  DRATINI: {
    name: '미뇽',
    types: [POKEMON_TYPE.DRAGON],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png',
  },
  EMPOLEON: {
    name: '엠페르트',
    types: [POKEMON_TYPE.WATER, POKEMON_TYPE.STEEL],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/395.png',
  },
  CHARIZARD: {
    name: '리자몽',
    types: [POKEMON_TYPE.FIRE, POKEMON_TYPE.FLYING],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
  },
  MEWTWO: {
    name: '뮤츠',
    types: [POKEMON_TYPE.PSYCHIC],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
  },
  MEW: {
    name: '뮤',
    types: [POKEMON_TYPE.PSYCHIC],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png',
  },
  CELEBI: {
    name: '세레비',
    types: [POKEMON_TYPE.PSYCHIC, POKEMON_TYPE.GRASS],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/251.png',
  },
  DRAGONITE: {
    name: '망나뇽',
    types: [POKEMON_TYPE.DRAGON, POKEMON_TYPE.FLYING],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
  },
  MOLTRES: {
    name: '파이어',
    types: [POKEMON_TYPE.FIRE, POKEMON_TYPE.FLYING],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png',
  },
  PALKIA: {
    name: '펄기아',
    types: [POKEMON_TYPE.WATER, POKEMON_TYPE.DRAGON],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/484.png',
  },
  DARKRAI: {
    name: '다크라이',
    types: [POKEMON_TYPE.DARK],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/491.png',
  },
  LAPRAS: {
    name: '라프라스',
    types: [POKEMON_TYPE.WATER, POKEMON_TYPE.ICE],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png',
  },
  ARTICUNO: {
    name: '프리져',
    types: [POKEMON_TYPE.ICE, POKEMON_TYPE.FLYING],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png',
  },
  ARCEUS: {
    name: '아르세우스',
    types: [POKEMON_TYPE.MASTER],
    imgUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png',
  },
} as const;

// prettier-ignore
const POKEMON_TABLE = [
  [ POKEMON.PICKACHU, POKEMON.PSYDUCK, POKEMON.MARILL, POKEMON.MEWTWO, POKEMON.PALKIA ],
  [ POKEMON.MACHOP, POKEMON.EEVEE, POKEMON.WOBBUFFET, POKEMON.MEW, POKEMON.DARKRAI ],
  [ POKEMON.DUGTRIO, POKEMON.ODDISH, POKEMON.DRATINI, POKEMON.CELEBI, POKEMON.LAPRAS ],
  [ POKEMON.LUCARIO, POKEMON.MAKUHITA, POKEMON.EMPOLEON, POKEMON.DRAGONITE, POKEMON.ARTICUNO ],
  [ POKEMON.DIALGA, POKEMON.INFERNAPE, POKEMON.CHARIZARD, POKEMON.MOLTRES, POKEMON.ARCEUS ]
] as const

export const findPokemon = (
  effort: number,
  talent: number,
  coalition?: Coalition,
): PokemonCard => {
  if (Math.max(effort, talent) > 4 || Math.min(effort, talent) < 0) {
    throw new InternalServerErrorException();
  }

  if (effort === 0 && talent === 0) {
    switch (coalition?.id) {
      case 85:
        return POKEMON.PICKACHU;
      case 86:
        return POKEMON.BULBASAUR;
      case 87:
        return POKEMON.SQUIRTLE;
      case 88:
        return POKEMON.CHARMANDER;
      default:
        return POKEMON.PICKACHU;
    }
  }

  return POKEMON_TABLE[effort][talent];
};
