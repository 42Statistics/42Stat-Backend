import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ExamsService {
  private readonly testExams = [
    {
      id: 1,
      beginAt: new Date(),
      endAt: new Date(),
      nbrSubscribers: 123,
      name: 'testExam1',
      projects: [
        {
          id: 1,
          name: 'thisIsExamProject',
          isExam: true,
          skills: 'testSkills',
          currentUsers: 'testUsers',
          graph: 'testGraph',
        },
      ],
      examUser: 'ASDF',
    },
    {
      id: 2,
      beginAt: new Date(),
      endAt: new Date(),
      nbrSubscribers: 321,
      name: 'testExam2',
      projects: [
        {
          id: 1,
          name: 'thisIsExamProject',
          isExam: true,
          skills: 'testSkills',
          currentUsers: 'testUsers',
          graph: 'testGraph',
        },
      ],
      examUser: 'ZXVc',
    },
  ];

  async findById(id: number) {
    const result = this.testExams.find((curr) => curr.id === id);
    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }
}
