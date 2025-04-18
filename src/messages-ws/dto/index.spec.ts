import { CreateMessagesWDto } from './create-messages-w.dto';
import { UpdateMessagesWDto } from './update-messages-w.dto';

describe('DTO exports', () => {
  it('should export CreateMessagesWDto', () => {
    expect(CreateMessagesWDto).toBeDefined();
    expect(new CreateMessagesWDto()).toBeInstanceOf(CreateMessagesWDto);
  });

  it('should export UpdateMessagesWDto', () => {
    expect(UpdateMessagesWDto).toBeDefined();
    expect(new UpdateMessagesWDto()).toBeInstanceOf(UpdateMessagesWDto);
  });
});
