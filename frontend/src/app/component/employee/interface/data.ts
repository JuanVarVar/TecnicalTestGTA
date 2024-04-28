export interface Data{
    data: User[];
    message: string;
    internalCode: string;
    success: boolean;
}

export interface User {
    id: number;
    firstName: string;
    firstLastName: string;
    secondLastName: string;
    otherName: string | null;
    country: string;
    document: string;
    identification: string;
    email: string;
    startDate: Date;
    area: string;
    status: Boolean;
    created_at: Date;
    updated_at: Date;
  }