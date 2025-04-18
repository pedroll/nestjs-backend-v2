import { validate } from 'class-validator';
import { UpdateMessagesWDto } from './update-messages-w.dto';

describe('UpdateMessagesWDto', () => {
  let dto: UpdateMessagesWDto;

  beforeEach(() => {
    dto = new UpdateMessagesWDto();
    dto.id = 1;
  });

  it('should be defined', () => {
    expect(dto).toBeInstanceOf(UpdateMessagesWDto);
  });

  it('should validate id property', async () => {
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});
