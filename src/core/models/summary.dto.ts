export class SummaryDto {
  courseCount: number;
  postCount: number;
  jobCount: number;
  subscriberCount: number;
  userCount: number;
  enrolledByLevel: { [key: string]: number };

  constructor(partial: Partial<SummaryDto> = {}) {
    Object.assign(this, partial);
  }
}
