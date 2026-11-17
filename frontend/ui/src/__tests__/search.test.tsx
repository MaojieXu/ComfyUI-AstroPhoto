import { act, fireEvent, render, screen } from '@testing-library/react';
import { SearchField } from '../shared/SearchField';
test('IME composition defers filtering until committed and debounce cleans up', () => {
  jest.useFakeTimers();
  const onSearch = jest.fn();
  const view = render(<SearchField label="Search" clearLabel="Clear search" onSearch={onSearch} />);
  const input = screen.getByRole('searchbox');
  fireEvent.compositionStart(input); fireEvent.change(input, { target: { value: 'hua' } });
  act(() => jest.advanceTimersByTime(500)); expect(onSearch).not.toHaveBeenCalled();
  fireEvent.compositionEnd(input, { target: { value: '画板' } });
  act(() => jest.advanceTimersByTime(180)); expect(onSearch).toHaveBeenLastCalledWith('画板');
  fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
  expect(input).toHaveFocus();
  act(() => jest.advanceTimersByTime(180)); expect(onSearch).toHaveBeenLastCalledWith('');
  fireEvent.change(input, { target: { value: 'pending' } }); view.unmount();
  act(() => jest.advanceTimersByTime(500)); expect(onSearch).toHaveBeenCalledTimes(2);
  jest.useRealTimers();
});
