import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WhyProblemReturns from '../WhyProblemReturns';

const mockReasons = [
  { icon: 'Egg', title: 'Яйца остались', description: 'Самостоятельная обработка не уничтожает яйца.' },
  { icon: 'Users', title: 'Соседи', description: 'Вредители мигрируют от соседей.' },
];

describe('WhyProblemReturns', () => {
  it('renders with return reasons', () => {
    render(<WhyProblemReturns returnReasons={mockReasons} serviceTitle="Дезинсекция" />);
    expect(screen.getByText('Яйца остались')).toBeInTheDocument();
    expect(screen.getByText('Соседи')).toBeInTheDocument();
  });

  it('returns null for empty array', () => {
    const { container } = render(<WhyProblemReturns returnReasons={[]} serviceTitle="Тест" />);
    expect(container.innerHTML).toBe('');
  });
});
