export class CreateUserProfileDto {
  name: string;
  location: string;
  bio: string;
  gear: string;
  rehearsal_space: string;
  location_point?: string;
  social_links?: Array<{ platform: string; url: string }>;
}
