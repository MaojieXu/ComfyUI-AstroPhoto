import { fireEvent, render, screen } from '@testing-library/react';
import { DetailAccordion } from '../features/settings/equipment/DetailAccordion';

test('accordion exposes its default state and toggles the controlled content', () => {
  render(<DetailAccordion title="Details" count="3 / 10" initiallyOpen><p>Content</p></DetailAccordion>);
  const button = screen.getByRole('button', { name: /Details/ });
  expect(button).toHaveAttribute('aria-expanded', 'true');
  const panel = document.getElementById(button.getAttribute('aria-controls')!);
  expect(panel).not.toHaveAttribute('hidden');
  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'false');
  expect(panel).toHaveAttribute('hidden');
});
