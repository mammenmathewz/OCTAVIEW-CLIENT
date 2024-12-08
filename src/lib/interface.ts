export interface SignupCredentials {
    companyName: string;
    email: string;
    password: string;
  }

  export interface Job {
    id: string;
    job_title: string;
    job_role: string;
    min_salary: number;
    max_salary: number;
    job_level: string;
    location: string;
    city: string;
    hidden: boolean;
  }
  
  export interface JobsApiResponse {
    nextCursor: any;
    jobs: Job[];
    hasMore: boolean;
    nextPage: number;
  }