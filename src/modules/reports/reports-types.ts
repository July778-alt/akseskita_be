export interface CreateReportDTO {
  title: string;

  description: string;

  category_id: string;

  latitude?: number;

  longitude?: number;

  address?: string;

  image_url?: string;
}