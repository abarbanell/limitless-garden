import { AuthService } from './auth.service';

describe('auth service tests', () => {
  it('isLogin is false', () => {
    let a = new AuthService();
    expect(a.isLoggedin).toBe(false);
  });
});

