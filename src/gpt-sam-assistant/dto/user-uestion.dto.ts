import { IsString } from 'class-validator';

export class UserQuestionDto {
  @IsString()
  threadId: string;

  @IsString()
  question: string;
}
