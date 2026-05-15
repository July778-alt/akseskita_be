export interface RegisterDTO {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}