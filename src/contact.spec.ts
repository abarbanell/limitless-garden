import { ContactService } from './contact.service';

describe('contact service tests', () => {
  it('isLogin is false', () => {
    let sut = new ContactService();
    expect(sut).toBeDefined();
  });
});
