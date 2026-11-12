import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../utils/response';
import selectFromResponse from '../utils/selectFromResponse';
import { withErrorHandling } from '../utils/withErrorHandling';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizToCourseDto } from './dto/quiz-to-course.dto';
import { QuizToLessonDto } from './dto/quiz-to-lesson.dto';
import { QuizToLevelTestDto } from './dto/quiz-to-level-test.dto';
import { QuizToSubLessonDto } from './dto/quiz-to-sub-lesson.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateQuizDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.quiz.create({
        data,
      });
      return successResponse({
        data: res,
      });
    });
  }

  async findAll() {
    return withErrorHandling(async () => {
      const res = await this.prisma.quiz.findMany({
        where: { isLevelTest: false },
        include: {
          sections: {
            orderBy: { order: 'asc' },
            select: {
              ...selectFromResponse(['id', 'title']),
              questions: {
                select: selectFromResponse(['id']),
              },
              _count: {
                select: selectFromResponse(['questions']),
              },
            },
          },
        },
      });
      const data = res.map(({ sections, ...quiz }) => ({
        ...quiz,
        sections: sections.map(({ _count, ...section }) => ({
          ...section,
          count: _count.questions,
        })),
      }));
      return successResponse({
        data,
      });
    });
  }

  async findAllQuizForAttach() {
    return withErrorHandling(async () => {
      const res = await this.prisma.quiz.findMany({
        where: {
          isLevelTest: false,
          AND: [
            { courseQuiz: { is: null } },
            { lessonQuiz: { is: null } },
            { subLessonQuiz: { is: null } },
          ],
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const data = await this.prisma.quiz.findUnique({
        where: {
          id,
        },
        include: {
          sections: {
            orderBy: { order: 'asc' },
            select: {
              ...selectFromResponse(['id', 'title', 'timeLimit', 'audioUrl']),
            },
          },
        },
      });
      return successResponse({
        data,
      });
    });
  }

  async update(id: string, data: UpdateQuizDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.quiz.update({
        where: { id },
        data,
      });
      return successResponse({
        data: res,
      });
    });
  }

  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.quiz.delete({
        where: { id },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async addQuizToCourse(data: QuizToCourseDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.courseQuiz.create({
        data,
      });
      return successResponse({
        data: res,
      });
    });
  }

  async removeQuizFromCourse(data: QuizToCourseDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.courseQuiz.delete({
        where: {
          courseId_quizId: data,
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async addQuizToLesson(data: QuizToLessonDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.lessonQuiz.create({
        data,
      });
      return successResponse({
        data: res,
      });
    });
  }

  async removeQuizFromLesson(data: QuizToLessonDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.lessonQuiz.delete({
        where: {
          lessonId_quizId: data,
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async addQuizToSubLesson(data: QuizToSubLessonDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.subLessonQuiz.create({
        data,
      });
      return successResponse({
        data: res,
      });
    });
  }

  async removeQuizFromSubLesson(data: QuizToSubLessonDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.subLessonQuiz.delete({
        where: {
          subLessonId_quizId: data,
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async addQuizToLevelTest(data: QuizToLevelTestDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.$transaction(async (tx) => {
        const link = await tx.levelTestQuiz.create({ data });
        await tx.quiz.update({
          where: { id: data.quizId },
          data: { isLevelTest: true },
        });
        return link;
      });
      return successResponse({
        data: res,
      });
    });
  }

  async removeQuizFromLevelTest(data: QuizToLevelTestDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.$transaction(async (tx) => {
        const link = await tx.levelTestQuiz.delete({
          where: {
            levelTestId_quizId: data,
          },
        });
        await tx.quiz.update({
          where: { id: data.quizId },
          data: { isLevelTest: false },
        });
        return link;
      });
      return successResponse({
        data: res,
      });
    });
  }
}
