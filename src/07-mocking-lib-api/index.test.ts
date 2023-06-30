// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');

    await throttledGetDataFromApi('/posts');

    expect(axiosCreateSpy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const expectedUrl = '/posts/1';
    jest.runAllTimers();

    const axiosCreateSpy = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockImplementation(async () => ({ data: 'pofig' }));

    await throttledGetDataFromApi(expectedUrl);

    expect(axiosCreateSpy).toHaveBeenCalledWith(expectedUrl);
  });

  test('should return response data', async () => {
    const expectedUrl = '/posts/1';
    jest.runAllTimers();

    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockImplementation(async () => ({ data: 'pofig' }));

    const result = await throttledGetDataFromApi(expectedUrl);

    expect(result).toBe('pofig');
  });
});
