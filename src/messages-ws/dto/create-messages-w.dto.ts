import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessagesWDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
