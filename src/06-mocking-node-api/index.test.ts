// Uncomment the code below and write your tests
import { join } from 'path';
import fs from 'fs';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { Buffer } from 'buffer';
import promiseFS from 'fs/promises';

describe('doStuffByTimeout', () => {
  const callback = jest.fn();
  const timeout = 1000;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    doStuffByTimeout(callback, timeout);

    jest.advanceTimersByTime(timeout);

    expect(callback).toHaveBeenCalled();
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();

    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  const interval = 1000;
  const timeout = 1000;
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const spySetInterval = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    doStuffByInterval(callback, timeout);
    expect(spySetInterval).toHaveBeenCalledWith(callback, timeout);
    spySetInterval.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    const callback = jest.fn();

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(interval * 2);
    expect(callback).toHaveBeenCalledTimes(4);
    setIntervalSpy.mockRestore();
  });
});
jest.mock('fs/promises');
jest.mock('path');
jest.mock('fs');
describe('readFileAsynchronously', () => {
  const pathToFile = 'example.txt';
  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(pathToFile);

    expect(join).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileContent = Buffer.from('file content');

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(promiseFS, 'readFile').mockImplementation(() => {
      return Promise.resolve(fileContent);
    });

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe('file content');
  });
});
