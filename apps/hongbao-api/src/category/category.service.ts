import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../utils/response';
import { withErrorHandling } from '../utils/withErrorHandling';
import { CategoryToCourseDto } from './dto/category-to-course.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const courseInclude = {
  courses: { select: { id: true, title: true } },
} as const;

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return withErrorHandling(async () => {
      const { courseIds, ...category } = data;
      const res = await this.prisma.category.create({
        data: {
          ...category,
          courses: { connect: courseIds.map((id) => ({ id })) },
        },
        include: courseInclude,
      });
      return successResponse({ data: res });
    });
  }

  async findAll() {
    return withErrorHandling(async () => {
      const res = await this.prisma.category.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          ...courseInclude,
          _count: { select: { courses: true } },
        },
      });
      const data = res.map(({ _count, ...category }) => ({
        ...category,
        courseCount: _count.courses,
      }));
      return successResponse({ data });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          ...courseInclude,
          _count: { select: { courses: true } },
        },
      });
      if (!category) throw new NotFoundException('Category not found');

      const { _count, ...rest } = category;
      return successResponse({
        data: { ...rest, courseCount: _count.courses },
      });
    });
  }

  async update(id: string, data: UpdateCategoryDto) {
    return withErrorHandling(async () => {
      const { courseIds, ...category } = data;
      const res = await this.prisma.category.update({
        where: { id },
        data: {
          ...category,
          ...(courseIds && {
            courses: { set: courseIds.map((id) => ({ id })) },
          }),
        },
        include: courseInclude,
      });
      return successResponse({ data: res });
    });
  }

  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.category.delete({ where: { id } });
      return successResponse({ data: res });
    });
  }

  async addCourse({ categoryId, courseId }: CategoryToCourseDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.course.update({
        where: { id: courseId },
        data: { categoryId },
        select: { id: true, title: true, categoryId: true },
      });
      return successResponse({ data: res });
    });
  }

  async removeCourse({ courseId }: CategoryToCourseDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.course.update({
        where: { id: courseId },
        data: { categoryId: null },
        select: { id: true, title: true, categoryId: true },
      });
      return successResponse({ data: res });
    });
  }
}
