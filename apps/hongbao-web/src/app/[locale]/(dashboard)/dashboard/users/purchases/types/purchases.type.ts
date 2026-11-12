export type TPurchaseCourse = {
  id: string;
  userId: string;
  orderNo: string;
  courseId: string;
  paymentType: string;
  transactionNo: string;
  status: "PENDING" | "REJECTED" | "APPROVED" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
  expiredAt: string | null;
  user: { name: string };
  course: { title: string };
};

export type TPurchaseCourseRes = {
  items: TPurchaseCourse[];
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};
