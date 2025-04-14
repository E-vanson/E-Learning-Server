export class EmployerDashboardSummarDto{
    jobCount: number;
    applicationCount: number;
    reviewCount: number;
    contractCount: number;

    constructor(partial: Partial<EmployerDashboardSummarDto> = {}) {
        Object.assign(this, partial);
      }
}