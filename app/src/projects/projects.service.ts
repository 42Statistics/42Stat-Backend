import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProjectsService {
  private readonly testProjects = [
    {
      id: 1,
      name: 'thisIsExamProject',
      isExam: true,
      skills: 'testSkills',
      currentUsers: 'testUsers',
      graph: 'testGraph',
    },
    {
      id: 2,
      name: 'testProject2',
      isExam: false,
      skills: 'testSkills',
      currentUsers: 'testUsers',
      graph: 'testGraph',
    },
  ];

  async findAll() {
    // todo: pagenation
    const result = this.testProjects;

    return result;
  }

  async findById(id: number) {
    const result = this.testProjects.find((curr) => curr.id === id);
    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }
}
