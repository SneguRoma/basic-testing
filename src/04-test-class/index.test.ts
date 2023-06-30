// Uncomment the code below and write your tests
import { getBankAccount } from '.';

describe('BankAccount', () => {
  const account = getBankAccount(250);
  const accountTwo = getBankAccount(3000);
  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(250);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => {
      account.withdraw(251);
    }).toThrow('Insufficient funds: cannot withdraw more than 250');
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => {
      account.transfer(251, accountTwo);
    }).toThrow('Insufficient funds: cannot withdraw more than 250');
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => {
      account.transfer(251, account);
    }).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    expect(account.deposit(50)).toBe(account);
    expect(account.getBalance()).toBe(300);
  });

  test('should withdraw money', () => {
    expect(account.withdraw(50)).toBe(account);
    expect(account.getBalance()).toBe(250);
  });

  test('should transfer money', () => {
    expect(account.transfer(50, accountTwo)).toBe(account);
    expect(account.getBalance()).toBe(200);
    expect(accountTwo.getBalance()).toBe(3050);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    await expect(account.fetchBalance()).resolves.not.toBeNaN();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(11);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(11);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
