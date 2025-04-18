import { CreateMessagesWDto } from './create-messages-w.dto';
import { validate } from 'class-validator';

describe('CreateMessageWsDto', () => {
  let dto: CreateMessagesWDto;

  beforeEach(() => {
    dto = new CreateMessagesWDto();
    dto.message = 'A sample message!!!!!!';
  });

  it('should be defined', () => {
    expect(dto).toBeInstanceOf(CreateMessagesWDto);
  });

  it('should validate message property', async () => {
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});
