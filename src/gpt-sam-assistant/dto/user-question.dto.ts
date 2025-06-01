import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UserQuestionDto represents the data structure for a user question.
 */
export class UserQuestionDto {
  /**
   * The ID of the thread.
   */
  @IsString()
  @ApiProperty({ description: 'The ID of the thread', example: 'thread-123' })
  threadId: string;

  /**
   * The user question.
   */
  @IsString()
  @ApiProperty({
    description: 'The user question',
    example: 'What is the capital of France?',
  })
  question: string;
}
