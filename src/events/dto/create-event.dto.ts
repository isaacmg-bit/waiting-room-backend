export class CreateEventDto {
  date: string;
  title: string;
  color: string;
  location_point?: string;
  is_public: boolean;
  street: string;
  event_type: 'Show' | 'Rehearsal';
}
